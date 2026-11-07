import type { Component } from "../../component/api/index.js";
import type { Openable } from "../../openable/api/index.js";

/**
 * @description A sidebar model whose logical presence is controlled by an opening capability.
 * @remarks It combines one lifetime with the selected opening authority rather than inheriting
 * static-sidebar behaviour or a presentation class. See
 * [Representative families](../../../docs/en/design/representative-families.md).
 */
export interface FloatingSidebar extends Component, Openable {
  /** @description Identifies the floating behavioural variant. */
  readonly variant: "floating";
}
