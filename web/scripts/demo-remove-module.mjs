import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const web = fileURLToPath(new URL("../", import.meta.url));
const moduleId = process.argv[2] ?? "inspections";
assert.match(moduleId, /^(grievances|inspections|facilities)$/);
const remainingIds = ["grievances", "inspections", "facilities"].filter((id) => id !== moduleId);
const copy = await mkdtemp(join(tmpdir(), "enspct-module-removal-"));

try {
  const ignored = new Set(["node_modules", "dist", "routeTree.gen.ts", ".DS_Store"]);
  await cp(web, copy, {
    recursive: true,
    filter: (source) => !ignored.has(source.split("/").at(-1)),
  });
  await symlink(join(web, "node_modules"), join(copy, "node_modules"), "dir");

  for (const file of ["modules.ts", "routes.ts"]) {
    const path = join(copy, "src", file);
    const source = await readFile(path, "utf8");
    const edited = source.split("\n").filter((line) =>
      file === "modules.ts"
        ? !line.includes(moduleId + "Module")
        : !line.includes("modules/" + moduleId + "/routes")
    ).join("\n");
    assert.ok(edited !== source, `Could not update ${file}`);
    await writeFile(path, edited);
  }

  await rm(join(copy, "src", "modules", moduleId), { recursive: true });
  execFileSync("pnpm", ["check"], { cwd: copy, stdio: "inherit" });

  const tree = await readFile(join(copy, "src", "routeTree.gen.ts"), "utf8");
  assert.ok(!tree.includes(`/${moduleId}`));
  const assets = join(copy, "dist", "assets");
  const scripts = (await readdir(assets)).filter((file) => file.endsWith(".js"));
  const output = (await Promise.all(scripts.map((file) => readFile(join(assets, file), "utf8")))).join("\n");
  assert.ok(!output.includes(`/api/${moduleId}`), "Removed API client is present in the bundle");
  assert.ok(!scripts.some((file) => file.includes(moduleId)), "Removed route chunk is present");
  for (const remainingId of remainingIds) {
    assert.ok(tree.includes(`/${remainingId}`));
    assert.ok(output.includes(`/api/${remainingId}`), "Remaining API client is missing");
    assert.ok(scripts.some((file) => file.startsWith(`${remainingId}-`)), "Remaining route was not split");
  }
  console.log(`Removed ${moduleId}; ${remainingIds.join(" and ")} still build as split routes.`);
} finally {
  await rm(copy, { recursive: true, force: true });
}
