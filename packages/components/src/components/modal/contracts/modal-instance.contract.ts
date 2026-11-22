import type { ComponentDefinition, ComponentInstance } from "@luscious-garden/protea-core";
import type { Openable } from "../../../capabilities/openable/contracts/openable.contract.js";
import type { ModalOptionsType } from "../types/modal-options.type.js";

/**
 * @description A dialogue model with owned lifetime and logical opening under one fixed authority.
 * @remarks Openable supplies request, observation and terminal-projection semantics; disposal
 * releases owned resources without requesting closing or disposing a borrowed authority.
 * Host modality and accessible interaction require separate evidence. See
 * [Modal](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/components/components/modal/index.md).
 */
export interface ModalInstance extends ComponentInstance<ComponentDefinition<ModalOptionsType, Openable>>, Openable {}
