/**
 * dependency-cruiser — the single source of every architecture rule (sheet row 5).
 * Enforces the module boundaries that make a fork able to delete a module cleanly.
 *
 * @type {import('dependency-cruiser').IConfiguration}
 */
module.exports = {
  forbidden: [
    {
      name: "no-module-to-module",
      comment:
        "A module must not import another module. Cross-module needs go through core.",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/" },
      to: {
        path: "^src/modules/([^/]+)/",
        pathNot: "^src/modules/$1/", // allow a module to import within itself
      },
    },
    {
      name: "no-core-to-module",
      comment: "Core must never depend on a module (one-way: modules -> core).",
      severity: "error",
      from: { path: "^src/core/" },
      to: { path: "^src/modules/" },
    },
    {
      name: "no-unresolved-imports",
      severity: "error",
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: "no-circular",
      comment: "No circular dependencies.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      comment: "Unreachable files (ignoring entries and generated/route glue).",
      severity: "warn",
      from: {
        orphan: true,
        pathNot: [
          "\\.(json|css)$",
          "src/routeTree\\.gen\\.ts$",
          "src/routes\\.ts$",
          "src/main\\.tsx$",
          "routes\\.virtual\\.ts$",
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
    exclude: { path: "node_modules" },
  },
};
