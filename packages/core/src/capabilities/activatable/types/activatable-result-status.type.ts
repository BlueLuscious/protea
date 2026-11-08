import type { activatableResultStatuses } from "../constants/activatable-result-statuses.constant.js";

/**
 * @description The statuses derived from the activation outcome vocabulary.
 */
export type ActivatableResultStatusType =
  (typeof activatableResultStatuses)[keyof typeof activatableResultStatuses];
