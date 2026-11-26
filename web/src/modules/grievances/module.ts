import { defineModule } from "../../core";

export const grievancesModule = defineModule({
  id: "grievances",
  i18nNs: "grievances",
  nav: { to: "/grievances", labelKey: "nav.title" },
  requiredAbility: { action: "read", subject: "Grievance" },
  loadMessages: async (lng) =>
    (await (lng === "ar" ? import("./locales/ar.json") : import("./locales/en.json"))).default,
});
