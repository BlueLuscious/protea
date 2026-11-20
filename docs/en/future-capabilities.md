# Future Capabilities

Status: **Design direction and conditional proposals; no implementation commitment for deferred work**

This document records prospective work and the evidence needed to reconsider it. Accepted design
direction is distinct from implemented contracts, package availability and publication. The
[package guides](packages/index.md) own the actual source; proposals here do not add runtime APIs.

The [Core](packages/core/index.md) and [Components](packages/components/index.md) guides own
the implemented package boundary. The [Modal](packages/components/components/modal/index.md)
and [Sidebar](packages/components/components/sidebar/index.md) guides own their remaining runtime
work. Family defaults need a demonstrated consumer.

## Conditional and deferred work

Importance follows the distinction used by Aster's
[future-capabilities guide](https://github.com/BlueLuscious/aster/blob/master/docs/en/future-capabilities.md):
`P2` is conditional on a demonstrated consumer or measured need, and `P4` is deferred without a
current delivery commitment. Importance does not establish implementation order.

| Importance | Opportunity | Evidence needed |
| --- | --- | --- |
| `P2` | Resolve component definitions by logical identity. | A consumer needs to select a definition by name and optional namespace. Its lookup scope and handling of duplicate identities can be defined. |
| `P2` | Identify component instances outside their in-memory references. | A consumer needs to correlate the same instance across a boundary where its object reference is unavailable. |
| `P2` | Inspect shared descriptive metadata on component definitions. | A consumer such as a catalogue or authoring tool needs specific descriptive fields across multiple definitions. |
| `P2` | Shared application state across independent components. | Two real controls need to observe and request changes to the same application-owned state. |
| `P2` | Responsive representation or control replacement. | A concrete host needs different controls at different breakpoints while preserving application state and correct interaction semantics. |
| `P4` | Conversion between component families. | A case cannot reasonably be served by representation changes, composition or replacement. |
| `P2` | Independent capability distribution. | Consumers need capabilities independently of the family catalogue and an actual dependency, loading, support or release requirement justifies extraction. |
| `P2` | Independent capability retirement and replacement. | A family needs to end one capability while retaining its own lifetime. |
| `P4` | Framework adapters, Icon/Aster and motion integrations. | Stable public contracts and one supported host/provider scenario exist. |
| `P2` | Shared development tooling. | Common mechanisms can serve the observed repositories while their product policies remain separate. |

## Shared application state

A future mobile Switch and desktop Button could both operate on an application-owned theme.
Each model would retain its own identity, lifetime, operational state and subscriptions. A shared
authority would own the theme; both controls would request changes and observe the resulting
state. Sharing a component definition alone would not synchronise instances.

The current Button represents a discrete action; it has no checked or theme state. A future Switch
would need its own state semantics. The Button's presentation could reflect the theme through its
host without pretending that activation is persistent selection.

Review ownership, initial reads, effective changes, update ordering, feedback loops and connection
cleanup before choosing a public binding contract. Borrowing a shared source must not transfer
authority to dispose it. This proposal creates no theme store, generic state engine or automatic
binding in Core. Existing opening authority remains governed by the
[opening contract](packages/components/capabilities/openable/index.md).

## Responsive representation and family conversion

Changing the presentation of one semantic model and substituting one family for another are
different operations. A host may be able to change representation alone. Different controls may
instead remain independent while observing the same application state.

Conversion between families is a separate, deferred possibility. Before offering it, define
compatible source/target contracts, identity, definition association, transferable state, retained
references, subscriptions, resource ownership and failed-conversion behaviour. A Button becoming
a Switch must not imply that their APIs, interaction or accessibility obligations are interchangeable.
No current conversion operation or compatibility matrix is promised.

## Independent capability distribution

The Components package keeps capabilities separate from family implementations,
depending on the public Core foundation. Requiring a Components import is not by itself evidence
that another distribution is needed.

Reconsider extraction when consumers genuinely need capabilities without the catalogue and the
current boundary imposes a demonstrated cost or incompatible dependency, environment or release
requirement. Qualify package dependencies, declarations, builds and fresh package consumers before
claiming an independent package. Extraction alone establishes no bundle-size or performance gain.

## Existing proposal owners

The following subjects retain their narrower authorities rather than duplicate their protocols here:

- [Independent capability lifetime and replacement](project/component-direction.md#capability-lifetime-and-replacement)
  owns the future Modal example and the unresolved retirement guarantees.
- [Connections, parts and coordination](project/component-direction.md#connections-parts-and-coordination)
  owns future shared controls and justified manager/lookup responsibilities.
- [Integration boundaries](project/integration-boundaries.md) owns optional framework hosts,
  a possible Protea Icon component, Aster and motion. Definitions may be creation inputs to an
  adapter; interactive integration still needs a live model and explicit lifetime ownership.
- [Tooling reuse](tooling/reuse.md#extraction-conditions) owns observed Aster/Protea duplication and
  conditions for a future development-only dependency, including any agreed lint/format presets.

Before promoting an opportunity to implementation, define its owner, public surface, dependencies,
ownership and applicable verification. Move implemented guarantees to their package or tooling
owner and keep this document limited to remaining prospective work.
