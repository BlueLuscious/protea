import type { CapabilityRejectionReasonType } from "../../../capabilities/shared/types/capability-rejection-reason.type.js";
import type { selectResultStatuses } from "../constants/select-result-statuses.constant.js";

/** @description The normal outcome of a synchronous selection request. */
export type SelectResultType =
  | {
      /** @description The target became effective. */
      readonly status: typeof selectResultStatuses.changed;
    }
  | {
      /** @description The target was already effective. */
      readonly status: typeof selectResultStatuses.unchanged;
    }
  | {
      /** @description The request was rejected. */
      readonly status: typeof selectResultStatuses.rejected;
      /** @description Why this request did not proceed. */
      readonly reason: CapabilityRejectionReasonType;
    };
