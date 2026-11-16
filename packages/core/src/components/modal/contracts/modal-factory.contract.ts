import type { ModalOptionsType } from "../types/modal-options.type.js";
import type { Modal } from "./modal.contract.js";

/** @description The construction contract for independent Modal models, without a runtime value. */
export interface ModalFactory {
  /**
   * @description Creates an active Modal with a private scope and the selected opening authority.
   * @remarks Failed setup exposes no partial model, invalidates acquired work and finalises only
   * the newly owned scope, attempting all required releases and preserving borrowed lifetimes.
   * @param options - Required opening control; internal defaults closed, external borrows its source.
   * @returns A new model whose caller owns disposal authority.
   */
  readonly create: (options: ModalOptionsType) => Modal;
}
