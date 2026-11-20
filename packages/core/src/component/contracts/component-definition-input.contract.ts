import type { TComponentSurfaceRestrictions } from "../types/internal/component-surface-restrictions.type.js";
import type { ComponentIdentity } from "./component-identity.contract.js";
import type { ComponentSetupContext } from "./component-setup-context.contract.js";

/**
 * @description Author-supplied identity and recipe for preparing a component definition.
 * @typeParam Options - The options accepted by the recipe.
 * @typeParam Surface - The recipe's flat public members.
 */
export interface ComponentDefinitionInput<Options = void, Surface extends object = object> {
  /** @description Identity data to validate and copy, allowing an absent namespace as undefined. */
  readonly identity: {
    /** @description The logical name of the component type. */
    readonly name: ComponentIdentity["name"];

    /** @description The optional namespace of the component type. */
    readonly namespace?: ComponentIdentity["namespace"];
  };

  /**
   * @description Prepares one instance and declares its specific public surface.
   * @remarks Validate options before acquisitions, register owned releases and finish synchronously.
   * @param context - The borrowed options and new scope for this call.
   * @returns An own-property record with the specific operations and data descriptors.
   */
  readonly setup: (this: void, context: ComponentSetupContext<Options>) => Surface & TComponentSurfaceRestrictions;
}
