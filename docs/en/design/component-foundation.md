# Component Foundation

Status: **Private experimental contract design; no runtime implementation**

This guide owns the semantic rules of the minimum component foundation. The private
[component contract](../../../design/component/contracts/component.contract.ts) owns the
`Component` signature; the [lifecycle type](../../../design/component/types/component-lifecycle.type.ts)
owns `ComponentLifecycleType`. Their [type-only entrypoint](../../../design/component/api/index.ts)
is an experimental consumption boundary, not an installed package or publication promise.

Read this contract within the [foundation scope](index.md), [vocabulary](vocabulary.md) and
[responsibility map](responsibilities.md). Declaration documentation links here for semantics;
complete signatures remain at their declaration owners.

## Identity and creation

A component is an individual UI model. Its object reference supplies its identity for this
contract: the same reference denotes the same instance throughout its lifetime and after
finalisation. A component does not gain a universal identifier, name, global generator,
serialisation identity, persistence key or DOM identifier. A future representation or family
may need its own identifier under its own contract.

Creation produces an `active` component. Concrete creation responsibilities belong to the
future component or family that creates it. The foundation introduces no constructor,
universal configuration object, base class, factory or protected lifecycle hook.

`Component` is a public-facing structural interface in this private design. A justified
contract may extend it to add its own responsibilities without inheriting an implementation.
Structural compatibility establishes neither nominal instance identity nor ownership authority.
Two compatible objects are not thereby the same component; aliases to one reference remain
references to the same instance.

## Logical lifetime

The lifecycle distinguishes `active` from the terminal `disposed` state. `active` means that
the component's logical lifetime has not ended. It does not mean mounted, enabled, visible,
open, selected or currently processing an action. Model finalisation is distinct from removing
a host representation.

The lifecycle property exposes the instance's current logical lifetime when read. Its
`readonly` declaration prevents assignment through that interface; it does not freeze the
object, prohibit implementation-owned transitions or establish a general state-observation
mechanism. Reading a value does not subscribe the consumer to later changes.

The transition to `disposed` is irreversible. The reference retains its identity, but the
instance must not start new component work or become `active` again. Reading its lifecycle
and calling disposal again remain valid. Future capabilities must define their own rejected
requests, permitted observations and notification details within that terminal boundary;
this foundation selects no such capability API or event protocol.

## Disposal and ownership

Only the component's lifecycle owner may initiate disposal. Holding or borrowing a reference,
composing a part or registering a component does not itself transfer that authority. A future
creation or composition contract must identify the owner and any explicit ownership transfer.
The public interface makes disposal callable; TypeScript does not prove that a caller owns
the component or is authorised to end its lifetime.
Ownership is a semantic precondition, not a promise of static or runtime enforcement.

The first authorised disposal call on an `active` component has these obligations:

1. End the logical lifetime synchronously by marking the component `disposed` before invoking
   any external resource-release operation or other release callback.
2. Attempt every synchronous release obligation for resources owned by that component, even
   when an earlier attempt fails. Retaining or borrowing a collaborator does not make it an
   owned resource; disposal must not accidentally finalise borrowed collaborators.
3. Return normally only after all of those synchronous release obligations have completed
   successfully. If any required release fails, throw an opaque error after all required
   attempts have been made; the failure must not be silently discarded.

A failure never restores the `active` state. Consequently, `disposed` records logical
finalisation rather than proof that every resource was successfully released. A propagated
failure is opaque at this foundation boundary; no error class, failure payload or aggregation
representation is selected here.

Repeated disposal is a no-op, including a re-entrant call made by a release callback. It must
not repeat release attempts, retry earlier failures or surface the original error again.
A repeated call returns without starting another disposal or waiting for release work already
in progress; a re-entrant return does not establish that the original call has finished its
release obligations. The completion guarantee above belongs to the initial call.
Owners must account for release failures without relying on repeated disposal as recovery.

Disposal is a synchronous semantic contract. It establishes no asynchronous finalisation
protocol and does not promise completion of future host teardown or other asynchronous work.
Such work needs an explicit later owner and completion contract. TypeScript permits some
asynchronous functions to satisfy a `void`-returning method type; that assignability does not
make an asynchronous disposal implementation conform to these synchronous semantics.

## Deliberately separate responsibilities

The foundation contains no universal configuration, mutable state object, event emitter,
observer subscription, opening operation, activation operation or manager registration.
Lifecycle reading is the narrow observation needed by this contract. Reusable capabilities
will justify any additional requests, state authority and observations against their actual
consumers, without making unrelated components acquire them.

A simple consumer can rely on reference identity and lifetime alone. An interactive consumer
can add a responsibility through a structural extension without placing it on every component.
The non-executed examples in the [private workspace](../../../design/README.md) illustrate that
distinction. Their `invokeExampleAction` member is a fixture-local operation for checking
extension; it is not an accepted product activation API or a completed capability design.

## Evidence and implementation boundary

These declarations describe an experimental intended API. They implement no construction,
state storage, transitions, cleanup, ownership enforcement or host effects. There are no
empty methods or throwing component stubs standing in for implementation. The existing shared
compiler configuration is reused with real design inputs; no empty product compilation is
treated as component evidence.

The [tooling guide](../tooling/index.md#current-verification) owns the actual commands and
checked coverage. Static consumption examples can check accessible members, structural
extension, readonly assignment restrictions and method types. They cannot prove synchronous
finalisation, release ordering, idempotence, reference ownership, resource cleanup, instance
isolation or runtime immutability. Those obligations require later implementation evidence.

Capability semantics, family construction, concrete class relationships, extension mechanisms,
host integration and runtime distribution remain with their owning design work. Nothing here
creates an executable library, a public package export or a compatibility guarantee.
