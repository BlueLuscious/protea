import { Component } from "@luscious-garden/protea-core";
import { SwitchDefinition } from "../../components/switch/definitions/switch.definition.js";
import type { SwitchApi } from "../contracts/switch-api.contract.js";

/** @description Immutable public API for creating independent Switch instances. */
export const Switch = Object.freeze<SwitchApi>({
  definition: SwitchDefinition,

  create(options) {
    return Component.create(SwitchDefinition, options);
  },
});

export type { SwitchApi };
export type { SwitchInstance } from "../../components/switch/contracts/switch-instance.contract.js";
export type { SwitchOptionsType } from "../../components/switch/types/switch-options.type.js";
