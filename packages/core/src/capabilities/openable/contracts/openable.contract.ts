import type { CapabilityUnsubscribeType } from "../../shared/types/capability-unsubscribe.type.js";
import type { OpenableChangeType } from "../types/openable-change.type.js";
import type { OpenableResultType } from "../types/openable-result.type.js";

/**
 * @description Logical opening bound to one borrowed component lifetime.
 * @see [Opening](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/core/capabilities/openable/index.md).
 */
export interface Openable {
  /**
   * @description Current logical openness, retaining its last observed value after finalisation.
   * @remarks Active reads observe the sole selected source; terminal reads never access it.
   */
  readonly isOpen: boolean;

  /**
   * @description Requests the logically open value synchronously.
   * @remarks Disposed and busy checks precede satisfaction. Commitment precedes notification;
   * later disposal or a callback failure does not roll back an observed commitment.
   * @returns A changed, unchanged or rejected outcome.
   */
  open(): OpenableResultType;

  /**
   * @description Requests the logically closed value synchronously.
   * @remarks Uses the same authority, ordering and failure rules as opening.
   * @returns A changed, unchanged or rejected outcome.
   */
  close(): OpenableResultType;

  /**
   * @description Registers synchronous observation of effective changes without initial replay.
   * @remarks Registrations are independent; mutation and owner finalisation affect pending turns.
   * Eligible callbacks are attempted despite failures, reported opaquely after delivery.
   * @param listener - Borrowed observer of the previous and committed current values.
   * @returns An idempotent release for only this registration.
   */
  subscribeOpenChange(listener: (change: OpenableChangeType) => void): CapabilityUnsubscribeType;
}
