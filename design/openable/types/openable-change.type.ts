/**
 * @description The previous and current logical values of an effective opening change.
 * @remarks The two directions exclude unchanged values. These readonly fields describe the
 * consumer view without promising runtime freezing or animation completion. See
 * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 */
export type OpenableChangeType =
  | {
      /** @description The closed value before an effective opening. */
      readonly previous: false;
      /** @description The committed open value after an effective opening. */
      readonly current: true;
    }
  | {
      /** @description The open value before an effective closing. */
      readonly previous: true;
      /** @description The committed closed value after an effective closing. */
      readonly current: false;
    };
