# Future Capabilities

Status: **Design direction and conditional proposals; no implementation commitment for deferred work**

This document records prospective work and the evidence needed to reconsider it. Accepted design
direction is distinct from implemented contracts, package availability and publication. The
[package guides](packages/index.md) own the actual source; proposals here do not add runtime APIs.

The [Core](packages/core/index.md) and [Components](packages/components/index.md) guides own
the implemented package boundary. The [Sidebar guide](packages/components/components/sidebar/index.md)
describes its changeable-presence model and the future decisions for permanent presence. Family
defaults need a demonstrated consumer.

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
| `P2` | General shared-state integration across independent components. | A consumer needs an integration beyond the existing synchronous checked-state authority and demonstrates the required state, timing and ownership. |
| `P2` | Responsive representation or control replacement. | A concrete host needs different controls at different breakpoints while preserving application state and correct interaction semantics. |
| `P4` | Conversion between component families. | A case cannot reasonably be served by representation changes, composition or replacement. |
| `P2` | Independent capability distribution. | Consumers need capabilities independently of the family catalogue and an actual dependency, loading, support or release requirement justifies extraction. |
| `P2` | Independent capability retirement and replacement. | A family needs to end one capability while retaining its own lifetime. |
| `P4` | Framework adapters, Icon/Aster and motion integrations. | Stable public contracts and one supported host/provider scenario exist. |
| `P2` | Shared development tooling. | Common mechanisms can serve the observed repositories while their product policies remain separate. |

## Component catalogue and loading

A metadata-only catalogue manifest is conditional on a consumer that needs to enumerate families,
such as an editor or authoring tool. Define the fields needed for discovery and derive them from
their canonical owners. A component definition includes an executable recipe, so discovery should
be able to read the selected metadata without evaluating those recipes.

Consider deferred loaders when a consumer needs to select a definition at runtime. Specify identity
resolution, absence and loading failures, and verify that a successful load returns the same
definition as the supported static import. Consider generating entry modules or catalogue projections
when maintaining them by hand produces repeated edits or drift. Keep one authoring source and verify
its projections against the packed package.

## Shared application state

The [Switch guide](packages/components/components/switch/index.md#checked-state-and-collaboration)
owns the current composition. An application supplies the checked-state authority and can connect
Button activation to that same authority. Each model retains its own lifetime.

A future responsive host could present a mobile Switch and a desktop Button for one theme
preference. The host can project the effective preference independently of which control sends the
request. A generic state engine or binding needs a concrete case beyond checked state. Review
initial reads, update ordering, feedback loops and cleanup at the owner of that integration.

Start theme coordination with an application-owned example. Consider a reusable Theme Manager API
when an independent consumer needs the same preference, effective-theme and observation semantics.
That consumer should help establish which state is portable, who supplies the system preference
and who owns host projection and connection cleanup.

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
  owns the example of replacing Modal's opening capability and the unresolved retirement guarantees.
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
