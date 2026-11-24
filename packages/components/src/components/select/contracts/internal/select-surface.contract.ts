import type { CapabilityUnsubscribeType } from "../../../../capabilities/shared/types/capability-unsubscribe.type.js";
import type { SelectChangeType } from "../../types/select-change.type.js";
import type { SelectResultType } from "../../types/select-result.type.js";
import type { SelectOption } from "../select-option.contract.js";

/** @description The fixed option set and observable selection supplied by the Select recipe. */
export interface ISelectSurface {
  /** @description Frozen ordered option records captured at creation. */
  readonly options: readonly SelectOption[];

  /** @description The effective value, retaining the last valid reading after finalisation. */
  readonly selectedValue: string;

  /**
   * @description Requests a listed value through the application authority.
   * @remarks An unchanged value bypasses policy. A differing disabled option refuses the request.
   * Invalid targets and collaborator failures throw separately from normal results.
   * @param nextValue - The requested option value.
   * @returns The synchronous request outcome.
   */
  requestSelection(nextValue: string): SelectResultType;

  /**
   * @description Observes effective selection changes without an initial replay.
   * @param listener - Observer of frozen snapshots after commitment.
   * @returns An idempotent release for this registration.
   */
  subscribeSelectionChange(listener: (change: SelectChangeType) => void): CapabilityUnsubscribeType;
}
