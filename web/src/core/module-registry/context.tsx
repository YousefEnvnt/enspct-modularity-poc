import { createContext, useContext, type ReactNode } from "react";
import type { ModuleManifest } from "./types";

const ModulesContext = createContext<ModuleManifest[]>([]);

/** Makes the enabled modules available to core UI (e.g. the nav) via React. */
export function ModulesProvider({
  modules,
  children,
}: {
  modules: ModuleManifest[];
  children: ReactNode;
}) {
  return (
    <ModulesContext.Provider value={modules}>{children}</ModulesContext.Provider>
  );
}

export function useModules(): ModuleManifest[] {
  return useContext(ModulesContext);
}
