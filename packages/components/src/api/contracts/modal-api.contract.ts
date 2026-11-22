import type { ModalInstance } from "../../components/modal/contracts/modal-instance.contract.js";
import type { ModalOptionsType } from "../../components/modal/types/modal-options.type.js";

/** @description Creates independent Modal models with caller-owned lifetimes. */
export interface ModalApi {
  /** @description The prepared Modal definition retained by instances from both creation entries. */
  readonly definition: ModalInstance["definition"];

  /**
   * @description Creates an active Modal with a private scope and the selected opening authority.
   * @remarks Failed setup exposes no partial model, invalidates acquired work and finalises only
   * the newly owned scope, attempting all required releases and preserving borrowed lifetimes.
   * @param options - Required opening control; internal defaults closed, external borrows its source.
   * @returns A new model whose caller owns disposal authority.
   */
  readonly create: (options: ModalOptionsType) => ModalInstance;
}
