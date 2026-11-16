# Protea Core

Private portable foundation and reusable capabilities for Protea's component library.

## Current surface

`@luscious-garden/protea-core` exposes one public root. componentScopeFactory creates an active
ComponentScope; openableFactory and activatableFactory attach their behaviour to a supplied
active scope. Each factory provides a contextual `create` operation. Implementation classes
and constructors are not public.

Component lifetime becomes terminal before owned release callbacks and attempts every required
synchronous release. Opening supports internal state or a borrowed synchronous state authority;
activation reports action acceptance. Named frozen vocabularies own lifecycle, result statuses
and rejection reasons, with types derived from those values.

The [core guide](../../docs/en/packages/core/index.md) maps public responsibilities.
The [component guide](../../docs/en/packages/core/component/index.md) owns lifetime and cleanup;
[capability guides](../../docs/en/packages/core/capabilities/index.md) own construction, state,
outcomes and observations. Follow the [tooling guide](../../docs/en/tooling/index.md) for actual
commands, coverage and contributor prerequisites.

The core root also exports type contracts for Button, Modal and Sidebar and their specific
construction interfaces. Their reviewed responsibilities and ownership are documented in the
[family guide](../../docs/en/packages/core/components/index.md). Family runtime implementations,
constructors and factory values do not exist yet; the seven implemented runtime exports remain
unchanged. Static examples do not execute these family contracts.

The package builds ES2022 ESM and declarations. Its initial `0.0.0` remains private and
unpublished. Host bindings, icons and motion remain future work.
Repository-relative guides are not included in the local archive; package metadata identifies
the owning repository.

## Licence

[ISC](LICENSE).
