import { Component } from "@luscious-garden/protea-core";
import { ButtonDefinition } from "../../components/button/definitions/button.definition.js";
import type { ButtonApi } from "../contracts/button-api.contract.js";

/** @description Immutable public API for creating independent Button instances. */
export const Button = Object.freeze<ButtonApi>({
  definition: ButtonDefinition,

  create(options) {
    return Component.create(ButtonDefinition, options);
  },
});

export type { ButtonApi };
export type { ButtonInstance } from "../../components/button/contracts/button-instance.contract.js";
export type { ButtonDisabledChangeType } from "../../components/button/types/button-disabled-change.type.js";
export type { ButtonOptionsType } from "../../components/button/types/button-options.type.js";
