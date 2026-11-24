import { componentLifecycleStates, type ComponentScope } from "@luscious-garden/protea-core";
import { capabilityRejectionReasons } from "../../../capabilities/shared/constants/capability-rejection-reasons.constant.js";
import type { CapabilityRejectionReasonType } from "../../../capabilities/shared/types/capability-rejection-reason.type.js";
import type { CapabilityUnsubscribeType } from "../../../capabilities/shared/types/capability-unsubscribe.type.js";
import { ObservationListeners } from "../../../shared/runtime/observation-listeners.js";
import { selectResultStatuses } from "../constants/select-result-statuses.constant.js";
import type { ISelectSurface } from "../contracts/internal/select-surface.contract.js";
import type { SelectionAuthority } from "../contracts/selection-authority.contract.js";
import type { SelectOption } from "../contracts/select-option.contract.js";
import type { SelectChangeType } from "../types/select-change.type.js";
import type { SelectOptionsType } from "../types/select-options.type.js";
import type { SelectResultType } from "../types/select-result.type.js";

/** @description Projects an application's selection over one fixed option set. */
export class SelectComponent implements ISelectSurface {
  /** @description Ordered option snapshots used to validate and present the selection. */
  readonly options: readonly SelectOption[];

  /** @description The scope that owns the model's source connection. */
  readonly #scope: ComponentScope;
  /** @description Ordered observations of effective selection changes. */
  readonly #listeners: ObservationListeners<[SelectChangeType]>;
  /** @description The borrowed authority and its captured request operation. */
  #connection: { authority: SelectionAuthority; request: SelectionAuthority["requestSelection"] } | undefined;
  /** @description The release for the acquired authority subscription. */
  #releaseSource: CapabilityUnsubscribeType | undefined;
  /** @description The most recent valid value, including reads ahead of delivery. */
  #lastSelection = "";
  /** @description The latest selection accounted for by source observation. */
  #observedSelection: string | undefined;
  /** @description Whether a request or observation delivery is occupying the model. */
  #busy = false;
  /** @description Effective transitions delivered during a delegated request. */
  #delegatedChanges: SelectChangeType[] | undefined;

  /**
   * @description Validates the options before reading or subscribing to the borrowed authority.
   * @param scope - The active Core-owned lifetime.
   * @param config - The ordered options and selection authority for this instance.
   */
  constructor(scope: ComponentScope, config: SelectOptionsType) {
    if (scope.lifecycle !== componentLifecycleStates.active) {
      throw new Error("Select requires an active component scope.");
    }
    if (config === null || typeof config !== "object" || Array.isArray(config)) {
      throw new TypeError("Select configuration must supply options and a selection authority.");
    }

    this.#scope = scope;
    this.options = this.#captureOptions(config.options);
    this.#listeners = new ObservationListeners(() => this.#isActive());
    const authority = config.authority;
    if (authority === null || (typeof authority !== "object" && typeof authority !== "function")) {
      throw new TypeError("Select requires a synchronous selection authority.");
    }
    const request = authority.requestSelection;
    const subscribe = authority.subscribeSelectionChange;
    if (typeof request !== "function" || typeof subscribe !== "function") {
      throw new TypeError("The selection authority must provide requests and subscription.");
    }
    this.#connection = { authority, request };

    try {
      scope.addCleanup(() => this.#release());
      this.#connectAuthority(authority, subscribe);
    } catch (error) {
      try {
        this.#release();
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "Select setup and cleanup failed.");
      }
      throw error;
    }
  }

  /**
   * @description Reads the effective source value or the retained selection after finalisation.
   * @returns The last valid selection after the read.
   */
  get selectedValue(): string {
    const connection = this.#connection;
    if (connection !== undefined && this.#isActive()) {
      const value = connection.authority.selectedValue;
      if (this.#isActive()) {
        this.#lastSelection = this.#requireOption(value).value;
      }
    }
    return this.#lastSelection;
  }

  /**
   * @description Checks the target and verifies the outcome of a delegated selection request.
   * @param nextValue - The requested option value.
   * @returns The normal selection request outcome.
   */
  requestSelection(nextValue: string): SelectResultType {
    const connection = this.#connection;
    if (connection === undefined || !this.#isActive()) {
      return this.#reject(capabilityRejectionReasons.disposed);
    }
    if (this.#busy) {
      return this.#reject(capabilityRejectionReasons.busy);
    }
    const target = this.#requireOption(nextValue);

    this.#busy = true;
    try {
      const previous = this.selectedValue;
      if (!this.#isActive()) {
        return this.#reject(capabilityRejectionReasons.disposed);
      }
      if (previous === nextValue) {
        return { status: selectResultStatuses.unchanged };
      }
      if (target.disabled) {
        return this.#reject(capabilityRejectionReasons.denied);
      }

      const changes: SelectChangeType[] = [];
      this.#delegatedChanges = changes;
      const accepted = connection.request.call(connection.authority, nextValue);
      if (typeof accepted !== "boolean") {
        throw new TypeError("The selection authority must return a boolean request outcome.");
      }
      const current = this.selectedValue;
      const active = this.#isActive();

      if (!accepted) {
        if (changes.length !== 0 || current !== previous) {
          throw new Error("The selection authority changed the selection during a refused request.");
        }
        return this.#reject(active ? capabilityRejectionReasons.denied : capabilityRejectionReasons.disposed);
      }

      const committed = changes.length === 1 && changes[0]?.previous === previous && changes[0].current === nextValue;
      if (committed && (!active || current === nextValue)) {
        return { status: selectResultStatuses.changed };
      }
      if (!active) {
        return this.#reject(capabilityRejectionReasons.disposed);
      }
      throw new Error("The selection authority must commit and report the accepted transition synchronously.");
    } finally {
      this.#delegatedChanges = undefined;
      this.#busy = false;
    }
  }

  /**
   * @description Registers an independent observation without replay.
   * @param listener - Observer of subsequent committed selection changes.
   * @returns An idempotent release for the registration.
   */
  subscribeSelectionChange(listener: (change: SelectChangeType) => void): CapabilityUnsubscribeType {
    return this.#listeners.subscribe(listener);
  }

  /**
   * @description Copies and freezes an ordered set of unique valid option records.
   * @param input - The supplied option list.
   * @returns Frozen options and records owned by this model.
   */
  #captureOptions(input: unknown): readonly SelectOption[] {
    if (!Array.isArray(input) || input.length === 0) {
      throw new TypeError("Select requires a non-empty list of options.");
    }
    const records: readonly unknown[] = input;
    const values = new Set<string>();
    const options: SelectOption[] = [];
    for (const record of records) {
      if (record === null || typeof record !== "object" || Array.isArray(record) || !("value" in record)) {
        throw new TypeError("A Select option must be a record with a value.");
      }
      const { value } = record;
      if (typeof value !== "string" || value.length === 0 || values.has(value)) {
        throw new TypeError("Select option values must be unique non-empty strings.");
      }
      if ("disabled" in record) {
        const { disabled } = record;
        if (typeof disabled !== "boolean") {
          throw new TypeError("A Select option's disabled flag must be a boolean.");
        }
        options.push(Object.freeze({ value, disabled }));
      } else {
        options.push(Object.freeze({ value }));
      }
      values.add(value);
    }
    return Object.freeze(options);
  }

  /**
   * @description Resolves an exact option key against the captured set.
   * @param value - A value supplied by a caller or the authority.
   * @returns The matching captured option record.
   */
  #requireOption(value: unknown): SelectOption {
    if (typeof value !== "string" || value.length === 0) {
      throw new TypeError("A selection value must be a non-empty string.");
    }
    const option = this.options.find((choice) => choice.value === value);
    if (option === undefined) {
      throw new RangeError("The selection value is outside the Select option set.");
    }
    return option;
  }

  /**
   * @description Connects to the source and accounts for changes during registration.
   * @param authority - Receiver of the captured subscription operation.
   * @param subscribe - The captured source subscription operation.
   * @returns No value.
   */
  #connectAuthority(authority: SelectionAuthority, subscribe: SelectionAuthority["subscribeSelectionChange"]): void {
    this.selectedValue;
    if (!this.#isActive()) {
      throw new Error("The Select scope ended during the initial source read.");
    }

    const release = subscribe.call(authority, (change) => this.#receive(change));
    if (typeof release !== "function") {
      throw new TypeError("The selection authority must return a subscription release.");
    }
    if (!this.#isActive()) {
      const ended = new Error("The Select scope ended during source setup.");
      try {
        release();
      } catch (cleanupError) {
        throw new AggregateError([ended, cleanupError], "Select setup and late subscription release failed.");
      }
      throw ended;
    }
    this.#releaseSource = release;
    this.#observedSelection = this.selectedValue;
    if (!this.#isActive()) {
      throw new Error("The Select scope ended before setup completed.");
    }
  }

  /**
   * @description Validates and delivers one effective transition from the borrowed authority.
   * @param change - The transition supplied by the source.
   * @returns No value.
   */
  #receive(change: SelectChangeType): void {
    if (!this.#isActive()) {
      return;
    }
    const wasBusy = this.#busy;
    this.#busy = true;
    try {
      if (change === null || typeof change !== "object") {
        throw new TypeError("A selection change must describe two distinct option values.");
      }
      const previous = this.#requireOption(change.previous).value;
      const current = this.#requireOption(change.current).value;
      if (previous === current) {
        throw new TypeError("A selection change must describe two distinct option values.");
      }
      if (!this.#isActive()) {
        return;
      }
      const selected = this.selectedValue;
      if (!this.#isActive()) {
        return;
      }
      if (selected !== current || (this.#observedSelection !== undefined && this.#observedSelection !== previous)) {
        throw new Error("The selection authority reported a transition inconsistent with its state.");
      }
      this.#observedSelection = current;
      const snapshot = Object.freeze({ previous, current });
      this.#delegatedChanges?.push(snapshot);
      this.#listeners.deliver(snapshot);
    } finally {
      this.#busy = wasBusy;
    }
  }

  /**
   * @description Reports whether the model can still consult or observe the borrowed source.
   * @returns Whether the scope and source connection are both live.
   */
  #isActive(): boolean {
    return this.#connection !== undefined && this.#scope.lifecycle === componentLifecycleStates.active;
  }

  /**
   * @description Forms a normal rejected request outcome.
   * @param reason - Why the request did not proceed.
   * @returns The rejected result.
   */
  #reject(reason: CapabilityRejectionReasonType): SelectResultType {
    return { status: selectResultStatuses.rejected, reason };
  }

  /**
   * @description Invalidates observations before releasing the acquired source subscription.
   * @returns No value.
   */
  #release(): void {
    this.#connection = undefined;
    this.#listeners.clear();
    const release = this.#releaseSource;
    this.#releaseSource = undefined;
    release?.();
  }
}
