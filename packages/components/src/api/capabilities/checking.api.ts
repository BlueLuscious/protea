import { Checkable } from "../../capabilities/checkable/runtime/checkable.js";
import type { CheckingApi } from "../contracts/checking-api.contract.js";

/** @description Immutable stateless factory for checked state within a borrowed lifetime. */
export const Checking = Object.freeze<CheckingApi>({
  create(scope, options) {
    return new Checkable(scope, options);
  },
});

export type { CheckingApi };
export { checkableResultStatuses } from "../../capabilities/checkable/constants/checkable-result-statuses.constant.js";
export type { Checkable } from "../../capabilities/checkable/contracts/checkable.contract.js";
export type { CheckedStateAuthority } from "../../capabilities/checkable/contracts/checked-state-authority.contract.js";
export type { CheckableChangeType } from "../../capabilities/checkable/types/checkable-change.type.js";
export type { CheckableOptionsType } from "../../capabilities/checkable/types/checkable-options.type.js";
export type { CheckableResultStatusType } from "../../capabilities/checkable/types/checkable-result-status.type.js";
export type { CheckableResultType } from "../../capabilities/checkable/types/checkable-result.type.js";
