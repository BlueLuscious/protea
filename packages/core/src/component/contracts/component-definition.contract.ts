import type { ComponentDefinitionInput } from "./component-definition-input.contract.js";
import type { ComponentIdentity } from "./component-identity.contract.js";

/**
 * @description A prepared component type with frozen identity and a stable recipe reference.
 * @remarks Its recipe remains callable code. Setup creates behaviour through Component.create.
 * @typeParam Options - The options accepted by the recipe.
 * @typeParam Surface - The recipe's flat public members.
 */
export interface ComponentDefinition<Options = void, Surface extends object = object>
  extends ComponentDefinitionInput<Options, Surface> {
  /** @description The prepared identity, with an absent namespace omitted by Core. */
  readonly identity: ComponentIdentity;
}
