# Protea Core

Private portable foundation package for Protea's component library.

## Current surface

The root of `@luscious-garden/protea-core` exports `componentScopeFactory`. Its `create()`
accepts no options and returns a new active ComponentScope with independent lifetime and cleanup
obligations. The root also exports the frozen `componentLifecycleStates` vocabulary, plus
Component, ComponentScope, ComponentScopeFactory and ComponentLifecycleType contracts.
Implementation classes and constructors are not public.

Finalisation becomes terminal before invoking release callbacks and attempts every owned
synchronous release. The package builds ESM JavaScript and declarations from production sources.
Opening, activation, concrete families and host bindings remain pending. The initial `0.0.0`
package is private and unpublished.

The repository's [core guide](../../docs/en/packages/core/index.md) owns current package scope;
the [component guide](../../docs/en/packages/core/component/index.md) owns lifetime and cleanup
semantics. Follow the [tooling guide](../../docs/en/tooling/index.md) for contributor prerequisites
and build/check commands. Repository-relative documentation is not included in the local package
archive; its metadata identifies the owning repository.

## Licence

[ISC](LICENSE).
