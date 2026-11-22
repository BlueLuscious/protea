import { componentLifecycleStates } from "../constants/component-lifecycle-states.constant.js";
import { componentReservedMembers } from "../constants/component-reserved-members.constant.js";
import type { ComponentDefinition } from "../contracts/component-definition.contract.js";
import type { ComponentInstance } from "../contracts/component-instance.contract.js";
import type { TComponentCreationOptions } from "../types/internal/component-creation-options.type.js";
import type { ComponentDefinitionFactory } from "./component-definition.factory.js";
import { ComponentScope } from "./component-scope.js";

/** @description Owns setup, composition and failure cleanup for each new component. */
export class ComponentInstanceFactory {
  /** @description The authority for inspecting prepared definitions. */
  readonly #definitions: ComponentDefinitionFactory;

  /**
   * @description Creates a factory that validates definitions before acquiring a scope.
   * @param definitions - The definition factory shared by the public construction API.
   */
  constructor(definitions: ComponentDefinitionFactory) {
    this.#definitions = definitions;
  }

  /**
   * @description Runs one setup and composes a protected instance before exposing it.
   * @remarks Captures cleanup before author code. The options tuple permits omission only when
   * the recipe accepts undefined. The result assertion reflects the fields installed below.
   * @typeParam Options - The options accepted by the recipe.
   * @typeParam Surface - The recipe's flat public members.
   * @param definition - A prepared definition to retain by reference.
   * @param options - Borrowed options for this creation.
   * @returns An active instance with the definition and specific surface installed.
   */
  create<Options, Surface extends object>(
    definition: ComponentDefinition<Options, Surface>,
    ...[options]: TComponentCreationOptions<Options>
  ): ComponentInstance<ComponentDefinition<Options, Surface>> & Surface {
    const setup = this.#definitions.readSetup(definition);
    const scope = new ComponentScope().view;
    const { dispose } = scope;

    try {
      const surface = setup(Object.freeze({ scope, options: options as Options }));
      const descriptors = this.#readSurfaceDescriptors(surface);

      if (scope.lifecycle !== componentLifecycleStates.active) {
        throw new Error("Component setup must leave its scope active.");
      }

      const instance: object = Object.create(null);
      Object.defineProperties(instance, {
        definition: { value: definition, enumerable: true },
        lifecycle: { get: () => scope.lifecycle, enumerable: true },
        dispose: { value: dispose, enumerable: true },
      });
      Object.defineProperties(instance, descriptors);
      Object.seal(instance);

      if (scope.lifecycle !== componentLifecycleStates.active) {
        throw new Error("Component construction must leave its scope active.");
      }

      return instance as ComponentInstance<ComponentDefinition<Options, Surface>> & Surface;
    } catch (error) {
      try {
        dispose();
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "Component construction and cleanup failed.");
      }

      throw error;
    }
  }

  /**
   * @description Checks the recipe's record and reserved keys without reading its member values.
   * @param surface - The recipe result to inspect.
   * @returns The descriptors to install on the public instance.
   */
  #readSurfaceDescriptors(surface: unknown): PropertyDescriptorMap {
    if (surface === null || typeof surface !== "object" || Array.isArray(surface)) {
      throw new TypeError("Component setup must return an own-property record.");
    }

    const prototype: unknown = Object.getPrototypeOf(surface);

    if (prototype !== null && prototype !== Object.prototype) {
      throw new TypeError("Component setup must return a plain or null-prototype record.");
    }

    const descriptors = Object.getOwnPropertyDescriptors(surface);

    for (const member of componentReservedMembers) {
      if (Object.hasOwn(descriptors, member)) {
        throw new TypeError(`Component setup cannot expose reserved member '${member}'.`);
      }
    }

    return descriptors;
  }
}
