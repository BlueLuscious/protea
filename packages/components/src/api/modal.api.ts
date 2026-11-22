import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import type { Openable } from "../capabilities/openable/contracts/openable.contract.js";
import { createOpenableSurface } from "../capabilities/openable/runtime/internal/openable-surface.js";
import type { ModalOptionsType } from "../components/modal/types/modal-options.type.js";
import type { ModalApi } from "./contracts/modal-api.contract.js";
import { Opening } from "./opening.api.js";

/** @description The built-in Modal recipe, which exposes opening under the Core-owned lifetime. */
const modalDefinition = Component.define({
  identity: { namespace: "protea", name: "modal" },
  setup({ scope, options }: ComponentSetupContext<ModalOptionsType>): Openable {
    return createOpenableSurface(Opening.create(scope, options));
  },
});

/** @description Immutable public API for creating independent Modal instances. */
export const Modal = Object.freeze<ModalApi>({
  definition: modalDefinition,

  create(options) {
    return Component.create(modalDefinition, options);
  },
});
