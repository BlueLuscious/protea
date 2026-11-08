import type { CapabilityUnsubscribeType } from "../../shared/types/capability-unsubscribe.type.js";
import type { OpenableChangeType } from "../types/openable-change.type.js";

/**
 * @description A borrowed synchronous owner of logical opening state.
 * @see [External authority](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/core/capabilities/openable/index.md).
 */
export interface OpenStateAuthority {
  /** @description The current authoritative openness; reading does not subscribe. */
  readonly isOpen: boolean;

  /**
   * @description Authorises and commits an opening value synchronously.
   * @remarks True means commitment and effective-change delivery have completed; false causes
   * no change, notification or queued work. Reentrant requests during source work return false.
   * Failures can follow commitment and do not establish rollback.
   * @param nextOpen - The requested logical value.
   * @returns Whether the target is synchronously authorised and effective.
   */
  requestOpen(nextOpen: boolean): boolean;

  /**
   * @description Registers synchronous observation without an initial replay.
   * @remarks The source borrows the listener; the caller owns its returned release obligation.
   * @param listener - Receives each coherent effective transition in registration order.
   * @returns An idempotent release for only this registration.
   */
  subscribeOpenChange(listener: (change: OpenableChangeType) => void): CapabilityUnsubscribeType;
}
