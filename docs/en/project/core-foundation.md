# Portable Core Foundation

Status: **Component lifetime and reusable opening/activation runtime implemented**

Protea's portable foundation supports its independent UI component library. The
[core package](../packages/core/index.md) implements component lifetime and cleanup ownership,
plus optional opening and activation with deliberate public contracts and factories.

The [component guide](../packages/core/component/index.md) owns identity, one logical lifetime
and explicit cleanup registration. Component remains the minimum model contract; ComponentScope
adds the stronger resource-owner responsibility without imposing it on every consumer.
Production TypeScript owns signatures and emits their declarations.

[Capabilities](../packages/core/capabilities/index.md) are grouped beneath core and share the
captured scope's lifetime. They retain independent state and registrations and do not acquire
authority to dispose the owner. Creation, failures and borrowing are specified alongside their
actual implementations. Individual capability teardown, replacement and transfer remain deferred.

DOM, rendering, styles, icons, motion, frameworks and managers stay outside this portable slice.
[Component direction](component-direction.md) owns conceptual responsibilities and future original
families; [integration boundaries](integration-boundaries.md) own optional host and provider work.
Neither allocates another package or a mandatory class hierarchy. The
[package tooling guide](../tooling/core-package.md) owns build and distribution qualification.
