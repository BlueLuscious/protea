import type { OpenableFactory } from "../contracts/openable-factory.contract.js";
import type { ComponentScope } from "../../../component/contracts/component-scope.contract.js";
import type { OpenableOptionsType } from "../types/openable-options.type.js";
import type { Openable as OpenableContract } from "../contracts/openable.contract.js";
import { Openable } from "../runtime/openable.js";

/** @description Immutable stateless construction owner for portable logical opening. */
export const openableFactory: OpenableFactory = Object.freeze({
  create(scope: ComponentScope, options: OpenableOptionsType): OpenableContract {
    return new Openable(scope, options);
  },
});
