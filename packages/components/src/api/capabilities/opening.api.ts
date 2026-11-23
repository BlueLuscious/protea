import { Openable } from "../../capabilities/openable/runtime/openable.js";
import type { OpeningApi } from "../contracts/opening-api.contract.js";

/** @description Immutable stateless construction owner for portable logical opening. */
export const Opening = Object.freeze<OpeningApi>({
  create(scope, options) {
    return new Openable(scope, options);
  },
});

export type { OpeningApi };
export { openableResultStatuses } from "../../capabilities/openable/constants/openable-result-statuses.constant.js";
export type { OpenStateAuthority } from "../../capabilities/openable/contracts/open-state-authority.contract.js";
export type { Openable } from "../../capabilities/openable/contracts/openable.contract.js";
export type { OpenableChangeType } from "../../capabilities/openable/types/openable-change.type.js";
export type { OpenableOptionsType } from "../../capabilities/openable/types/openable-options.type.js";
export type { OpenableResultStatusType } from "../../capabilities/openable/types/openable-result-status.type.js";
export type { OpenableResultType } from "../../capabilities/openable/types/openable-result.type.js";
