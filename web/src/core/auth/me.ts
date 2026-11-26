import { apiGet } from "../api/fetch";
import type { AbilityRule } from "./ability";

interface Me {
  user: { id: string; name: string };
  rules: AbilityRule[];
}

export function fetchMe(): Promise<Me> {
  return apiGet<Me>("/api/me");
}
