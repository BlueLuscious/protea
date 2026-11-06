/**
 * @description The lifetime of a component model before or after finalisation.
 * @remarks This is independent of mounting, visibility and interactive state. See
 * [Component foundation](../../../docs/en/design/component-foundation.md) for the lifetime semantics.
 */
export type ComponentLifecycleType = "active" | "disposed";
