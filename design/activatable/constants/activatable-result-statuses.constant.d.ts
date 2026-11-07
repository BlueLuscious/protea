/**
 * @description The named string choices for an activation request outcome.
 * @remarks This ambient declaration describes a future vocabulary object, not an implemented
 * runtime value. See [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md#result-vocabularies).
 */
export declare const activatableResultStatuses: {
  /** @description One activation was accepted. */
  readonly activated: "activated";
  /** @description The request was rejected with an expected reason. */
  readonly rejected: "rejected";
};
