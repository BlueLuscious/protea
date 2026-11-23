import { Checkable } from "../capabilities/checkable/runtime/checkable.js";
import type { CheckingApi } from "./contracts/checking-api.contract.js";

/** @description Immutable stateless factory for checked state within a borrowed lifetime. */
export const Checking = Object.freeze<CheckingApi>({
  create(scope, options) {
    return new Checkable(scope, options);
  },
});
