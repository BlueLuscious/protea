import type { ComponentDefinition, ComponentInstance } from "@luscious-garden/protea-core";
import type { ButtonOptionsType } from "../types/button-options.type.js";
import type { IButtonSurface } from "./internal/button-surface.contract.js";

/** @description A discrete action with an independent lifetime and observable availability. */
export interface ButtonInstance
  extends ComponentInstance<ComponentDefinition<ButtonOptionsType | undefined, IButtonSurface>>, IButtonSurface {}
