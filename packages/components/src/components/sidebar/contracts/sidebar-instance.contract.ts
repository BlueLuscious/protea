import type { ComponentDefinition, ComponentInstance } from "@luscious-garden/protea-core";
import type { Openable } from "../../../capabilities/openable/contracts/openable.contract.js";
import type { SidebarOptionsType } from "../types/sidebar-options.type.js";

/**
 * @description A lateral-region model with owned lifetime and changeable logical opening.
 * @remarks This bounded contract excludes permanently invariant visibility. Openable owns its
 * request, observation and terminal-projection semantics; positioning and host visibility are
 * independent. See [Sidebar](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/components/sidebar/index.md).
 */
export interface SidebarInstance extends ComponentInstance<ComponentDefinition<SidebarOptionsType, Openable>>, Openable {}
