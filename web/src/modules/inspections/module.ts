import { defineModule } from "../../core";

export const inspectionsModule = defineModule({
  id: "inspections",
  i18nNs: "inspections",
  nav: { to: "/inspections", labelKey: "nav.title" },
  requiredAbility: { action: "read", subject: "Inspection" },
  loadMessages: async (lng) =>
    (await (lng === "ar" ? import("./locales/ar.json") : import("./locales/en.json"))).default,
});
