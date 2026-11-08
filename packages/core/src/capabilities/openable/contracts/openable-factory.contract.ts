import type { ComponentScope } from "../../../component/contracts/component-scope.contract.js";
import type { OpenableOptionsType } from "../types/openable-options.type.js";
import type { Openable } from "./openable.contract.js";

/** @description Creates independent opening capabilities without acquiring their owner's lifetime. */
export interface OpenableFactory {
  /**
   * @description Captures fixed configuration and establishes opening on an active owner.
   * @remarks Failed setup retires only this attempt's resources; the borrowed owner and source survive.
   * @param scope - The active lifetime and cleanup-registration owner.
   * @param options - Internal state or the sole synchronous external authority.
   * @returns A completed opening capability with no independent disposal operation.
   */
  readonly create: (scope: ComponentScope, options: OpenableOptionsType) => Openable;
}
