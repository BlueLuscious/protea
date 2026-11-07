import type { CapabilityUnsubscribeType } from "../../capabilities/api/index.js";
import type { OpenableChangeType } from "../types/openable-change.type.js";

/**
 * @description A borrowed external owner of logical opening state.
 * @remarks A capability consumes this public contract without acquiring ownership of the
 * authority or a second writable state. See
 * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 */
export interface OpenStateAuthority {
  /**
   * @description The current authoritative logical opening value.
   * @remarks Reading this value does not subscribe the caller to later changes.
   */
  readonly isOpen: boolean;

  /**
   * @description Requests a synchronously authorised logical opening value.
   * @remarks Acceptance commits the requested value before returning and notifies an effective
   * change before return. Denial leaves state intact without notification or queued work.
   * Unexpected failures are opaque exceptions rather than denial and do not imply rollback.
   * @param nextOpen - The requested logical opening value.
   * @returns True when the requested value is synchronously committed, or false on denial.
   */
  requestOpen(nextOpen: boolean): boolean;

  /**
   * @description Registers a synchronous observer of effective authoritative opening changes.
   * @remarks Registration does not emit an initial value. The caller owns the returned release
   * obligation and borrows the listener. Ordering and failure rules are defined in
   * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
   * @param listener - Receives the previous and committed current logical values.
   * @returns An idempotent function that releases this observation registration.
   */
  subscribeOpenChange(
    listener: (change: OpenableChangeType) => void,
  ): CapabilityUnsubscribeType;
}
