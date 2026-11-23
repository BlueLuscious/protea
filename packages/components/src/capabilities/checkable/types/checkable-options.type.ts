import type { CheckedStateAuthority } from "../contracts/checked-state-authority.contract.js";

/** @description Selects the fixed owner and initial state of a checking capability. */
export type CheckableOptionsType =
  | {
      /** @description Selects state owned by the capability. */
      readonly control: "internal";
      /** @description The initial value, defaulting to false when omitted. */
      readonly initialChecked?: boolean;
      /** @description Excludes a borrowed owner from internal control. */
      readonly authority?: never;
    }
  | {
      /** @description Selects the sole borrowed owner. */
      readonly control: "external";
      /** @description The synchronous authority retained for this capability's lifetime. */
      readonly authority: CheckedStateAuthority;
      /** @description Excludes a separate initial value from external control. */
      readonly initialChecked?: never;
    };
