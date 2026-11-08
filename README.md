# Protea

Protea is Garden's standalone UI component library project. It aims to provide reusable
component behaviour, accessibility and composition with optional presentation and integrations.

## Current status

The repository contains its first private [core package](docs/en/packages/core/index.md),
`@luscious-garden/protea-core`. Its `componentScopeFactory.create()` creates an independent
component lifetime with explicit cleanup registration. Finalisation becomes terminal before
release callbacks and attempts every owned release. The package builds ESM JavaScript and
declarations; opening and activation runtime remain pending.

The [component guide](docs/en/packages/core/component/index.md) owns identity, logical lifetime
and cleanup semantics. Opening and activation remain [legacy design inputs](docs/en/design/index.md)
with non-executed type examples. Their production construction and independent teardown need
further capability decisions.

Button, Sidebar and Modal are [future original families](docs/en/project/component-direction.md).
The earlier static/floating Sidebar classification is reopened. Optional hosts, Icon/Aster and
motion remain [future integrations](docs/en/project/integration-boundaries.md), without runtime
dependencies or support claims.

Repository verification covers focused lint, production and legacy types, manifest/configuration
formatting, bounded build behaviour, lifecycle runtime and fresh package consumers. Lifetime
evidence is separate from capability, host and accessibility qualification. The package is private
and has not been published.

## Development

Use the Node version in [.node-version](.node-version) and the package manager pinned in
[package.json](package.json):

```sh
pnpm install --frozen-lockfile
pnpm run verify
```

The [tooling guide](docs/en/tooling/index.md) owns actual commands, prerequisites and coverage.
Verification includes tests which build isolated candidates and use owned temporary directories.

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
