# Core

Status: **Private contract package and build; lifecycle and capability runtime not implemented**

`@luscious-garden/protea-core` owns Protea's portable foundation. The package currently exports
the `Component`, `ComponentScope` and `ComponentLifecycleType` contracts through one root entry.
These are type-only exports. There is no component constructor, scope factory, opening factory,
activation factory or executable component behaviour in this checkpoint.

The [component guide](component/index.md) owns identity, lifetime, cleanup registration and the
meaning of finalisation. Production TypeScript owns signatures and the build emits their
declarations; this guide does not maintain a parallel handwritten API catalogue.

## Package boundary

The package lives under `packages/core/`, is ESM-only and emits ES2022 JavaScript plus declarations
to its owned `dist/`. Its root export resolves types to `dist/index.d.ts` and JavaScript imports
to `dist/index.js`. There are no public subpaths or wildcard exports. The generated JavaScript
currently provides the module boundary without executable component exports.

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
Their production location, construction and independent teardown require decisions after the
foundation runtime. They are not current package exports. Button, Sidebar and Modal remain
[future original families](../../project/component-direction.md), potentially in core when
their actual responsibilities justify that location.

Runtime transitions, instance isolation, cleanup execution and real capability composition need
their own implementation and tests. A declaration build and clean type consumer establish
resolution and type restrictions; they do not demonstrate those runtime guarantees. Browser
rendering, accessibility, SSR, frameworks and optional integrations likewise require separate
[host evidence](../../project/integration-boundaries.md).
