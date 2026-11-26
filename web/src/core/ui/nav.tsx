import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useModules } from "../module-registry/context";
import { useAbility } from "../auth/context";
import type { ModuleManifest } from "../module-registry/types";

function NavLink({ module }: { module: ModuleManifest }) {
  // Each module's label lives in its own namespace, loaded lazily once visited;
  // until then react-i18next returns the key, so we pass a readable default.
  const { t } = useTranslation(module.i18nNs);
  return (
    <Link to={module.nav.to} className="nav-link">
      {t(module.nav.labelKey, module.id)}
    </Link>
  );
}

/** App shell navigation, assembled from the registry and filtered by CASL. */
export function Nav() {
  const { t } = useTranslation("core");
  const modules = useModules();
  const ability = useAbility();

  const visible = modules.filter(
    (m) =>
      !m.requiredAbility ||
      ability.can(m.requiredAbility.action, m.requiredAbility.subject),
  );

  return (
    <nav className="nav">
      <Link to="/" className="nav-link">
        {t("home")}
      </Link>
      {visible.map((m) => (
        <NavLink key={m.id} module={m} />
      ))}
    </nav>
  );
}
