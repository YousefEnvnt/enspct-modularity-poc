import { createFileRoute } from "@tanstack/react-router";
import { GrievancesPage } from "../pages/grievances-page";

export const Route = createFileRoute("/grievances/")({
  component: GrievancesPage,
});
