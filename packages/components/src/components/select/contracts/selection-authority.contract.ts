import type { CapabilityUnsubscribeType } from "../../../capabilities/shared/types/capability-unsubscribe.type.js";
import type { SelectChangeType } from "../types/select-change.type.js";

/**
 * @description A borrowed, application-owned source of effective selection.
 * @see [Select](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/components/select/index.md).
 */
export interface SelectionAuthority {
  /** @description The current value, readable without subscribing. */
  readonly selectedValue: string;

  /**
   * @description Authorises and commits a requested selection synchronously.
   * @remarks A changed value must be readable and reported before returning true. Refusal
   * changes nothing, publishes nothing and queues no work. The source refuses reentrant writes.
   * @param nextValue - The exact requested option value.
   * @returns Whether the target was authorised and made effective.
   */
  requestSelection(nextValue: string): boolean;

  /**
   * @description Registers a synchronous observer of later effective changes without replay.
   * @param listener - Observer of committed transitions in registration order.
   * @returns An idempotent release for this registration.
   */
  subscribeSelectionChange(listener: (change: SelectChangeType) => void): CapabilityUnsubscribeType;
}
