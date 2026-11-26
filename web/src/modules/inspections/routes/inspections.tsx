import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { loadNamespace } from "../../../core";

export const Route = createFileRoute("/inspections")({
  beforeLoad: ({ context }) => {
    if (context.ability.cannot("read", "Inspection")) {
      throw redirect({ to: "/forbidden" });
    }
  },
  loader: () => loadNamespace("inspections"),
  component: Outlet,
});
