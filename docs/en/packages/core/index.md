# Core

Status: **Private portable construction, lifetime and cleanup**

`@luscious-garden/protea-core` owns Protea's portable component foundation. Its public root
exposes definition-based construction, standalone scopes and the lifecycle vocabulary. Production
TypeScript owns signatures and emits declarations. These guides own semantics and responsibilities.

## Boundary

The package is ESM-only and emits ES2022 JavaScript plus declarations to its owned `dist/`.
Its root export resolves types to `dist/index.d.ts` and JavaScript to `dist/index.js`.
There are no wildcard exports or supported private runtime imports. The initial `0.0.0`
package is private; its identity establishes no registry reservation or published release.

Core has no production dependencies and requires no implicit Node, DOM or framework types.
The [workspace tooling guide](../../tooling/workspace/index.md) owns the build and its outputs.

[Components](../components/index.md) depends on the public Core root for construction and
lifetime. Applications can use Core alone to define their own components. The
[integration guide](../../project/integration-boundaries.md) owns host and provider boundaries.

## Documentation

| Page | Owns |
| --- | --- |
| [API](api/index.md) | `Component` and `Scope` operations, usage and exact root exports. |
| [Component](component/index.md) | Definition and instance contracts, identity, lifetime and cleanup. |
| [Component Runtime](component/runtime/index.md) | Definition preparation, flat instance assembly and failure handling. |
| [Quality](quality.md) | Runtime, declaration and packed-consumer evidence. |
