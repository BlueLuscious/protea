import type { ComponentDefinition } from "./component-definition.contract.js";
import type { ComponentLifetime } from "./component-lifetime.contract.js";

/**
 * @description Common members of a live Core-created component.
 * @remarks The default view preserves definition identity without assuming any accepted setup options.
 * @typeParam Definition - The definition this instance was created from.
 */
export interface ComponentInstance<Definition extends ComponentDefinition<never> = ComponentDefinition<never>>
  extends ComponentLifetime {
  /** @description The exact prepared definition used to construct the instance. */
  readonly definition: Definition;
}
