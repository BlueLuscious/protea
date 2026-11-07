/**
 * @description An expected reason for rejecting a capability request.
 * @remarks Finalisation, an in-progress operation and denied authorisation are distinct outcomes.
 * Unexpected collaborator failures are opaque exceptions, not rejection reasons. See
 * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 */
export type CapabilityRejectionReasonType = "disposed" | "busy" | "denied";
