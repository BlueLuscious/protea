import type { TabsInstance } from "../../components/tabs/contracts/tabs-instance.contract.js";
import type { TabsOptionsType } from "../../components/tabs/types/tabs-options.type.js";

/** @description Constructs independently owned Tabs instances. */
export interface TabsApi {
  /** @description The prepared definition shared by both Tabs construction paths. */
  readonly definition: TabsInstance["definition"];

  /**
   * @description Creates a model with fixed tab associations and local selection.
   * @param options - The ordered associations and explicit initial tab key.
   * @returns A new model whose caller owns disposal authority.
   */
  readonly create: (options: TabsOptionsType) => TabsInstance;
}
