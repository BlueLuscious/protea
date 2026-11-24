import type { selectResultStatuses } from "../constants/select-result-statuses.constant.js";

/** @description The closed set of normal selection request statuses. */
export type SelectResultStatusType = typeof selectResultStatuses[keyof typeof selectResultStatuses];
