import type { OpenStateAuthority } from "../contracts/open-state-authority.contract.js";

/**
 * @description Selects one fixed opening-state authority for a capability's lifetime.
 * @remarks Internal control defaults to closed. External control borrows its sole authority
 * and accepts no separate initial value. This type selects no public factory or runtime class.
 * See [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 */
export type OpenableOptionsType =
  | {
      /** @description Selects state owned internally by the capability. */
      readonly control: "internal";
      /** @description The initial logical value, defaulting to false when omitted. */
      readonly initialOpen?: boolean;
      /** @description Excludes an external authority from internal control. */
      readonly authority?: never;
    }
  | {
      /** @description Selects state owned by a borrowed external authority. */
      readonly control: "external";
      /** @description The sole borrowed authority for current state and synchronous requests. */
      readonly authority: OpenStateAuthority;
      /** @description Excludes an independent initial value from external control. */
      readonly initialOpen?: never;
    };
