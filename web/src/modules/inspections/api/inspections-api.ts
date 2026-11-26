import { apiGet, type Page } from "../../../core";

interface Inspection {
  id: number;
  site: string;
  result: "pass" | "fail" | "pending";
  inspector: string;
}

export function fetchInspections(
  page: number,
  pageSize: number,
): Promise<Page<Inspection>> {
  return apiGet<Page<Inspection>>(
    `/api/inspections?page=${page}&pageSize=${pageSize}`,
  );
}

export function fetchInspection(id: string): Promise<Inspection> {
  return apiGet<Inspection>(`/api/inspections/${encodeURIComponent(id)}`);
}
