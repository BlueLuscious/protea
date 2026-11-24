/** @description One stable choice in the Select model's ordered option set. */
export interface SelectOption {
  /** @description The exact non-empty string that identifies this option. */
  readonly value: string;

  /** @description Whether Select refuses requests to change the selection to this value. */
  readonly disabled?: boolean;
}
