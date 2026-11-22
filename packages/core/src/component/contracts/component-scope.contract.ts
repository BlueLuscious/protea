import type { ComponentLifetime } from "./component-lifetime.contract.js";

/**
 * @description A component lifetime with explicit cleanup-registration authority.
 * @see [Cleanup registration](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/core/component/index.md#cleanup-registration).
 */
export interface ComponentScope extends ComponentLifetime {
  /**
   * @description Registers one synchronous release obligation while this scope is active.
   * @remarks Registration never invokes release; invalid or terminal registration throws
   * without retaining it. Successful calls add independent entries, including duplicates.
   * @param release - Synchronous cleanup callback; returned promises are not awaited.
   * @returns No value.
   */
  readonly addCleanup: (release: () => void) => void;
}
