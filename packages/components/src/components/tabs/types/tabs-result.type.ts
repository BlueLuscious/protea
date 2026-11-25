import type { CapabilityRejectionReasonType } from "../../../capabilities/shared/types/capability-rejection-reason.type.js";
import type { tabsResultStatuses } from "../constants/tabs-result-statuses.constant.js";

/** @description The normal outcome of a synchronous tab selection request. */
export type TabsResultType =
  | {
      /** @description The requested tab became active. */
      readonly status: typeof tabsResultStatuses.changed;
    }
  | {
      /** @description The requested tab was already active. */
      readonly status: typeof tabsResultStatuses.unchanged;
    }
  | {
      /** @description The request was rejected. */
      readonly status: typeof tabsResultStatuses.rejected;
      /** @description Why the request could not proceed. */
      readonly reason: CapabilityRejectionReasonType;
    };
