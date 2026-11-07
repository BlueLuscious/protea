import type { Button } from "../../button/api/index.js";
import type { OpenableOptionsType } from "../../openable/api/index.js";

/**
 * @description Supplies one opening configuration and an optional borrowed closing control.
 * @remarks Creation captures fixed references without taking ownership of the control or an
 * external opening authority. Static typing does not establish that a control is active or that
 * its implementation obeys its contract. See
 * [Representative families](../../../docs/en/design/representative-families.md).
 */
export type ModalOptionsType = OpenableOptionsType & {
  /**
   * @description An active button borrowed as the modal's closing control, omitted when absent.
   * @remarks The modal owns the connection from accepted activation to its public close request,
   * not the button's lifetime. Changing this options object later cannot replace that connection.
   */
  readonly closeControl?: Button;
};
