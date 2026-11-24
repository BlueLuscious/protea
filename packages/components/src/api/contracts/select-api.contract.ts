import type { SelectInstance } from "../../components/select/contracts/select-instance.contract.js";
import type { SelectOptionsType } from "../../components/select/types/select-options.type.js";

/** @description Constructs independently owned Select instances. */
export interface SelectApi {
  /** @description The prepared definition shared by both Select construction entries. */
  readonly definition: SelectInstance["definition"];

  /**
   * @description Creates a Select instance with fixed options and a borrowed selection authority.
   * @param config - The ordered choices and application-owned source.
   * @returns A new model whose caller owns disposal authority.
   */
  readonly create: (config: SelectOptionsType) => SelectInstance;
}
