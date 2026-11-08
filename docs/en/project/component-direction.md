# Component Direction

Status: **Original families and capability composition deferred; no family runtime or exports**

Protea will build original Button, Sidebar and Modal families before selecting variants. They
may later belong to the [core package](../packages/core/index.md); no separate component package,
mandatory hierarchy or catalogue is allocated here. Shared family implementation needs concrete
state, behaviour and consumers before composition or a base implementation is selected.

## Families and independent axes

A Button motivates a discrete action without implying persistent pressed or selected state.
A Modal motivates logical opening with additional host interaction and accessibility obligations.
Those scenarios guide later design without retaining ambient component factories as present APIs.

Sidebar must be designed as a family first. The previous StaticSidebar/FloatingSidebar pilot
is retired as a production classification: floating presentation and static state or interaction
may describe independent axes and may coexist. Whether Sidebar always has opening behaviour,
which distinctions justify variants and which remain presentation require that family's actual
use cases. No variant union or inherited opening obligation is selected here.

Presentation choices such as Default, Minimal or Glass likewise do not justify behavioural
classes by their names. The conceptual foundation, family, variant and presentation progression
in [Garden's direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#responsibility)
does not mandate implementation inheritance.

## Capability lifetime and replacement

The current [foundation](../packages/core/component/index.md) supplies one terminal component
lifetime and explicit cleanup registration. Opening and activation remain legacy specifications;
their production construction, placement and optional independent teardown require further review.
Component and ComponentScope retain their distinct consumer and
resource-owner roles; no definition/instance alias replaces them.

Consider a future Modal whose opening capability can be replaced while the Modal remains alive.
Closing it would change logical openness; disposing the Modal would end its model lifetime.
Destroying or replacing just its opening capability would be a third responsibility. That case
must answer who authorises replacement, how old subscriptions and source connections are released,
what retained references observe or reject, and whether parent finalisation also ends every child
capability. A dangling reference must not silently act on a replacement or revive retired work.

The design must also decide how early release interacts with registered parent cleanup, failed
physical disconnection, repeated teardown, in-flight callbacks and terminal state projection.
The current `addCleanup` contract does not remove or transfer entries and introduces no capability
destruction method, rebinding operation or capability registry. These questions must be resolved
at the capability/family owner before such support is claimed; no implementation or signature is
introduced by this example.

## Connections, parts and coordination

A triggering control and its target are separate models. A future composition should request
the target's public operation, keep the activation outcome distinct from that target's outcome,
and identify who owns each acquired connection. A source storing a registration does not acquire
the consumer's lifetime; a consumer holding an unsubscribe obligation does not own the source.
Target disposal cannot automatically remove application-owned registrations on other sources.

A family may justify a borrowed part such as a closing control. It must specify multiplicity,
retention, replacement, ownership, failed setup and behaviour after either participant ends.
The retired modal pilot supplied useful questions, not a fixed production `closeControl` API.
Shared controls would need explicit fan-out or exclusivity semantics rather than an inferred
topmost target. Failed physical release must not revive logically invalidated work.

Direct references and public operations are the starting point. A scoped manager, registry,
lookup address or factory-and-query surface needs a real discovery or membership consumer.
Registration does not itself confer disposal or state authority. Policies for overlapping modals,
focus, exclusivity or topmost selection need their own application/family/host responsibility;
generic lookup cannot supply those policies implicitly. No global singleton or empty manager
is selected.

## Host evidence

Future components must define accessible naming, supported input and dismissal, focus and
representation responsibilities with their concrete hosts. Button semantics and modal interaction
cannot be inferred from a portable type or a logical open boolean. A Sidebar's representation
must follow its eventual semantics without assuming a landmark, modal behaviour or positioning
from its family name. The [integration guide](integration-boundaries.md) owns optional host and
provider boundaries; these questions establish no accessibility or framework conformance.
