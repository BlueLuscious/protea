import type { OpenStateAuthority } from "../contracts/open-state-authority.contract.js";

/** @description Selects the fixed authority and initial state of one opening capability. */
export type OpenableOptionsType =
  | {
      /** @description Selects state owned by this capability. */
      readonly control: "internal";
      /** @description The initial openness, defaulting to false when omitted. */
      readonly initialOpen?: boolean;
      /** @description Excludes an external owner from internal control. */
      readonly authority?: never;
    }
  | {
      /** @description Selects the sole borrowed state authority. */
      readonly control: "external";
      /** @description The synchronous source retained for this capability's lifetime. */
      readonly authority: OpenStateAuthority;
      /** @description Excludes a second initial-state authority. */
      readonly initialOpen?: never;
    };
