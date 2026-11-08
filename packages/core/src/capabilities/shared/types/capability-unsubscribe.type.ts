/**
 * @description Releases one observation registration without finalising its source or listener.
 * @remarks Repeated calls are harmless, including after the owner is finalised.
 * @returns No value.
 */
export type CapabilityUnsubscribeType = () => void;
