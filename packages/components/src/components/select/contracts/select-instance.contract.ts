import type { ComponentDefinition, ComponentInstance } from "@luscious-garden/protea-core";
import type { SelectOptionsType } from "../types/select-options.type.js";
import type { ISelectSurface } from "./internal/select-surface.contract.js";

/**
 * @description A single-selection model with an independent lifetime and a borrowed authority.
 * @see [Select](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/components/select/index.md).
 */
export interface SelectInstance
  extends ComponentInstance<ComponentDefinition<SelectOptionsType, ISelectSurface>>, ISelectSurface {}
