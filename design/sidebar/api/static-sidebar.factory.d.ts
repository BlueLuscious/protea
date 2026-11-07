import type { StaticSidebar } from "../contracts/static-sidebar.contract.js";

/**
 * @description The declared owner of static-sidebar creation.
 * @remarks This declaration supplies no runtime value. See
 * [Representative families](../../../docs/en/design/representative-families.md).
 */
export declare const staticSidebarFactory: {
  /**
   * @description Creates the permanently present static-sidebar pilot model.
   * @remarks Creation requires no opening options and performs no activation or opening request.
   * The caller owns the model's lifetime under the representative-family creation rules.
   * @returns A new active static sidebar whose lifecycle belongs to the caller.
   */
  readonly create: () => StaticSidebar;
};
