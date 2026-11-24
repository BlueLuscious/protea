# Component Families

Status: **Portable Button, Modal, Select, Sidebar and Switch runtimes**

The built-in families live under `src/components/<family>/` in [Components](../index.md).
Each family owns its state, operations and composition. Core supplies
portable lifetime and definition-based construction.

| Guide | Responsibility |
| --- | --- |
| [Button](button/index.md) | Incorporated definition, active instances, availability and activation. |
| [Modal](modal/index.md) | Incorporated definition, dialogue lifetime and explicit opening authority. |
| [Select](select/index.md) | Incorporated definition, fixed ordered options and application-owned single selection. |
| [Sidebar](sidebar/index.md) | Incorporated definition, changeable logical presence and explicit opening authority. |
| [Switch](switch/index.md) | Incorporated definition and retained checked state with internal or external authority. |

## Module and public boundaries

Families use the [Core component foundation](../../core/component/index.md) through Core's public
package root. Within Components, family modules consume capability contracts and creation APIs
from their owners in `src/capabilities/` and `src/api/capabilities/`. The package-level
`src/api/families/` contains each executable family entry.
The API contracts live in `src/api/contracts/`. Each family owns its prepared definition under
`definitions/` and its instance and data contracts under `contracts/` and `types/`.

Concrete family implementation classes use the Component role. `ButtonComponent` in
`runtime/button.component.ts` owns the family behaviour that the Button recipe delegates to.
The Modal and Sidebar recipes delegate opening to `Opening`. The Switch recipe delegates checked
state to `Checking`. Select owns its selection requests and observations while the application
controls the selected value. Core assembles each public instance.
The Button implementation follows
[Garden's symbol and role naming](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#symbols-and-files).

The [Components API guide](../api/index.md#package-exports) lists the public root and the available
family and definition entries. A family entry exposes the same API object as the root. Its
`definition` property refers to the family's named definition export.

## Contract-led development

The bounded review starts from each family's cases before implementation:

1. Establish representative cases and each original family's purpose and exclusions.
2. Define actions, state authority, construction, ownership, observation, lifecycle and failures.
3. Express the resulting method contracts through interfaces and types at their real production
   feature owners, with semantic guides and statically checked consumption examples.
4. Compare those requirements with existing Core contracts. Identify family-owned behaviour,
   justified reusable capabilities and responsibilities belonging to a future host.
5. Implement and verify each family against its accepted contract.

A method name alone establishes no shared capability. Review state authority, request/results,
notification ordering, reentrancy and lifetime before composing a shared contract. Use the
existing capabilities where their semantics fit. Incompatible Core changes follow the
[public contract procedure](../../../project/index.md#public-contract-changes).

Interface method signatures need no executable bodies. Do not substitute empty methods, throwing
stubs, ambient declarations of unavailable factory values or a second prototype workspace for
contracts. A declaration emitted from real TypeScript is distinct from an authored ambient
promise of a runtime value. Static examples demonstrate type restrictions, not state transitions,
cleanup or accessible host behaviour.

## Construction contracts and factories

`ButtonApi`, `ModalApi`, `SelectApi`, `SidebarApi` and `SwitchApi` describe each family's creation
operation and its prepared definition. Each `create` operation delegates to Core with that
definition. Each family guide owns its parameter, result and lifetime relationships.

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
| A Save control becomes enabled and accepts a discrete action. | [Button](button/index.md) owns observable availability and combines `ComponentInstance` with `Activatable`. |
| A dialogue is opened and closed, including an application-controlled source. | [Modal](modal/index.md) combines `ComponentInstance` with `Openable`. The model owns lifetime, and a future host supplies actual modality. |
| A user requests one value from a fixed ordered set. | [Select](select/index.md) captures the options and observes the application's effective choice. |
| A lateral region can be opened and closed independently of its visual positioning. | [Sidebar](sidebar/index.md) combines `ComponentInstance` with `Openable` for changeable presence. Permanently invariant visibility is outside this bounded contract. |
| A two-state control reads local checked state or uses a shared preference from the application. | [Switch](switch/index.md) combines `ComponentInstance` with `Checkable` and retains an independent lifetime in either mode. |
| Each created family has an independent identity and finalisation authority. | Core supplies each built instance's lifetime and definition reference. The family API exposes the instance's disposal operation and keeps cleanup registration private. |
| Modal/Sidebar choose internal or synchronous external control. | Their feature-owned options aliases reuse OpenableOptionsType without a second authority or state/result vocabulary. Options are required to make that choice explicit. |
| Button needs observable disabled changes. | Family-owned state, setter and snapshots; one current consumer does not justify a new shared availability capability. |
| Button activation requests Modal closure. | Application-owned connection through public operations, with separate activation and closing results; no closeControl part or manager. |
| Consumers need host input, naming, focus or layout. | Host responsibility, with its own implementation and evidence. |

Each recipe receives its own scope and composes capabilities where their semantics fit. The
package-level [shared runtime](../shared/index.md) supplies ordered delivery for family-owned
availability, selection and reusable capabilities.

The current Modal and Sidebar types are structurally compatible; their purposes and host obligations
differ, but no nominal brand or runtime identity test is invented to distinguish them. Neither
interface proves that an arbitrary structurally matching object obeys its semantics. Original
families precede variants; the old static/floating Sidebar classification is not restored.

The non-executed [family type consumer](../../../../../tests/distribution/family-consumer.test.ts)
checks valid and invalid public consumption against fresh installed declarations under NodeNext
and Bundler resolution. It uses the family APIs and their prepared definitions.

The [Components quality guide](../quality.md) owns the packed family runtime, consumer and
distribution checks.
[Product direction](../../../project/component-direction.md) owns wider concepts and deferred
families; [integration boundaries](../../../project/integration-boundaries.md) own future hosts,
icons and motion. Portable models alone establish no rendered or accessible component support.
