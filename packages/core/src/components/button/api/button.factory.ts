import type { ButtonFactory } from "../contracts/button-factory.contract.js";
import { ButtonComponent } from "../runtime/button.component.js";
import type { ButtonOptionsType } from "../types/button-options.type.js";

/** @description Immutable, stateless factory for Buttons with independent private lifetimes. */
export const buttonFactory: ButtonFactory = Object.freeze({
  create(options?: ButtonOptionsType): ButtonComponent {
    return new ButtonComponent(options);
  },
});
