import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { loadNamespace } from "../../../core";

export const Route = createFileRoute("/facilities")({
  beforeLoad: ({ context }) => {
    if (context.ability.cannot("read", "Facility")) {
      throw redirect({ to: "/forbidden" });
    }
  },
  loader: () => loadNamespace("facilities"),
  component: Outlet,
});
