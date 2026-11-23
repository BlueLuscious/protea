import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import type { Checkable } from "../capabilities/checkable/contracts/checkable.contract.js";
import type { SwitchOptionsType } from "../components/switch/types/switch-options.type.js";
import { Checking } from "./checking.api.js";
import type { SwitchApi } from "./contracts/switch-api.contract.js";

/** @description The built-in Switch recipe composing checked state with the Core-owned lifetime. */
const switchDefinition = Component.define({
  identity: { namespace: "protea", name: "switch" },
  setup({ scope, options }: ComponentSetupContext<SwitchOptionsType>): Checkable {
    const checking = Checking.create(scope, options);
    return {
      get isChecked() {
        return checking.isChecked;
      },
      requestChecked: checking.requestChecked.bind(checking),
      subscribeCheckedChange: checking.subscribeCheckedChange.bind(checking),
    };
  },
});

/** @description Immutable public API for creating independent Switch instances. */
export const Switch = Object.freeze<SwitchApi>({
  definition: switchDefinition,

  create(options) {
    return Component.create(switchDefinition, options);
  },
});
