import type { componentReservedMembers } from "../../constants/component-reserved-members.constant.js";

/** @description Excludes known common-member collisions and thenable surfaces. */
export type TComponentSurfaceRestrictions = {
  readonly [Key in (typeof componentReservedMembers)[number]]?: never;
};
