import { Openable } from "../capabilities/openable/runtime/openable.js";
import type { OpeningApi } from "./contracts/opening-api.contract.js";

/** @description Immutable stateless construction owner for portable logical opening. */
export const Opening = Object.freeze<OpeningApi>({
  create(scope, options) {
    return new Openable(scope, options);
  },
});
