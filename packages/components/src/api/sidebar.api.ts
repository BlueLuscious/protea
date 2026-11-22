import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";
import type { Openable } from "../capabilities/openable/contracts/openable.contract.js";
import { createOpenableSurface } from "../capabilities/openable/runtime/internal/openable-surface.js";
import type { SidebarOptionsType } from "../components/sidebar/types/sidebar-options.type.js";
import type { SidebarApi } from "./contracts/sidebar-api.contract.js";
import { Opening } from "./opening.api.js";

/** @description The built-in Sidebar recipe for changeable logical presence. */
const sidebarDefinition = Component.define({
  identity: { namespace: "protea", name: "sidebar" },
  setup({ scope, options }: ComponentSetupContext<SidebarOptionsType>): Openable {
    return createOpenableSurface(Opening.create(scope, options));
  },
});

/** @description Immutable public API for creating independent Sidebar instances. */
export const Sidebar = Object.freeze<SidebarApi>({
  definition: sidebarDefinition,

  create(options) {
    return Component.create(sidebarDefinition, options);
  },
});
