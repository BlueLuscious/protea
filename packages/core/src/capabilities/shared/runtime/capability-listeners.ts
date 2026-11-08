import type { CapabilityUnsubscribeType } from "../types/capability-unsubscribe.type.js";

/**
 * @description Owns ordered, independent capability observation registrations.
 * @typeParam Arguments - The exact argument tuple delivered to each borrowed listener.
 */
export class CapabilityListeners<Arguments extends unknown[]> {
  /** @description Reports whether this capability may still accept or deliver observations. */
  readonly #isActive: () => boolean;

  /** @description Distinct registrations, including repeated references to one listener. */
  readonly #registrations = new Set<(...arguments_: Arguments) => void>();

  /**
   * @description Creates an empty observation owner bound to the capability's eligibility.
   * @param isActive - Borrowed predicate checked before registration and each delivery attempt.
   */
  constructor(isActive: () => boolean) {
    this.#isActive = isActive;
  }

  /**
   * @description Registers a listener without invoking it and returns its idempotent release.
   * @param listener - Borrowed synchronous observer of later deliveries.
   * @returns A function releasing only this registration.
   */
  subscribe(listener: (...arguments_: Arguments) => void): CapabilityUnsubscribeType {
    if (!this.#isActive()) {
      throw new Error("Cannot subscribe after capability finalisation.");
    }

    if (typeof listener !== "function") {
      throw new TypeError("A capability listener must be a function.");
    }

    const registration = (...arguments_: Arguments): void => listener(...arguments_);
    this.#registrations.add(registration);

    return (): void => {
      this.#registrations.delete(registration);
    };
  }

  /**
   * @description Attempts eligible registrations from one ordered delivery snapshot.
   * @remarks Additions wait for the next delivery; removals and finalisation cancel pending turns.
   * Callback failures are reported opaquely after remaining eligible attempts, without rollback.
   * @param arguments_ - Arguments supplied unchanged to each eligible observer.
   * @returns No value.
   */
  deliver(...arguments_: Arguments): void {
    const failures: unknown[] = [];

    for (const registration of [...this.#registrations]) {
      if (!this.#isActive()) {
        break;
      }

      if (!this.#registrations.has(registration)) {
        continue;
      }

      try {
        registration(...arguments_);
      } catch (error) {
        failures.push(error);
      }
    }

    if (failures.length > 0) {
      throw new AggregateError(failures, "Capability notification failed.");
    }
  }

  /**
   * @description Releases all registrations, including turns pending in an active delivery.
   * @returns No value.
   */
  clear(): void {
    this.#registrations.clear();
  }
}
