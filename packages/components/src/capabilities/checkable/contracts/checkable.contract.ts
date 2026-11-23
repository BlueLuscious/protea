import type { CapabilityUnsubscribeType } from "../../shared/types/capability-unsubscribe.type.js";
import type { CheckableChangeType } from "../types/checkable-change.type.js";
import type { CheckableResultType } from "../types/checkable-result.type.js";

/**
 * @description Checked state and requests within a borrowed component lifetime.
 * @see [Checkable](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/capabilities/checkable/index.md).
 */
export interface Checkable {
  /** @description Effective checked state, retaining its last observed value after finalisation. */
  readonly isChecked: boolean;

  /**
   * @description Requests an explicit checked value synchronously.
   * @remarks An effective commitment precedes notification. Later failures do not undo it.
   * @param nextChecked - The requested value.
   * @returns A changed, unchanged or rejected outcome.
   */
  requestChecked(nextChecked: boolean): CheckableResultType;

  /**
   * @description Observes future effective changes without replay.
   * @param listener - Borrowed synchronous observer of the committed transition.
   * @returns An idempotent release for this registration.
   */
  subscribeCheckedChange(listener: (change: CheckableChangeType) => void): CapabilityUnsubscribeType;
}
