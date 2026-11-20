import type { ComponentScope } from "@luscious-garden/protea-core";
import type { Openable } from "../../capabilities/openable/contracts/openable.contract.js";
import type { OpenableOptionsType } from "../../capabilities/openable/types/openable-options.type.js";

/** @description Creates independent opening capabilities without acquiring their owner's lifetime. */
export interface OpeningApi {
  /**
   * @description Captures fixed configuration and establishes opening on an active owner.
   * @remarks Failed setup retires only this attempt's resources; the borrowed owner and source survive.
   * @param scope - The active lifetime and cleanup-registration owner.
   * @param options - Internal state or the sole synchronous external authority.
   * @returns A completed opening capability with no independent disposal operation.
   */
  readonly create: (scope: ComponentScope, options: OpenableOptionsType) => Openable;
}
