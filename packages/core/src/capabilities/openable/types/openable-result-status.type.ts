import type { openableResultStatuses } from "../constants/openable-result-statuses.constant.js";

/** @description A member of the opening outcome vocabulary. */
export type OpenableResultStatusType =
  (typeof openableResultStatuses)[keyof typeof openableResultStatuses];
