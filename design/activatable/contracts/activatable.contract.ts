import type { CapabilityUnsubscribeType } from "../../capabilities/api/index.js";
import type { ActivatableResultType } from "../types/activatable-result.type.js";

/**
 * @description The action requests and observations supported by one activation capability.
 * @remarks The owning component supplies the lifetime and cleanup authority. This capability
 * introduces no persistent pressed, selected or opening state and no separate disposal owner.
 * See [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 */
export interface Activatable {
  /**
   * @description Requests one activation after synchronous eligibility and authorisation checks.
   * @remarks A finalised owner or locally busy capability rejects before authorisation.
   * Each accepted request is a distinct activation, committed before eligible observers and the result. Unexpected observer
   * failures are thrown after remaining eligible observers without rolling back the activation.
   * @returns An activated or rejected request outcome.
   */
  activate(): ActivatableResultType;

  /**
   * @description Registers a synchronous observer of committed activations.
   * @remarks Registration does not invoke the listener. The owning component attempts to release
   * remaining registrations under the foundation rules when finalised without finalising borrowed
   * listeners. Delivery ordering and failure rules are defined in
   * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
   * @param listener - Runs once for each eligible committed activation delivery.
   * @returns An idempotent function that releases this observation registration.
   */
  subscribeActivation(listener: () => void): CapabilityUnsubscribeType;
}
