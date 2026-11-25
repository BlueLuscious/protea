import { componentLifecycleStates, type ComponentScope } from "@luscious-garden/protea-core";
import { capabilityRejectionReasons } from "../../../capabilities/shared/constants/capability-rejection-reasons.constant.js";
import type { CapabilityUnsubscribeType } from "../../../capabilities/shared/types/capability-unsubscribe.type.js";
import { ObservationListeners } from "../../../shared/runtime/observation-listeners.js";
import { tabsResultStatuses } from "../constants/tabs-result-statuses.constant.js";
import type { ITabsSurface } from "../contracts/internal/tabs-surface.contract.js";
import type { TabOption } from "../contracts/tab-option.contract.js";
import type { TabsChangeType } from "../types/tabs-change.type.js";
import type { TabsOptionsType } from "../types/tabs-options.type.js";
import type { TabsResultType } from "../types/tabs-result.type.js";

/** @description Owns one local selection over captured tab and panel associations. */
export class TabsComponent implements ITabsSurface {
  /** @description The frozen ordered tab records captured from configuration. */
  readonly tabs: readonly TabOption[];

  /** @description The instance lifetime supplied by Core. */
  readonly #scope: ComponentScope;

  /** @description Independent observers of committed selection changes. */
  readonly #listeners: ObservationListeners<[TabsChangeType]>;

  /** @description The single committed record for the active tab and its panel. */
  #activeTab: TabOption;

  /** @description Whether a selection transition is occupied by synchronous delivery. */
  #busy = false;

  /**
   * @description Captures associations and initial selection before acquiring observations.
   * @param scope - The instance scope supplied by Core.
   * @param options - The borrowed configuration for this creation.
   */
  constructor(scope: ComponentScope, options: TabsOptionsType) {
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
      throw new TypeError("Tabs options must be an object.");
    }

    this.tabs = this.#captureTabs(options.tabs);
    const initialTab = this.#requireTab(options.initialTabKey);
    if (initialTab.disabled) {
      throw new RangeError("The initial tab must be enabled.");
    }

    this.#activeTab = initialTab;
    this.#scope = scope;
    this.#listeners = new ObservationListeners(() => this.#scope.lifecycle === componentLifecycleStates.active);
    scope.addCleanup(() => this.#listeners.clear());
  }

  /**
   * @description Reads the captured record for the active tab and panel.
   * @returns The last committed tab, including after finalisation.
   */
  get activeTab(): TabOption {
    return this.#activeTab;
  }

  /**
   * @description Commits a differing enabled tab and delivers its selection change.
   * @remarks Observer failure preserves the committed record and occupation ends on exit.
   * @param tabKey - The exact key of the requested tab.
   * @returns The normal selection request outcome.
   */
  requestSelection(tabKey: string): TabsResultType {
    if (this.#scope.lifecycle !== componentLifecycleStates.active) {
      return { status: tabsResultStatuses.rejected, reason: capabilityRejectionReasons.disposed };
    }
    if (this.#busy) {
      return { status: tabsResultStatuses.rejected, reason: capabilityRejectionReasons.busy };
    }

    const target = this.#requireTab(tabKey);
    if (target === this.#activeTab) {
      return { status: tabsResultStatuses.unchanged };
    }
    if (target.disabled) {
      return { status: tabsResultStatuses.rejected, reason: capabilityRejectionReasons.denied };
    }

    const change = Object.freeze({ previous: this.#activeTab, current: target });
    this.#activeTab = target;
    this.#busy = true;
    try {
      this.#listeners.deliver(change);
      return { status: tabsResultStatuses.changed };
    } finally {
      this.#busy = false;
    }
  }

  /**
   * @description Registers an independent observer without replay.
   * @param listener - Observer of future committed selection changes.
   * @returns An idempotent release for this registration.
   */
  subscribeSelectionChange(listener: (change: TabsChangeType) => void): CapabilityUnsubscribeType {
    return this.#listeners.subscribe(listener);
  }

  /**
   * @description Captures ordered associations with independent tab and panel key uniqueness.
   * @param input - The supplied tab list.
   * @returns A frozen array of frozen tab records.
   */
  #captureTabs(input: unknown): readonly TabOption[] {
    if (!Array.isArray(input) || input.length === 0) {
      throw new TypeError("Tabs requires a non-empty list of tab records.");
    }

    const records: readonly unknown[] = input;
    const tabKeys = new Set<string>();
    const panelKeys = new Set<string>();
    const tabs: TabOption[] = [];
    for (const record of records) {
      if (record === null || typeof record !== "object" || Array.isArray(record) ||
        !("key" in record) || !("panelKey" in record)) {
        throw new TypeError("A tab record requires tab and panel keys.");
      }
      const { key, panelKey } = record;
      if (typeof key !== "string" || key.length === 0 || tabKeys.has(key) ||
        typeof panelKey !== "string" || panelKey.length === 0 || panelKeys.has(panelKey)) {
        throw new TypeError("Tab and panel keys must be non-empty strings unique within their own sets.");
      }

      if ("disabled" in record) {
        const { disabled } = record;
        if (typeof disabled !== "boolean") {
          throw new TypeError("A tab's disabled flag must be a boolean.");
        }
        tabs.push(Object.freeze({ key, panelKey, disabled }));
      } else {
        tabs.push(Object.freeze({ key, panelKey }));
      }
      tabKeys.add(key);
      panelKeys.add(panelKey);
    }
    return Object.freeze(tabs);
  }

  /**
   * @description Resolves an exact key against the captured set.
   * @param key - The configured or requested tab key.
   * @returns The matching captured tab.
   */
  #requireTab(key: unknown): TabOption {
    if (typeof key !== "string" || key.length === 0) {
      throw new TypeError("A tab key must be a non-empty string.");
    }
    const tab = this.tabs.find((candidate) => candidate.key === key);
    if (tab === undefined) {
      throw new RangeError("The tab key is outside the captured set.");
    }
    return tab;
  }
}
