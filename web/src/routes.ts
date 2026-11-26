import { rootRoute, index, route, physical } from "@tanstack/virtual-file-routes";

/**
 * The virtual route tree. Core owns the root + home + forbidden; each module
 * owns a physical folder of route files. Filenames resolve relative to ./src
 * (routesDirectory in vite.config).
 *
 * To remove a module: delete its folder, then delete its line here AND in
 * modules.ts (the two files a removal touches, by design).
 */
export const routes = rootRoute("core/router/root.tsx", [
  index("core/router/home.tsx"),
  route("/login", "core/router/login.tsx"),
  route("/forbidden", "core/router/forbidden.tsx"),
  physical("/", "modules/grievances/routes"),
  physical("/", "modules/inspections/routes"),
  physical("/", "modules/facilities/routes"),
]);
