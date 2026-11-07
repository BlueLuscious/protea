/**
 * @description The named string choices for an opening request outcome.
 * @remarks This ambient declaration describes a future vocabulary object, not an implemented
 * runtime value. See [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md#result-vocabularies).
 */
export declare const openableResultStatuses: {
  /** @description An effective logical change was committed. */
  readonly changed: "changed";
  /** @description The requested value was already effective. */
  readonly unchanged: "unchanged";
  /** @description The request was rejected with an expected reason. */
  readonly rejected: "rejected";
};
