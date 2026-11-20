import { ComponentDefinitionFactory } from "../component/runtime/component-definition.factory.js";
import { ComponentInstanceFactory } from "../component/runtime/component-instance.factory.js";
import type { ComponentApi } from "./contracts/component-api.contract.js";

/** @description Shared internal authority for preparing and validating definitions. */
const componentDefinitionFactory = new ComponentDefinitionFactory();

/** @description Shared internal authority for constructing independent instances. */
const componentInstanceFactory = new ComponentInstanceFactory(componentDefinitionFactory);

/** @description Immutable public API for preparing definitions and creating component instances. */
export const Component = Object.freeze<ComponentApi>({
  define(input) {
    return componentDefinitionFactory.create(input);
  },

  create(definition, ...options) {
    return componentInstanceFactory.create(definition, ...options);
  },
});
