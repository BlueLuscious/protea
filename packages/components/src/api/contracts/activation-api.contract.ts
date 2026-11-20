import type { ComponentScope } from "@luscious-garden/protea-core";
import type { Activatable } from "../../capabilities/activatable/contracts/activatable.contract.js";
import type { ActivatableOptionsType } from "../../capabilities/activatable/types/activatable-options.type.js";

/**
 * @description Creates independent activation capabilities within borrowed component lifetimes.
 */
export interface ActivationApi {
  /**
   * @description Captures an optional guard and registers capability cleanup with an active scope.
   * @remarks Failed setup releases only its own resources and never disposes the borrowed scope.
   * See [Activation](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/capabilities/activatable/index.md).
   * @param scope - Active lifetime and cleanup owner borrowed by the capability.
   * @param options - Optional synchronous guard, captured without invoking it.
   * @returns A new capability sharing the supplied scope's lifetime.
   */
  readonly create: (scope: ComponentScope, options?: ActivatableOptionsType) => Activatable;
}
