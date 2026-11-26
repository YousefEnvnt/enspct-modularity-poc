import { RecordActions } from "../../../core";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchGrievances } from "../api/grievances-api";

const PAGE_SIZE = 10;

export function GrievancesPage() {
  const { t } = useTranslation("grievances");
  const [page, setPage] = useState(1);
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["grievances", page],
    queryFn: () => fetchGrievances(page, PAGE_SIZE),
    placeholderData: keepPreviousData, // keep the current page while the next loads
  });

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <section>
      <h1>{t("heading")}</h1>
      {error && <p role="alert">{error.message} <button onClick={() => void refetch()}>Retry</button></p>}
      {isPending && !data ? (
        <p>Loading…</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t("col.id")}</th>
              <th>{t("col.title")}</th>
              <th>{t("col.status")}</th>
              <th>{t("col.by")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((g) => (
              <tr key={g.id}>
                <td><Link to="/grievances/$id" params={{ id: String(g.id) }}>{g.id}</Link></td>
                <td>{g.title}</td>
                <td>{g.status}</td>
                <td>{g.submittedBy}</td>
                <td><RecordActions moduleId="grievances" type="Grievance" record={g} actions={["approve"]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          ‹
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          ›
        </button>

      </div>
    </section>
  );
}
