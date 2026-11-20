import type { SidebarInstance } from "../../components/sidebar/contracts/sidebar-instance.contract.js";
import type { SidebarOptionsType } from "../../components/sidebar/types/sidebar-options.type.js";

/** @description The construction contract for independent Sidebar models, without a runtime value. */
export interface SidebarApi {
  /**
   * @description Creates an active Sidebar with a private scope and fixed opening authority.
   * @remarks Failed setup exposes no partial model, invalidates acquired work and finalises only
   * the newly owned scope, attempting all required releases and preserving borrowed lifetimes.
   * @param options - Required opening control; internal defaults closed, external borrows its source.
   * @returns A new model whose caller owns disposal authority.
   */
  readonly create: (options: SidebarOptionsType) => SidebarInstance;
}
