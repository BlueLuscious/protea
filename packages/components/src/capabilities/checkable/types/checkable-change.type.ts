/** @description A snapshot of one effective checked change. */
export type CheckableChangeType =
  | {
      /** @description The unchecked value before the change. */
      readonly previous: false;
      /** @description The committed checked value. */
      readonly current: true;
    }
  | {
      /** @description The checked value before the change. */
      readonly previous: true;
      /** @description The committed unchecked value. */
      readonly current: false;
    };
