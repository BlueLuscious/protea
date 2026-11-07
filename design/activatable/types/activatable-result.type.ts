import type { CapabilityRejectionReasonType } from "../../capabilities/api/index.js";
import type { activatableResultStatuses } from "../constants/activatable-result-statuses.constant.js";

/**
 * @description The expected outcome of a synchronous activation request.
 * @remarks Activation describes an action rather than a persistent pressed, selected or opening
 * state. Unexpected exceptions are not rejection outcomes. See
 * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 */
export type ActivatableResultType =
  | {
      /** @description The activation was committed. */
      readonly status: typeof activatableResultStatuses.activated;
    }
  | {
      /** @description The activation was rejected. */
      readonly status: typeof activatableResultStatuses.rejected;
      /** @description The expected cause of rejection. */
      readonly reason: CapabilityRejectionReasonType;
    };
