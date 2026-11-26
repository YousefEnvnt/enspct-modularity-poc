import type { ModuleManifest } from "./core";
import { grievancesModule } from "./modules/grievances";
import { inspectionsModule } from "./modules/inspections";
import { facilitiesModule } from "./modules/facilities";

/**
 * The module registry — the single list of modules a fork ships.
 * Removing a module = delete its folder + its line here + its line in routes.ts.
 */
export const enabledModules: ModuleManifest[] = [
  grievancesModule,
  inspectionsModule,
  facilitiesModule,
];
