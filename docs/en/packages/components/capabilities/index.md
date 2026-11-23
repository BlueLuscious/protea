# Reusable Capabilities

Status: **Portable activation, opening and checking runtimes**

Capabilities supply narrow behaviour to a model and borrow a [ComponentScope](../../core/component/index.md)
for lifetime and release registration. Each capability retains its own state and registrations.

## Documentation

| Page | Owns |
| --- | --- |
| [Activatable](activatable/index.md) | Discrete action acceptance, guards and observation. |
| [Checkable](checkable/index.md) | Checked state, authority, changes and request results. |
| [Openable](openable/index.md) | Logical opening, state authority, changes and request results. |
| [Shared](shared/index.md) | Rejection vocabulary and observation release contracts. |

## Construction and composition

`Activation.create(scope, options?)`, `Opening.create(scope, options)` and
`Checking.create(scope, options)` require an active conforming `ComponentScope`. The caller
retains disposal authority. A capability borrows the scope for terminal observation and cleanup
registration. See the [API guide](../api/index.md#contracts-and-values) for their public contracts.

Creation captures selected configuration values, the external authority reference where used
and configured callback references. Mutating the original options object does not reconfigure a
capability. The caller's options, sources and closures are not frozen or adopted. Each creation
has independent state, occupation and registrations. Sharing a scope shares lifetime; explicitly
sharing an external authority also shares that authority's state and refusal constraints.

The following application-owned composition uses only public contracts and values:

```ts
import { Scope } from "@luscious-garden/protea-core";
import { Activation, Opening } from "@luscious-garden/protea-components";

const scope = Scope.create();

try {
  const opening = Opening.create(scope, { control: "internal" });
  const activation = Activation.create(scope);

  scope.addCleanup(
    activation.subscribeActivation(() => {
      opening.open();
    }),
  );

  activation.activate();
} finally {
  scope.dispose();
}
```

The application owns the trigger connection and registers its release explicitly. The target's
opening outcome remains separate from activation acceptance; a consumer needing that distinction
must inspect the target result. No live getter is copied into another object, no state authority
is bypassed and no Button, Sidebar or Modal implementation is required by this composition.

### Failed setup

Factories validate their owning inputs and establish required connections before exposing a
completed capability. Failure exposes no partial capability: invalidate callbacks and links
allocated for that attempt before attempting all its required cleanup, including after another
cleanup failure. Propagate an opaque failure without disposing the borrowed scope, earlier
capabilities, external authorities or callback collaborators.

If setup finalises the scope before returning an acquired release handle, the creator must still
release what it acquired and expose nothing. Failed registration transfers no obligation to the
scope. A failed attempt already registered with the scope must leave an inert cleanup entry after
its own attempt, without retaining a source-release handle for an unintended retry. No rollback
of effects already performed by collaborators is promised.

An application wanting all-or-nothing composition owns disposal of its scope when an intermediate
creation fails, as in the example. The current factory protocol introduces no resource transfer,
capability replacement, reparenting, detach operation or independent capability lifetime.

## Results and named vocabularies

Each capability owns an immutable runtime vocabulary and derives its status type from that
authority. `openableResultStatuses` and `checkableResultStatuses` each contain `changed`,
`unchanged` and `rejected`. `activatableResultStatuses` contains `activated` and `rejected`.
Results preserve branch-specific status members, including the required reason on rejection.

Rejected results use the [shared rejection vocabulary](shared/index.md#rejection-reasons).

Public requests check disposed before busy, then their operation-specific conditions. A satisfied
state target is considered after those first checks. Occupation lasts through guard/source calls,
commitment and notification delivery, including source-driven delivery. A reentrant public
request on the same occupied capability returns `rejected` with `busy` without queuing work.
An external-source callback can still project a commitment during a pending request.

Separate instances and capabilities have no implicit common busy flag or mutable state. A
vocabulary's runtime immutability and a consumer's readonly type view are separate guarantees;
readonly results do not imply universal deep freezing, nominal identity or ownership enforcement.
Unexpected exceptions are not members of the result unions and do not establish rollback.

## Subscriptions and synchronous delivery

Opening and checked-change subscribers receive previous/current booleans for one effective transition.
Activation subscribers receive acceptance without a universal payload. Neither notification
reports rejected or unchanged requests as effective changes. Their operation results carry
those distinctions.

Capabilities use the [shared observation runtime](../shared/index.md#runtime) for
independent registrations, ordered delivery and terminal checks. Conforming external authorities
follow these delivery rules for their own notifications. The [release contract](shared/index.md#observation-release)
defines what a returned unsubscribe owns.

Callbacks and guards must satisfy their synchronous protocols. TypeScript can accept a
Promise-returning callback in a void-return position; no returned promise is awaited and its
later effects gain no ordering, completion or cancellation guarantee from these APIs.

## Ownership, finalisation and failure

The source owns registration storage; a subscribing consumer owns its acquired release
obligation. The capability owns registrations and any connection it acquires to an external
authority, released through its captured scope. Supplied authorities and callbacks are borrowed.
Holding an unsubscribe does not transfer the source's lifetime.

Scope finalisation is terminal before physical release callbacks, so capability work and delivery
must stop even if its cleanup has not run yet or physical disconnection fails. Attempt every
owned release under the component protocol; only the initial disposal's normal return establishes
successful synchronous release. Repeated disposal does not retry failures.

Opening and Checking preserve their last observed values at finalisation. Finalisation retires
the capability's source registration while the borrowed source retains its value and unrelated
registrations. Observers receive effective changes or accepted actions during the active lifetime.

An application subscription on another model remains application-owned even if its target ends.
The application must release its own connection; target disposal cannot remove records owned by
a different source. No manager, implicit membership or cross-component transaction is supplied.

An exception may follow committed state or accepted activation. Preserve the commitment and
attempt remaining eligible observers; callers must not infer refusal, assume external rollback
or automatically retry activation from that exception. The
[Opening](openable/index.md#delegation-and-finalisation) and
[Checking](checkable/index.md#finalisation-and-failure) guides describe delegated outcomes.

## Evidence and limits

Runtime regressions must exercise both control modes, refusals, repeats, independent/shared
instances, guard rechecks, nested requests, subscription mutation, callback failures, disposal
during requests/delivery and partial setup. Public type and distribution consumers independently
check declarations, choices and actual exports. The [tooling guide](../../../tooling/index.md)
owns actual commands and coverage; local, hosted and publication evidence remain distinct.

[Component families](../../../project/component-direction.md) own model composition.
[Host integrations](../../../project/integration-boundaries.md) own events, rendering, focus and
optional providers for their environment.
