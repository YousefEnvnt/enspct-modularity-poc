import { RecordActions } from "../../../core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchInspection } from "../api/inspections-api";

export const Route = createFileRoute("/inspections/$id")({
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const { data, isPending, error } = useQuery({
    queryKey: ["inspections", "detail", id],
    queryFn: () => fetchInspection(id),
  });

  return (
    <section>
      <Link to="/inspections">Back to inspections</Link>
      <h1>Inspection #{id}</h1>
      {isPending && <p>Loading…</p>}
      {error && <p role="alert">{error.message}</p>}
      {data && (
        <div>
        <RecordActions moduleId="inspections" type="Inspection" record={data} actions={["complete"]} />
        <dl>
          {Object.entries(data).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{String(value)}</dd>
            </div>
          ))}
        </dl>
        </div>
      )}
    </section>
  );
}
