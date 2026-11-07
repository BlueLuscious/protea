import type { FloatingSidebar } from "../contracts/floating-sidebar.contract.js";
import type { StaticSidebar } from "../contracts/static-sidebar.contract.js";

/**
 * @description The static or floating sidebar pilot model, distinguished by its variant.
 * @remarks Family membership does not make opening operations universal or introduce a shared
 * runtime parent. See [Representative families](../../../docs/en/design/representative-families.md).
 */
export type SidebarType = StaticSidebar | FloatingSidebar;
