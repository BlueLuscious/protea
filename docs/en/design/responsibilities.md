# Design Responsibilities

Status: **Portable dependency boundaries; capability implementation and families pending**

This map distinguishes responsibilities in the [vocabulary](vocabulary.md), following Garden's
[Protea direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md)
and [ecosystem](https://github.com/BlueLuscious/garden/blob/master/docs/en/ecosystem.md).
It selects no mandatory class hierarchy or additional package.

| Responsibility | Owner and boundary |
| --- | --- |
| Component foundation | [Production component guide](../packages/core/component/index.md): identity, one logical lifetime, finalisation and explicit resource ownership. |
| Reusable capability | [Legacy capability specification](reusable-capabilities.md): narrow opening/activation semantics; production construction and teardown remain pending. |
| Family and variant | [Component direction](../project/component-direction.md): purpose, justified differences, parts and ownership. Original families precede variants. |
| Coordination | Application or justified family policy using public operations. No registry, manager, modal stack or global service is currently selected. |
| Host and optional provider | [Integration boundaries](../project/integration-boundaries.md): public contracts, concrete representation and separately qualified host effects. |

Contracts remain independent of concrete runtime implementations. A foundation must not import
family, capability-specific, manager, presentation or host consumers to accommodate their needs.
A capability may consume a common lifetime/resource contract when its actual ownership requires it;
that does not create a universal capability base or a second component lifetime.

A family chooses capabilities by responsibility rather than by shared naming. Sidebar's floating
presentation and static state/interaction may be independent axes; no inherited opening surface
is implied. A manager, if later justified, owns membership or lookup without gaining state or
disposal authority. Family coordination such as overlapping-modal focus needs its own policy.

Every composition must state what is owned, copied, borrowed, retained or exposed and who releases
its connections. Source-owned registration storage and consumer-owned release obligations are
different. Optional integrations cannot reverse dependencies into foundational products. Concrete
placement and future extension APIs must follow demonstrated consumers, not this conceptual map.
