# Component Foundation

Status: **Component lifetime and cleanup runtime implemented**

This guide owns component lifetime, scope construction and cleanup registration.
The [production source](../../../../../packages/core/src/component/) owns signatures; the
[core package](../index.md) exports them through its root and emits declarations from that source.
The root exports `componentScopeFactory` and `componentLifecycleStates`, alongside the
`Component`, `ComponentScope`, `ComponentScopeFactory` and `ComponentLifecycleType` contracts.
Implementation classes and their constructors remain private to the package.

## Identity and lifetime

A component is an individual model whose object reference supplies identity throughout its
lifetime and after finalisation. Aliases preserve that identity; structural compatibility does
not make two objects the same instance. The foundation introduces no universal identifier,
DOM identifier, configuration, state store, event bus or manager registration.

Lifecycle distinguishes `active` from terminal `disposed`. Active means the logical lifetime
has not ended; it says nothing about mounting, visibility, eligibility, openness or work currently
in progress. Creation must expose an active model. The transition to disposed is irreversible
and must prevent new model work without inventing closing or activation notifications.

`componentLifecycleStates.active` and `.disposed` are the named string choices in a frozen
vocabulary object. ComponentLifecycleType derives its union from that authority; existing
`"active"` and `"disposed"` string consumers remain compatible. These are lifecycle states,
separate from the result statuses of a future capability operation.

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

`componentScopeFactory.create()` accepts no options and returns a new active scope. Each call
has its own lifetime and cleanup entries. Creating a scope acquires no external resource, calls
no application callback and attaches no capability. The caller owns the new scope's disposal.
The factory exposes completed scopes rather than a public implementation constructor.

The following application-owned helper registers a caller-supplied synchronous release before
letting a consumer borrow the minimum component contract:

```ts
import {
  componentScopeFactory,
  type Component,
} from "@luscious-garden/protea-core";

export function useOwnedResource(
  release: () => void,
  consume: (component: Component) => void,
): void {
  const scope = componentScopeFactory.create();

  try {
    scope.addCleanup(release);
    consume(scope);
  } finally {
    scope.dispose();
  }
}
```

The helper owns the created scope; borrowing it as Component does not transfer lifecycle
authority. A failed registration retains or invokes nothing, so its caller still owns that
unregistered release obligation. Once registered, finalisation attempts it even if the consumer
throws. A release failure propagates opaquely; no particular aggregation of simultaneous
application and cleanup failures is promised by this example.

The [capability construction protocol](../capabilities/index.md#failed-setup) applies those
ownership rules to actual opening/activation setup: failure cleans only its own acquisitions
and preserves the borrowed scope. Effects already performed by collaborators are not rolled
back. The scope factory itself takes no resource-acquisition callback or options.

The contracts remain independent of implementation classes. A conforming structural owner is
permitted, but its shape alone proves neither atomic registration, synchronous finalisation nor
resource ownership. Native private implementation state and any genuine class specialisation
remain implementation responsibilities.

Closing a future Modal is distinct from finalising it. Removing a host representation is also
distinct from ending a borrowed model's lifetime. Component-specific policies and optional
capabilities must preserve these boundaries without adding unrelated members to the minimum
contract.

## Evidence

Strict production/declaration checks and public type consumers exercise members, structural
extension, readonly restrictions and host-free consumption. Separate runtime tests consume a
fresh built public package to exercise creation, independent instances, terminal-before-release
observation, every required cleanup attempt, invalid/terminal registration, duplicate obligations,
borrowing, failure and repeated/reentrant disposal.

This runtime evidence does not establish opening, activation, host teardown or accessibility.
The [tooling guide](../../../tooling/index.md#current-verification) owns actual commands and
coverage; local, hosted and publication evidence remain separate.
