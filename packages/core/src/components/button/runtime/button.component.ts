import { activatableFactory } from "../../../capabilities/activatable/api/index.js";
import type { Activatable, ActivatableResultType } from "../../../capabilities/activatable/api/index.js";
import type { CapabilityUnsubscribeType } from "../../../capabilities/shared/api/index.js";
import { Scope } from "../../../api/scope.api.js";
import { componentLifecycleStates } from "../../../component/constants/component-lifecycle-states.constant.js";
import type { ComponentScope } from "../../../component/contracts/component-scope.contract.js";
import type { ComponentLifecycleType } from "../../../component/types/component-lifecycle.type.js";
import { ObservationListeners } from "../../../shared/runtime/observation-listeners.js";
import type { Button } from "../contracts/button.contract.js";
import type { ButtonDisabledChangeType } from "../types/button-disabled-change.type.js";
import type { ButtonOptionsType } from "../types/button-options.type.js";

/** @description Implements a discrete action with private lifetime and observable availability. */
export class ButtonComponent implements Button {
  /** @description The private lifetime and cleanup owner created for this model. */
  readonly #scope: ComponentScope;

  /** @description Activation bound to this model's lifetime and current disabled policy. */
  readonly #activation: Activatable;

  /** @description Independent observers of effective availability changes. */
  readonly #disabledListeners: ObservationListeners<[ButtonDisabledChangeType]>;

  /** @description The last committed application-set disabled policy. */
  #isDisabled: boolean;

  /** @description Whether availability delivery currently excludes nested writes. */
  #notifyingDisabled = false;

  /**
   * @description Captures availability and creates an independent scope and activation capability.
   * @remarks Validate caller configuration before acquiring resources. Failed setup finalises
   * only the newly owned scope and attempts its releases before reporting failure.
   * @param options - Optional initial availability, captured without retaining the options object.
   */
  constructor(options?: ButtonOptionsType) {
    if (options !== undefined && (options === null || typeof options !== "object" || Array.isArray(options))) {
      throw new TypeError("Button options must be an object.");
    }

    const initialDisabled = options?.initialDisabled;

    if (initialDisabled !== undefined && typeof initialDisabled !== "boolean") {
      throw new TypeError("Initial Button availability must be a boolean.");
    }

    this.#isDisabled = initialDisabled ?? false;
    this.#scope = Scope.create();

    try {
      this.#disabledListeners = new ObservationListeners(() => this.#isActive());
      this.#scope.addCleanup(() => this.#disabledListeners.clear());
      this.#activation = activatableFactory.create(this.#scope, { canActivate: () => !this.#isDisabled });
    } catch (error) {
      try {
        this.#scope.dispose();
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "Button setup and cleanup failed.");
      }

      throw error;
    }
  }

  /**
   * @description Reads the private scope's logical lifetime, including after disposal.
   * @returns The current component lifetime.
   */
  get lifecycle(): ComponentLifecycleType {
    return this.#scope.lifecycle;
  }

  /**
   * @description Reads this model's last committed disabled policy.
   * @returns The current policy, retained after finalisation.
   */
  get isDisabled(): boolean {
    return this.#isDisabled;
  }

  /**
   * @description Commits a differing disabled policy and delivers one frozen transition.
   * @remarks Terminal, invalid and reentrant writes throw before mutation. Commitment survives
   * callback failure; occupation is cleared after delivery even when an observer throws.
   * @param disabled - The application's next disabled policy.
   * @returns No value.
   */
  setDisabled(disabled: boolean): void {
    if (!this.#isActive()) {
      throw new Error("Cannot change availability after Button finalisation.");
    }

    if (typeof disabled !== "boolean") {
      throw new TypeError("Button availability must be a boolean.");
    }

    if (this.#notifyingDisabled) {
      throw new Error("Cannot change availability during its notification delivery.");
    }

    if (disabled === this.#isDisabled) {
      return;
    }

    const change: ButtonDisabledChangeType = disabled
      ? Object.freeze({ previous: false, current: true })
      : Object.freeze({ previous: true, current: false });
    this.#isDisabled = disabled;
    this.#notifyingDisabled = true;

    try {
      this.#disabledListeners.deliver(change);
    } finally {
      this.#notifyingDisabled = false;
    }
  }

  /**
   * @description Registers independent observation of future effective disabled changes.
   * @param listener - Borrowed synchronous observer, without an initial replay.
   * @returns An idempotent operation releasing only this registration.
   */
  subscribeDisabledChange(listener: (change: ButtonDisabledChangeType) => void): CapabilityUnsubscribeType {
    return this.#disabledListeners.subscribe(listener);
  }

  /**
   * @description Requests activation under the existing lifetime, occupation and disabled guard.
   * @returns An accepted activation or an expected rejection.
   */
  activate(): ActivatableResultType {
    return this.#activation.activate();
  }

  /**
   * @description Registers observation of accepted activations through the owned capability.
   * @param listener - Borrowed observer of future acceptance, without an initial replay.
   * @returns An idempotent operation releasing only this registration.
   */
  subscribeActivation(listener: () => void): CapabilityUnsubscribeType {
    return this.#activation.subscribeActivation(listener);
  }

  /**
   * @description Finalises this model before attempting every private scope release.
   * @returns No value.
   */
  dispose(): void {
    this.#scope.dispose();
  }

  /**
   * @description Checks the private lifetime before new availability work or observation delivery.
   * @returns Whether the model remains logically active.
   */
  #isActive(): boolean {
    return this.#scope.lifecycle === componentLifecycleStates.active;
  }
}
