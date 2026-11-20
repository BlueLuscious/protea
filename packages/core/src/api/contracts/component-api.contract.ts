import type { ComponentDefinitionInput } from "../../component/contracts/component-definition-input.contract.js";
import type { ComponentDefinition } from "../../component/contracts/component-definition.contract.js";
import type { ComponentInstance } from "../../component/contracts/component-instance.contract.js";
import type { TComponentCreationOptions } from "../../component/types/internal/component-creation-options.type.js";

/** @description Prepares reusable types and creates independent instances from them. */
export interface ComponentApi {
  /**
   * @description Copies a valid identity and captures the recipe in a fresh frozen definition.
   * @remarks Throws for invalid recognised fields. Preparation acquires no instance resources.
   * @typeParam Options - The options accepted by the recipe.
   * @typeParam Surface - The recipe's flat public members.
   * @param input - Authored identity and recipe.
   * @returns The prepared definition.
   */
  readonly define: <Options = void, Surface extends object = object>(
    input: ComponentDefinitionInput<Options, Surface>,
  ) => ComponentDefinition<Options, Surface>;

  /**
   * @description Creates an active instance with its own lifetime and the recipe's flat surface.
   * @remarks Setup must finish synchronously. Failure finalises the newly acquired scope.
   * @typeParam Options - The options accepted by the recipe.
   * @typeParam Surface - The recipe's flat public members.
   * @param definition - A structurally prepared definition.
   * @param options - Options for this creation, optional when the recipe accepts undefined.
   * @returns A fresh component associated with the supplied definition.
   */
  readonly create: <Options, Surface extends object>(
    definition: ComponentDefinition<Options, Surface>,
    ...options: TComponentCreationOptions<Options>
  ) => ComponentInstance<ComponentDefinition<Options, Surface>> & Surface;
}
