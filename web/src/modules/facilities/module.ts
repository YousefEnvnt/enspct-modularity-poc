import { defineModule } from "../../core";

export const facilitiesModule = defineModule({
  id: "facilities",
  i18nNs: "facilities",
  nav: { to: "/facilities", labelKey: "nav.title" },
  requiredAbility: { action: "read", subject: "Facility" },
  loadMessages: async (lng) =>
    (await (lng === "ar" ? import("./locales/ar.json") : import("./locales/en.json"))).default,
});
