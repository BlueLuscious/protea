import { Component } from "@luscious-garden/protea-core";
import { SidebarDefinition } from "../../components/sidebar/definitions/sidebar.definition.js";
import type { SidebarApi } from "../contracts/sidebar-api.contract.js";

/** @description Immutable public API for creating independent Sidebar instances. */
export const Sidebar = Object.freeze<SidebarApi>({
  definition: SidebarDefinition,

  create(options) {
    return Component.create(SidebarDefinition, options);
  },
});

export type { SidebarApi };
export type { SidebarInstance } from "../../components/sidebar/contracts/sidebar-instance.contract.js";
export type { SidebarOptionsType } from "../../components/sidebar/types/sidebar-options.type.js";
