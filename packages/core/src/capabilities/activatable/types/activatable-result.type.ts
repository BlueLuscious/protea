import type { CapabilityRejectionReasonType } from "../../shared/api/index.js";
import type { activatableResultStatuses } from "../constants/activatable-result-statuses.constant.js";

/**
 * @description An accepted activation or an expected refusal of its request.
 * @remarks Unexpected collaborator failures are thrown rather than converted into rejection.
 */
export type ActivatableResultType =
  | {
      /** @description The request accepted one activation. */
      readonly status: typeof activatableResultStatuses.activated;
    }
  | {
      /** @description The request did not accept an activation. */
      readonly status: typeof activatableResultStatuses.rejected;
      /** @description The expected reason for refusal. */
      readonly reason: CapabilityRejectionReasonType;
    };
