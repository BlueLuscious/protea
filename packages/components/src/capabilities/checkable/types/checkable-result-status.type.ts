import type { checkableResultStatuses } from "../constants/checkable-result-statuses.constant.js";

/** @description The closed set of normal checked-state request statuses. */
export type CheckableResultStatusType = typeof checkableResultStatuses[keyof typeof checkableResultStatuses];
