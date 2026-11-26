const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function apiRequest<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const token = sessionStorage.getItem("enspct-token");
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401 && path !== "/api/login") {
    sessionStorage.removeItem("enspct-token");
    window.location.assign("/login");
  }
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path);
}

/** Shape every server-side paginated list endpoint returns. */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
