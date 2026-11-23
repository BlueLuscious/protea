import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import type { ButtonInstance } from "../contracts/button-instance.contract.js";
import type { IButtonSurface } from "../contracts/internal/button-surface.contract.js";
import { ButtonComponent } from "../runtime/button.component.js";
import type { ButtonOptionsType } from "../types/button-options.type.js";

/** @description The built-in Button recipe, shared by the family API and explicit Core creation. */
export const ButtonDefinition: ButtonInstance["definition"] = Component.define({
  identity: { namespace: "protea", name: "button" },
  setup({ scope, options }: ComponentSetupContext<ButtonOptionsType | undefined>): IButtonSurface {
    const model = new ButtonComponent(scope, options);

    return {
      get isDisabled() {
        return model.isDisabled;
      },
      setDisabled: model.setDisabled.bind(model),
      subscribeDisabledChange: model.subscribeDisabledChange.bind(model),
      activate: model.activate.bind(model),
      subscribeActivation: model.subscribeActivation.bind(model),
    };
  },
});
