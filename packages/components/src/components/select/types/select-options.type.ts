import type { SelectionAuthority } from "../contracts/selection-authority.contract.js";
import type { SelectOption } from "../contracts/select-option.contract.js";

/** @description Configures a Select with fixed options and one external selection owner. */
export type SelectOptionsType = {
  /** @description Non-empty ordered choices with unique values, captured at construction. */
  readonly options: readonly SelectOption[];

  /** @description Source of the initial selection, later updates and request decisions. */
  readonly authority: SelectionAuthority;
};
