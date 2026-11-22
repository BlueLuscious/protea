# Protea Core

Private portable foundation for Protea's component library.

## Current surface

`@luscious-garden/protea-core` exposes one public root. `Component.define` prepares a reusable
definition and `Component.create` runs its recipe for a fresh instance with a private lifetime.
`Scope.create` supplies an independent scope for cleanup ownership.

Component lifetime becomes terminal before owned release callbacks and attempts every required
synchronous release. The frozen `componentLifecycleStates` vocabulary exposes the active and
disposed states.

The [core guide](../../docs/en/packages/core/index.md) maps public responsibilities.
The [Core API guide](../../docs/en/packages/core/api/index.md#usage) covers authoring.
The [component guide](../../docs/en/packages/core/component/index.md) owns lifetime and cleanup.
The [Components package guide](../../docs/en/packages/components/index.md) describes built-in
families and capabilities that consume Core. Follow the
[tooling guide](../../docs/en/tooling/index.md) for verification and contributor prerequisites.

The package builds ES2022 ESM and declarations with no runtime dependencies. Its initial `0.0.0`
remains private and unpublished.
Repository-relative guides are not included in the local archive; package metadata identifies
the owning repository.

## Licence

[ISC](LICENSE).
