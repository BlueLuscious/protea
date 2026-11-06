# Design Responsibilities

Status: **Responsibility baseline with a private component foundation contract; runtime pending**

This guide maps the responsibilities named in the [vocabulary](vocabulary.md) within Protea's
bounded [design](index.md). It follows Garden's [Protea direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md)
and [ecosystem boundaries](https://github.com/BlueLuscious/garden/blob/master/docs/en/ecosystem.md).
The map describes conceptual ownership and permitted consumption, not an implemented module graph.

## Responsibility map

| Responsibility                         | Boundary                                                                                                                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Shared component foundation            | Owns reference identity, logical lifetime and finalisation in the [component foundation](component-foundation.md). It requires no universal configuration, event mechanism, opening, activation or manager registration. |
| Capability                             | Owns the meaning of one instance's supported behaviour and observations. Reuse must allow independent instances; concrete state authority, storage and implementation mechanisms are decided by its later contract.      |
| Family and variant                     | Own purpose-specific constraints, the meaningful differences between variants and required composition roles. They select suitable capabilities without making every related component support identical operations.     |
| Part composition                       | Identifies the participating roles and their relationships. Exact creation, borrowing, retention, replacement and cleanup responsibilities must be assigned by the owning component or family contract.                  |
| Optional manager                       | Owns justified scoped membership or lookup. That responsibility does not confer authority over component behaviour, state or resource lifetime; no global manager is required for basic component use.                   |
| Coordination policy                    | Belongs to the family or an explicit collaborator whose responsibility requires it. Generic membership does not acquire family policy; coordination consumes reviewed public requests and observations.                  |
| Future host adapter                    | Maps Protea's public contracts to the public contracts of a concrete host. Host-specific representation and effects stay at that integration boundary without redefining portable component semantics.                   |
| Optional presentation and integrations | Supply supported visual, icon or motion capabilities through explicit boundaries. Their absence must not make basic component behaviour depend on a mandatory style, icon system, animation system or framework.         |

A foundation is justified by actual common obligations rather than a desire for one universal
component shape. A permanently visible sidebar can challenge that shape without acquiring an
opening capability simply to belong to the same family as a floating sidebar. This is a design
constraint on abstraction, not an accepted component class or operation surface.

The capability owner defines behaviour for an instance; this does not preselect whether its
authoritative capability state belongs to the component or its application. A trigger, observer, manager
or coordinator must not create a second authority merely by interacting with that instance.
The supported control model and exact request/change relationship remain to be specified.

## Permitted dependency directions

Arrows below mean consumption of a relevant contract when the responsibility is retained.
They require no particular class, layer directory, package or independently instantiated object.
Contracts remain independent of concrete runtime implementation classes under Garden's
[layer boundary](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#layer-boundaries).

```text
family or variant       -> justified shared foundation and selected capability contracts
capability contract     -> justified shared foundation contracts
optional manager        -> public component contracts needed for membership or lookup
coordination policy     -> public capability contracts needed for requests and observations
future host adapter     -> Protea public contracts + host public contracts
optional integration    -> relevant public Protea and provider contracts
```

A capability consumes a common identity, lifecycle or ownership contract only when a real consumer
needs that responsibility. This permits justified reuse without requiring a universal capability
base. Foundation contracts must not depend on capability-specific contracts in return.

Shared foundation and capability contracts do not acquire dependencies on specific families,
managers, presentation or host implementations merely to support those consumers. A manager
may own its membership data without owning the behavioural state of its members. Family-specific
coordination, such as a possible modal ordering policy, needs its own justified owner instead
of becoming an implicit rule of generic membership.

A future Lilium adapter consumes public Protea and public Lilium contracts. Protea's foundation
remains independent of Lilium and must not depend on its implementation details. Lilium must not
import Protea. Other framework integrations retain the same direction. No host API, adapter
package, compatibility range or working integration is selected by this map.

Icons, motion and presentation remain optional integration responsibilities. Any retained use of
Aster must consume its public capability and must not introduce a reverse dependency from Aster
into Protea. Logical component changes and animation effects remain distinct responsibilities.

## Ownership and later decisions

Each retained contract must identify what is owned, copied, borrowed, retained or exposed and
who releases any resources it creates. Composition, membership, coordination and component
lifecycle are separate responsibilities; their exact ownership transfers and cleanup relationships
cannot be inferred from a family name, registration concept or implementation class.

This baseline settles the separation of responsibilities and dependency direction. The component
foundation selects common lifetime and disposal responsibilities. Later design must select actual
capabilities and family constraints, decide whether management is needed, and specify their state
authority, parts and cleanup relationships within that lifetime boundary. Further public names,
signatures, representation, inheritance and package boundaries remain provisional.
No runtime state store, registry, listener, transition or host effect is implemented here.
