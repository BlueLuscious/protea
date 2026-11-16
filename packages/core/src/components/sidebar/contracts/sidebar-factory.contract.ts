import type { SidebarOptionsType } from "../types/sidebar-options.type.js";
import type { Sidebar } from "./sidebar.contract.js";

/** @description The construction contract for independent Sidebar models, without a runtime value. */
export interface SidebarFactory {
  /**
   * @description Creates an active Sidebar with a private scope and fixed opening authority.
   * @remarks Failed setup exposes no partial model, invalidates acquired work and finalises only
   * the newly owned scope, attempting all required releases and preserving borrowed lifetimes.
   * @param options - Required opening control; internal defaults closed, external borrows its source.
   * @returns A new model whose caller owns disposal authority.
   */
  readonly create: (options: SidebarOptionsType) => Sidebar;
}
