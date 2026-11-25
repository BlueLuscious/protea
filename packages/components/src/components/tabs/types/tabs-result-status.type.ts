import type { tabsResultStatuses } from "../constants/tabs-result-statuses.constant.js";

/** @description The closed set of normal tab selection request statuses. */
export type TabsResultStatusType = typeof tabsResultStatuses[keyof typeof tabsResultStatuses];
