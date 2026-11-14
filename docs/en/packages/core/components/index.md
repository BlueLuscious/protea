# Component Families

Status: **Initial portable family ownership selected; no family runtime implemented**

The first original Button, Modal and Sidebar models will live in the existing
[core package](../index.md), under `src/components/<family>/`. Their guides follow the same
feature ownership here. This selects the implementation destination; those source directories,
family exports and runtime values do not exist yet.

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

Only real `api/`, `contracts/`, `types/` and `runtime/` owners are created during implementation.
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

Begin with a bounded joint review of Button, Modal and Sidebar before implementing the families:

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

Start with family-specific contracts such as ButtonFactory and contextual create operations.
Their parameter, result and lifetime relationships must be defined before a corresponding runtime
factory is advertised. A type describing construction does not supply an executable factory.

A future common factory interface remains an option when a real consumer needs to work with
multiple factories. It must preserve the relationship between inputs and returned instances,
including required/optional parameters and ownership. A shared create name alone does not justify
the abstraction. A base implementation class additionally needs actual common behaviour or
invariants; it is a separate decision from sharing an interface. Neither implies registration,
lookup, a manager or a query API.

## Initial families and evidence

[Button](button/index.md) has an initial contract baseline: an independently owned lifetime,
observable application-set availability and discrete activation. Review it alongside Modal's
opening/collaboration and Sidebar's visibility/interaction cases before implementing runtime.
That review will establish bounded contracts for all three and justify capability composition.
Original families precede variants; the old static/floating Sidebar classification is not restored.

Family runtime/type tests and public consumers must exercise actual built/packed artefacts.
For the selected one-package boundary, extend existing core consumers with family cases and
intentional exports; keep the current guarded producer, host-free compiler and focused lint/format
scope. Existing passing tests prove no unimplemented family contract.

The [tooling guide](../../../tooling/core-package.md) owns actual build/distribution checks.
[Product direction](../../../project/component-direction.md) owns wider concepts and deferred
families; [integration boundaries](../../../project/integration-boundaries.md) own future hosts,
icons and motion. Portable models alone establish no rendered or accessible component support.
