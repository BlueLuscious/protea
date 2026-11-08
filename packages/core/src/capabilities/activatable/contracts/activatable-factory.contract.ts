import type { ComponentScope } from "../../../component/api/index.js";
import type { ActivatableOptionsType } from "../types/activatable-options.type.js";
import type { Activatable } from "./activatable.contract.js";

/**
 * @description Creates independent activation capabilities within borrowed component lifetimes.
 */
export interface ActivatableFactory {
  /**
   * @description Captures an optional guard and registers capability cleanup with an active scope.
   * @remarks Failed setup releases only its own resources and never disposes the borrowed scope.
   * See [Activation](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/core/capabilities/activatable/index.md).
   * @param scope - Active lifetime and cleanup owner borrowed by the capability.
   * @param options - Optional synchronous guard, captured without invoking it.
   * @returns A new capability sharing the supplied scope's lifetime.
   */
  readonly create: (scope: ComponentScope, options?: ActivatableOptionsType) => Activatable;
}
