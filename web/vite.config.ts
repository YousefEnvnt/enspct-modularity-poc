import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { routes } from "./src/routes";

export default defineConfig({
  plugins: [
    // Must come BEFORE the React plugin.
    tanstackRouter({
      target: "react",
      // Our route files live inside modules, not in a single routes/ dir,
      // so filenames in the virtual config are resolved relative to ./src.
      routesDirectory: "./src",
      generatedRouteTree: "./src/routeTree.gen.ts",
      // The route tree is assembled from per-module fragments (see src/routes.ts).
      virtualRouteConfig: routes,
      // Each route's component is split into its own chunk automatically.
      autoCodeSplitting: true,
    }),
    react(),
  ],
  server: { port: 5173 },
});
