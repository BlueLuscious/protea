# Proposed Public API

Status: **Private consumer surface consolidated; no executable or published API**

This is the retained prototype surface, not the selected production export list. The
[portable core scope](../project/core-foundation.md) selects a new construction owner and real
capability factories; the [package baseline](../tooling/core-package.md) selects one root entry.
Legacy family factories and Sidebar variants remain deferred and will be retired. Neither the
26 names below nor their type-only restrictions are a preservation quota for the core package.

This guide owns the proposed logical modules, consumer boundaries and extension surface of the
current design. The [declarations](../../../design/README.md) own signatures; the semantic guides
linked below own operation meaning, authority, ownership and failure rules. This map introduces
no new symbol or change to those contracts.

The seven feature-local `api/index.ts` files are experimental source consumption boundaries.
Their exports are all type-only. They are not package subpaths, an export map or installed module
identifiers. Their `.js` specifiers resolve to the private TypeScript declarations under the
current authoring configuration; they establish no executable JavaScript entrypoints or product
distribution target.

## Module and symbol owners

The linked entrypoints re-export each symbol from its declaration owner. Follow those declarations
for complete signatures and member documentation rather than maintaining copies in this guide.

| Logical module and source entrypoint                                       | Selected names                                                                                                                                            | Semantic owner                                                                                                                 |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [Component foundation](../../../design/component/api/index.ts)             | `Component`, `ComponentLifecycleType`                                                                                                                     | [Component foundation](component-foundation.md): reference identity, logical lifetime and disposal.                            |
| [Shared capability definitions](../../../design/capabilities/api/index.ts) | `CapabilityRejectionReasonType`, `CapabilityUnsubscribeType`                                                                                              | [Reusable capabilities](reusable-capabilities.md): the shared rejection vocabulary and registration release obligation.        |
| [Opening](../../../design/openable/api/index.ts)                           | `Openable`, `OpenStateAuthority`, `OpenableOptionsType`, `OpenableChangeType`, `OpenableResultType`, `OpenableResultStatusType`, `openableResultStatuses` | [Reusable capabilities](reusable-capabilities.md): logical opening, authority modes, outcomes and observations.                |
| [Activation](../../../design/activatable/api/index.ts)                     | `Activatable`, `ActivatableOptionsType`, `ActivatableResultType`, `ActivatableResultStatusType`, `activatableResultStatuses`                              | [Reusable capabilities](reusable-capabilities.md): action acceptance, eligibility, outcomes and observations.                  |
| [Button](../../../design/button/api/index.ts)                              | `Button`, `buttonFactory`                                                                                                                                 | [Representative families](representative-families.md): the minimum action control and its creation ownership.                  |
| [Sidebar](../../../design/sidebar/api/index.ts)                            | `StaticSidebar`, `FloatingSidebar`, `SidebarType`, `staticSidebarFactory`, `floatingSidebarFactory`                                                       | [Representative families](representative-families.md): static/floating discrimination, capability selection and creation.      |
| [Modal](../../../design/modal/api/index.ts)                                | `Modal`, `ModalOptionsType`, `modalFactory`                                                                                                               | [Representative families](representative-families.md): logical modal interaction, fixed borrowed closing control and creation. |

These 26 names describe eight structural interfaces, twelve type aliases and six ambient value
descriptors. The latter describe four future factory objects and two named result vocabularies;
their type-only exports allow type queries without supplying those values. A declaration-only
factory reference in an example is not a runtime factory import. Consumers cannot execute these
prototypes or obtain component constructors from them.

The capability-level definitions have two real consumers and retain only their common rejection
and unsubscribe meanings. Each capability owns its result vocabulary and result discrimination.
Family factories retain their own inputs and `create` result; no common options object, generic
factory, registry or additional facade is needed by the selected consumers.

## Consumer and extension boundaries

Consumers should depend on the narrowest contract needed by their operation. Opening or activation
alone does not confer a family identity, component lifetime or disposal authority. Family contracts
compose their selected capabilities with one component lifetime. The
[coordination assessment](component-coordination.md) retains direct references and explicit
connection ownership for these pilots.

The deliberate extension surface consists of structural contract composition and the existing
application collaborators:

- A specialised component contract may extend the foundation or combine a capability when its
  responsibility preserves the accepted semantics. Structural compatibility proves no ownership,
  nominal identity or runtime conformance.
- An application may supply a conforming `OpenStateAuthority` for external opening control. Its
  synchronous protocol is the provider boundary; a boolean-shaped source alone is insufficient.
- The activation options admit an eligibility callback under the existing guard contract. It is
  not a lifecycle hook, browser event handler or observable disabled-state API.
- Consumers may supply observation callbacks through the existing capability subscriptions and
  own their release obligations. This selects no universal event emitter or host lifecycle hook.

No public implementation class, protected hook, controller base, override protocol or storage
mechanism is selected. Native runtime privacy and any implementation inheritance remain future
implementation responsibilities, rather than new consumer requirements.

The workspace is private, but its intended consumer-facing contracts follow Garden's public naming
rules. The examples, their declared fixtures, compiler configuration and contributor tooling are
private design details. They do not add exported interfaces, host services or runtime entrypoints.
Future implementation helpers remain private unless a real consumer justifies a public contract.

## Import and dependency direction

Cross-feature consumption uses the owning feature's type-only entrypoint. Within a feature, its
contracts and types may refer directly to their own declaration owners; the entrypoint re-exports
that surface. A public declaration referring to its own source files is not an import of another
product's implementation. There is no package export map enforcing source-path access restrictions
yet: these are reviewed logical boundaries, not filesystem privacy guarantees.

| Module                        | Direct cross-feature dependencies         |
| ----------------------------- | ----------------------------------------- |
| Component foundation          | None.                                     |
| Shared capability definitions | None.                                     |
| Opening                       | Shared capability definitions.            |
| Activation                    | Shared capability definitions.            |
| Button                        | Component foundation and activation.      |
| Sidebar                       | Component foundation and opening.         |
| Modal                         | Component foundation, opening and Button. |

The reviewed declaration graph is acyclic. Foundational modules do not import their family
consumers. All existing imports and re-exports are type-only; the design imports no Node, DOM,
framework or other Garden runtime. Explicit imports and references require review independently
of the host-free compiler configuration. The current tooling has no separate automated architecture
gate or package-consumer test.

A future [host adapter](integration-boundaries.md) consumes public Protea contracts and the host's
public contracts. Concrete host dependencies stay with that integration. Its requirements do not
give foundational modules a reverse dependency on families, renderers or framework internals.

## Existing consumer evidence

The private workspace already records the representative module consumers:

- [Foundation examples](../../../design/examples/component-foundation.test.ts) consume the
  foundation entrypoint and contrast minimum and structurally extended shapes.
- [Capability examples](../../../design/examples/capabilities.test.ts) consume opening, activation
  and shared definitions, including authority modes, named statuses and result restrictions.
- [Family examples](../../../design/examples/families.test.ts) consume the family entrypoints,
  factory type queries, capability-only views and sidebar narrowing.
- [Coordination examples](../../../design/examples/component-coordination.test.ts) consume existing
  public factories and capabilities with separate application cleanup obligations.

These examples are checked without execution. Their existing restrictions include the absence of
runtime factory and vocabulary exports. Consolidating the module map adds no new type restriction
and needs no duplicate example or pretend adapter. Static success does not prove source synchrony,
resource release, accessible interaction or distribution conformance. The
[tooling guide](../tooling/index.md#design-authoring) owns actual inputs, commands and coverage.

## Qualification and implementation reconciliation

This is a selected experimental surface for further validation, not a versioned public API promise.
The [integration boundary](integration-boundaries.md) records the host contracts and evidence still
needed. This prototype established no production package identity or runtime target. The current
[package baseline](../tooling/core-package.md) now selects those core boundaries; implementation
and qualification remain outstanding. Future family/integration packages remain undecided.

Before implementation supplies runtime objects or generated declarations, compare its surface and
semantics with these reviewed prototypes. Resolve differences at their actual contract owner and
retire or re-scope the private prototypes so there is one current signature authority. Runtime,
host and clean-consumer evidence must establish their own guarantees; compiling this workspace
does not establish them.

The [implementation handover](implementation-handover.md) owns the detailed evidence map and
reconciliation procedure, including the future declaration producer and the experimental scope
of the six runtime-value absence checks.
