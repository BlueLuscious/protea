import type { ComponentDefinitionInput } from "../contracts/component-definition-input.contract.js";
import type { ComponentDefinition } from "../contracts/component-definition.contract.js";

/** @description Prepares reusable definitions and verifies the prepared protocol for instance creation. */
export class ComponentDefinitionFactory {
  /** @description The lowercase ASCII kebab-case grammar shared by identity parts. */
  static readonly #identityPartPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

  /**
   * @description Captures a recipe and copies its identity into a frozen definition.
   * @typeParam Options - The options accepted by the recipe.
   * @typeParam Surface - The recipe's flat public members.
   * @param input - The authored identity and recipe.
   * @returns A fresh prepared definition.
   */
  create<Options, Surface extends object>(input: ComponentDefinitionInput<Options, Surface>): ComponentDefinition<Options, Surface> {
    const definition = this.#readDefinition(input, false);
    Object.freeze(definition.identity);
    return Object.freeze(definition);
  }

  /**
   * @description Validates a supplied prepared definition and captures its recipe.
   * @typeParam Options - The options accepted by the recipe.
   * @typeParam Surface - The recipe's flat public members.
   * @param definition - The prepared definition to inspect.
   * @returns The captured setup operation without invoking it.
   */
  readSetup<Options, Surface extends object>(definition: ComponentDefinition<Options, Surface>): ComponentDefinition<Options, Surface>["setup"] {
    return this.#readDefinition(definition, true).setup;
  }

  /**
   * @description Validates and snapshots identity and setup from recognised own fields.
   * @remarks The recipe assertion preserves the caller's generics after validating its callable shape.
   * @typeParam Options - The options accepted by the recipe.
   * @typeParam Surface - The recipe's flat public members.
   * @param input - The definition or author input to inspect.
   * @param prepared - Whether to require the frozen protocol used by creation.
   * @returns A snapshot of the validated fields.
   */
  #readDefinition<Options, Surface extends object>(
    input: ComponentDefinitionInput<Options, Surface>,
    prepared: boolean,
  ): ComponentDefinition<Options, Surface> {
    if (input === null || typeof input !== "object" || (prepared && !Object.isFrozen(input))) {
      throw new TypeError("Expected a component definition object, frozen for creation.");
    }

    const identity = this.#readOwnDataField(input, "identity");
    const setup = this.#readOwnDataField(input, "setup");

    if (identity === null || typeof identity !== "object" || (prepared && !Object.isFrozen(identity))) {
      throw new TypeError("Expected a component identity object, frozen for creation.");
    }

    const name = this.#readOwnDataField(identity, "name");
    const namespace = this.#readOwnDataField(identity, "namespace");

    if (prepared && namespace === undefined && "namespace" in identity) {
      throw new TypeError("A prepared component namespace must be an own string property when present.");
    }

    const identityPartPattern = ComponentDefinitionFactory.#identityPartPattern;

    if (typeof name !== "string" || !identityPartPattern.test(name)) {
      throw new TypeError("Component name must be lowercase ASCII kebab-case.");
    }

    if (namespace !== undefined && (typeof namespace !== "string" || !identityPartPattern.test(namespace))) {
      throw new TypeError("Component namespace must be lowercase ASCII kebab-case when supplied.");
    }

    if (typeof setup !== "function") {
      throw new TypeError("Component setup must be callable.");
    }

    return {
      identity: namespace === undefined ? { name } : { name, namespace },
      setup: setup as ComponentDefinition<Options, Surface>["setup"],
    };
  }

  /**
   * @description Reads an own data field without executing an accessor.
   * @param target - The object containing the field.
   * @param key - The recognised field name.
   * @returns The supplied value, or undefined when the field is absent.
   */
  #readOwnDataField(target: object, key: string): unknown {
    const descriptor = Object.getOwnPropertyDescriptor(target, key);

    if (descriptor === undefined) {
      return undefined;
    }

    if (!Object.hasOwn(descriptor, "value")) {
      throw new TypeError(`Component definition field '${key}' must be an own data property.`);
    }

    return descriptor.value;
  }
}
