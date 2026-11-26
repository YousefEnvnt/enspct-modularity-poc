import type { QueryClient } from "@tanstack/react-query";
import type { AppAbility } from "../auth/ability";

/** A single navigation entry a module contributes to the app shell. */
export interface ModuleNavItem {
  /** Route path, e.g. "/grievances". */
  to: string;
  /** Translation key resolved within the module's own i18n namespace. */
  labelKey: string;
}

/** The ability a user must hold to see/enter a module. Checked against CASL. */
export interface RequiredAbility {
  action: string;
  subject: string;
}

/**
 * Everything a module declares about itself. This is the single contract between
 * a module and the core. A fork removes a module by deleting its folder and the
 * one line that registers this manifest.
 */
export interface ModuleManifest {
  /** Unique module id, also used as the i18n namespace. */
  id: string;
  /** i18n namespace (kept 1:1 with the module id). */
  i18nNs: string;
  /** Nav entry shown in the shell when the user is allowed. */
  nav: ModuleNavItem;
  /** Ability gating the module's nav + route. Omit for always-visible modules. */
  requiredAbility?: RequiredAbility;
  /** Lazily loads the module's translations for a language. */
  loadMessages: (lng: string) => Promise<TranslationMessages>;
}

/** Context passed into the router and available in every route's beforeLoad/loader. */
export interface RouterContext {
  queryClient: QueryClient;
  ability: AppAbility;
}

interface TranslationMessages {
  [key: string]: string | TranslationMessages;
}
