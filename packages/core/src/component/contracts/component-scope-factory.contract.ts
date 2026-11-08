import type { ComponentScope } from "./component-scope.contract.js";

/**
 * @description Creates independent component lifetimes and their cleanup owners.
 */
export interface ComponentScopeFactory {
  /**
   * @description Creates an active scope with no registered cleanup obligations.
   * @returns A new scope whose lifetime belongs to the caller.
   */
  readonly create: () => ComponentScope;
}
