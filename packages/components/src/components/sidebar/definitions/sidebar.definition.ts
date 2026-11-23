import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import { Opening } from "../../../api/capabilities/opening.api.js";
import type { Openable } from "../../../capabilities/openable/contracts/openable.contract.js";
import { createOpenableSurface } from "../../../capabilities/openable/runtime/internal/openable-surface.js";
import type { SidebarInstance } from "../contracts/sidebar-instance.contract.js";
import type { SidebarOptionsType } from "../types/sidebar-options.type.js";

/** @description The built-in Sidebar recipe for changeable logical presence. */
export const SidebarDefinition: SidebarInstance["definition"] = Component.define({
  identity: { namespace: "protea", name: "sidebar" },
  setup({ scope, options }: ComponentSetupContext<SidebarOptionsType>): Openable {
    return createOpenableSurface(Opening.create(scope, options));
  },
});
