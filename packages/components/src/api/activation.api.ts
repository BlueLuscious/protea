import { Activatable } from "../capabilities/activatable/runtime/activatable.js";
import type { ActivationApi } from "./contracts/activation-api.contract.js";

/**
 * @description Immutable, stateless factory for scope-owned activation capabilities.
 */
export const Activation = Object.freeze<ActivationApi>({
  create(scope, options) {
    return new Activatable(scope, options);
  },
});
