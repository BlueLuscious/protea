import type { SwitchInstance } from "../../components/switch/contracts/switch-instance.contract.js";
import type { SwitchOptionsType } from "../../components/switch/types/switch-options.type.js";

/** @description Creates independent Switch models with caller-owned lifetimes. */
export interface SwitchApi {
  /** @description The prepared Switch definition retained by instances from both creation entries. */
  readonly definition: SwitchInstance["definition"];

  /**
   * @description Creates an active Switch with its own scope and fixed checked-state authority.
   * @param options - The explicit internal or external mode and its inputs.
   * @returns A new model whose caller owns disposal authority.
   */
  readonly create: (options: SwitchOptionsType) => SwitchInstance;
}
