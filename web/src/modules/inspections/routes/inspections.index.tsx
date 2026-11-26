import { createFileRoute } from "@tanstack/react-router";
import { InspectionsPage } from "../pages/inspections-page";

export const Route = createFileRoute("/inspections/")({
  component: InspectionsPage,
});
