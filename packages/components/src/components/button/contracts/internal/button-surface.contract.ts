import type { Activatable } from "../../../../capabilities/activatable/contracts/activatable.contract.js";
import type { CapabilityUnsubscribeType } from "../../../../capabilities/shared/types/capability-unsubscribe.type.js";
import type { ButtonDisabledChangeType } from "../../types/button-disabled-change.type.js";

/**
 * @description The activation and observable availability members supplied by the Button recipe.
 * @remarks Activation follows Activatable, with disabled requests denied after lifetime/busy checks.
 * Its private scope and capability are not exposed. See
 * [Button](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/components/button/index.md).
 */
export interface IButtonSurface extends Activatable {
  /** @description The current disabled policy, retaining its last value after finalisation. */
  readonly isDisabled: boolean;

  /**
   * @description Commits the disabled policy and synchronously notifies effective changes.
   * @remarks Invalid, terminal or reentrant writes during disabled delivery throw before mutation.
   * Idle unchanged writes do nothing. Observer failures are thrown after eligible delivery,
   * without rolling back commitment; disposal cancels remaining callbacks.
   * @param disabled - The application's next availability policy.
   * @returns No value.
   */
  setDisabled(disabled: boolean): void;

  /**
   * @description Observes future effective availability changes without an initial replay.
   * @remarks Registrations are independent and synchronous; terminal registration throws.
   * Delivery uses registration order, defers additions and skips registrations released before
   * their turn. Callbacks are borrowed, and unsubscribe remains idempotent after finalisation.
   * @param listener - Observer of frozen, opposite-direction disabled snapshots.
   * @returns An idempotent release for only this registration.
   */
  subscribeDisabledChange(listener: (change: ButtonDisabledChangeType) => void): CapabilityUnsubscribeType;
}
