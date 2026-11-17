import type { ButtonOptionsType } from "../types/button-options.type.js";
import type { Button } from "./button.contract.js";

/** @description Creates independent Button models with caller-owned lifetimes. */
export interface ButtonFactory {
  /**
   * @description Creates an active Button with its own private lifetime and captured availability.
   * @remarks Failed setup exposes no partial model and finalises only its newly owned scope,
   * attempting every required release while preserving borrowed collaborators.
   * @param options - Optional initial policy; omission or undefined selects enabled availability.
   * @returns A new model whose caller owns disposal authority.
   */
  readonly create: (options?: ButtonOptionsType) => Button;
}
