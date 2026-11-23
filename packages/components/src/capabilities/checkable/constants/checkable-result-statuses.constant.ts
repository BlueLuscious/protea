/** @description Immutable normal outcomes of a checked-state request. */
export const checkableResultStatuses = Object.freeze({
  /** @description A differing target became effective. */
  changed: "changed",
  /** @description The target was already effective. */
  unchanged: "unchanged",
  /** @description The request was refused before an observed commitment. */
  rejected: "rejected",
} as const);
