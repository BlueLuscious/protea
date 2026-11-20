import type { CapabilityRejectionReasonType } from "../../shared/types/capability-rejection-reason.type.js";
import type { openableResultStatuses } from "../constants/openable-result-statuses.constant.js";

/**
 * @description The normal outcome of a synchronous opening request.
 * @remarks Exceptions propagate separately and do not establish refusal or rollback.
 */
export type OpenableResultType =
  | {
      /** @description An effective change was committed. */
      readonly status: typeof openableResultStatuses.changed;
    }
  | {
      /** @description The target was already satisfied. */
      readonly status: typeof openableResultStatuses.unchanged;
    }
  | {
      /** @description The request was rejected. */
      readonly status: typeof openableResultStatuses.rejected;
      /** @description The expected cause of rejection. */
      readonly reason: CapabilityRejectionReasonType;
    };
