import type { ComponentScope } from "../../component/contracts/component-scope.contract.js";

/** @description Creates independent lifetimes with cleanup-registration authority. */
export interface ScopeApi {
  /**
   * @description Creates an active standalone scope without acquiring external resources.
   * @returns A frozen view over a fresh lifetime that the caller owns.
   */
  readonly create: () => ComponentScope;
}
