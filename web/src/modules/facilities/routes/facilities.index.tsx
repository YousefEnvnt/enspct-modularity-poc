import { createFileRoute } from "@tanstack/react-router";
import { FacilitiesPage } from "../pages/facilities-page";

export const Route = createFileRoute("/facilities/")({
  component: FacilitiesPage,
});
