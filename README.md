# Protea

Protea is Garden's standalone UI component library project. It aims to provide reusable
component behaviour, accessibility and composition with optional presentation and integrations.

## Current status

The private [Core package](docs/en/packages/core/index.md), `@luscious-garden/protea-core`,
provides definition-based construction, independent lifetimes and cleanup. Use `Component.define`
and `Component.create` to build your own component types. See the
[Core API guide](docs/en/packages/core/api/index.md#usage).

The private [Components package](docs/en/packages/components/index.md),
`@luscious-garden/protea-components`, uses Core to provide built-in component families and
[reusable capabilities](docs/en/packages/components/capabilities/index.md). `Button.create()`
supplies independent instances with observable availability and activation.
[`Modal.create(options)`](docs/en/packages/components/components/modal/index.md) constructs a dialogue
model with explicit opening authority.
[`Sidebar.create(options)`](docs/en/packages/components/components/sidebar/index.md) constructs
a lateral region model with changeable logical presence.
[`Switch.create(options)`](docs/en/packages/components/components/switch/index.md) constructs
a two-state model with local checked state or an application-owned authority.
The [local web example](examples/web/README.md) connects Button, Modal, Sidebar and Switch to native HTML.
The [integration guide](docs/en/project/integration-boundaries.md) describes host responsibilities
and prospective adapters.

Repository verification covers focused lint, strict production types, manifest/configuration
formatting, bounded builds, public runtime regressions and fresh package consumers. Component
and capability evidence establishes no accessible host interaction or framework compatibility.
Both packages build ES2022 ESM with declarations and remain private and unpublished.

## Development

Use the Node version in [.node-version](.node-version) and the package manager pinned in
[package.json](package.json):

```sh
pnpm install --frozen-lockfile
pnpm run verify
```

The [tooling guide](docs/en/tooling/index.md) owns actual commands, prerequisites and coverage.
Verification builds isolated candidates and uses owned temporary directories.

## Documentation

- [Documentation home](docs/en/index.md): canonical guides and subject ownership.
- [Packages](docs/en/packages/index.md): actual package set and current capabilities.
- [Project](docs/en/project/index.md): product direction, shared rules and contribution.
- [Repository tooling](docs/en/tooling/index.md): contributor infrastructure and checking limits.
- [Repository automation](docs/en/tooling/automation/index.md): CI and Discord configuration.
- [Garden product direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md): ecosystem responsibility and optional integrations.
- [Shared engineering rules](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md): applicable Garden conventions.

## Licence

Software and documentation follow [ISC](LICENSE).
