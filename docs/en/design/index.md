# Foundation Design

Status: **Scope and terminology selected; component declarations and runtime not implemented**

This guide owns the current foundation-design scope and representative cases. The
[vocabulary](vocabulary.md) defines its concepts; the [responsibility map](responsibilities.md)
assigns their roles and permitted dependencies. The [project guide](../project/index.md) owns
Protea's overall product scope and shared-rule adoption.

Protea remains a standalone UI component library. A portable foundation supports that product;
it does not define a mandatory framework, rendering system or class hierarchy. Garden's
[Protea direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md)
and [ecosystem](https://github.com/BlueLuscious/garden/blob/master/docs/en/ecosystem.md) own the
accepted product relationships. This design introduces no exception to those boundaries.

## Purpose and current evidence

The design will define a small set of component responsibilities and what their public operations
promise before implementing behaviour. Its eventual evidence will combine semantic specifications,
declaration prototypes and non-executed consumption examples checked by TypeScript.

Currently, only scope, vocabulary, responsibilities and authoring ownership are selected. There
are no component signatures, declaration prototypes, type examples, type-check command or
implemented components. Repository lint and formatting inspect contributor configuration and
authored prose; they demonstrate no component behaviour or API conformance.

## Representative cases

The following cases are design constraints and questions, not implemented user journeys or accepted
component classes. A declaration must eventually express their justified responsibilities without
forcing unrelated operations on every component.

### Activating a control

Use a button-like control to examine the minimum meaning of requesting an action. Determine what
the consumer may request and observe, who authorises the action and who owns any resources. Do not
assume activation creates persistent selection, pressed or opening state.

This case tests whether a simple interactive component can use the foundation without gaining
opening methods, mandatory manager registration or rendering concerns. Browser gestures, event
listeners, keyboard handling and visual feedback remain host/runtime work; their required semantics
must be identified before such implementation is claimed.

### Opening a sidebar

Use a floating sidebar to examine logical opening independently of its trigger and presentation.
Its eventual contract must resolve request/result meaning, state authority, observation and
lifecycle. Logical openness must not require animation completion or a framework runtime.

Contrast it with a sidebar that is permanently visible in this scenario. That static case must
not acquire artificial opening/closing operations merely to satisfy a family relationship. The
contrast challenges shared capability composition and substitution; it does not select a parent
class or require all sidebar variants to expose the same surface.

### Opening a modal

Use a modal to challenge reuse of an opening capability under different family constraints.
Distinguish the control requesting an operation from the target component and any application
state owner. Compare independent instances without placing their state in a global service.

Identify which accessibility and host responsibilities will be needed, including focus and
interaction boundaries, without implementing them. If coordination such as choosing a topmost
modal becomes necessary, justify its owner separately from generic lookup or membership. This
case does not itself require a manager, stack algorithm or singleton.

### Questions shared by the cases

For each retained operation, the later contract design must identify inputs, preconditions,
request authority, effective state, result and notification meaning, repeated or rejected requests,
and use after finalisation where relevant. These outcomes remain unresolved; a type name or method
signature alone will not settle them.

Ownership must distinguish retained values, borrowed collaborators and resources requiring cleanup.
Model identity and lifetime must remain distinct from future representation identifiers and DOM
mounting. The design must identify which information is portable and which effects require a host.

## Scope limits

The cases cover enough variety to challenge a minimum foundation, shared capabilities, families,
parts and optional coordination. They do not establish the complete component catalogue, a visual
system, tokens, themes or all possible interaction models.

The current design excludes executable transitions, registries, listeners, DOM manipulation,
focus algorithms, renderers and functional adapters. No empty methods, throwing stubs or fake
runtime components are used as design evidence. Icons, motion and presentation remain optional
and cannot become incidental dependencies of the foundation.

`BaseComponent`, `Openable`, `Activatable`, `Pressable` and component/manager class names remain
provisional. `protea-core` is a working subject, not a package name, installed entrypoint or
distribution promise. Composition is a starting point for evaluation; inheritance requires a
real specialisation that preserves its consumer contract.

## Design artefacts and authority

| Artefact                                  | Owner and boundary                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Scope and representative cases            | This guide; they constrain the design without declaring a component API.                                            |
| Concept definitions                       | The vocabulary; names identify responsibilities rather than mandatory types or classes.                             |
| Responsibilities and dependency direction | The responsibility map; concrete collaboration and public signatures remain to be designed.                         |
| Future signatures                         | Private declaration prototypes in the design workspace; they will describe an intended API without implementing it. |
| Future operation semantics                | Canonical documentation under this design guide, linked from the declarations at the narrowest actual owner.        |
| Private workspace and checks              | The repository tooling guide owns paths, configuration, commands and actual coverage.                               |

The private [design workspace](../../../design/README.md) currently contains its introduction only.
[Design authoring](../tooling/index.md#design-authoring) records the selected future source layout
and the work required before a real type check can be introduced. No public package, workspace
member, export map, build output or ambient host dependency is created by choosing that space.

Declarations will own signatures; prose will own semantic explanations and restrictions. Do not
copy complete signatures across several guides. When implementation later generates declarations,
compare them with the reviewed design and retire or re-scope the prototypes so there is one
current signature authority.

## Decision status and naming

Treat the cases, vocabulary, responsibility boundaries and private workspace as the selected
design basis. Treat API names, identity/lifecycle surfaces, state-control models, concrete types,
class relationships and module exports as provisional until their actual contract design resolves
them. A deferred decision must identify its owner and the case needed to resolve it; it must not
be hidden by a placeholder implementation or presented as a product guarantee.

Apply Garden's [TypeScript/JavaScript profile](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#typescript-and-javascript-profile)
when actual symbols and files are introduced. A private experimental workspace can describe a
candidate public API; workspace privacy does not make every consumer-facing interface an internal
implementation interface. Concrete filenames and declaration forms follow the responsibility of
the real symbol, not a catalogue of names invented in advance.

No opening, activation, identity, lifecycle or manager contract is accepted by this scope alone.
There is no framework/browser compatibility, accessible-interaction or publication claim. Static
evidence will cover type relationships; transitions, actual instance isolation, notification
ordering, cleanup, accessibility and host integration will require their own later evidence.
