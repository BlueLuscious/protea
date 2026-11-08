# Reusable Capabilities

Status: **Portable opening and activation runtime implemented within core**

Capabilities supply narrow behaviour to a model that needs it. [Opening](openable/index.md) owns
logical openness and its state authority; [activation](activatable/index.md) owns acceptance of
an action. Both borrow the existing [ComponentScope](../component/index.md), sharing its logical
lifetime without adding opening or activation members to every Component.

The source groups these responsibilities under `src/capabilities/{openable,activatable,shared}`.
The group is an organising boundary, not another npm package, facade or mandatory base class.
Public consumption uses the [core package root](../index.md). Production source owns signatures
and emits declarations; these guides own semantics, ownership and limitations.

## Construction and composition

`openableFactory.create(scope, options)` and `activatableFactory.create(scope, options?)` require
an active conforming ComponentScope. Their public contracts are OpenableFactory and
ActivatableFactory. The caller owns the supplied scope's lifetime; a capability borrows it for
terminal observation and cleanup registration and cannot dispose it independently.

Creation captures selected configuration values, the external authority reference where used
and configured callback references. Mutating the original options object does not reconfigure a
capability. The caller's options, sources and closures are not frozen or adopted. Each creation
has independent state, occupation and registrations. Sharing a scope shares lifetime; explicitly
sharing an external authority also shares that authority's state and refusal constraints.

The following application-owned composition uses only public contracts and values:

```ts
import {
  activatableFactory,
  componentScopeFactory,
  openableFactory,
} from "@luscious-garden/protea-core";

const scope = componentScopeFactory.create();

try {
  const opening = openableFactory.create(scope, { control: "internal" });
  const activation = activatableFactory.create(scope);

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
authority. `openableResultStatuses` contains changed, unchanged and rejected;
`activatableResultStatuses` contains activated and rejected. Results preserve branch-specific
status members, including the required reason on rejection. Opening's no-op and activation's
acceptance do not become a generic success status or resource discriminator.

The shared `capabilityRejectionReasons` vocabulary supplies `CapabilityRejectionReasonType`:

| Reason | Meaning |
| --- | --- |
| `disposed` | The captured owner has ended its logical lifetime. |
| `busy` | This capability is already processing a request or delivering a notification. |
| `denied` | The relevant external authority or activation guard refused authorisation. |

Public requests check disposed before busy, then their operation-specific conditions. A satisfied
opening target does not bypass those first checks. Occupation lasts through guard/source calls,
commitment and notification delivery. Source-driven opening delivery also occupies that opening
capability. A reentrant public request on the same occupied capability is rejected with busy,
without queuing work. The current external-source projection callback is permitted inside its
pending opening request; it is not a second public request.

Separate instances and capabilities have no implicit common busy flag or mutable state. A
vocabulary's runtime immutability and a consumer's readonly type view are separate guarantees;
readonly results do not imply universal deep freezing, nominal identity or ownership enforcement.
Unexpected exceptions are not members of the result unions and do not establish rollback.

## Subscriptions and synchronous delivery

Opening-change subscribers receive previous/current booleans for one effective transition.
Activation subscribers receive acceptance without a universal payload. Neither notification
reports rejected or unchanged requests as effective changes. Their operation results carry
those distinctions.

Capability notifications and conforming external-authority notifications obey these rules:

- Subscribing while active registers one observation without initial replay or notification.
  Every registration is independent, including duplicate callback references.
- Delivery is synchronous in registration order. A registration added during delivery starts
  with the next delivery. Unsubscribing before its turn prevents invocation; a callback already
  executing may finish.
- The returned `CapabilityUnsubscribeType` function removes only that registration. It is
  idempotent, including after finalisation, and confers no authority to dispose the source,
  listener, target or owner.
- Subscribing after the owner is disposed throws opaquely without registration. Finalisation
  cancels remaining capability deliveries and prevents later callbacks reviving model work.
- One callback failure does not cancel other callbacks still eligible for that delivery. Attempt
  them before throwing an opaque failure, without promising an error class, aggregation shape
  or failure order. Disposal can make pending callbacks ineligible even during that error path.

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

Opening preserves its last observed projection at finalisation. Finalisation requests no closing,
does not mutate an external source and invents no activation or change event. It retires the
capability's source registration without cancelling unrelated registrations or deliveries owned
by that source. Opening-change observation is not a disposal publisher.

An application subscription on another model remains application-owned even if its target ends.
The application must release its own connection; target disposal cannot remove records owned by
a different source. No manager, implicit membership or cross-component transaction is supplied.

An exception may follow committed state or accepted activation. Preserve the commitment and
attempt remaining eligible observers; callers must not infer refusal, assume external rollback
or automatically retry activation from that exception. Detailed delegated-opening outcomes
belong to the [opening guide](openable/index.md#delegation-and-finalisation).

## Evidence and limits

Runtime regressions must exercise both control modes, refusals, repeats, independent/shared
instances, guard rechecks, nested requests, subscription mutation, callback failures, disposal
during requests/delivery and partial setup. Public type and distribution consumers independently
check declarations, choices and actual exports. The [tooling guide](../../../tooling/index.md)
owns actual commands and coverage; local, hosted and publication evidence remain distinct.

These capabilities supply no DOM events, rendering, focus, persistent selection, Pressable,
toggle operation, framework scheduler, manager or optional icon/motion dependency. Original
[component families](../../../project/component-direction.md) and concrete
[host integration](../../../project/integration-boundaries.md) retain their own responsibilities.
