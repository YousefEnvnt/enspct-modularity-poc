import type { ModuleManifest } from "./types";

/**
 * Non-React holder for the enabled modules. The app populates it once at startup
 * (see main.tsx). Core code consults it WITHOUT importing any module, which keeps
 * the dependency direction one-way (modules -> core). The i18n backend uses this
 * to find a module's message loader by namespace.
 */
let modules: ModuleManifest[] = [];

export function setRegistry(enabled: ModuleManifest[]): void {
  modules = enabled;
}

export function findByNamespace(ns: string): ModuleManifest | undefined {
  return modules.find((m) => m.i18nNs === ns);
}
