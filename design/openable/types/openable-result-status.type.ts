import type { openableResultStatuses } from "../constants/openable-result-statuses.constant.js";

/**
 * @description A status drawn from the opening outcome vocabulary.
 * @remarks The vocabulary declaration owns the literals; this type adds no runtime resource.
 */
export type OpenableResultStatusType =
  (typeof openableResultStatuses)[keyof typeof openableResultStatuses];
