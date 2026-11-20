/**
 * @description Immutable named outcomes of an activation request.
 */
export const activatableResultStatuses = Object.freeze({
  /** @description One activation was accepted. */
  activated: "activated",
  /** @description The request was refused without accepting an activation. */
  rejected: "rejected",
} as const);
