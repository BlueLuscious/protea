# Component Foundation

Status: **Production contracts specified; lifecycle runtime not implemented**

This guide owns the semantics of `Component`, `ComponentLifecycleType` and `ComponentScope`.
Their [production source](../../../../../packages/core/src/component/) owns signatures; the
[core package](../index.md) exports them through its root and emits declarations from that source.
The contracts describe required behaviour without supplying a factory or implementation class.

## Identity and lifetime

A component is an individual model whose object reference supplies identity throughout its
lifetime and after finalisation. Aliases preserve that identity; structural compatibility does
not make two objects the same instance. The foundation introduces no universal identifier,
DOM identifier, configuration, state store, event bus or manager registration.

Lifecycle distinguishes `active` from terminal `disposed`. Active means the logical lifetime
has not ended; it says nothing about mounting, visibility, eligibility, openness or work currently
in progress. Creation must expose an active model. The transition to disposed is irreversible
and must prevent new model work without inventing closing or activation notifications.

The lifecycle reading remains valid after finalisation. Its readonly type view restricts consumer
assignment without freezing the object or supplying a lifecycle subscription. Future capabilities
must specify their own permitted terminal readings and rejected requests.

`Component` is the minimum structural contract. `ComponentScope` extends that same lifetime with
explicit cleanup-registration authority; it is not an application scope, group, registry or
mandatory superclass. A caller needing only a component should consume the narrower contract.
The scope name identifies resource ownership, not a different component identity.

## Cleanup registration

`ComponentScope.addCleanup` accepts a synchronous release function only while active. A
successful call retains one obligation without invoking it. Each call creates a separate
obligation, including repeated references to the same function. Invalid or terminal registration
throws an opaque failure before retaining or invoking the supplied release; unsuccessful
registration transfers no cleanup responsibility.

The registration owns the release obligation rather than every collaborator the callback can
reach. Borrowing a source, control, listener or other model does not authorise finalising it.
An owner must register repeated release obligations only when every invocation is valid.

There is no remove, replace or transfer operation for cleanup entries. An idempotent release
may be invoked early and remain registered until scope finalisation. This selected foundation
does not yet provide independent capability destruction or replacement; that design question
is recorded with [future component composition](../../../project/component-direction.md#capability-lifetime-and-replacement).

## Finalisation and ownership

Only the lifecycle owner may initiate `dispose()`. Holding a callable method or borrowing a
reference does not transfer authority; TypeScript does not enforce this semantic precondition.
The first authorised disposal must:

1. Mark the model disposed synchronously before invoking external release code.
2. Attempt every owned synchronous release even when another attempt fails, preserving borrowed
   collaborators and their independent lifetimes.
3. Return normally only when all required synchronous releases succeed; otherwise throw an
   opaque failure after all required attempts.

Cleanup order is not a public guarantee. A failure cannot restore the active state, so disposed
records terminal logical lifetime rather than proof of successful physical release. No error
class, aggregation shape or failure identity is promised.

Repeated or reentrant disposal does not repeat, retry, wait for or resurface the original release
work. A reentrant return does not establish completion of the initial call. Adding cleanup during
disposal sees the terminal state and fails before retaining or invoking it.

This protocol is synchronous. Returned promises are not awaited and establish no asynchronous
completion, cancellation or host-teardown guarantee. TypeScript can accept Promise-returning
functions in some void-return positions; that assignability is not semantic conformance.

## Construction and extension boundary

No runtime creation value is exported yet. Later construction must expose no partial model,
capture its required ownership before exposure and clean up allocations from failed setup.
Cleanup failure must not hide other required release attempts or silently adopt borrowed
collaborators. Effects already performed by collaborators are not automatically rolled back.

The contracts remain independent of implementation classes. A conforming structural owner is
permitted, but its shape alone proves neither atomic registration, synchronous finalisation nor
resource ownership. Native private implementation state and any genuine class specialisation
remain implementation responsibilities.

Closing a future Modal is distinct from finalising it. Removing a host representation is also
distinct from ending a borrowed model's lifetime. Component-specific policies and optional
capabilities must preserve these boundaries without adding unrelated members to the minimum
contract.

## Evidence

Strict production/declaration checks and current public type consumers exercise members,
structural extension, readonly restrictions and host-free consumption. They do not execute a
lifetime, freeze objects or prove cleanup, ordering, reentrancy or instance isolation.

Runtime evidence must exercise terminal-before-release observation, every required cleanup
attempt, invalid and terminal registration, duplicate obligations, borrowed lifetimes, partial
setup, failure and repeated/reentrant disposal. The
[tooling guide](../../../tooling/index.md#current-verification) owns current commands and their
actual coverage. No runtime suite is advertised for these unimplemented operations.
