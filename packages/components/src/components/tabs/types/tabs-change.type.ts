import type { TabOption } from "../contracts/tab-option.contract.js";

/** @description A frozen snapshot of a committed selection change between captured tabs. */
export type TabsChangeType = {
  /** @description The captured tab that was active before commitment. */
  readonly previous: TabOption;

  /** @description The captured tab that became active. */
  readonly current: TabOption;
};
