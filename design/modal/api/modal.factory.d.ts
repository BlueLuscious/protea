import type { Modal } from "../contracts/modal.contract.js";
import type { ModalOptionsType } from "../types/modal-options.type.js";

/**
 * @description The declared owner of modal creation.
 * @remarks This declaration supplies no runtime value. See
 * [Representative families](../../../docs/en/design/representative-families.md).
 */
export declare const modalFactory: {
  /**
   * @description Creates a modal and its optional activation-to-close connection.
   * @remarks Creation validates any borrowed control and establishes owned registrations without
   * activating the control or requesting an opening change. The caller owns the new model's
   * lifetime; borrowed references retain their owners. Validation, failed-creation cleanup and
   * connection semantics are defined in the representative-family guide.
   * @param options - The fixed opening configuration and optional active closing control.
   * @returns A new active modal whose lifecycle belongs to the caller.
   */
  readonly create: (options: ModalOptionsType) => Modal;
};
