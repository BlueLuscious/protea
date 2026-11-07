import type { ActivatableOptionsType } from "../../activatable/api/index.js";
import type { Button } from "../contracts/button.contract.js";

/**
 * @description The declared owner of button creation.
 * @remarks This declaration supplies no runtime value. See
 * [Representative families](../../../docs/en/design/representative-families.md).
 */
export declare const buttonFactory: {
  /**
   * @description Creates a button with its own lifetime and activation capability.
   * @remarks Creation captures the selected guard without requesting activation; the guard
   * remains borrowed. The caller owns the new model's lifetime. Validation and failed-creation
   * cleanup are defined in the representative-family guide.
   * @param options - Optional activation authorisation, defaulting to acceptance when omitted.
   * @returns A new active button whose lifecycle belongs to the caller.
   */
  readonly create: (options?: ActivatableOptionsType) => Button;
};
