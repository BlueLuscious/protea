/**
 * @description Immutable expected reasons for rejecting a capability request.
 */
export const capabilityRejectionReasons = Object.freeze({
  /** @description The owning component's logical lifetime has ended. */
  disposed: "disposed",
  /** @description This capability is already handling a request or delivery. */
  busy: "busy",
  /** @description The guard or external authority refused the request. */
  denied: "denied",
} as const);
