import type { Button } from "../../button/api/index.js";
import type { Component } from "../../component/api/index.js";
import type { Openable } from "../../openable/api/index.js";

/**
 * @description A modal model with logical opening and an optional borrowed closing control.
 * @remarks The model owns its opening capability and any activation-to-close registration,
 * without owning the control's lifetime. Host interaction and optional coordination remain
 * separate. See [Representative families](../../../docs/en/design/representative-families.md).
 */
export interface Modal extends Component, Openable {
  /**
   * @description The fixed borrowed button used to request closing, or undefined when absent.
   * @remarks Creation requires an active control when supplied. It cannot be replaced through
   * this contract. Later control finalisation does not finalise the modal. Modal disposal
   * invalidates its connection and attempts release without finalising the borrowed control
   * or freezing the reference.
   */
  readonly closeControl: Button | undefined;
}
