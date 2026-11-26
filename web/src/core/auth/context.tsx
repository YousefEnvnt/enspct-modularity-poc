import { createContextualCan } from "@casl/react";
import { createContext, useContext, type ReactNode } from "react";
import { buildAbility, type AppAbility } from "./ability";

const AbilityContext = createContext<AppAbility>(buildAbility([]));

export function AbilityProvider({
  ability,
  children,
}: {
  ability: AppAbility;
  children: ReactNode;
}) {
  return (
    <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  );
}

export function useAbility(): AppAbility {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error("useAbility must be used within an <AbilityProvider>");
  }
  return ability;
}

export const Can = createContextualCan(AbilityContext.Consumer);
