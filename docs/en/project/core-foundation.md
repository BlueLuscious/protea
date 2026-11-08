# Portable Core Foundation

Status: **Component lifetime and cleanup runtime implemented; capabilities remain pending**

Protea's portable foundation supports the independent UI component library. Its first real
package is [core](../packages/core/index.md). Its componentScopeFactory creates independent
ComponentScope instances with the existing component lifetime and explicit cleanup-registration
contract. The [component guide](../packages/core/component/index.md) owns semantics and use;
production TypeScript owns signatures and emits their declarations.

A component's minimum contract supplies identity through its reference, logical lifetime and
finalisation. A resource-owning consumer can explicitly accept the stronger ComponentScope.
Keeping those roles distinct avoids imposing cleanup-registration authority on every consumer,
without replacing the component model with definition/instance aliases.

Opening and activation remain
[legacy capability inputs](../design/index.md). Their production placement, factories and any
independent capability teardown/replacement require further capability decisions. The current
factory creates only a component scope, without options or attached capabilities. Consumers
must not rely on opening/activation values which this package does not export.

DOM, rendering, styles, icons, motion, frameworks and managers stay outside the portable core
slice. [Component direction](component-direction.md) owns future original families and their
composition questions; [integration boundaries](integration-boundaries.md) own optional host and
provider responsibilities. Neither allocates another package or a mandatory class hierarchy.
The [package tooling guide](../tooling/core-package.md) owns actual distribution and build boundaries.
