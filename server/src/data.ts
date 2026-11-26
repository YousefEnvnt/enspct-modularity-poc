// In-memory demo data. Mimics the "all tables are paginated server-side" context.

export interface Grievance {
  id: number;
  title: string;
  status: "open" | "in_review" | "resolved";
  submittedBy: string;
}

export interface Inspection {
  id: number;
  site: string;
  result: "pass" | "fail" | "pending";
  inspector: string;
}

const statuses: Grievance["status"][] = ["open", "in_review", "resolved"];
const results: Inspection["result"][] = ["pass", "fail", "pending"];

export const grievances: Grievance[] = Array.from({ length: 57 }, (_, i) => ({
  id: i + 1,
  title: `Grievance #${i + 1}`,
  status: statuses[i % statuses.length],
  submittedBy: `employee-${(i % 9) + 1}`,
}));

export const inspections: Inspection[] = Array.from({ length: 41 }, (_, i) => ({
  id: i + 1,
  site: `Site ${String.fromCharCode(65 + (i % 6))}-${i + 1}`,
  result: results[i % results.length],
  inspector: `inspector-${(i % 5) + 1}`,
}));

export function paginate<T>(rows: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return {
    items: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageSize,
  };
}

export const facilities = Array.from({ length: 34 }, (_, index) => ({
  id: index + 1,
  site: `Facility #${index + 1}`,
  status: index % 4 === 0 ? "inactive" : "active",
  manager: index % 2 === 0 ? "Sara Ahmed" : "Omar Hassan",
  region: index % 2 === 0 ? "Cairo" : "Alexandria",
  address: index % 2 === 0 ? "12 El Tahrir Street, Cairo" : "8 Corniche Road, Alexandria",
  category: ["Hospital", "Warehouse", "Restaurant"][index % 3],
  risk: ["High", "Medium", "Low"][index % 3],
  employees: 25 + index * 7,
  lastInspection: "2026-11-20",
  license: `LIC-2026-${1000 + index}`,
}));
