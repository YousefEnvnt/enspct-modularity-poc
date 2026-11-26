import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { routeTree } from "./routeTree.gen";
import { enabledModules } from "./modules";
import { setRegistry } from "./core/module-registry/registry";
import { ModulesProvider } from "./core/module-registry/context";
import { AbilityProvider } from "./core/auth/context";
import { buildAbility } from "./core/auth/ability";
import { fetchMe } from "./core/auth/me";
import { initI18n } from "./core/i18n/i18n";
import { createQueryClient } from "./core/api/query-client";
import "./styles.css";

const queryClient = createQueryClient();

// Created at module scope (with a placeholder ability) so the router type can be
// registered globally; the real ability is injected before first render.
const router = createRouter({
  routeTree,
  context: { queryClient, ability: buildAbility([]) },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = createRoot(document.getElementById("root")!);

async function bootstrap() {
  // Populate the non-React registry first — the i18n backend reads it.
  setRegistry(enabledModules);
  await initI18n();

  const me = sessionStorage.getItem("enspct-token") ? await fetchMe() : null;
  const ability = buildAbility(me?.rules ?? []);
  router.update({ context: { queryClient, ability } });

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ModulesProvider modules={enabledModules}>
          <AbilityProvider ability={ability}>
            <RouterProvider router={router} />
          </AbilityProvider>
        </ModulesProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

void bootstrap().catch((error: unknown) => {
  console.error(error);
  root.render(<p role="alert">Could not start the app. Check that the Express API is running.</p>);
});
