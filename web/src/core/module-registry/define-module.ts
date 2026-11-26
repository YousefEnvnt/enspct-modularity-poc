import type { ModuleManifest } from "./types";

/**
 * Identity helper that gives each module a typed manifest. Keeping it a function
 * (rather than a bare object) means a manifest shape error surfaces in the module,
 * not far away in the registry.
 */
export function defineModule(manifest: ModuleManifest): ModuleManifest {
  return manifest;
}
