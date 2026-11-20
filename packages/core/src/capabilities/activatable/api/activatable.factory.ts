import type { ComponentScope } from "../../../component/contracts/component-scope.contract.js";
import type { ActivatableFactory } from "../contracts/activatable-factory.contract.js";
import { Activatable } from "../runtime/activatable.js";
import type { ActivatableOptionsType } from "../types/activatable-options.type.js";

/**
 * @description Immutable, stateless factory for scope-owned activation capabilities.
 */
export const activatableFactory: ActivatableFactory = Object.freeze({
  create(scope: ComponentScope, options?: ActivatableOptionsType): Activatable {
    return new Activatable(scope, options);
  },
});
