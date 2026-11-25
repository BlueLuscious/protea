/** @description Immutable normal outcomes of a tab selection request. */
export const tabsResultStatuses = Object.freeze({
  /** @description The requested tab became active. */
  changed: "changed",
  /** @description The requested tab was already active. */
  unchanged: "unchanged",
  /** @description The request did not proceed to a selection change. */
  rejected: "rejected",
} as const);
