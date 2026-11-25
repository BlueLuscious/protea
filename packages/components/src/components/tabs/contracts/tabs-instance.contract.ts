import type { ComponentDefinition, ComponentInstance } from "@luscious-garden/protea-core";
import type { TabsOptionsType } from "../types/tabs-options.type.js";
import type { ITabsSurface } from "./internal/tabs-surface.contract.js";

/**
 * @description A fixed set of tab and panel associations with one locally selected tab.
 * @see [Tabs](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/components/tabs/index.md).
 */
export interface TabsInstance
  extends ComponentInstance<ComponentDefinition<TabsOptionsType, ITabsSurface>>, ITabsSurface {}
