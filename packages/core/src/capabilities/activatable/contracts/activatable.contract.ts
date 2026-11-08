import type { CapabilityUnsubscribeType } from "../../shared/api/index.js";
import type { ActivatableResultType } from "../types/activatable-result.type.js";

/**
 * @description Requests and observes accepted actions without persistent pressed or selected state.
 * @remarks Its borrowed component scope supplies the lifetime; this capability has no disposal API.
 * See [Activation](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/core/capabilities/activatable/index.md).
 */
export interface Activatable {
  /**
   * @description Requests one activation after lifetime, occupation and synchronous guard checks.
   * @remarks Acceptance precedes notification. Observer failure is reported after other eligible
   * callbacks, without undoing acceptance; disposal during delivery cancels remaining callbacks.
   * @returns An activated outcome or an expected rejection with its reason.
   */
  activate(): ActivatableResultType;

  /**
   * @description Registers an observer of future accepted activations without an initial replay.
   * @remarks Delivery is synchronous and ordered. Registration after scope disposal throws;
   * existing unsubscribe operations remain idempotent after disposal.
   * @param listener - Borrowed observer called without an activation payload.
   * @returns An idempotent operation releasing only this registration.
   */
  subscribeActivation(listener: () => void): CapabilityUnsubscribeType;
}
