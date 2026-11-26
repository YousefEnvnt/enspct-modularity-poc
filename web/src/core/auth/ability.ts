import {
  createMongoAbility,
  type MongoAbility,
  type RawRuleOf,
} from "@casl/ability";

/** Broad ability type for the POC (string action + string subject). */
export type AppAbility = MongoAbility;

export interface AbilityRule {
  action: string;
  subject: string;
  conditions?: Record<string, unknown>;
}

/** Builds a CASL ability from rules returned by the backend (/api/me). */
export function buildAbility(rules: AbilityRule[]): AppAbility {
  return createMongoAbility(rules as RawRuleOf<AppAbility>[]);
}
