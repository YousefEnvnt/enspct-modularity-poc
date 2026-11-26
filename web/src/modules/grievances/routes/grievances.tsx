import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { loadNamespace } from "../../../core";

export const Route = createFileRoute("/grievances")({
  // Route-level CASL guard, using the ability from router context (backend-sourced).
  beforeLoad: ({ context }) => {
    if (context.ability.cannot("read", "Grievance")) {
      throw redirect({ to: "/forbidden" });
    }
  },
  // Lazily load this module's translations before the component renders.
  loader: () => loadNamespace("grievances"),
  component: Outlet,
});
