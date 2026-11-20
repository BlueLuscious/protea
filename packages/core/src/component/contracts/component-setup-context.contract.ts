import type { ComponentScope } from "./component-scope.contract.js";

/**
 * @description The resources and inputs available to one synchronous setup call.
 * @typeParam Options - The options accepted by the recipe.
 */
export interface ComponentSetupContext<Options = void> {
  /** @description The new instance's scope, available for owned release registration. */
  readonly scope: ComponentScope;

  /** @description Borrowed creation options for the recipe to validate and capture. */
  readonly options: Options;
}
