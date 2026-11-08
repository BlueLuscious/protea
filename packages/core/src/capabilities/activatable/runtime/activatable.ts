import { componentLifecycleStates } from "../../../component/api/index.js";
import type { ComponentScope } from "../../../component/api/index.js";
import { capabilityRejectionReasons } from "../../shared/api/index.js";
import type { CapabilityRejectionReasonType, CapabilityUnsubscribeType } from "../../shared/api/index.js";
import { CapabilityListeners } from "../../shared/runtime/capability-listeners.js";
import { activatableResultStatuses } from "../constants/activatable-result-statuses.constant.js";
import type { Activatable as ActivatableContract } from "../contracts/activatable.contract.js";
import type { ActivatableOptionsType } from "../types/activatable-options.type.js";
import type { ActivatableResultType } from "../types/activatable-result.type.js";

/**
 * @description Implements independent activation requests within one borrowed component lifetime.
 */
export class Activatable implements ActivatableContract {
  /** @description The borrowed lifetime and cleanup owner. */
  readonly #scope: ComponentScope;

  /** @description The guard reference captured during construction, when configured. */
  readonly #canActivate: (() => boolean) | undefined;

  /** @description Owned registrations observing accepted activations without a payload. */
  readonly #listeners: CapabilityListeners<[]>;

  /** @description Whether this capability has invalidated its owned work. */
  #released = false;

  /** @description Whether a request is evaluating its guard or notifying observers. */
  #busy = false;

  /**
   * @description Captures configuration and joins an active scope without acquiring its disposal.
   * @remarks A failed registration invalidates this attempt even if the scope retained its callback.
   * @param scope - Borrowed active lifetime and cleanup owner.
   * @param options - Optional guard captured without invocation.
   */
  constructor(scope: ComponentScope, options?: ActivatableOptionsType) {
    if (scope === null || (typeof scope !== "object" && typeof scope !== "function") ||
      scope.lifecycle !== componentLifecycleStates.active || typeof scope.addCleanup !== "function") {
      throw new TypeError("Activation requires an active component scope.");
    }

    if (options !== undefined && (options === null || typeof options !== "object" || Array.isArray(options))) {
      throw new TypeError("Activation options must be an object.");
    }

    const canActivate = options?.canActivate;

    if (canActivate !== undefined && typeof canActivate !== "function") {
      throw new TypeError("An activation guard must be a function.");
    }

    this.#scope = scope;
    this.#canActivate = canActivate;
    this.#listeners = new CapabilityListeners<[]>(() => this.#isActive());

    try {
      if (!this.#isActive()) {
        throw new Error("The component scope ended during activation setup.");
      }

      scope.addCleanup(() => this.#release());

      if (!this.#isActive()) {
        throw new Error("The component scope ended during activation setup.");
      }
    } catch (error) {
      this.#release();
      throw error;
    }
  }

  /**
   * @description Accepts one activation after lifecycle, occupation and guard checks.
   * @remarks Occupation spans the guard and delivery; accepted activation survives observer disposal.
   * @returns An activated outcome or an expected refusal.
   */
  activate(): ActivatableResultType {
    if (!this.#isActive()) {
      return this.#reject(capabilityRejectionReasons.disposed);
    }

    if (this.#busy) {
      return this.#reject(capabilityRejectionReasons.busy);
    }

    this.#busy = true;

    try {
      const canActivate = this.#canActivate;
      const allowed = canActivate === undefined ? true : canActivate();

      if (typeof allowed !== "boolean") {
        throw new TypeError("An activation guard must return a boolean synchronously.");
      }

      if (!this.#isActive()) {
        return this.#reject(capabilityRejectionReasons.disposed);
      }

      if (!allowed) {
        return this.#reject(capabilityRejectionReasons.denied);
      }

      this.#listeners.deliver();
      return { status: activatableResultStatuses.activated };
    } finally {
      this.#busy = false;
    }
  }

  /**
   * @description Registers one future activation observer with the shared delivery protocol.
   * @param listener - Borrowed observer receiving no activation payload.
   * @returns An idempotent operation removing this registration.
   */
  subscribeActivation(listener: () => void): CapabilityUnsubscribeType {
    return this.#listeners.subscribe(listener);
  }

  /**
   * @description Checks both logical invalidation and the borrowed scope's current lifetime.
   * @returns Whether this capability can still perform or register work.
   */
  #isActive(): boolean {
    return !this.#released && this.#scope.lifecycle === componentLifecycleStates.active;
  }

  /**
   * @description Forms an expected refusal without accepting or notifying an activation.
   * @param reason - The eligibility condition preventing acceptance.
   * @returns A rejected request outcome carrying that reason.
   */
  #reject(reason: CapabilityRejectionReasonType): ActivatableResultType {
    return { status: activatableResultStatuses.rejected, reason };
  }

  /**
   * @description Invalidates owned work and releases registrations without disposing collaborators.
   * @returns No value.
   */
  #release(): void {
    this.#released = true;
    this.#listeners.clear();
  }
}
