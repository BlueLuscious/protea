import { Activatable } from "../../capabilities/activatable/runtime/activatable.js";
import type { ActivationApi } from "../contracts/activation-api.contract.js";

/**
 * @description Immutable, stateless factory for scope-owned activation capabilities.
 */
export const Activation = Object.freeze<ActivationApi>({
  create(scope, options) {
    return new Activatable(scope, options);
  },
});

export type { ActivationApi };
export { activatableResultStatuses } from "../../capabilities/activatable/constants/activatable-result-statuses.constant.js";
export type { Activatable } from "../../capabilities/activatable/contracts/activatable.contract.js";
export type { ActivatableOptionsType } from "../../capabilities/activatable/types/activatable-options.type.js";
export type { ActivatableResultStatusType } from "../../capabilities/activatable/types/activatable-result-status.type.js";
export type { ActivatableResultType } from "../../capabilities/activatable/types/activatable-result.type.js";
