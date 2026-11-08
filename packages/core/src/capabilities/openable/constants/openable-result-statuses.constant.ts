/** @description Immutable named outcomes of a logical opening request. */
export const openableResultStatuses = Object.freeze({
  /** @description An effective opening change was committed. */
  changed: "changed",
  /** @description The requested value was already effective. */
  unchanged: "unchanged",
  /** @description An expected condition rejected the request. */
  rejected: "rejected",
} as const);
