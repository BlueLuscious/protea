# Core

Status: **Private construction, lifetime, capability and Button runtime. Modal and Sidebar type contracts.**

`@luscious-garden/protea-core` owns Protea's portable component foundation and reusable
capabilities. Its one public root exports current API objects, contracts, factories and immutable
vocabularies. Production TypeScript owns signatures and emits declarations. These guides own
semantics, ownership and limitations.

## Boundary

The package is ESM-only and emits ES2022 JavaScript plus declarations to its owned `dist/`.
Its root export resolves types to `dist/index.d.ts` and JavaScript to `dist/index.js`.
There are no wildcard exports or supported private runtime imports. The initial `0.0.0`
package is private; its identity establishes no registry reservation or published release.

Core has no production dependencies and requires no implicit Node, DOM or framework types.
The [workspace tooling guide](../../tooling/workspace/index.md) owns the build and its outputs.

The first portable [component families](components/index.md) have reviewed production interfaces
and types under `src/components/` in this same package. `buttonFactory` creates Button models
with observable availability and activation. Button will adopt definition-based construction in
the [Components migration](../../future-capabilities.md#pending-components-migration).
Modal and Sidebar remain type-only. The [integration guide](../../project/integration-boundaries.md)
owns host and provider boundaries.

## Documentation

| Page | Owns |
| --- | --- |
| [API](api/index.md) | `Component` and `Scope` operations, usage and exact root exports. |
| [Capabilities](capabilities/index.md) | Opening, activation and composition over a borrowed lifetime. |
| [Component](component/index.md) | Definition and instance contracts, identity, lifetime and cleanup. |
| [Component Runtime](component/runtime/index.md) | Definition preparation, flat instance assembly and failure handling. |
| [Components](components/index.md) | Button runtime and the Modal and Sidebar type contracts. |
| [Shared Runtime](shared/index.md) | Listener registration and delivery shared by families and capabilities. |
| [Quality](quality.md) | Runtime, declaration and packed-consumer evidence. |
