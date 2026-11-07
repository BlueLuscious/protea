import type { CapabilityUnsubscribeType } from "../../capabilities/api/index.js";
import type { OpenableChangeType } from "../types/openable-change.type.js";
import type { OpenableResultType } from "../types/openable-result.type.js";

/**
 * @description The logical opening requests and observations supported by one capability.
 * @remarks The owning component supplies the lifetime and cleanup authority; this capability
 * adds no disposal operation or component inheritance. See
 * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
 */
export interface Openable {
  /**
   * @description The currently observed logical opening value.
   * @remarks This is independent of animation and retains its last observed value after the
   * owning component is finalised. It is not a writable second authority in external control.
   */
  readonly isOpen: boolean;

  /**
   * @description Requests the logically open value from the selected state authority.
   * @remarks A finalised owner or locally busy capability rejects before testing satisfaction.
   * Effective state is committed before eligible observers run and before a result returns.
   * Unexpected failures are opaque exceptions; committed changes are not rolled back.
   * @returns A changed, unchanged or rejected request outcome.
   */
  open(): OpenableResultType;

  /**
   * @description Requests the logically closed value from the selected state authority.
   * @remarks A finalised owner or locally busy capability rejects before testing satisfaction.
   * Effective state is committed before eligible observers run and before a result returns.
   * Unexpected failures are opaque exceptions; committed changes are not rolled back.
   * @returns A changed, unchanged or rejected request outcome.
   */
  close(): OpenableResultType;

  /**
   * @description Registers a synchronous observer of effective logical opening changes.
   * @remarks Registration does not emit an initial value. The component attempts to release
   * remaining registrations under the foundation rules when finalised without finalising borrowed
   * listeners or its external authority. Delivery ordering and failure rules are defined in
   * [Reusable capabilities](../../../docs/en/design/reusable-capabilities.md).
   * @param listener - Receives the previous and committed current logical values.
   * @returns An idempotent function that releases this observation registration.
   */
  subscribeOpenChange(
    listener: (change: OpenableChangeType) => void,
  ): CapabilityUnsubscribeType;
}
