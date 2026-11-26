import { RecordActions } from "../../../core";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchInspections } from "../api/inspections-api";

const PAGE_SIZE = 10;

export function InspectionsPage() {
  const { t } = useTranslation("inspections");
  const [page, setPage] = useState(1);
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["inspections", page],
    queryFn: () => fetchInspections(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
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
              <th>{t("col.site")}</th>
              <th>{t("col.result")}</th>
              <th>{t("col.inspector")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((row) => (
              <tr key={row.id}>
                <td><Link to="/inspections/$id" params={{ id: String(row.id) }}>{row.id}</Link></td>
                <td>{row.site}</td>
                <td>{row.result}</td>
                <td>{row.inspector}</td>
                <td><RecordActions moduleId="inspections" type="Inspection" record={row} actions={["complete"]} /></td>
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
