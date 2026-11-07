import type { activatableResultStatuses } from "../constants/activatable-result-statuses.constant.js";

/**
 * @description A status drawn from the activation outcome vocabulary.
 * @remarks The vocabulary declaration owns the literals; this type adds no runtime resource.
 */
export type ActivatableResultStatusType =
  (typeof activatableResultStatuses)[keyof typeof activatableResultStatuses];
