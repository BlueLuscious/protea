import type { Activatable } from "../../activatable/api/index.js";
import type { Component } from "../../component/api/index.js";

/**
 * @description A button model that combines one component lifetime with simple activation.
 * @remarks The button adds no opening, pressed or selection state. Its purpose, creation and
 * borrowed uses are defined in
 * [Representative families](../../../docs/en/design/representative-families.md).
 */
export interface Button extends Component, Activatable {}
