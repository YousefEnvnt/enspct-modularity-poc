import { RecordActions } from "../../../core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchGrievance } from "../api/grievances-api";

export const Route = createFileRoute("/grievances/$id")({
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const { data, isPending, error } = useQuery({
    queryKey: ["grievances", "detail", id],
    queryFn: () => fetchGrievance(id),
  });

  return (
    <section>
      <Link to="/grievances">Back to grievances</Link>
      <h1>Grievance #{id}</h1>
      {isPending && <p>Loading…</p>}
      {error && <p role="alert">{error.message}</p>}
      {data && (
        <div>
        <RecordActions moduleId="grievances" type="Grievance" record={data} actions={["approve"]} />
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
