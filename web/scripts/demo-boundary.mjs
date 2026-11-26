import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const fixture = await mkdtemp(join(tmpdir(), "enspct-boundary-"));

try {
  const { cp, symlink } = await import("node:fs/promises");
  const web = new URL("../", import.meta.url);
  await cp(new URL("src", web), join(fixture, "src"), { recursive: true });
  for (const file of [".dependency-cruiser.cjs", "tsconfig.json", "package.json"]) {
    await cp(new URL(file, web), join(fixture, file));
  }
  await symlink(new URL("node_modules", web).pathname, join(fixture, "node_modules"), "dir");
  await writeFile(join(fixture, "src/modules/grievances/boundary-probe.ts"), 'import "../inspections/module";\n');
  await writeFile(join(fixture, "src/core/boundary-probe.ts"), 'import "../modules/grievances/module";\n');

  const result = spawnSync("pnpm", ["exec", "depcruise", "src", "--output-type", "err-long"], {
    cwd: fixture,
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  const report = result.stdout + result.stderr;
  assert.ok(result.status > 0, report);
  assert.match(report, /no-module-to-module/);
  assert.match(report, /no-core-to-module/);
  console.log("Dependency Cruiser rejected both forbidden import directions.");
} finally {
  await rm(fixture, { recursive: true, force: true });
}
