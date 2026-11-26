import { RecordActions } from "../../../core";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchFacilities } from "../api/facilities-api";

const PAGE_SIZE = 10;

export function FacilitiesPage() {
  const { t } = useTranslation("facilities");
  const [page, setPage] = useState(1);
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["facilities", page],
    queryFn: () => fetchFacilities(page, PAGE_SIZE),
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
              <th>{t("col.status")}</th>
              <th>{t("col.manager")}</th>
              <th>Region</th><th>Category</th><th>Risk</th><th>Employees</th><th>License</th><th>Address</th><th>Last inspection</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((row) => (
              <tr key={row.id}>
                <td><Link to="/facilities/$id" params={{ id: String(row.id) }}>{row.id}</Link></td>
                <td>{row.site}</td>
                <td>{row.status}</td>
                <td>{row.manager}</td>
                <td>{row.region}</td><td>{row.category}</td><td>{row.risk}</td><td>{row.employees}</td><td>{row.license}</td><td>{row.address}</td><td>{row.lastInspection}</td>
                <td><RecordActions moduleId="facilities" type="Facility" record={row} actions={["activate", "deactivate"]} /></td>
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
