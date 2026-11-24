/** @description Immutable normal outcomes of a selection request. */
export const selectResultStatuses = Object.freeze({
  /** @description The differing target became effective. */
  changed: "changed",
  /** @description The requested value was already effective. */
  unchanged: "unchanged",
  /** @description The request did not proceed to an accepted transition. */
  rejected: "rejected",
} as const);
