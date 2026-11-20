# Component Runtime

Status: **Definition preparation, instance construction and scope runtime implemented**

The `src/component/runtime/` feature prepares definitions, creates private lifetime owners and
composes an instance from the recipe's result. The [Core API](../../api/index.md) exposes these
operations. The [component contracts](../index.md) own identity, lifetime and cleanup semantics.

## Runtime responsibilities

| Internal class | Responsibility | Result |
| --- | --- | --- |
| [`ComponentDefinitionFactory`](../../../../../../packages/core/src/component/runtime/component-definition.factory.ts) | Inspects own data fields, validates identity using its private slug pattern and captures the recipe. | Frozen definition and identity records. |
| [`ComponentInstanceFactory`](../../../../../../packages/core/src/component/runtime/component-instance.factory.ts) | Validates the prepared definition, runs setup with a fresh scope and assembles the instance. Owns cleanup if construction fails. | Sealed flat instance with a null prototype. |
| [`ComponentScope`](../../../../../../packages/core/src/component/runtime/component-scope.ts) | Holds one lifetime and its registered releases. | Frozen scope view with lifecycle, cleanup registration and disposal. |

## Definition preparation

`Component.define` accepts a `ComponentDefinitionInput` and reads its recognised own data fields
and the identity's without invoking getters. It rejects accessor fields, captures the recipe and
copies the identity. Each call returns a fresh frozen definition with a frozen identity. The
author's input, function, closure and collaborators stay under their original ownership.
The recipe runs during creation.

`Component.create` requires a frozen definition container with own data fields for the recipe and
valid frozen identity. Core validates that shape and retains the exact supplied definition.
The identity's name and any present namespace must be own data properties.
Structurally conforming definitions from another compatible Core copy are permitted. Pass mutable
authoring input through `define` to prepare it. Runtime validation checks the frozen protocol.

Prepared structural definitions may have additional own fields. Core ignores them, retains the
original definition reference and promises no validation or immutability of their reachable values.
Only the recognised identity/recipe fields belong to this initial contract.

## Setup and options

`setup` receives a frozen `ComponentSetupContext<Options>` with a frozen scope view and borrowed
options. It runs without an implicit receiver and before Core exposes the public instance. The
options keep their original mutability.

Options are borrowed for this call. Core neither retains nor merges them on the instance.
The author validates and captures configuration before acquiring resources and decides what to
copy or intentionally borrow. The initial empty scope has no external resources or callbacks.

## Construction and failed preparation

Construction is synchronous.

1. Validate and capture the prepared definition and recipe before acquiring an instance scope.
2. Create a fresh private lifetime owner and its stable scope view, then freeze the setup context.
3. Invoke `setup` once. The author validates options, creates per-instance behaviour and registers
   acquired release obligations on that scope. Scope registration does not acquire ownership of
   borrowed authorities, controls or models.
4. Require an own-property surface record and inspect its descriptors. Validate all keys and the
   active lifetime before composing, without evaluating returned getters.
5. Create Core's public instance, install its protected common members and the validated specific
   descriptors, and seal the surface. Check the scope remains active before returning the instance.
6. On any failure after scope acquisition, finalise that scope and attempt every registered
   release before reporting failure. Return no partial instance and preserve unrelated lifetimes.

Finishing the scope during setup makes construction fail. Cleanup failures cannot reactivate it
or prevent the other required attempts. Core reports construction and cleanup failure without a
promised error class, identity or aggregation shape. Effects the author performed outside the
scope's registered obligations remain that author's responsibility.

A returned Promise, class instance, array, function or other unsupported record fails surface
validation and triggers cleanup. A record with its own `then` member also fails validation.
Asynchronous work started by a nonconforming recipe remains the author's responsibility.

## Flat public surface

The returned surface must be a record with the executing realm's `Object.prototype` or null
as its prototype. Core exposes its own string and symbol keys, including non-enumerable keys.
Core checks the prototype at runtime because an object can conform to the TypeScript shape with
a different prototype.

Core uses a new null-prototype public object. Use `Object.hasOwn(instance, key)` to check for own
members. Methods such as `toString` are available only when the recipe provides them.

`definition` is a fixed readonly reference,
`lifecycle` is a getter over the private lifetime and `dispose` is a fixed operation over that same
owner. These members are non-configurable and cannot be replaced. Lifetime callable contracts
use readonly properties, including `dispose` and scope `addCleanup`, so ordinary typed assignment
is rejected as well. The scope view is a frozen container backed by the private lifetime owner.
Core captures the scope's disposal operation before running the recipe.

Specific data and accessor descriptors preserve values, getter and setter functions, enumerability
and writability. Sealing makes properties non-configurable and prevents later additions. Specific
writable data, declared setters and mutable nested state remain usable. During member access,
methods and accessors execute with the public object as receiver. For a model with private fields,
delegate explicitly using `activate: () => model.activate()` or
`get isDisabled() { return model.isDisabled; }` to preserve the model's receiver.

Core rejects any own `definition`, `lifecycle`, `dispose` or `then` on the specific surface,
including hidden properties, accessors and undefined values. Reserving `then` prevents the
resulting instance from becoming a thenable. The same reserved-member list drives the runtime
check and the TypeScript restriction. Type checking catches known collisions and Promise or
thenable results. Runtime checks precede publication, skip accessor invocation and also cover
JavaScript callers, widened types and assertions.

Core inspects property descriptors to preserve getters without evaluating them. Proxy traps may
still run during validation. See [own-property descriptors](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.getownpropertydescriptors)
and [integrity levels](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.freeze).

## Author responsibilities

A recipe may retain its scope for terminal checks. Core protects the common lifetime operations.
Authors define and enforce which custom actions and reads are permitted after disposal. Only
the lifetime owner may initiate disposal, including when a scope view is available to a borrowed
collaborator. Allocate per-instance state and resources in `setup` and document any intentionally
shared collaborators. Follow the [terminal cleanup protocol](../index.md#finalisation-and-ownership).

## Verification boundary

The [Core quality guide](../../quality.md) records public declaration and packed runtime checks
for this protocol.
