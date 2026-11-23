import { Component } from "@luscious-garden/protea-core";
import { ModalDefinition } from "../../components/modal/definitions/modal.definition.js";
import type { ModalApi } from "../contracts/modal-api.contract.js";

/** @description Immutable public API for creating independent Modal instances. */
export const Modal = Object.freeze<ModalApi>({
  definition: ModalDefinition,

  create(options) {
    return Component.create(ModalDefinition, options);
  },
});

export type { ModalApi };
export type { ModalInstance } from "../../components/modal/contracts/modal-instance.contract.js";
export type { ModalOptionsType } from "../../components/modal/types/modal-options.type.js";
