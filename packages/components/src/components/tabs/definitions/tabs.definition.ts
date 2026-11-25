import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import type { ITabsSurface } from "../contracts/internal/tabs-surface.contract.js";
import type { TabsInstance } from "../contracts/tabs-instance.contract.js";
import { TabsComponent } from "../runtime/tabs.component.js";
import type { TabsOptionsType } from "../types/tabs-options.type.js";

/** @description The prepared Tabs recipe shared by both creation paths. */
export const TabsDefinition: TabsInstance["definition"] = Component.define({
  identity: { namespace: "protea", name: "tabs" },
  setup({ scope, options }: ComponentSetupContext<TabsOptionsType>): ITabsSurface {
    const tabs = new TabsComponent(scope, options);
    return {
      get tabs() {
        return tabs.tabs;
      },
      get activeTab() {
        return tabs.activeTab;
      },
      requestSelection: tabs.requestSelection.bind(tabs),
      subscribeSelectionChange: tabs.subscribeSelectionChange.bind(tabs),
    };
  },
});
