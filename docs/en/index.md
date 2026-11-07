# Protea Documentation

English under `docs/en/` is the canonical documentation locale. Future translations should preserve
the same relative structure.

## Guides and ownership

| Guide                                                | Responsibility                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Project](project/index.md)                          | Current product scope, shared-rule adoption, contribution and ownership.             |
| [Foundation design](design/index.md)                 | Selected design scope, vocabulary, responsibility boundaries and artefact ownership. |
| [Repository tooling](tooling/index.md)               | Contributor infrastructure, selected baseline, current verification and its limits.  |
| [Repository automation](tooling/automation/index.md) | CI orchestration, Discord configuration and execution/receipt boundaries.            |

The [repository introduction](../../README.md) summarises the current state. The project guide links
Garden's ecosystem authorities. The private [component foundation](design/component-foundation.md)
specifies the minimum lifetime contract; [reusable capabilities](design/reusable-capabilities.md)
own opening, activation and state-authority semantics. [Representative families](design/representative-families.md)
own the button, sidebar and modal pilots and their part composition.
[Component coordination](design/component-coordination.md) owns direct-reference collaboration,
connection responsibilities and the reasons for deferring registries and multi-modal policy.
The [proposed public API](design/public-api.md) maps declaration and semantic owners;
[integration boundaries](design/integration-boundaries.md) own future host requirements and
the limits of optional integrations.
These remain private prototypes; no shipping
package API or integration support matrix is established yet.

Software and documentation follow the repository's [ISC licence](../../LICENSE).
