import type { TabOption } from "../contracts/tab-option.contract.js";

/** @description Configures fixed tab and panel associations and an explicit initial selection. */
export type TabsOptionsType = {
  /** @description Non-empty ordered tabs with unique tab keys and unique panel keys. */
  readonly tabs: readonly TabOption[];

  /** @description The key of the enabled tab selected at creation. */
  readonly initialTabKey: string;
};
