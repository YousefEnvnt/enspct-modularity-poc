import { apiGet, type Page } from "../../../core";

interface Facility {
  id: number;
  site: string;
  status: "active" | "inactive";
  manager: string;
  region: string;
  category: string;
  risk: string;
  employees: number;
  license: string;
  address: string;
  lastInspection: string;
}

export function fetchFacilities(
  page: number,
  pageSize: number,
): Promise<Page<Facility>> {
  return apiGet<Page<Facility>>(
    `/api/facilities?page=${page}&pageSize=${pageSize}`,
  );
}

export function fetchFacility(id: string): Promise<Facility> {
  return apiGet<Facility>(`/api/facilities/${encodeURIComponent(id)}`);
}
