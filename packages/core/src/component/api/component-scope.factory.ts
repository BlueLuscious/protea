import type { ComponentScopeFactory } from "../contracts/component-scope-factory.contract.js";
import { ComponentScope } from "../runtime/component-scope.js";

/**
 * @description Immutable, stateless factory for independent component scopes.
 */
export const componentScopeFactory: ComponentScopeFactory = Object.freeze({
  create(): ComponentScope {
    return new ComponentScope();
  },
});
