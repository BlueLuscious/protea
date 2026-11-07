# Foundation Design

Status: **Private contract design and implementation handover specified; runtime not implemented**

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

The design defines a small set of component responsibilities and what their public operations
promise before implementing behaviour. The [component foundation](component-foundation.md) now
specifies reference identity, logical lifetime and disposal. [Reusable capabilities](reusable-capabilities.md)
specify logical opening, activation, authority and observation. Their private type prototypes and
non-executed consumption examples are checked by TypeScript. [Representative families](representative-families.md)
now test their composition through button, sidebar and modal contracts, creation declarations and
a borrowed closing control.
[Component coordination](component-coordination.md) assesses discovery and coordination needs,
retaining direct references and explicit connection ownership without adding a manager contract.
The [proposed public API](public-api.md) maps the existing consumer surface and extension boundaries.
[Integration boundaries](integration-boundaries.md) assign future host responsibilities and record
unavailable upstream contracts without adding an adapter.
The [implementation handover](implementation-handover.md) maps each evidence category to the
runtime and host checks still required and defines how implementation-generated declarations
will replace the prototype signature authority.

Scope, vocabulary, responsibilities, minimum lifetime, reusable capabilities and representative
family contracts are selected for this experimental design. Repository verification checks actual type relationships, contributor
configuration and formatting. It demonstrates no component behaviour, resource cleanup or runtime
implementation conformance.

## Representative cases

The following cases are design constraints, with their selected pilot surfaces owned by the
representative-family guide. They are not implemented user journeys or mandatory component classes.
A declaration must express their justified responsibilities without
forcing unrelated operations on every component.

### Activating a control

Use a button-like control to examine the minimum meaning of requesting an action. The selected
activation contract defines the request and observations without persistent selection, pressed or
opening state. The button pilot combines that capability with component lifetime and needs no
separate model parts.

This case tests whether a simple interactive component can use the foundation without gaining
opening methods, mandatory manager registration or rendering concerns. Browser gestures, event
listeners, keyboard handling and visual feedback remain host/runtime work; their required semantics
must be identified before such implementation is claimed.

### Opening a sidebar

Use a floating sidebar to examine logical opening independently of its trigger and presentation.
The selected opening contract resolves request/result meaning, state authority, observation and
lifetime limits. Logical openness does not require animation completion or a framework runtime;
the family guide now selects its static/floating contrast and composition boundaries.

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

For each retained operation, its contract must identify inputs, preconditions, request authority,
effective state, result and notification meaning, repeated or rejected requests and use after
finalisation. The reusable-capability guide selects those rules for opening and activation;
future capabilities retain the same design obligation. Common lifetime and finalisation semantics
remain with the component foundation.

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

`Openable`, `Activatable` and the representative family surfaces are selected experimental
contracts. `Pressable` and `toggle` are deferred for lack of a current consumer. `BaseComponent` and component/manager class names remain
provisional. `protea-core` is a working subject, not a package name, installed entrypoint or
distribution promise. Composition is a starting point for evaluation; inheritance requires a
real specialisation that preserves its consumer contract.

## Design artefacts and authority

| Artefact                                  | Owner and boundary                                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Scope and representative cases            | This guide; they constrain the design without declaring a component API.                                                 |
| Concept definitions                       | The vocabulary; names identify responsibilities rather than mandatory types or classes.                                  |
| Responsibilities and dependency direction | The responsibility map; further concrete collaboration remains to be designed within those boundaries.                   |
| Prototype signatures                      | Private type declarations in the design workspace; they describe an intended API without implementing it.                |
| Component foundation semantics            | The component foundation guide, linked from its declarations; future capabilities retain their own semantic owners.      |
| Reusable capability semantics             | The reusable-capability guide owns opening, activation, authority and subscription rules.                                |
| Representative family semantics           | The representative-family guide owns pilot purposes, variants, part composition and creation ownership.                  |
| Coordination decisions                    | The coordination guide owns current collaboration, connection responsibilities and deferred discovery/policy candidates. |
| Proposed public surface                   | The public-API guide maps logical modules, existing names, declaration owners and deliberate extension boundaries.       |
| Integration boundaries                    | The integration guide owns future host responsibilities, optional product boundaries and unavailable upstream contracts. |
| Validation and implementation handover    | The handover owns evidence classification, required implementation regressions and declaration reconciliation.           |
| Private workspace and checks              | The repository tooling guide owns paths, configuration, commands and actual coverage.                                    |

The private [design workspace](../../../design/README.md) contains foundation, capability and family
contracts, declaration-only family creation, type-only entrypoints, non-executed examples and their
compiler configuration.
[Design authoring](../tooling/index.md#design-authoring) records the real inputs, commands and
coverage. No public package, workspace member, export map, build output or ambient host dependency
is created by this prototype.

Declarations own signatures; prose owns semantic explanations and restrictions. Do not
copy complete signatures across several guides. When implementation later generates declarations,
compare them with the reviewed design and retire or re-scope the prototypes so there is one
current signature authority.

## Decision status and naming

Treat the cases, vocabulary, responsibility boundaries and private workspace as the selected
design basis. The component foundation selects its minimum lifetime surface and reference identity
for this private prototype. The reusable-capability guide selects its two opening authority modes
and minimal activation semantics. The representative-family guide selects pilot surfaces, fixed
part borrowing and creation ownership. The coordination guide records why registry and multi-modal
policy candidates are deferred and what would justify revisiting them. The public-API and integration
guides consolidate the selected consumer boundaries and the obligations of prospective hosts.
Concrete host contracts, distribution and runtime conformance still need their own evidence.
These prototype choices are not a versioned public API
promise. A deferred decision must identify its owner and the case needed to resolve it; it must not
be hidden by a placeholder implementation or presented as a product guarantee.

Apply Garden's [TypeScript/JavaScript profile](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#typescript-and-javascript-profile)
when actual symbols and files are introduced. A private experimental workspace can describe a
candidate public API; workspace privacy does not make every consumer-facing interface an internal
implementation interface. Concrete filenames and declaration forms follow the responsibility of
the real symbol, not a catalogue of names invented in advance.

The separate component foundation, reusable-capability and representative-family guides own their
selected contracts; the coordination guide owns their collaboration assessment. No manager contract
is retained for the current pilots.
There is no framework/browser compatibility, accessible-interaction or publication claim. Static
evidence will cover type relationships; transitions, actual instance isolation, notification
ordering, cleanup, accessibility and host integration will require their own later evidence.
