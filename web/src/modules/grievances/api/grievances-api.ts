import { apiGet, type Page } from "../../../core";

interface Grievance {
  id: number;
  title: string;
  status: "open" | "in_review" | "resolved";
  submittedBy: string;
}

export function fetchGrievances(
  page: number,
  pageSize: number,
): Promise<Page<Grievance>> {
  return apiGet<Page<Grievance>>(
    `/api/grievances?page=${page}&pageSize=${pageSize}`,
  );
}

export function fetchGrievance(id: string): Promise<Grievance> {
  return apiGet<Grievance>(`/api/grievances/${encodeURIComponent(id)}`);
}
