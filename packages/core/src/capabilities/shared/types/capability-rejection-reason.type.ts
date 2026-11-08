import type { capabilityRejectionReasons } from "../constants/capability-rejection-reasons.constant.js";

/**
 * @description An expected rejection reason, distinct from an unexpected exception.
 */
export type CapabilityRejectionReasonType =
  (typeof capabilityRejectionReasons)[keyof typeof capabilityRejectionReasons];
