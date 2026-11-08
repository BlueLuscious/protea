# Core

Status: **Private component lifetime and cleanup runtime; capabilities remain pending**

`@luscious-garden/protea-core` owns Protea's portable foundation. The package currently exports
the `componentScopeFactory` and `componentLifecycleStates` values, plus the `Component`,
`ComponentScope`, `ComponentScopeFactory` and `ComponentLifecycleType` contracts through one root
entry. The stateless factory's `create()` accepts no options and returns a new active ComponentScope
with independent lifetime and cleanup obligations. Opening and activation factories are not exported.

The [component guide](component/index.md) owns identity, lifetime, cleanup registration and the
meaning of finalisation. Production TypeScript owns signatures and the build emits their
declarations; this guide does not maintain a parallel handwritten API catalogue.

## Package boundary

The package lives under `packages/core/`, is ESM-only and emits ES2022 JavaScript plus declarations
to its owned `dist/`. Its root export resolves types to `dist/index.d.ts` and JavaScript imports
to `dist/index.js`. There are no public subpaths or wildcard exports. The generated JavaScript
provides the scope factory and immutable lifecycle vocabulary. The implementation class and
constructor are not public exports.

The initial `0.0.0` package is private. Its manifest identity establishes no registry reservation,
published archive or installable public release. It has no production dependencies and its
portable contracts require no implicit Node, DOM or framework types. The
[package tooling guide](../../tooling/core-package.md) owns build, inclusion, consumer checks
and supported-qualification boundaries.

## Scope and current limits

A consumer can depend on the minimum `Component` contract or explicitly accept the stronger
resource-owning `ComponentScope`. Structural extension permits additional domain responsibilities
without making every component openable, activatable or managed. A contract does not require a
base implementation class or expose private storage.

Opening and activation remain [legacy capability prototypes](../../design/index.md).
Their production location, construction and independent teardown require further decisions.
They are not current package exports. Button, Sidebar and Modal remain
[future original families](../../project/component-direction.md), potentially in core when
their actual responsibilities justify that location.

The lifetime runtime implements terminal finalisation, independent state and all required
synchronous cleanup attempts. Its public runtime tests are separate from build and type-consumer
checks. Real capability composition remains future work. Browser rendering, accessibility, SSR,
frameworks and optional integrations require separate
[host evidence](../../project/integration-boundaries.md).
