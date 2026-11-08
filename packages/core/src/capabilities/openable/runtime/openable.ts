import type { ComponentScope } from "../../../component/contracts/component-scope.contract.js";
import { componentLifecycleStates } from "../../../component/constants/component-lifecycle-states.constant.js";
import { capabilityRejectionReasons } from "../../shared/constants/capability-rejection-reasons.constant.js";
import { CapabilityListeners } from "../../shared/runtime/capability-listeners.js";
import type { CapabilityUnsubscribeType } from "../../shared/types/capability-unsubscribe.type.js";
import type { Openable as OpenableContract } from "../contracts/openable.contract.js";
import type { OpenStateAuthority } from "../contracts/open-state-authority.contract.js";
import { openableResultStatuses } from "../constants/openable-result-statuses.constant.js";
import type { OpenableOptionsType } from "../types/openable-options.type.js";
import type { OpenableChangeType } from "../types/openable-change.type.js";
import type { OpenableResultType } from "../types/openable-result.type.js";

/** @description Implements internal opening or a live projection of one borrowed authority. */
export class Openable implements OpenableContract {
  /** @description The fixed borrowed lifetime and cleanup owner. */
  readonly #scope: ComponentScope;
  /** @description Observation registrations guarded by both setup and owner lifetime. */
  readonly #listeners: CapabilityListeners<[OpenableChangeType]>;
  /** @description The internal state or last externally observed value. */
  #value = false;
  /** @description The retained external authority, released from this projection at finalisation. */
  #authority: OpenStateAuthority | undefined;
  /** @description The captured external request operation, preserving its original receiver. */
  #requestOpen: OpenStateAuthority["requestOpen"] | undefined;
  /** @description The one owned source-registration release, when supplied. */
  #sourceRelease: CapabilityUnsubscribeType | undefined;
  /** @description Whether this construction attempt may still perform logical work. */
  #alive = true;
  /** @description Capability-local occupation during a request or source delivery. */
  #busy = false;
  /** @description The target of a pending external request, distinct from its source state. */
  #requestedTarget: boolean | undefined;
  /** @description Whether the live capability observed that pending target before finalisation. */
  #observedCommit = false;

  /**
   * @description Captures validated inputs and establishes owned cleanup before source subscription.
   * @remarks A late source-release handle is still attempted if setup finalises the borrowed owner.
   * @param scope - Active lifetime and release-registration owner.
   * @param options - The fixed initial state or borrowed synchronous authority.
   */
  constructor(scope: ComponentScope, options: OpenableOptionsType) {
    if (scope === null || (typeof scope !== "object" && typeof scope !== "function") ||
      scope.lifecycle !== componentLifecycleStates.active || typeof scope.addCleanup !== "function") {
      throw new TypeError("Opening requires an active component scope.");
    }

    if (options === null || typeof options !== "object") {
      throw new TypeError("Opening requires explicit authority options.");
    }

    this.#scope = scope;
    this.#listeners = new CapabilityListeners(() => this.#isActive());
    let subscribe: OpenStateAuthority["subscribeOpenChange"] | undefined;

    const control = options.control;

    if (control === "internal") {
      if ("authority" in options) {
        throw new TypeError("Internal opening cannot supply an external authority.");
      }

      const initialOpen = "initialOpen" in options ? options.initialOpen : false;

      if (typeof initialOpen !== "boolean") {
        throw new TypeError("Initial openness must be a boolean.");
      }

      this.#value = initialOpen;
    } else if (control === "external") {
      if ("initialOpen" in options) {
        throw new TypeError("External opening cannot supply a second initial state.");
      }

      const authority = options.authority;

      if (authority === null || (typeof authority !== "object" && typeof authority !== "function")) {
        throw new TypeError("External opening requires a synchronous authority.");
      }

      this.#authority = authority;
      this.#requestOpen = authority.requestOpen;
      subscribe = authority.subscribeOpenChange;

      if (typeof this.#requestOpen !== "function" || typeof subscribe !== "function") {
        throw new TypeError("The opening authority must provide requests and subscription.");
      }
    } else {
      throw new TypeError("Opening control must be internal or external.");
    }

    try {
      scope.addCleanup(() => this.#release());

      if (!this.#isActive()) {
        throw new Error("The opening owner ended during setup.");
      }

      const authority = this.#authority;

      if (authority !== undefined && subscribe !== undefined) {
        this.#readAuthority(authority);

        if (!this.#isActive()) {
          throw new Error("The opening owner ended during its initial source reading.");
        }

        const release = subscribe.call(authority, (change) => this.#receive(change));

        if (typeof release !== "function") {
          throw new TypeError("The opening authority must return a subscription release.");
        }

        if (!this.#isActive()) {
          release();
          throw new Error("The opening owner ended during source setup.");
        }

        this.#sourceRelease = release;
        this.#readAuthority(authority);
      }

      if (!this.#isActive()) {
        throw new Error("The opening owner ended before setup completed.");
      }
    } catch (error) {
      try {
        this.#release();
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "Opening setup and cleanup failed.");
      }

      throw error;
    }
  }

  /**
   * @description Reads current authoritative openness while active, or its terminal projection.
   * @returns The last observed logical value.
   */
  get isOpen(): boolean {
    const authority = this.#authority;

    if (!this.#isActive() || authority === undefined) {
      return this.#value;
    }

    return this.#readAuthority(authority);
  }

  /**
   * @description Requests logical opening under the fixed authority.
   * @returns The synchronous outcome, unless external code throws.
   */
  open(): OpenableResultType {
    return this.#request(true);
  }

  /**
   * @description Requests logical closing under the fixed authority.
   * @returns The synchronous outcome, unless external code throws.
   */
  close(): OpenableResultType {
    return this.#request(false);
  }

  /**
   * @description Registers one independently releasable observation without replay.
   * @param listener - Borrowed synchronous effective-change observer.
   * @returns Its idempotent registration release.
   */
  subscribeOpenChange(listener: (change: OpenableChangeType) => void): CapabilityUnsubscribeType {
    return this.#listeners.subscribe(listener);
  }

  /**
   * @description Checks local invalidation and the public owner's terminal state.
   * @returns Whether this capability may still work or deliver callbacks.
   */
  #isActive(): boolean {
    return this.#alive && this.#scope.lifecycle === componentLifecycleStates.active;
  }

  /**
   * @description Captures a live observation without introducing another writable state owner.
   * @param value - The observed internal or external committed value.
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
   * @description Reads the borrowed source and preserves observations only while the owner is live.
   * @param authority - Captured source reference for this synchronous read.
   * @returns The retained projection, including if external reading finalises the owner.
   */
  #readAuthority(authority: OpenStateAuthority): boolean {
    const value = authority.isOpen;

    if (typeof value !== "boolean") {
      throw new TypeError("The opening authority must expose boolean state.");
    }

    this.#observe(value);
    return this.#value;
  }

  /**
   * @description Projects one coherent source transition and occupies this capability during delivery.
   * @param change - Borrowed transition copied before consumer observation.
   * @returns No value.
   */
  #receive(change: OpenableChangeType): void {
    if (!this.#isActive()) {
      return;
    }

    if (change === null || typeof change !== "object") {
      throw new TypeError("An opening change must describe opposite boolean states.");
    }

    const previous = change.previous;
    const current = change.current;
    const snapshot = previous === false && current === true
      ? Object.freeze({ previous: false, current: true } as const)
      : previous === true && current === false
        ? Object.freeze({ previous: true, current: false } as const)
        : undefined;

    if (snapshot === undefined) {
      throw new TypeError("An opening change must describe opposite boolean states.");
    }

    if (!this.#isActive()) {
      return;
    }

    const wasBusy = this.#busy;
    this.#busy = true;

    try {
      this.#observe(current);
      this.#listeners.deliver(snapshot);
    } finally {
      this.#busy = wasBusy;
    }
  }

  /**
   * @description Applies lifecycle, occupation, satisfaction and authority checks in that order.
   * @param target - The requested logical openness.
   * @returns A changed, unchanged or expected rejected result.
   */
  #request(target: boolean): OpenableResultType {
    if (!this.#isActive()) {
      return { status: openableResultStatuses.rejected, reason: capabilityRejectionReasons.disposed };
    }

    if (this.#busy) {
      return { status: openableResultStatuses.rejected, reason: capabilityRejectionReasons.busy };
    }

    this.#busy = true;

    try {
      const previous = this.isOpen;

      if (!this.#isActive()) {
        return { status: openableResultStatuses.rejected, reason: capabilityRejectionReasons.disposed };
      }

      if (previous === target) {
        return { status: openableResultStatuses.unchanged };
      }

      const authority = this.#authority;
      const request = this.#requestOpen;

      if (authority === undefined || request === undefined) {
        this.#observe(target);
        this.#listeners.deliver(target
          ? Object.freeze({ previous: false, current: true } as const)
          : Object.freeze({ previous: true, current: false } as const));
        return { status: openableResultStatuses.changed };
      }

      this.#requestedTarget = target;
      this.#observedCommit = false;
      const accepted = request.call(authority, target);

      if (typeof accepted !== "boolean") {
        throw new TypeError("The opening authority must return a boolean request outcome.");
      }

      if (accepted && this.#observedCommit) {
        return { status: openableResultStatuses.changed };
      }

      if (!this.#isActive()) {
        return { status: openableResultStatuses.rejected, reason: capabilityRejectionReasons.disposed };
      }

      if (!accepted) {
        return { status: openableResultStatuses.rejected, reason: capabilityRejectionReasons.denied };
      }

      this.#readAuthority(authority);

      if (this.#observedCommit) {
        return { status: openableResultStatuses.changed };
      }

      if (!this.#isActive()) {
        return { status: openableResultStatuses.rejected, reason: capabilityRejectionReasons.disposed };
      }

      throw new Error("The opening authority did not commit its accepted target.");
    } finally {
      this.#busy = false;
      this.#requestedTarget = undefined;
      this.#observedCommit = false;
    }
  }

  /**
   * @description Invalidates logical work before attempting physical source disconnection once.
   * @returns No value, unless its owned source release fails.
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
    this.#requestOpen = undefined;
    release?.();
  }
}
