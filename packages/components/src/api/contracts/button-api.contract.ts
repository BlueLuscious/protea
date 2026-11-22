import type { ButtonInstance } from "../../components/button/contracts/button-instance.contract.js";
import type { ButtonOptionsType } from "../../components/button/types/button-options.type.js";

/** @description Creates independent Button models with caller-owned lifetimes. */
export interface ButtonApi {
  /** @description The prepared Button definition retained by instances from both creation entries. */
  readonly definition: ButtonInstance["definition"];

  /**
   * @description Creates an active Button with its own private lifetime and captured availability.
   * @remarks Failed setup exposes no partial model and finalises only its newly owned scope,
   * attempting every required release while preserving borrowed collaborators.
   * @param options - Optional initial policy; omission or undefined selects enabled availability.
   * @returns A new model whose caller owns disposal authority.
   */
  readonly create: (options?: ButtonOptionsType) => ButtonInstance;
}
