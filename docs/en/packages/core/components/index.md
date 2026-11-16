# Component Families

Status: **Original family type contracts defined; no family runtime implemented**

The first original Button, Modal and Sidebar contracts live in the existing
[core package](../index.md), under `src/components/<family>/`. Their guides follow the same
feature ownership here. The package exports their interfaces/types, including construction
contracts; family implementations and executable factories do not exist yet.

## Package decision

| Consideration | Selection and consequence |
| --- | --- |
| Responsibility | Families give a component purpose, selected state and composition over the minimum component lifetime and reusable capabilities. Feature modules express that distinction within core. |
| Platform and dependencies | The selected models use the same portable ES2022 ESM baseline and existing core contracts. They require no DOM, framework or additional production dependency. |
| Consumers | Application code can construct a family and compose it with other models through one public package. There is no current independent foundation-only distribution requirement or separate family release policy. |
| Cost retained | The package archive will include implemented family modules, and root imports load modules re-exported there. A shared package does not establish smaller bundles or automatic elimination by a consumer's tooling. |
| Alternative | A dependent family package would require another identity, dependency/build order, owned output set and clean installation of both archives. The current consumers do not justify that additional distribution boundary. |

Revisit extraction if real consumers need independent foundation installation, measured loading or
bundle costs warrant it, or dependencies, supported environments or release policy diverge. Once
family names are public, moving them requires an explicit compatibility decision. This selection
does not promise effortless extraction or prescribe the distribution of future host adapters.

## Module and public boundaries

`component/` owns the minimum shared lifetime contract; `components/` groups concrete family
models such as Button and Sidebar. A portable component model remains a component responsibility
before it has a rendered host. The plural group does not claim a completed visual implementation.

Component lifetime, capabilities and families remain distinct feature groups. A family consumes
the relevant component/capability API and contracts; those foundations must not import family or
host consumers. Internal feature imports must not pass through an aggregate root that re-exports
the importing family and introduces a cycle. No family imports a capability implementation class
to bypass its public contract.

The current family sources have real `api/`, `contracts/` and `types/` owners. Runtime owners will
be added with executable behaviour.
Internal interfaces and type aliases follow Garden's `contracts/internal/` and `types/internal/`
rules; implementation classes remain private behind contextual factories. A conceptual family
or variant does not require a base class, manager or shared family layer.

The existing package root remains the intended consumer boundary. Family additions will be
exported deliberately, with production TypeScript generating their declarations. Reviewed
interface/type contracts may precede their runtime implementations; executable factories enter
the public root only when they actually exist. Type availability and runtime availability must
be documented separately.

No subpath, wildcard, second package, source alias or unavailable value is added by this decision.

## Contract-led development

The bounded joint review starts from each family's cases before implementing the families:

1. Establish representative cases and each original family's purpose and exclusions.
2. Define actions, state authority, construction, ownership, observation, lifecycle and failures.
3. Express the resulting method contracts through interfaces and types at their real production
   feature owners, with semantic guides and statically checked consumption examples.
4. Compare those requirements with existing core contracts; identify family-owned behaviour,
   justified reusable capabilities and responsibilities belonging to a future host.
5. Implement and verify each family in the order Button, Modal and Sidebar.

A method name alone establishes no shared capability. Review state authority, request/results,
notification ordering, reentrancy and lifetime before composing a shared contract. Activatable
and Openable already have real implementations; use them where their semantics fit, without
forcing the families into them or changing accepted core contracts implicitly. Any incompatible
core change requires explicit acceptance before its implementation.

Interface method signatures need no executable bodies. Do not substitute empty methods, throwing
stubs, ambient declarations of unavailable factory values or a second prototype workspace for
contracts. A declaration emitted from real TypeScript is distinct from an authored ambient
promise of a runtime value. Static examples demonstrate type restrictions, not state transitions,
cleanup or accessible host behaviour.

## Construction contracts and factories

The current family-specific contracts are ButtonFactory, ModalFactory and SidebarFactory, with
contextual create operations.
Their parameter, result and lifetime relationships must be defined before a corresponding runtime
factory is advertised. A type describing construction does not supply an executable factory.

A future common factory interface remains an option when a real consumer needs to work with
multiple factories. It must preserve the relationship between inputs and returned instances,
including required/optional parameters and ownership. A shared create name alone does not justify
the abstraction. A base implementation class additionally needs actual common behaviour or
invariants; it is a separate decision from sharing an interface. Neither implies registration,
lookup, a manager or a query API.

## Initial families and evidence

The reviewed cases and responsibility map are:

| Case or requirement | Contract owner and decision |
| --- | --- |
| A Save control becomes enabled and accepts a discrete action. | [Button](button/index.md) owns observable availability and combines Component with Activatable. No click, pressed or selected state is added. |
| A dialogue is opened and closed, including an application-controlled source. | [Modal](modal/index.md) combines Component with Openable; the model owns lifetime, while a future host supplies actual modality. |
| A lateral region can be opened and closed independently of its visual positioning. | [Sidebar](sidebar/index.md) combines Component with Openable for this changeable-presence case. Permanently invariant visibility is outside this bounded contract. |
| Each created family has an independent identity and finalisation authority. | Each family factory contract promises a private scope per model; no public scope argument, cleanup method or capability instance escapes. |
| Modal/Sidebar choose internal or synchronous external control. | Their feature-owned options aliases reuse OpenableOptionsType without a second authority or state/result vocabulary. Options are required to make that choice explicit. |
| Button needs observable disabled changes. | Family-owned state, setter and snapshots; one current consumer does not justify a new shared availability capability. |
| Button activation requests Modal closure. | Application-owned connection through public operations, with separate activation and closing results; no closeControl part or manager. |
| Consumers need host input, naming, focus or layout. | Future host responsibility, with its own implementation and evidence; neither capability supplies these effects. |

Button's initial availability/activation baseline is retained. Openable and Activatable fit the
selected cases without a core-contract change. There is no new reusable capability or common
factory abstraction: existing consumers need family-specific construction, not a polymorphic
factory collection. No common family class has demonstrated shared runtime work yet.

The current Modal and Sidebar types are structurally compatible; their purposes and host obligations
differ, but no nominal brand or runtime identity test is invented to distinguish them. Neither
interface proves that an arbitrary structurally matching object obeys its semantics. Original
families precede variants; the old static/floating Sidebar classification is not restored.

The non-executed [family type consumer](../../../../../tests/distribution/family-consumer.test.ts)
checks valid and invalid public consumption against fresh installed declarations under NodeNext
and Bundler resolution. Construction contracts are supplied as typed inputs, not unavailable
library values. The package's runtime namespace remains its seven implemented values.

Later family runtime tests and public consumers must exercise actual built/packed artefacts.
For the selected one-package boundary, extend existing core consumers with family cases and
intentional exports; keep the current guarded producer, host-free compiler and focused lint/format
scope. Existing passing tests prove no unimplemented family contract.

The [tooling guide](../../../tooling/core-package.md) owns actual build/distribution checks.
[Product direction](../../../project/component-direction.md) owns wider concepts and deferred
families; [integration boundaries](../../../project/integration-boundaries.md) own future hosts,
icons and motion. Portable models alone establish no rendered or accessible component support.
