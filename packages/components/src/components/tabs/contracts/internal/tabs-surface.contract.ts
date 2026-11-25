import type { CapabilityUnsubscribeType } from "../../../../capabilities/shared/types/capability-unsubscribe.type.js";
import type { TabsChangeType } from "../../types/tabs-change.type.js";
import type { TabsResultType } from "../../types/tabs-result.type.js";
import type { TabOption } from "../tab-option.contract.js";

/** @description The ordered associations and observable selection supplied by the Tabs recipe. */
export interface ITabsSurface {
  /** @description Frozen tab records captured in their configured order. */
  readonly tabs: readonly TabOption[];

  /** @description The captured active tab and its logical panel, retained after finalisation. */
  readonly activeTab: TabOption;

  /**
   * @description Requests an enabled tab by its logical key.
   * @remarks A change commits before synchronous delivery. Invalid targets and observer failures throw.
   * @param tabKey - The exact key of the requested tab.
   * @returns The synchronous selection outcome.
   */
  requestSelection(tabKey: string): TabsResultType;

  /**
   * @description Observes effective selection changes without replay.
   * @param listener - Observer of committed changes between captured tab records.
   * @returns An idempotent release for this registration.
   */
  subscribeSelectionChange(listener: (change: TabsChangeType) => void): CapabilityUnsubscribeType;
}
