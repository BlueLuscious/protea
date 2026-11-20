/**
 * @description Optional synchronous authorisation captured when an activation capability is created.
 */
export type ActivatableOptionsType = {
  /**
   * @description Authorises an otherwise eligible request, defaulting to acceptance when omitted.
   * @remarks The borrowed guard authorises acceptance rather than reporting business completion.
   * A thrown failure propagates without accepting an activation.
   * @returns True to authorise activation, or false to deny it.
   */
  readonly canActivate?: () => boolean;
};
