/** @description A snapshot of one effective selection change between distinct values. */
export type SelectChangeType = {
  /** @description The value before commitment. */
  readonly previous: string;

  /** @description The committed value. */
  readonly current: string;
};
