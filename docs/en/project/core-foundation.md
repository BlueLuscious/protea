# Portable Core Foundation

Status: **Production foundation contracts; runtime construction and capabilities pending**

Protea's portable foundation supports the independent UI component library. Its first real
package is [core](../packages/core/index.md), which currently exports Component, ComponentScope
and ComponentLifecycleType as contracts. The [component guide](../packages/core/component/index.md)
owns their semantics and production TypeScript owns their signatures.

A component's minimum contract supplies identity through its reference, logical lifetime and
finalisation. A resource-owning consumer can explicitly accept the stronger ComponentScope.
Keeping those roles distinct avoids imposing cleanup-registration authority on every consumer,
without replacing the component model with definition/instance aliases.

No creation value or lifecycle runtime exists yet. Opening and activation remain
[legacy capability inputs](../design/index.md). Their production placement, factories and any
independent capability teardown/replacement are intentionally decided after the foundation.
The earlier target factory-composition example is withdrawn as a selected production API;
capability consumers must not rely on values which this package does not export.

DOM, rendering, styles, icons, motion, frameworks and managers stay outside the portable core
slice. [Component direction](component-direction.md) owns future original families and their
composition questions; [integration boundaries](integration-boundaries.md) own optional host and
provider responsibilities. Neither allocates another package or a mandatory class hierarchy.
The [package tooling guide](../tooling/core-package.md) owns actual distribution and build boundaries.
