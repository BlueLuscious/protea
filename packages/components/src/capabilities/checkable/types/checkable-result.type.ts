import type { CapabilityRejectionReasonType } from "../../shared/types/capability-rejection-reason.type.js";
import type { checkableResultStatuses } from "../constants/checkable-result-statuses.constant.js";

/**
 * @description The normal outcome of a synchronous checked-state request.
 * @remarks Exceptions propagate separately and do not establish refusal or rollback.
 */
export type CheckableResultType =
  | {
      /** @description An effective change was committed. */
      readonly status: typeof checkableResultStatuses.changed;
    }
  | {
      /** @description The target was already effective. */
      readonly status: typeof checkableResultStatuses.unchanged;
    }
  | {
      /** @description The request was rejected. */
      readonly status: typeof checkableResultStatuses.rejected;
      /** @description The expected reason for rejecting this request. */
      readonly reason: CapabilityRejectionReasonType;
    };
