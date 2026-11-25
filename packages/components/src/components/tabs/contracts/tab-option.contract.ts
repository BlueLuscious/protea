/** @description Associates a logical tab with one panel in an ordered set. */
export interface TabOption {
  /** @description The exact non-empty key that identifies the tab. */
  readonly key: string;

  /** @description The exact non-empty key of the associated logical panel. */
  readonly panelKey: string;

  /** @description Whether this tab is unavailable for selection. Omit to enable it. */
  readonly disabled?: boolean;
}
