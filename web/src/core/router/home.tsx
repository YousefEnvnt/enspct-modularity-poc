import { useTranslation } from "react-i18next";
import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
  const { t } = useTranslation("core");
  return (
    <section>
      <h1>{t("homeTitle")}</h1>
      <p>{t("homeDescription")}</p>
    </section>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
