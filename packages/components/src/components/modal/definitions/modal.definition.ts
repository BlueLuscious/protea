import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import { Opening } from "../../../api/capabilities/opening.api.js";
import type { Openable } from "../../../capabilities/openable/contracts/openable.contract.js";
import { createOpenableSurface } from "../../../capabilities/openable/runtime/internal/openable-surface.js";
import type { ModalInstance } from "../contracts/modal-instance.contract.js";
import type { ModalOptionsType } from "../types/modal-options.type.js";

/** @description The built-in Modal recipe, which exposes opening under the Core-owned lifetime. */
export const ModalDefinition: ModalInstance["definition"] = Component.define({
  identity: { namespace: "protea", name: "modal" },
  setup({ scope, options }: ComponentSetupContext<ModalOptionsType>): Openable {
    return createOpenableSurface(Opening.create(scope, options));
  },
});
