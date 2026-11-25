import { Component } from "@luscious-garden/protea-core";
import type { TabsInstance } from "../../components/tabs/contracts/tabs-instance.contract.js";
import { TabsDefinition } from "../../components/tabs/definitions/tabs.definition.js";
import type { TabsApi } from "../contracts/tabs-api.contract.js";

/** @description Immutable public API for creating independent Tabs instances. */
export const Tabs = Object.freeze<TabsApi>({
  definition: TabsDefinition,

  create(options): TabsInstance {
    return Component.create(TabsDefinition, options);
  },
});

export type { TabsApi, TabsInstance };
export { tabsResultStatuses } from "../../components/tabs/constants/tabs-result-statuses.constant.js";
export type { TabOption } from "../../components/tabs/contracts/tab-option.contract.js";
export type { TabsChangeType } from "../../components/tabs/types/tabs-change.type.js";
export type { TabsOptionsType } from "../../components/tabs/types/tabs-options.type.js";
export type { TabsResultStatusType } from "../../components/tabs/types/tabs-result-status.type.js";
export type { TabsResultType } from "../../components/tabs/types/tabs-result.type.js";
