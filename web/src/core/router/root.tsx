import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../api/fetch";
import { Nav } from "../ui/nav";
import type { RouterContext } from "../module-registry/types";

function RootLayout() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div className="app" lang={language} dir={i18n.dir(language)}>
      <header className="app-header">
        <strong>Enspct Modularity POC</strong>{" "}
        <select aria-label="Language" value={language} onChange={(event) => void i18n.changeLanguage(event.target.value)}>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </header>
      {sessionStorage.getItem("enspct-token") && <>
        <p>Signed in as {sessionStorage.getItem("enspct-user")}</p>
        <button onClick={async () => {
          await apiRequest("/api/logout", "POST");
          sessionStorage.clear();
          window.location.assign("/login");
        }}>Log out</button>
        <Nav />
      </>}
      <main className="app-main">
        <Suspense fallback={<p>Loading module…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ location }) => {
    if (location.pathname !== "/login" && !sessionStorage.getItem("enspct-token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: RootLayout,
});
