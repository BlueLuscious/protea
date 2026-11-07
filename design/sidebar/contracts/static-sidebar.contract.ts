import type { Component } from "../../component/api/index.js";

/**
 * @description A sidebar model that is permanently present in the static pilot scenario.
 * @remarks Its logical lifetime requires no opening state or requests. This contract does not
 * implement host visibility or prescribe presentation. See
 * [Representative families](../../../docs/en/design/representative-families.md).
 */
export interface StaticSidebar extends Component {
  /** @description Identifies the static behavioural variant. */
  readonly variant: "static";
}
