# Protea Documentation

English under `docs/en/` is canonical. Future translations should preserve its relative structure.

## Guides and ownership

| Guide | Responsibility |
| --- | --- |
| [Packages](packages/index.md) | Actual package set, current API responsibilities and parallel feature guides. |
| [Project](project/index.md) | Product direction, shared-rule adoption, contribution and ownership. |
| [Repository tooling](tooling/index.md) | Contributor environment, actual commands, output ownership and checking limits. |
| [Repository automation](tooling/automation/index.md) | CI orchestration and Discord execution/receipt boundaries. |

The [repository introduction](../../README.md) summarises current source. The private
[core package](packages/core/index.md) implements the component foundation and reusable opening
and activation, with production contracts and generated declarations.
The [component guide](packages/core/component/index.md) owns logical lifetime and cleanup;
[capability guides](packages/core/capabilities/index.md) own composition, requests, state authority,
outcomes and observations.

[Component direction](project/component-direction.md) records vocabulary, responsibilities,
deferred original families and reopened Sidebar axes. [Integration boundaries](project/integration-boundaries.md)
own future hosts and optional providers. Neither is a second API catalogue or a compatibility claim.
Software and documentation follow the repository's [ISC licence](../../LICENSE).
