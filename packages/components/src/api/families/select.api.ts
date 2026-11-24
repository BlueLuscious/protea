import { Component } from "@luscious-garden/protea-core";
import { SelectDefinition } from "../../components/select/definitions/select.definition.js";
import type { SelectApi } from "../contracts/select-api.contract.js";

/** @description Immutable public API for creating independent Select instances. */
export const Select = Object.freeze<SelectApi>({
  definition: SelectDefinition,

  create(config) {
    return Component.create(SelectDefinition, config);
  },
});

export type { SelectApi };
export { selectResultStatuses } from "../../components/select/constants/select-result-statuses.constant.js";
export type { SelectInstance } from "../../components/select/contracts/select-instance.contract.js";
export type { SelectOption } from "../../components/select/contracts/select-option.contract.js";
export type { SelectionAuthority } from "../../components/select/contracts/selection-authority.contract.js";
export type { SelectChangeType } from "../../components/select/types/select-change.type.js";
export type { SelectOptionsType } from "../../components/select/types/select-options.type.js";
export type { SelectResultStatusType } from "../../components/select/types/select-result-status.type.js";
export type { SelectResultType } from "../../components/select/types/select-result.type.js";
