# Protea Components

Private portable component families and capabilities for Protea.

## Current surface

`@luscious-garden/protea-components` exposes the family and capability APIs at its public root.
Import a single family through `/button`, `/modal`, `/select`, `/sidebar` or `/switch` on the same package.
The corresponding `/definitions/<family>` entry exports its prepared definition by name.
`Button.create()` creates a Button with an independent lifetime, observable availability and
activation. The named `ButtonDefinition` is the same value as `Button.definition` and works
with `Component.create(ButtonDefinition, options)`.
`Modal.create(options)` creates a dialogue model with internal or borrowed external opening
authority. Its prepared definition is available as `Modal.definition` for explicit creation.
`Select.create(config)` creates a single-selection model with a fixed set of options and a
borrowed application authority. Its prepared definition is available as `Select.definition`.
`Sidebar.create(options)` creates a lateral region model with changeable logical presence and
the same opening authority choices. Use `Sidebar.definition` with the explicit Core entry.
`Switch.create(options)` creates a checked-state model with internal or borrowed external
control. Its prepared definition is available as `Switch.definition`.

Import `Opening`, `Checking` and `Activation` together from `/capabilities` on the same package.
Their individual entries are `/capabilities/opening`, `/capabilities/checking` and
`/capabilities/activation`. They add portable behaviour to a supplied active Core scope.
Opening and Checking can use internal state or a borrowed synchronous state authority.
Activation reports action acceptance.

The [package guide](../../docs/en/packages/components/index.md) maps public responsibilities.
The [API guide](../../docs/en/packages/components/api/index.md) shows both construction entries.
The [Core guide](../../docs/en/packages/core/index.md) owns the foundation that Components uses.

The package builds ES2022 ESM and declarations. It depends on `@luscious-garden/protea-core` and
remains private and unpublished at `0.0.0`. Repository-relative guides are not included in the
local archive. Package metadata identifies the owning repository.

## Licence

[ISC](LICENSE).
