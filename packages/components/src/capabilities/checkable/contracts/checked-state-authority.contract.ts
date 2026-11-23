import type { CapabilityUnsubscribeType } from "../../shared/types/capability-unsubscribe.type.js";
import type { CheckableChangeType } from "../types/checkable-change.type.js";

/**
 * @description A borrowed synchronous owner of effective checked state.
 * @see [Checkable](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/capabilities/checkable/index.md).
 */
export interface CheckedStateAuthority {
  /** @description The current authoritative value, readable without subscribing. */
  readonly isChecked: boolean;

  /**
   * @description Authorises and commits a checked value synchronously.
   * @remarks True requires completed effective delivery for a changed value. False refuses
   * without changing, notifying or queuing work. Reentrant writes are refused.
   * @param nextChecked - The requested value.
   * @returns Whether the target is authorised and effective.
   */
  requestChecked(nextChecked: boolean): boolean;

  /**
   * @description Registers synchronous observation of effective changes without replay.
   * @param listener - Borrowed observer of each coherent transition in registration order.
   * @returns An idempotent release for this registration.
   */
  subscribeCheckedChange(listener: (change: CheckableChangeType) => void): CapabilityUnsubscribeType;
}
