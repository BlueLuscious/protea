import { componentLifecycleStates, type ComponentScope } from "@luscious-garden/protea-core";
import { ObservationListeners } from "../../../shared/runtime/observation-listeners.js";
import { capabilityRejectionReasons } from "../../shared/constants/capability-rejection-reasons.constant.js";
import type { CapabilityRejectionReasonType } from "../../shared/types/capability-rejection-reason.type.js";
import type { CapabilityUnsubscribeType } from "../../shared/types/capability-unsubscribe.type.js";
import { checkableResultStatuses } from "../constants/checkable-result-statuses.constant.js";
import type { Checkable as CheckableContract } from "../contracts/checkable.contract.js";
import type { CheckedStateAuthority } from "../contracts/checked-state-authority.contract.js";
import type { CheckableChangeType } from "../types/checkable-change.type.js";
import type { CheckableOptionsType } from "../types/checkable-options.type.js";
import type { CheckableResultType } from "../types/checkable-result.type.js";

/** @description Owns checked state or projects one borrowed authority within a fixed lifetime. */
export class Checkable implements CheckableContract {
  /** @description The borrowed lifetime and cleanup owner. */
  readonly #scope: ComponentScope;
  /** @description Independent observations of effective checked changes. */
  readonly #listeners: ObservationListeners<[CheckableChangeType]>;
  /** @description The internal value or last observed external value. */
  #value = false;
  /** @description The borrowed source in external control. */
  #authority: CheckedStateAuthority | undefined;
  /** @description The captured request to call with the original authority as its receiver. */
  #requestFromAuthority: CheckedStateAuthority["requestChecked"] | undefined;
  /** @description The release for the registration acquired from the external source. */
  #sourceRelease: CapabilityUnsubscribeType | undefined;
  /** @description Whether this capability still owns active work. */
  #alive = true;
  /** @description Whether a request or change delivery is in progress. */
  #busy = false;
  /** @description The target of the current delegated request, if any. */
  #requestedTarget: boolean | undefined;
  /** @description Whether the pending target was observed before finalisation. */
  #observedCommit = false;

  /**
   * @description Captures configuration and establishes owned connections before exposure.
   * @param scope - An active lifetime and cleanup-registration owner.
   * @param options - The initial internal value or external authority.
   */
  constructor(scope: ComponentScope, options: CheckableOptionsType) {
    if (scope === null || (typeof scope !== "object" && typeof scope !== "function") ||
      scope.lifecycle !== componentLifecycleStates.active || typeof scope.addCleanup !== "function") {
      throw new TypeError("Checking requires an active component scope.");
    }

    if (options === null || typeof options !== "object") {
      throw new TypeError("Checking requires explicit authority options.");
    }

    this.#scope = scope;
    this.#listeners = new ObservationListeners(() => this.#isActive());
    const subscribe = this.#captureOptions(options);

    try {
      scope.addCleanup(() => this.#release());
      if (!this.#isActive()) {
        throw new Error("The checking owner ended during setup.");
      }

      const authority = this.#authority;
      if (authority !== undefined && subscribe !== undefined) {
        this.#connectAuthority(authority, subscribe);
      }
      if (!this.#isActive()) {
        throw new Error("The checking owner ended before setup completed.");
      }
    } catch (error) {
      try {
        this.#release();
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "Checking setup and cleanup failed.");
      }
      throw error;
    }
  }

  /**
   * @description Reads the effective value while active and the retained value after finalisation.
   * @returns The observed checked value.
   */
  get isChecked(): boolean {
    const authority = this.#authority;
    return authority !== undefined && this.#isActive() ? this.#readAuthority(authority) : this.#value;
  }

  /**
   * @description Checks lifetime, occupation and target before requesting checked state.
   * @param nextChecked - The requested value.
   * @returns A changed, unchanged or rejected outcome.
   */
  requestChecked(nextChecked: boolean): CheckableResultType {
    if (!this.#isActive()) {
      return this.#reject(capabilityRejectionReasons.disposed);
    }
    if (this.#busy) {
      return this.#reject(capabilityRejectionReasons.busy);
    }
    if (typeof nextChecked !== "boolean") {
      throw new TypeError("The requested checked value must be a boolean.");
    }

    this.#busy = true;
    try {
      const previous = this.isChecked;
      if (!this.#isActive()) {
        return this.#reject(capabilityRejectionReasons.disposed);
      }
      if (previous === nextChecked) {
        return { status: checkableResultStatuses.unchanged };
      }

      const authority = this.#authority;
      const request = this.#requestFromAuthority;
      if (authority !== undefined && request !== undefined) {
        return this.#delegate(nextChecked, authority, request);
      }

      this.#deliver(nextChecked);
      return { status: checkableResultStatuses.changed };
    } finally {
      this.#busy = false;
      this.#requestedTarget = undefined;
      this.#observedCommit = false;
    }
  }

  /**
   * @description Observes effective checked changes without an initial replay.
   * @param listener - Borrowed synchronous observer.
   * @returns An idempotent release for this registration.
   */
  subscribeCheckedChange(listener: (change: CheckableChangeType) => void): CapabilityUnsubscribeType {
    return this.#listeners.subscribe(listener);
  }

  /**
   * @description Validates the initial value or captures the selected authority and its operations.
   * @param options - Fixed control mode and its inputs.
   * @returns The captured subscription operation for external control, if any.
   */
  #captureOptions(options: CheckableOptionsType): CheckedStateAuthority["subscribeCheckedChange"] | undefined {
    const control = options.control;
    if (control === "internal") {
      if ("authority" in options) {
        throw new TypeError("Internal checking cannot supply an external authority.");
      }
      const initialChecked = "initialChecked" in options ? options.initialChecked : false;
      if (typeof initialChecked !== "boolean") {
        throw new TypeError("Initial checked state must be a boolean.");
      }
      this.#value = initialChecked;
      return undefined;
    }

    if (control !== "external") {
      throw new TypeError("Checking control must be internal or external.");
    }
    if ("initialChecked" in options) {
      throw new TypeError("External checking cannot supply a second initial state.");
    }
    const authority = options.authority;
    if (authority === null || (typeof authority !== "object" && typeof authority !== "function")) {
      throw new TypeError("External checking requires a synchronous authority.");
    }

    const request = authority.requestChecked;
    const subscribe = authority.subscribeCheckedChange;
    if (typeof request !== "function" || typeof subscribe !== "function") {
      throw new TypeError("The checked authority must provide requests and subscription.");
    }
    this.#authority = authority;
    this.#requestFromAuthority = request;
    return subscribe;
  }

  /**
   * @description Reads, connects and reads back the source without losing an intervening change.
   * @param authority - The fixed source and receiver for the captured operation.
   * @param subscribe - The captured source subscription.
   * @returns No value.
   */
  #connectAuthority(authority: CheckedStateAuthority, subscribe: CheckedStateAuthority["subscribeCheckedChange"]): void {
    this.#readAuthority(authority);
    if (!this.#isActive()) {
      throw new Error("The checking owner ended during its initial source reading.");
    }

    const release = subscribe.call(authority, (change) => this.#receive(change));
    if (typeof release !== "function") {
      throw new TypeError("The checked authority must return a subscription release.");
    }
    if (!this.#isActive()) {
      release();
      throw new Error("The checking owner ended during source setup.");
    }
    this.#sourceRelease = release;
    this.#readAuthority(authority);
  }

  /**
   * @description Delegates one request and preserves only an observed accepted commitment.
   * @param nextChecked - The differing target.
   * @param authority - The fixed borrowed source.
   * @param request - Its captured operation.
   * @returns The request outcome.
   */
  #delegate(
    nextChecked: boolean,
    authority: CheckedStateAuthority,
    request: CheckedStateAuthority["requestChecked"],
  ): CheckableResultType {
    this.#requestedTarget = nextChecked;
    const accepted = request.call(authority, nextChecked);
    if (typeof accepted !== "boolean") {
      throw new TypeError("The checked authority must return a boolean request outcome.");
    }
    if (accepted && this.#observedCommit) {
      return { status: checkableResultStatuses.changed };
    }
    if (!this.#isActive()) {
      return this.#reject(capabilityRejectionReasons.disposed);
    }
    if (!accepted) {
      return this.#reject(capabilityRejectionReasons.denied);
    }

    this.#readAuthority(authority);
    if (this.#observedCommit) {
      return { status: checkableResultStatuses.changed };
    }
    if (!this.#isActive()) {
      return this.#reject(capabilityRejectionReasons.disposed);
    }
    throw new Error("The checked authority did not commit its accepted target.");
  }

  /**
   * @description Reads and validates the external value without sending a notification.
   * @param authority - The source active at the start of this read.
   * @returns The retained value even if the source finalises the owner while reading.
   */
  #readAuthority(authority: CheckedStateAuthority): boolean {
    const value = authority.isChecked;
    if (typeof value !== "boolean") {
      throw new TypeError("The checked authority must expose boolean state.");
    }
    this.#observe(value);
    return this.#value;
  }

  /**
   * @description Validates and projects the transition delivered by the borrowed source.
   * @param change - The reported transition to copy before delivery.
   * @returns No value.
   */
  #receive(change: CheckableChangeType): void {
    if (!this.#isActive()) {
      return;
    }
    const wasBusy = this.#busy;
    this.#busy = true;
    try {
      if (change === null || typeof change !== "object") {
        throw new TypeError("A checked change must describe opposite boolean states.");
      }
      const { previous, current } = change;
      if (typeof previous !== "boolean" || typeof current !== "boolean" || previous === current) {
        throw new TypeError("A checked change must describe opposite boolean states.");
      }
      this.#deliver(current);
    } finally {
      this.#busy = wasBusy;
    }
  }

  /**
   * @description Retains the committed value before publishing its frozen transition.
   * @param value - The current value of a validated effective transition.
   * @returns No value.
   */
  #deliver(value: boolean): void {
    this.#observe(value);
    this.#listeners.deliver(value
      ? Object.freeze({ previous: false, current: true } as const)
      : Object.freeze({ previous: true, current: false } as const));
  }

  /**
   * @description Remembers the effective value and observes pending commitment while active.
   * @param value - The effective checked value.
   * @returns No value.
   */
  #observe(value: boolean): void {
    if (this.#isActive()) {
      this.#value = value;
      if (this.#requestedTarget === value) {
        this.#observedCommit = true;
      }
    }
  }

  /**
   * @description Checks both logical invalidation and the borrowed owner's lifetime.
   * @returns Whether this capability may work or deliver.
   */
  #isActive(): boolean {
    return this.#alive && this.#scope.lifecycle === componentLifecycleStates.active;
  }

  /**
   * @description Forms an expected rejection without publishing a change.
   * @param reason - Why the request could not proceed.
   * @returns The rejected outcome.
   */
  #reject(reason: CapabilityRejectionReasonType): CheckableResultType {
    return { status: checkableResultStatuses.rejected, reason };
  }

  /**
   * @description Invalidates work before releasing the owned source registration once.
   * @returns No value.
   */
  #release(): void {
    if (!this.#alive) {
      return;
    }
    this.#alive = false;
    this.#listeners.clear();
    const release = this.#sourceRelease;
    this.#sourceRelease = undefined;
    this.#authority = undefined;
    this.#requestFromAuthority = undefined;
    release?.();
  }
}
