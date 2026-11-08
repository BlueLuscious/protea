import type { ComponentLifecycleType } from "../types/component-lifecycle.type.js";

/**
 * @description The minimum lifetime contract shared by Protea component models.
 * @remarks Identity is the object reference. See
 * [Component foundation](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/core/component/index.md#identity-and-lifetime).
 */
export interface Component {
  /**
   * @description The model's logical lifetime, readable after finalisation.
   */
  readonly lifecycle: ComponentLifecycleType;

  /**
   * @description Synchronously finalises this model and attempts every owned release.
   * @remarks Becomes terminal before release callbacks; borrowed lifetimes are preserved.
   * Repeated or reentrant calls return normally without waiting or retrying.
   * Release failures are thrown opaquely after all attempts.
   * @returns No value.
   */
  dispose(): void;
}
