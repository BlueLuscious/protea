import type { ComponentScope as ComponentScopeContract } from "../component/contracts/component-scope.contract.js";
import { ComponentScope } from "../component/runtime/component-scope.js";
import type { ScopeApi } from "./contracts/scope-api.contract.js";

/** @description Immutable public API for creating standalone component scopes. */
export const Scope: ScopeApi = Object.freeze({
  create(): ComponentScopeContract {
    return new ComponentScope().view;
  },
});
