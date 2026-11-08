# Protea Core

Private portable foundation package for Protea's component library.

## Current surface

The root of `@luscious-garden/protea-core` exports the type-only `Component`, `ComponentScope`
and `ComponentLifecycleType` contracts. The package builds ESM JavaScript and declarations from
production TypeScript. No executable component, factory, lifecycle transition or capability
runtime is available yet. The initial `0.0.0` package is private and unpublished.

The repository's [core guide](../../docs/en/packages/core/index.md) owns current package scope;
the [component guide](../../docs/en/packages/core/component/index.md) owns lifetime and cleanup
semantics. Follow the [tooling guide](../../docs/en/tooling/index.md) for contributor prerequisites
and build/check commands. Repository-relative documentation is not included in the local package
archive; its metadata identifies the owning repository.

## Licence

[ISC](LICENSE).
