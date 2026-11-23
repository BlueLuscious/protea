import { componentLifecycleStates, type ComponentScope } from "@luscious-garden/protea-core";
import { Activation } from "../../../api/capabilities/activation.api.js";
import type { Activatable } from "../../../capabilities/activatable/contracts/activatable.contract.js";
import type { ActivatableResultType } from "../../../capabilities/activatable/types/activatable-result.type.js";
import type { CapabilityUnsubscribeType } from "../../../capabilities/shared/types/capability-unsubscribe.type.js";
import { ObservationListeners } from "../../../shared/runtime/observation-listeners.js";
import type { IButtonSurface } from "../contracts/internal/button-surface.contract.js";
import type { ButtonDisabledChangeType } from "../types/button-disabled-change.type.js";
import type { ButtonOptionsType } from "../types/button-options.type.js";

/** @description Implements a discrete action with private lifetime and observable availability. */
export class ButtonComponent implements IButtonSurface {
  /** @description The private lifetime and cleanup owner supplied by Core. */
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
   * @description Captures availability and composes activation on the new instance's scope.
   * @remarks Configuration is validated before acquiring Button resources. Core owns failure cleanup.
   * @param scope - The fresh scope assigned to this instance by Core.
   * @param options - Optional initial availability, captured without retaining the options object.
   */
  constructor(scope: ComponentScope, options?: ButtonOptionsType) {
    if (options !== undefined && (options === null || typeof options !== "object" || Array.isArray(options))) {
      throw new TypeError("Button options must be an object.");
    }

    const initialDisabled = options?.initialDisabled;

    if (initialDisabled !== undefined && typeof initialDisabled !== "boolean") {
      throw new TypeError("Initial Button availability must be a boolean.");
    }

    this.#isDisabled = initialDisabled ?? false;
    this.#scope = scope;
    this.#disabledListeners = new ObservationListeners(() => this.#isActive());
    scope.addCleanup(() => this.#disabledListeners.clear());
    this.#activation = Activation.create(scope, { canActivate: () => !this.#isDisabled });
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
   * @description Checks the private lifetime before new availability work or observation delivery.
   * @returns Whether the model remains logically active.
   */
  #isActive(): boolean {
    return this.#scope.lifecycle === componentLifecycleStates.active;
  }
}
