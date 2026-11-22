# Protea Documentation

English under `docs/en/` is canonical. Future translations should preserve its relative structure.
Each package guide mirrors the authored feature roots under its package's `src/` directory.
Tooling feature guides follow the corresponding `tooling/` directories.

## Guides and ownership

| Guide | Responsibility |
| --- | --- |
| [Packages](packages/index.md) | Actual package set, current API responsibilities and parallel feature guides. |
| [Project](project/index.md) | Product direction, shared-rule adoption, contribution and ownership. |
| [Repository tooling](tooling/index.md) | Contributor environment, actual commands, output ownership and checking limits. |
| [Repository automation](tooling/automation/index.md) | CI orchestration and Discord execution/receipt boundaries. |
| [Future capabilities](future-capabilities.md) | Deferred capabilities and the evidence they need. |

The [repository introduction](../../README.md) summarises current source. The private
[core package](packages/core/index.md) implements definition-based construction, component
lifetime and cleanup, with production contracts and generated declarations.
The [Core API guide](packages/core/api/index.md) owns usage and exports.
The [component guide](packages/core/component/index.md) owns logical lifetime and cleanup.
[Components](packages/components/index.md) uses Core for its built-in families. Its
[capability guides](packages/components/capabilities/index.md) own composition, requests, state
authority, outcomes and observations. Its [families](packages/components/components/index.md)
own the reviewed development workflow and contracts.
[Button](packages/components/components/button/index.md) and
[Modal](packages/components/components/modal/index.md) have incorporated definitions and portable
runtimes. [Sidebar](packages/components/components/sidebar/index.md) remains type-only.
[Component direction](project/component-direction.md) records vocabulary, original-family boundaries
and independent Sidebar axes.
[Integration boundaries](project/integration-boundaries.md) own future hosts and optional providers.
Neither is a second API catalogue or a compatibility claim.
Software and documentation follow the repository's [ISC licence](../../LICENSE).
