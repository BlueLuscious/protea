import type { Openable } from "../../../capabilities/openable/api/index.js";
import type { Component } from "../../../component/api/index.js";

/**
 * @description A lateral-region model with owned lifetime and changeable logical opening.
 * @remarks This bounded contract excludes permanently invariant visibility. Openable owns its
 * request, observation and terminal-projection semantics; positioning and host visibility are
 * independent. See [Sidebar](https://github.com/BlueLuscious/protea/blob/master/docs/en/packages/core/components/sidebar/index.md).
 */
export interface Sidebar extends Component, Openable {}
