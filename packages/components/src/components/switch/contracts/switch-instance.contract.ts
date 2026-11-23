import type { ComponentDefinition, ComponentInstance } from "@luscious-garden/protea-core";
import type { Checkable } from "../../../capabilities/checkable/contracts/checkable.contract.js";
import type { SwitchOptionsType } from "../types/switch-options.type.js";

/**
 * @description A checked-state model with an independent component lifetime.
 * @see [Switch](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/components/switch/index.md).
 */
export interface SwitchInstance extends ComponentInstance<ComponentDefinition<SwitchOptionsType, Checkable>>, Checkable {}
