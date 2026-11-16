import type { Openable } from "../../../capabilities/openable/api/index.js";
import type { Component } from "../../../component/api/index.js";

/**
 * @description A dialogue model with owned lifetime and logical opening under one fixed authority.
 * @remarks Openable supplies request, observation and terminal-projection semantics; disposal
 * releases owned resources without requesting closing or disposing a borrowed authority.
 * Host modality and accessible interaction require separate evidence. See
 * [Modal](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/core/components/modal/index.md).
 */
export interface Modal extends Component, Openable {}
