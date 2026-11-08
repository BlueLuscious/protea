/**
 * @description Immutable named states of a component's logical lifetime.
 */
export const componentLifecycleStates = Object.freeze({
  /** @description The logical lifetime has not ended. */
  active: "active",
  /** @description The logical lifetime has ended, regardless of cleanup success. */
  disposed: "disposed",
} as const);
