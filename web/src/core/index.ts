// The core's public API. Modules import ONLY from here (and from external libs).
// dependency-cruiser forbids core -> modules and module -> module imports.

export { defineModule } from "./module-registry/define-module";
export type { ModuleManifest } from "./module-registry/types";


export { RecordActions } from "./ui/record-actions";
export { apiGet } from "./api/fetch";
export type { Page } from "./api/fetch";

export { loadNamespace } from "./i18n/i18n";
