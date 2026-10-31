# Protea

Protea is a UI component library project in Garden. It aims to provide reusable component
behaviour, accessibility and composition with optional presentation and framework integrations.

## Current status

The repository provides a private contributor toolchain, project documentation, shared-rule
adoption, an ISC licence and text hygiene configuration. Component contracts, runtime code and
product packages have not been introduced. Repository verification checks its current configuration
and documentation; there is no product build or runtime test suite yet.

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
- [Repository tooling](docs/en/tooling/index.md): contributor infrastructure, current checks and limits.
- [Garden product direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md): ecosystem responsibility and optional integrations.
- [Shared engineering rules](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md): applicable Garden conventions.

## Licence

Software and documentation follow [ISC](LICENSE).
