import { createFileRoute } from "@tanstack/react-router";

function ForbiddenPage() {
  return (
    <section>
      <h1>403 — Not allowed</h1>
      <p>
        Your abilities (from the backend) don&apos;t permit this module. A route
        guard redirected you here.
      </p>
    </section>
  );
}

export const Route = createFileRoute("/forbidden")({
  component: ForbiddenPage,
});
