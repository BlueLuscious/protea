import type { ComponentLifecycleType } from "../types/component-lifecycle.type.js";

/**
 * @description The minimum lifetime contract shared by Protea component models.
 * @remarks Identity is the object reference. Creation, resource ownership and finalisation are
 * defined in [Component foundation](../../../docs/en/design/component-foundation.md).
 */
export interface Component {
  /**
   * @description The current lifetime of this component model.
   * @remarks This remains readable after finalisation and is independent of mounting, visibility
   * and interactive state. Consumers cannot assign it through this contract.
   */
  readonly lifecycle: ComponentLifecycleType;

  /**
   * @description Finalises this model and attempts to release every resource it owns.
   * @remarks Finalisation is irreversible and becomes observable before external release work.
   * Repeated and re-entrant calls return without waiting, retrying releases or resurfacing failures.
   * Borrowed resources are not finalised. An initial call must throw if a required release fails,
   * after attempting all required releases; no error class or aggregation shape is guaranteed. See
   * [Component foundation](../../../docs/en/design/component-foundation.md) for the full semantics.
   * @returns No value.
   */
  dispose(): void;
}
