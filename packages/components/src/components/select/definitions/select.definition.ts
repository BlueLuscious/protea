import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import type { ISelectSurface } from "../contracts/internal/select-surface.contract.js";
import type { SelectInstance } from "../contracts/select-instance.contract.js";
import { SelectComponent } from "../runtime/select.component.js";
import type { SelectOptionsType } from "../types/select-options.type.js";

/** @description The built-in Select recipe shared by the family API and explicit Core creation. */
export const SelectDefinition: SelectInstance["definition"] = Component.define({
  identity: { namespace: "protea", name: "select" },
  setup({ scope, options }: ComponentSetupContext<SelectOptionsType>): ISelectSurface {
    const select = new SelectComponent(scope, options);
    return {
      get options() {
        return select.options;
      },
      get selectedValue() {
        return select.selectedValue;
      },
      requestSelection: select.requestSelection.bind(select),
      subscribeSelectionChange: select.subscribeSelectionChange.bind(select),
    };
  },
});
