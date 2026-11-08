/**
 * @description A snapshot of one effective logical opening change.
 * @remarks The opposite boolean directions exclude unchanged state and animation completion.
 */
export type OpenableChangeType =
  | {
      /** @description The closed value before opening. */
      readonly previous: false;
      /** @description The committed open value. */
      readonly current: true;
    }
  | {
      /** @description The open value before closing. */
      readonly previous: true;
      /** @description The committed closed value. */
      readonly current: false;
    };
