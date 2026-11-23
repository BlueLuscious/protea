import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import { Checking } from "../../../api/capabilities/checking.api.js";
import type { Checkable } from "../../../capabilities/checkable/contracts/checkable.contract.js";
import type { SwitchInstance } from "../contracts/switch-instance.contract.js";
import type { SwitchOptionsType } from "../types/switch-options.type.js";

/** @description The built-in Switch recipe composing checked state with the Core-owned lifetime. */
export const SwitchDefinition: SwitchInstance["definition"] = Component.define({
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
