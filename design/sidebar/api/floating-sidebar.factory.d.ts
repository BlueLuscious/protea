import type { OpenableOptionsType } from "../../openable/api/index.js";
import type { FloatingSidebar } from "../contracts/floating-sidebar.contract.js";

/**
 * @description The declared owner of floating-sidebar creation.
 * @remarks This declaration supplies no runtime value. See
 * [Representative families](../../../docs/en/design/representative-families.md).
 */
export declare const floatingSidebarFactory: {
  /**
   * @description Creates a floating sidebar with one selected opening authority.
   * @remarks Creation establishes initial openness without requesting a change and captures
   * its fixed control mode and any borrowed authority. The caller owns the model's lifetime.
   * Validation and failed-creation cleanup are defined in the representative-family guide.
   * @param options - The internal or external opening configuration selected for this lifetime.
   * @returns A new active floating sidebar whose lifecycle belongs to the caller.
   */
  readonly create: (options: OpenableOptionsType) => FloatingSidebar;
};
