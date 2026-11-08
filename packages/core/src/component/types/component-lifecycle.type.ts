/**
 * @description The lifetime of a component model before or after finalisation.
 * @remarks This is independent of mounting, visibility and interactive state. See
 * [Component foundation](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/core/component/index.md) for semantics.
 */
export type ComponentLifecycleType = "active" | "disposed";
