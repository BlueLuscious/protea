# Protea Components

Private portable component families and capabilities for Protea.

## Current surface

`@luscious-garden/protea-components` exposes one public root. `Button.create()` creates a Button
with an independent lifetime, observable availability and activation. It shares its prepared
definition with the explicit Core entry `Component.create(Button.definition, options)`.

`Opening.create` and `Activation.create` add portable behaviour to a supplied active Core scope.
Opening can use internal state or a borrowed synchronous state authority. Activation reports
action acceptance. Modal and Sidebar supply instance and construction types only.

The [package guide](../../docs/en/packages/components/index.md) maps public responsibilities.
The [API guide](../../docs/en/packages/components/api/index.md) shows both construction entries.
The [Core guide](../../docs/en/packages/core/index.md) owns the foundation that Components uses.

The package builds ES2022 ESM and declarations. It depends on `@luscious-garden/protea-core` and
remains private and unpublished at `0.0.0`. Repository-relative guides are not included in the
local archive. Package metadata identifies the owning repository.

## Licence

[ISC](LICENSE).
