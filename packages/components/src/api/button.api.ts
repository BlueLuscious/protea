import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import type { IButtonSurface } from "../components/button/contracts/internal/button-surface.contract.js";
import { ButtonComponent } from "../components/button/runtime/button.component.js";
import type { ButtonOptionsType } from "../components/button/types/button-options.type.js";
import type { ButtonApi } from "./contracts/button-api.contract.js";

/** @description The built-in Button recipe, shared by the family API and explicit Core creation. */
const buttonDefinition = Component.define({
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

/** @description Immutable public API for creating independent Button instances. */
export const Button = Object.freeze<ButtonApi>({
  definition: buttonDefinition,

  create(options) {
    return Component.create(buttonDefinition, options);
  },
});
