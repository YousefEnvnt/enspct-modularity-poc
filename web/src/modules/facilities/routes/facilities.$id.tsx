import { RecordActions } from "../../../core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchFacility } from "../api/facilities-api";

export const Route = createFileRoute("/facilities/$id")({
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const { data, isPending, error } = useQuery({
    queryKey: ["facilities", "detail", id],
    queryFn: () => fetchFacility(id),
  });

  return (
    <section>
      <Link to="/facilities">Back to facilities</Link>
      <h1>Facility #{id}</h1>
      {isPending && <p>Loading…</p>}
      {error && <p role="alert">{error.message}</p>}
      {data && (
        <div>
        <RecordActions moduleId="facilities" type="Facility" record={data} actions={["activate", "deactivate"]} />
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
