import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { findByNamespace } from "../module-registry/registry";

/**
 * i18next with per-module namespaces, loaded lazily. When a namespace is requested
 * (on route entry), the backend looks up the owning module in the registry and
 * calls its loadMessages(), which dynamic-imports the module's locale JSON — so a
 * module's translations ship in the module's own chunk and leave with it.
 */
export async function initI18n() {
  await i18n
    .use(
      resourcesToBackend(async (lng: string, ns: string) => {
        if (ns === "core") {
          return (await (lng === "ar" ? import("./locales/ar.json") : import("./locales/en.json"))).default;
        }
        const mod = findByNamespace(ns);
        if (!mod) return {};
        return mod.loadMessages(lng);
      }),
    )
    .use(initReactI18next)
    .init({
      lng: "en",
      fallbackLng: "en",
      ns: ["core"],
      defaultNS: false,
      interpolation: { escapeValue: false },
      // Route loaders pre-load namespaces, so Suspense isn't needed and we avoid a
      // missing-key flash on first render.
      react: { useSuspense: false },
    });
  return i18n;
}

/** Ensures a module's namespace is loaded; call from a route loader. */
export function loadNamespace(ns: string): Promise<void> {
  return i18n.loadNamespaces(ns);
}

