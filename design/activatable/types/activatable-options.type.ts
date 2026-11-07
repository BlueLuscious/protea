/**
 * @description Supplies optional synchronous authorisation for activation requests.
 * @remarks The guard defaults to acceptance when omitted. It is a borrowed collaborator, not
 * an action executor, state store or lifecycle owner. This type selects no public factory.
 * See [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 */
export type ActivatableOptionsType = {
  /**
   * @description Determines whether an otherwise eligible activation may proceed.
   * @remarks The guard runs synchronously. A thrown failure is opaque rather than a denial.
   * @returns True to authorise activation, or false to deny it.
   */
  readonly canActivate?: () => boolean;
};
