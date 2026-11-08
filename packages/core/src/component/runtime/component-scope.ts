import type { ComponentScope as ComponentScopeContract } from "../contracts/component-scope.contract.js";
import { componentLifecycleStates } from "../constants/component-lifecycle-states.constant.js";
import type { ComponentLifecycleType } from "../types/component-lifecycle.type.js";

/**
 * @description Implements one component lifetime and its owned synchronous releases.
 */
export class ComponentScope implements ComponentScopeContract {
  /** @description The current logical lifetime of this scope. */
  #lifecycle: ComponentLifecycleType = componentLifecycleStates.active;

  /** @description Independent release obligations retained until disposal. */
  #releases: Array<() => void> = [];

  /**
   * @description Reads the scope's logical lifetime.
   * @returns The current lifetime, including after disposal.
   */
  get lifecycle(): ComponentLifecycleType {
    return this.#lifecycle;
  }

  /**
   * @description Retains a synchronous release obligation for an active scope.
   * @param release - Cleanup callback retained without invocation.
   * @returns No value.
   */
  addCleanup(release: () => void): void {
    if (this.#lifecycle !== componentLifecycleStates.active) {
      throw new Error("Cannot register cleanup after component disposal.");
    }

    if (typeof release !== "function") {
      throw new TypeError("A cleanup callback must be a function.");
    }

    this.#releases.push(release);
  }

  /**
   * @description Ends the logical lifetime and attempts every retained release.
   * @remarks Detaching obligations before external calls makes repeated and reentrant disposal inert.
   * @returns No value.
   */
  dispose(): void {
    if (this.#lifecycle === componentLifecycleStates.disposed) {
      return;
    }

    this.#lifecycle = componentLifecycleStates.disposed;
    const releases = this.#releases;
    this.#releases = [];
    const failures: unknown[] = [];

    for (const release of releases) {
      try {
        release();
      } catch (error) {
        failures.push(error);
      }
    }

    if (failures.length > 0) {
      throw new AggregateError(failures, "Component cleanup failed.");
    }
  }
}
