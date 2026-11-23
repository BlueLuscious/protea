import type { ComponentScope } from "@luscious-garden/protea-core";
import type { Checkable } from "../../capabilities/checkable/contracts/checkable.contract.js";
import type { CheckableOptionsType } from "../../capabilities/checkable/types/checkable-options.type.js";

/** @description Creates independent checking capabilities within borrowed component lifetimes. */
export interface CheckingApi {
  /**
   * @description Fixes the checked-state authority and registers cleanup with an active scope.
   * @remarks Failed setup releases its own acquisitions and preserves borrowed lifetimes.
   * @param scope - The active lifetime and cleanup owner.
   * @param options - Internal state or a borrowed synchronous authority.
   * @returns A new checking capability sharing the supplied scope's lifetime.
   */
  readonly create: (scope: ComponentScope, options: CheckableOptionsType) => Checkable;
}
