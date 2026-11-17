# Component Definitions and Construction

Status: **Accepted construction design; definition/instance runtime and package migration not implemented**

This guide specifies the portable construction model for Core and Components. The
[current core guide](../packages/core/index.md) owns the existing implementation; the APIs and
signatures below describe its accepted successor. They are not current package exports or
executable consumer examples. Production source and generated declarations will own implemented
signatures, with parallel package guides owning their use.

## Model and package ownership

| Concept | Responsibility |
| --- | --- |
| `ComponentDefinition<Options, Surface>` | A reusable component type: copied logical identity and a typed construction recipe. It exists independently of its instances. |
| `ComponentLifetime` | Terminal logical lifetime and synchronous finalisation. It has no definition or family-specific operations. |
| `ComponentScope` | A lifetime with explicit cleanup-registration authority. A standalone scope needs no artificial component definition. |
| `ComponentInstance<Definition>` | A live component's common lifetime and readonly reference to the actual definition used. Core combines it with the recipe's specific surface. |
| `ComponentSetupContext<Options>` | The new instance's scope and that creation's options, supplied only to its recipe. |

Core owns these contracts, definition preparation and instance construction. Components depends
on public Core exports and owns reusable capabilities, Button and future original families.
Opening/activation state, result vocabularies and observation helpers belong to Components.
Core has no family dispatch table, capability or host dependency.

The intended API values are immutable, stateless concept objects at package-level `src/api/`,
with separate `*Api` contracts and deliberate root exports, following
[Aster's API organisation](https://github.com/BlueLuscious/aster/blob/master/docs/en/packages/core/index.md).
Domain contracts, types and implementations retain their feature owners; composition imports
those owners directly instead of routing internal dependencies through the aggregate public root.

| Package | API value and contract | Operation/result |
| --- | --- | --- |
| Core | `Component: ComponentApi` | `define(input)` prepares a definition; `create(definition, options)` creates a flat instance. |
| Core | `Scope: ScopeApi` | `create()` creates an independent `ComponentScope`. The contract keeps its agreed name; `Scope` names its creation API. |
| Components | `Opening: OpeningApi` | `create(scope, options)` creates `Openable`, borrowing the active scope. |
| Components | `Activation: ActivationApi` | `create(scope, options?)` creates `Activatable`, borrowing the active scope. |
| Components | `Button: ButtonApi` | Readonly `definition` and `create(options?)`, returning `ButtonInstance`. |
| Components, future runtime | `ModalApi`, `SidebarApi` | Migrated construction contracts only until their families have executable implementations. No `Modal`/`Sidebar` API values or incorporated definitions are promised by this migration. |

`ButtonInstance`, `ModalInstance` and `SidebarInstance` distinguish live family contracts from
their concept API values. Opening/Activation preserve the existing Openable/Activatable contract
names. Scope and capabilities remain useful primitives; they are not component instances and
do not acquire definitions merely because they have creation APIs.

## Definition preparation and identity

The initial Core-prepared definition contains only `identity` and `setup`. `identity` has required
`name` and optional `namespace`. Both supplied strings use lowercase ASCII kebab-case:
`^[a-z0-9]+(?:-[a-z0-9]+)*$`. Reject empty strings, whitespace, uppercase and invalid separators;
do not silently trim or change case. Omitted or undefined namespace is captured as absent.
Identity describes a component type; object reference still distinguishes live instances.
A namespace provides logical attribution, not authentication, exclusivity or global registration.

`Component.define` validates the input's own data fields and the identity's own data fields without
invoking field getters. It captures the callable recipe, copies recognised identity fields and
returns a fresh frozen definition with a frozen identity. Recognised accessor fields are invalid;
unknown fields are not retained. It never mutates or freezes the input object, the function,
its closure or caller-owned collaborators. It does not call `setup` or acquire resources.
Calling `define` again prepares another definition; there is no interning or idempotence promise.

`Component.create` requires the prepared protocol: stable own data fields for identity/recipe,
valid frozen identity and a frozen definition container. It validates that shape and retains the
exact supplied definition, rather than normalising it into a new reference. Structurally conforming
definitions from another compatible Core copy are permitted; a private recognition set or global
registry is unnecessary. A mutable authoring input must first pass through `define`. Structural
typing alone cannot establish runtime freezing or semantic conformance.

Prepared structural definitions may have additional own fields. Core ignores them, retains the
original definition reference and promises no validation or immutability of their reachable values.
Only the recognised identity/recipe fields belong to this initial contract.

Inspection exposes identity and recipe, not a registry of live instances. Calling `setup` directly
is not another supported route to a component instance; use Core construction. The recipe is callable
code, so the definition is not a serialisable data format or a sandbox. Closures can still capture
mutable state; authors must keep per-instance state/resources in setup and document any intentional
shared collaborators. Metadata, versions, universal capability lists and default-merging policy
are not added without an actual consumer. Families may later prepare their own reusable data
without turning live authorities into immutable definition data.

## Setup and type relationship

The recipe's designed callable shape is
`setup(this: void, context: ComponentSetupContext<Options>): Surface`, with a compile-time
restriction excluding `definition`, `lifecycle`, `dispose` and `then` from its returned surface.
It receives no partially composed public instance and is invoked without an implicit receiver.
`context` has readonly `scope: ComponentScope` and `options: Options`; Core freezes the context
container, not the options or anything reachable through them.

The generic defaults are `Options = void` and `Surface extends object = object`.
`define` preserves both parameters. `create` returns
`ComponentInstance<ComponentDefinition<Options, Surface>> & Surface`; it requires an options
argument unless `undefined extends Options`, in which case that argument is optional. An author
with meaningful options annotates the setup context, allowing the return surface to be inferred.
Specifying only one explicit generic argument must not be advertised as preserving inference of
the remaining defaulted parameter.

The instance contract's definition parameter is bounded by `ComponentDefinition<never, object>`,
so its default describes the shared instance boundary without claiming arbitrary creation options.
The public signature can express the reserved-member restriction as optional `never` properties
under strict `exactOptionalPropertyTypes`; internal helper types need no separate root export.
These restrictions reject known collisions and Promise/thenable returns. Runtime validation
remains necessary for JavaScript callers, widened types and assertions.

Options are borrowed for this call. Core neither retains nor merges them on the instance.
The author validates and captures family configuration before acquiring family resources, and
decides what to copy or intentionally borrow. No generic store, validation hook or defaults engine
is required. Allocating the initial empty scope acquires no external resources or callbacks.

For example, this designed authoring form uses Core alone and requires a message for each creation:

```ts
import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";

const noticeDefinition = Component.define({
  identity: { namespace: "my-ui", name: "notice" },
  setup({ options }: ComponentSetupContext<{ message: string }>) {
    const message = options.message;

    if (typeof message !== "string") {
      throw new TypeError("A notice message must be a string.");
    }

    return { get message() { return message; } };
  },
});

const notice = Component.create(noticeDefinition, { message: "Saved" });
```

The example's message is captured per creation and remains readable after disposal. It claims
no rendering, activation or resource acquisition; a richer author supplies those responsibilities
explicitly through its recipe and the same cleanup owner.

## Construction and failed preparation

Construction is synchronous and follows this protocol:

1. Validate and capture the prepared definition and recipe before acquiring an instance scope.
2. Create a fresh private lifetime owner and its stable scope view, then freeze the setup context.
3. Invoke `setup` once. The author validates options, creates per-instance behaviour and registers
   acquired release obligations on that scope. Scope registration does not acquire ownership of
   borrowed authorities, controls or models.
4. Require an own-property surface record and inspect its descriptors. Validate all keys and the
   active lifetime before composing; do not evaluate returned getters to discover their values.
5. Create Core's public instance, install its protected common members and the validated specific
   descriptors, and seal the surface. Check the scope remains active before returning the instance.
6. On any failure after scope acquisition, finalise that scope and attempt every registered
   release before reporting failure. Return no partial instance and preserve unrelated lifetimes.

Finishing the scope during setup makes construction fail; it cannot publish an already terminal
instance. Cleanup failures cannot reactivate it or prevent the other required attempts. Report
construction and cleanup failure without adding a public error taxonomy or promising an error
class, identity or aggregation shape. Core cannot undo unregistered effects or revoke references
an author deliberately leaks during setup.

No setup promise or thenable is awaited or assimilated. A returned Promise, class instance,
array, function or other unsupported record fails surface validation and triggers cleanup.
Core cannot cancel asynchronous work started by a nonconforming author; this is a synchronous
construction contract, not an asynchronous resource transaction.

## Flat public surface

The returned surface must be a record with `Object.prototype` or null as its prototype. Only
its own string and symbol keys are exposed, including non-enumerable keys. Inherited members
are not copied. TypeScript cannot prove this record/prototype property for every typed object;
returning a class instance may type-check and still fail the runtime protocol. The prototype check
uses the executing Core copy's `Object.prototype` or null; accepting arbitrary cross-realm object
prototypes is outside this initial rule. Compatible Core copies in the same realm can interoperate.

Core uses a new null-prototype public object. `definition` is a fixed readonly reference,
`lifecycle` is a getter over the private lifetime and `dispose` is a fixed operation over that same
owner. These members are non-configurable and cannot be replaced. Lifetime callable contracts
use readonly properties, including `dispose` and scope `addCleanup`, so ordinary typed assignment
is rejected as well. The scope view is a frozen container backed by the private lifetime owner.
Its captured Core operations must resist replacement; Core must not rely on a caller-modifiable
public method to perform its required cleanup.

Specific data/accessor descriptors preserve values, getter/setter functions, enumerability and
writability. Sealing makes properties non-configurable and prevents later additions; it does not
freeze specific writable data, disable declared setters or freeze nested state. Methods and
accessors execute with the public object as receiver. An author using an internal class delegates
explicitly, for example `activate: () => model.activate()` and
`get isDisabled() { return model.isDisabled; }`. Copying an unbound method that requires that
class's private fields is not a supported substitute.

Reject any own `definition`, `lifecycle` or `dispose` on the specific surface, including hidden
or accessor properties. Also reserve `then` as a synchronous-surface restriction, even when its
value is undefined, so the instance cannot accidentally become a thenable. This fourth name is
not a Core operation. Reject collisions before invoking accessors or exposing the instance.

Descriptor inspection preserves getters; object spread would instead read their values.
The standard mechanisms are [own-property descriptors](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertydescriptors)
and [integrity levels](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.freeze).
These mechanisms do not isolate hostile code: proxy traps may still run during validation.
The restrictions protect construction invariants, not arbitrary execution by component authors.

## Lifetime and equivalent creation entries

Preserve the current [terminal cleanup protocol](../packages/core/component/index.md#finalisation-and-ownership):
terminal before external releases, every required synchronous attempt, borrowed lifetimes intact,
and inert repeated/reentrant disposal without retry or waiting. There is no new lifecycle event
publisher, asynchronous finaliser or independent capability retirement protocol.

The recipe may retain its scope to enforce action/read rules. Core ties common lifetime to that
owner but cannot prove that arbitrary custom methods obey it. Each behaviour documents terminal
requests and readable state; freezing or sealing the public object does not enforce those rules.

The intended family consumption is:

```ts
const first = Button.create(options);
const second = Component.create(Button.definition, options);

first.definition === Button.definition;
second.definition === Button.definition;
first !== second;
```

`Button.create` delegates through Core with its incorporated definition; it adds no second setup
algorithm. Each call gets fresh state, listeners, resources and lifetime. The definition can be
shared, and applications may deliberately supply shared authorities, without sharing all instance
state. Built-in Button identity is `{ namespace: "protea", name: "button" }`; no eager live model
is exported. Modal/Sidebar incorporated definitions await their actual runtime.

Future adapters primarily consume live instances. Accepting a definition to create one internally
requires explicit model ownership and disposal, as specified by the
[integration boundary](integration-boundaries.md). A framework, icon or motion dependency must not
flow back into this foundation.

## Migration and evidence boundary

The existing package still exposes `Component`, contextual factories and families within Core.
The first implementation step replaces that old minimum contract with `ComponentLifetime`, freeing
the `Component` value name, and introduces the new construction model. Existing family runtimes
may temporarily remain lifetime-only during that step; they must not be called new definition-based
instances until migrated. Their current factories remain only for that bounded transition.

The next step moves capabilities, observation support, Button and Modal/Sidebar types to Components,
adopts the API table above and removes the transitional exports. It also qualifies the real
Components-to-Core dependency, dependency-ordered builds and fresh packed consumers. Permanent
aliases, private cross-package imports and source-path consumer shortcuts are not the migration.
The [tooling owner](../tooling/core-package.md) still describes the current single-package producer;
this design does not assert that its two-package replacement already exists.

Static design checks can establish inference and rejected typed calls. Only implementation tests
can establish actual descriptor handling, independence, cleanup, failed setup and equivalent
creation behaviour; fresh archives are required to establish the final distribution boundary.
Rendered accessibility, frameworks, registry publication and hosted CI need their own evidence.
