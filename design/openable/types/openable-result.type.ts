import type { CapabilityRejectionReasonType } from "../../capabilities/api/index.js";
import type { openableResultStatuses } from "../constants/openable-result-statuses.constant.js";

/**
 * @description The expected outcome of a synchronous opening or closing request.
 * @remarks A satisfied request differs from a rejected request. An exception is not an outcome
 * in this union and does not imply that a committed change was rolled back. See
 * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 */
export type OpenableResultType =
  | {
      /** @description An effective logical change was committed. */
      readonly status: typeof openableResultStatuses.changed;
    }
  | {
      /** @description The requested value was already effective. */
      readonly status: typeof openableResultStatuses.unchanged;
    }
  | {
      /** @description The request was rejected. */
      readonly status: typeof openableResultStatuses.rejected;
      /** @description The expected cause of rejection. */
      readonly reason: CapabilityRejectionReasonType;
    };
