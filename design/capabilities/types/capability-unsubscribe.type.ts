/**
 * @description Releases one capability or authoritative-state observation registration.
 * @remarks Repeated calls are harmless, including after its owner has already released the
 * registration. Releasing it does not finalise its observed source, borrowed listener or component. See
 * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 * @returns No value.
 */
export type CapabilityUnsubscribeType = () => void;
