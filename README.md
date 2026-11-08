# Protea

Protea is Garden's standalone UI component library project. It aims to provide reusable
component behaviour, accessibility and composition with optional presentation and integrations.

## Current status

The private [core package](docs/en/packages/core/index.md), `@luscious-garden/protea-core`,
implements portable component lifetime, cleanup ownership, logical opening and activation.
It builds ESM JavaScript and declarations with one public package root.

The [component guide](docs/en/packages/core/component/index.md) owns lifetime and finalisation.
[Reusable capabilities](docs/en/packages/core/capabilities/index.md) share that lifetime while
keeping state and listeners independent. Opening supports internal state or a borrowed synchronous
authority; activation represents an accepted action. Named immutable vocabularies own lifecycle,
request statuses and rejection reasons.

Button, Sidebar and Modal remain [future original families](docs/en/project/component-direction.md).
The static/floating Sidebar classification is reopened. Optional hosts, Icon/Aster and motion
remain [future integrations](docs/en/project/integration-boundaries.md), without mandatory
runtime dependencies or support claims.

Repository verification covers focused lint, strict production types, manifest/configuration
formatting, bounded builds, public runtime regressions and fresh package consumers. Component
and capability evidence establishes no accessible host interaction or framework compatibility.
The initial package remains private and unpublished.

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
