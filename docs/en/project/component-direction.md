# Component Direction

Status: **Portable Button, Modal, Select, Sidebar, Switch, Tabs and capability runtimes**

Protea develops original component families before selecting variants. Its
[family modules](../packages/components/components/index.md) live in Components. The package
consumes public Core contracts for definition-based creation and lifetime.
Shared family implementation still needs concrete state, behaviour and consumers before a common
layer is chosen.

## Families and independent axes

A [Button](../packages/components/components/button/index.md) combines owned lifetime, observable
application-set availability and discrete activation. The reviewed
[contract-led workflow](../packages/components/components/index.md#contract-led-development) maps
these requirements to `ComponentInstance`, `Activatable` and family-owned availability.
`Button.create()` delegates to Core with its incorporated definition.
[Modal](../packages/components/components/modal/index.md) combines owned lifetime with logical
opening and delegates construction to Core with its prepared definition.
[Select](../packages/components/components/select/index.md) captures a fixed set of ordered options
and observes one selected value from a synchronous application-owned authority.
[Sidebar](../packages/components/components/sidebar/index.md) combines owned lifetime and
changeable logical presence through its prepared definition. Persistent pressed or selected
state would require its own family case and contract.

[Switch](../packages/components/components/switch/index.md) combines owned lifetime with a
checked value retained between requests. Its Checking capability uses local state or borrows an
application-owned authority, so separate instances can act on the same effective preference.

[Tabs](../packages/components/components/tabs/index.md) owns one local choice from fixed captured
tab records. Each record associates a logical tab key with a logical panel key. The host supplies
the content and interaction, while application routing retains its own authority.

The initial Sidebar family selects changeable logical presence. Opening and closing work with
fixed or floating positioning. A host selects rendered visibility, layout and interaction policies
independently. A permanently present region needs its own capability and construction decision.
See the [Sidebar axes](../packages/components/components/sidebar/index.md#supported-cases-and-independent-axes).

Presentation choices such as Default, Minimal or Glass likewise do not justify behavioural
classes by their names. The conceptual foundation, family, variant and presentation progression
in [Garden's direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#responsibility)
does not mandate implementation inheritance.

## Vocabulary and responsibility

These concepts distinguish product responsibilities without requiring matching classes or packages:

| Concept | Meaning and owner |
| --- | --- |
| Component | An individual model with a defined purpose and contract; the [foundation](../packages/core/component/index.md) owns identity and lifetime. |
| Family and variant | Related purposes and justified behavioural/structural differences; their actual component owner selects obligations and composition. |
| Capability | A narrow reusable behaviour. The [capability guides](../packages/components/capabilities/index.md) own activation, opening, checking and their resource boundaries. |
| Behaviour and controller | Behaviour is promised observable meaning. A controller is a possible implementation mechanism needing real responsibility, state and consumers; the two terms do not require parallel abstractions. |
| Manager and coordination | A manager may own justified scoped membership/lookup. Family/application coordination policy uses public operations; neither automatically owns member state or lifetime. |
| Part | A composition role with explicitly selected representation, retention, borrowing, replacement and cleanup. |
| Configuration and state | Configuration supplies creation/use inputs; state is an authoritative condition with its own owner and observation rules. Neither implies a universal options object or state store. |
| Presentation | Optional visual expression distinct from behavioural identity, with concrete [integration responsibilities](integration-boundaries.md). |
| Contract and API | A contract defines semantic obligations and limits; API names/types express the consumable surface owned by production source and generated declarations. |
| Request and effective change | Asking an owner for work is distinct from authorisation, commitment and any subsequent visual completion. |

Contracts remain independent of concrete implementation classes. Capabilities consume the
component lifetime and resource boundary. The construction feature depends only on that
foundation. Families choose capabilities according to the responsibilities they need. Optional
hosts consume public model and host contracts without introducing reverse dependencies.

Every composition identifies what is owned, copied, borrowed, retained or exposed. Registration
storage and release obligations are distinct. Type compatibility alone proves no synchrony,
ownership, cleanup or accessible interaction; implementations and host evidence qualify those
guarantees at their actual owners.

## Construction and extension

A definition supplies the identity and recipe of a reusable component type. Each creation
establishes an independent model lifetime. Its recipe validates the options, initialises
model-owned state and connects to any explicitly supplied collaborators. The author specifies
which values the recipe captures, which collaborators it borrows, who releases each acquired
resource and which single authority owns each logical state. Shared definition metadata or
defaults need a demonstrated use and rules for validation and application. See the
[Core construction runtime](../packages/core/component/runtime/index.md#setup-and-options) and
the [family contracts](../packages/components/components/index.md#construction-contracts-and-factories).

Keep model inputs portable. Supply host elements, templates, styles and motion at the
[integration boundary](integration-boundaries.md#presentation-and-motion). Compose extensions
through public operations and observations, preserving the model's identity, results and
ownership. When a concrete case needs a new guard or observation, name it for the operation
or fact it exposes. Define what it may veto or observe, when it runs, and how it handles
reentrancy, errors and release.

## Capability lifetime and replacement

The current [foundation](../packages/core/component/index.md) supplies one terminal component
lifetime and explicit cleanup registration. [Capabilities](../packages/components/capabilities/index.md)
borrow that fixed scope. Capabilities sharing a scope retain independent state and listeners.
Independent capability teardown and replacement remain deferred. `ComponentLifetime` and
`ComponentScope` retain distinct consumer and resource-owner roles. `ComponentInstance`
adds the definition association for models created by the new Core runtime. See the
[component foundation](../packages/core/component/index.md#identity-and-lifetime).

Consider replacing a Modal's opening capability while the Modal remains alive. Closing it changes
logical openness. Disposing the Modal ends its model lifetime.
Destroying or replacing just its opening capability would be a third responsibility. That case
must answer who authorises replacement, how old subscriptions and source connections are released,
what retained references observe or reject, and how independent retirement would preserve the
existing parent's terminal guarantees. A dangling reference must not silently act on a replacement
or revive retired work.

That future extension must also decide how early release interacts with registered parent cleanup, failed
physical disconnection, repeated teardown, in-flight callbacks and terminal state projection.
The current `addCleanup` contract does not remove or transfer entries and introduces no capability
destruction method, rebinding operation or capability registry. These questions must be resolved
at the capability/family owner before such support is claimed; no implementation or signature is
introduced by this example.

## Connections, parts and coordination

A triggering control and its target are separate models. A composition requests the target's
public operation, keeps the activation outcome distinct from that target's outcome,
and identifies who owns each acquired connection. A source storing a registration does not acquire
the consumer's lifetime; a consumer holding an unsubscribe obligation does not own the source.
Target disposal cannot automatically remove application-owned registrations on other sources.

A family may justify a borrowed part such as a closing control. It must specify multiplicity,
retention, replacement, ownership, failed setup and behaviour after either participant ends.
The application owns the closing control and the closing connection in the
[Button and Modal example](../packages/components/components/modal/index.md#collaboration-and-finalisation).
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
