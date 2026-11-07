# Protea

Protea is a UI component library project in Garden. It aims to provide reusable component
behaviour, accessibility and composition with optional presentation and framework integrations.

## Current status

The repository provides a private contributor toolchain, project documentation, shared-rule
adoption, an ISC licence and text hygiene configuration. Foundation scope, vocabulary and
responsibilities are documented in the [design guide](docs/en/design/index.md). A private
[component foundation prototype](docs/en/design/component-foundation.md) specifies reference identity
and logical lifetime. [Reusable capability prototypes](docs/en/design/reusable-capabilities.md)
specify opening, activation, state authority and observations, with non-executed consumption
examples checked statically.
The [representative families](docs/en/design/representative-families.md) now contrast buttons,
static/floating sidebars and modals, including borrowed controls and their cleanup boundaries.
[Component coordination](docs/en/design/component-coordination.md) retains direct references and
public capabilities for these pilots, with explicit connection ownership; registries and
multi-modal policies need a further concrete consumer before introducing contracts.
The [proposed public API](docs/en/design/public-api.md) maps the existing type-only modules;
[integration boundaries](docs/en/design/integration-boundaries.md) assign future host responsibilities
and identify unavailable upstream contracts without promising compatibility.
The [implementation handover](docs/en/design/implementation-handover.md) maps static evidence to
the runtime and host regressions still required, and defines declaration reconciliation.
Repository verification checks contributor configuration, design types and formatting. There is no component
runtime implementation, product package, product build or runtime test suite yet.

## Development

Use the Node version in [.node-version](.node-version) and the package manager pinned in
[package.json](package.json):

```sh
pnpm install --frozen-lockfile
pnpm run verify
```

The [tooling guide](docs/en/tooling/index.md) owns commands, prerequisites and verification coverage.

## Documentation

- [Documentation home](docs/en/index.md): canonical guides and subject ownership.
- [Project](docs/en/project/index.md): current scope, shared-rule adoption and contribution.
- [Foundation design](docs/en/design/index.md): selected cases, private prototypes, responsibilities and coordination decisions.
- [Repository tooling](docs/en/tooling/index.md): contributor infrastructure, current checks and limits.
- [Repository automation](docs/en/tooling/automation/index.md): CI, Discord configuration and execution evidence.
- [Garden product direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md): ecosystem responsibility and optional integrations.
- [Shared engineering rules](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md): applicable Garden conventions.

## Licence

Software and documentation follow [ISC](LICENSE).
