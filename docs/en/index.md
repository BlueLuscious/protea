# Protea Documentation

English under `docs/en/` is canonical. Future translations should preserve its relative structure.

## Guides and ownership

| Guide | Responsibility |
| --- | --- |
| [Packages](packages/index.md) | Actual package set, current API responsibilities and parallel feature guides. |
| [Project](project/index.md) | Product direction, shared-rule adoption, contribution and ownership. |
| [Legacy capabilities](design/index.md) | Retained opening/activation prototypes and their pending production decisions. |
| [Repository tooling](tooling/index.md) | Contributor environment, actual commands, output ownership and checking limits. |
| [Repository automation](tooling/automation/index.md) | CI orchestration and Discord execution/receipt boundaries. |

The [repository introduction](../../README.md) summarises current source. The private
[core package](packages/core/index.md) provides the component scope factory, lifetime and cleanup
runtime with production contracts and generated declarations. Its
[component guide](packages/core/component/index.md) owns creation, logical lifetime and explicit
cleanup registration. Capability and concrete family runtime remain pending.

[Component direction](project/component-direction.md) records deferred original families,
reopened Sidebar axes and capability-lifetime questions. [Integration boundaries](project/integration-boundaries.md)
own future hosts and optional providers. Neither is a second API catalogue or a compatibility claim.
Software and documentation follow the repository's [ISC licence](../../LICENSE).
