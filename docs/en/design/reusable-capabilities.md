# Reusable Capabilities

Status: **Private experimental capability design; no runtime implementation**

This guide owns request, state-authority and observation semantics for the retained reusable
capabilities. The [component foundation](component-foundation.md) retains its accepted identity,
logical lifetime and disposal rules. The [design scope](index.md), [vocabulary](vocabulary.md)
and [responsibility map](responsibilities.md) supply the surrounding boundaries.

The private declarations own signatures:

- [Shared capability definitions](../../../design/capabilities/api/index.ts).
- [Opening contracts and types](../../../design/openable/api/index.ts).
- [Activation contracts and types](../../../design/activatable/api/index.ts).
- [Non-executed consumption examples](../../../design/examples/capabilities.test.ts).

These are experimental authoring entrypoints, not package exports or executable components.
This guide specifies no public class, constructor, factory or controller. A capability consumer
does not acquire the whole component interface: later component contracts compose the relevant
capabilities with `Component`, sharing one logical lifetime without changing its foundation.

## Retained responsibilities

| Candidate     | Consumer and disposition                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Openable`    | Retained for logical opening in the floating-sidebar and modal scenarios. A permanently visible sidebar does not need this capability. |
| `Activatable` | Retained for a simple control that requests an action. Activation is not persistent opening, selection or pressed state.               |
| `Pressable`   | Deferred: the current action scenario supplies no distinct persistent-state consumer requiring this contract.                          |
| `toggle`      | Excluded: the current consumers justify explicit opening and closing, without an additional inversion operation.                       |

These scenarios justify capability responsibilities, not family declarations, parts, concrete
classes, rendering algorithms or a complete component catalogue. Logical opening is independent
of animation, focus, host mounting and presentation. Activation requires no icon, motion system,
framework event or ambient host service.

## Result vocabularies

Each capability owns its named status vocabulary:

- [openableResultStatuses](../../../design/openable/constants/openable-result-statuses.constant.d.ts)
  owns opening outcomes; [OpenableResultStatusType](../../../design/openable/types/openable-result-status.type.ts)
  derives their union.
- [activatableResultStatuses](../../../design/activatable/constants/activatable-result-statuses.constant.d.ts)
  owns activation outcomes; [ActivatableResultStatusType](../../../design/activatable/types/activatable-result-status.type.ts)
  derives their union.

These are string choices with named members. Each result branch refers to its specific member
type, retaining the relationship between rejection and its required reason. Assigning the whole
status union to every branch would lose that discrimination. Existing string literal consumers
remain valid; no nominal enum identity is introduced.

Opening distinguishes a changed state from an already-satisfied request; activation represents
an accepted action. Those responsibilities do not justify a generic success status or an added
resource discriminator. The shared rejection-reason vocabulary still supplies its two real
consumers without broadening either capability's outcomes.

The vocabulary objects are ambient declarations describing future values. Their private
entrypoints export them for type queries only; no object or enum is implemented or available at
runtime. Declaration-only examples can describe their named members without executing them.
Readonly members establish a type restriction, not proof of runtime freezing. Later implementation
must reconcile any concrete vocabulary producer with these reviewed declarations.

## Opening and state authority

`Openable` exposes the current logical openness through `isOpen`. Its opening and closing
requests distinguish an effective change, an already-satisfied request and a rejected request.
The `changed`, `unchanged` and `rejected` result statuses are separate outcomes; rejection is
never represented merely as no change. Rejection reasons distinguish `disposed`, `busy` and
`denied`.

Two synchronous control modes are supported. Creation selects one mode permanently; changing
the options object later does not switch modes or replace the selected authority.

### Internal control

In `internal` mode, the component owns openness. The optional `initialOpen` value defaults to
`false` and is established before the instance is exposed. Initial state creates no change
notification. An active, idle instance commits an opening or closing request when its target
differs from the current state; no additional opening guard or public authorisation hook exists.
An already-satisfied request returns `unchanged` without a notification.

### External control

In `external` mode, an explicitly supplied, borrowed `OpenStateAuthority` is the sole owner of
openness. There is no separate initial-open option, fallback state owner or public component
setter. The component projects the source's state and changes instead of maintaining a second
writable authority. While active, its public openness agrees with the conforming source.
A public reading captures that authoritative value as an observation by the capability, just
as receiving its source-change callback does. Finalisation must not make a value already exposed
by such a reading retreat to an older projection. Reads create no notification or subscription.

The authority supplies current openness, an opening-state request operation and change
subscription. Its synchronous protocol is:

- The source establishes a defined initial boolean before use. Creation establishes the
  component's initial reading and source subscription before exposing it, without losing a
  transition between those steps.
- A `true` response from `requestOpen` means that the requested state is authorised and is
  already committed before the operation returns. If the state changed, its synchronous
  change notification has been delivered before that return. An already-satisfied request
  needs no transition or notification.
- A `false` response means refusal: no state change, change notification or queued request
  results from that call. If the owner remains active, the capability maps refusal to
  `rejected` with reason `denied`.
  The authority may refuse because of its own busy state or domain rule without exposing
  that distinction. Capability-local occupation alone produces the `busy` reason.
- Every effective source transition publishes exactly one coherent synchronous change, even
  when the application initiates it outside a capability request. Unchanged state produces
  no change notification. Subscribing does not replay an earlier transition or publish an
  initial notification.
- A re-entrant request on the authority during its own request or delivery returns `false`.
  Application mutation of that authority during its own delivery is outside the supported
  protocol. No nested source transition or implicit queue is permitted.

When the capability is active and idle, a request whose target already matches its public state
returns `unchanged` without asking the authority again. Otherwise it asks the source and projects
the source's committed change. The projection callback needed to report that change is allowed
inside the capability's pending synchronous request; it is not a second public request.

Delegation is not an atomic transaction over the component and application. If the owner is
finalised before the capability observes an effective commitment for that request, the capability
returns `rejected` with reason `disposed`, unless a collaborator throws. Its projection remains
at the last value observed before finalisation. That rejection does not guarantee rollback or
absence of effects on the borrowed authority: an already-delegated request may change the source
after the model ends, without notifying or reviving the capability. A source's `false` response
still guarantees that its own refused delegation causes no state change or change notification.
If the capability already observed the committed change, through a public reading or its source
callback, before the owner is finalised, `changed` is retained when no error occurs. Finalisation
can cancel all capability notification deliveries before any listener runs; that does not undo
an observation already made by the capability.

A provider error can propagate after source commitment or notification. The component must not
roll back the borrowed source or infer that an exception proves refusal. This contract requires
a coherent source; it does not claim correctness of an arbitrary provider's implementation or
private consumers.

This model excludes pending authorisation, asynchronous commitment and cancellation. A refused
request cannot later become an implicitly accepted queued request. A future host adapter,
including a Lilium adapter, must establish that its public source meets this synchronous
protocol; it must not invent compatible host APIs or silently turn asynchronous updates into
immediate commitments.

## Activation

`Activatable` requests an action without creating persistent activation, selection, pressed or
opening state. Every accepted call represents a new activation, including a repeated call after
the previous call has completed. Its result is `activated`; refusal is `rejected` with a reason.
An activation notification reports acceptance, not successful completion of application business
work, navigation, rendering or another component's operation.

The optional synchronous `canActivate` callback defaults to allowing activation. It is consulted
only after the lifecycle and local-busy checks. A false result on an otherwise active instance
produces `denied`, with no activation notification. The callback may execute application code,
including finalising the owner, so lifecycle is checked again before acceptance. Finalisation
at that point produces `disposed` rather than accepting an activation. If the guard throws,
that failure propagates; no activation has been accepted.

Acceptance precedes the synchronous activation notification, which precedes a normal result.
There is no activation counter, timestamp, universal input payload, action identifier or
business-result channel. A later responsibility must justify any such addition.

## Request ordering and operation matrix

Public requests first reject a finalised instance, even when an opening target would already
be satisfied. They then reject occupation of the same capability with `busy`. The capability
remains occupied while requesting, evaluating its guard where applicable, committing and
delivering its notifications. Source-driven opening delivery also occupies the capability,
even when no public opening or closing request is in progress.

A re-entrant public request on that occupied capability returns `rejected` with reason `busy`;
it is not queued. A source callback reporting the current opening request's commitment remains
permitted. Other instances have no implicit shared busy flag or state. Sharing an explicitly
supplied external authority intentionally shares that source's state and refusal constraints;
it does not create an unmentioned global state owner.

| Operation and condition                                                                                | Authority and result                                                    | State and notification                                                                                                                 |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Read openness while active                                                                             | Internal state or the selected external source.                         | Read-only observation of current openness; no subscription or transition.                                                              |
| Read openness after finalisation                                                                       | The component's retained last observed value.                           | No new source read or subscription; no transition.                                                                                     |
| Open or close after finalisation                                                                       | `rejected`, reason `disposed`, before any other request check.          | No new component work or notification, even for a satisfied target.                                                                    |
| Open or close while locally occupied                                                                   | `rejected`, reason `busy`.                                              | No transition, authority request or notification from the rejected call.                                                               |
| Open or close while active and idle, target already satisfied                                          | `unchanged`.                                                            | No authority call, transition or notification.                                                                                         |
| Internal opening request with a different target                                                       | The component commits the target; `changed` after delivery.             | One effective change, committed before its change notification.                                                                        |
| External opening request accepted by its source and observed by the live capability                    | The source commits the target; `changed` after projection and delivery. | One projected effective change; no independent component write.                                                                        |
| External opening request refused by its source while the owner remains active                          | `rejected`, reason `denied`.                                            | No transition, notification or queue from the refused call.                                                                            |
| Owner finalises during external delegation before the capability observes effective commitment         | `rejected`, reason `disposed`, unless the collaborator throws.          | Freeze the last observed projection; the already-delegated source may change independently without component notification or rollback. |
| Owner finalises after the capability observes commitment through its public reading or source callback | Preserve `changed` if no callback or collaborator error occurs.         | Keep that committed projection; cancel pending deliveries, including those not yet begun, without reviving the owner.                  |
| Application changes a conforming external source                                                       | The source commits; there is no capability request result.              | One projected effective change, delivered synchronously while the capability is occupied.                                              |
| Activate after finalisation or while occupied                                                          | `rejected`, respectively `disposed` or `busy`.                          | No guard invocation or activation notification.                                                                                        |
| Activation guard returns false and the instance remains active                                         | `rejected`, reason `denied`.                                            | No activation or persistent-state change.                                                                                              |
| Activation guard finalises the owner before acceptance                                                 | `rejected`, reason `disposed`.                                          | No activation; the foundation's finalisation remains irreversible.                                                                     |
| Active, idle activation passes its guard                                                               | `activated` after delivery.                                             | One activation notification; repeated accepted calls are distinct activations.                                                         |
| Subscribe while active                                                                                 | Register a separate subscription and return its unsubscribe operation.  | No initial notification; additions during delivery start with the next delivery.                                                       |
| Subscribe after finalisation                                                                           | Throw an opaque error without registering anything.                     | No new subscription or notification.                                                                                                   |
| Unsubscribe, including repeated calls or calls after finalisation                                      | Idempotent removal of that registration.                                | No component finalisation or notification.                                                                                             |
| Finalise the component                                                                                 | The existing foundation contract applies.                               | Cancel pending capability deliveries and attempt to release every owned subscription; no artificial close or activation.               |
| An eligible notification callback throws                                                               | Attempt remaining eligible callbacks, then throw an opaque error.       | Preserve any committed change or accepted activation; do not turn it into rejection or roll it back.                                   |

The order describes observable obligations, not a selected storage, dispatcher or transition
implementation. No public request promises that the owner remains active after arbitrary
consumer callbacks. If a notification callback finalises the owner after commitment or activation,
the already-accepted result remains `changed` or `activated` when no error occurs, while pending
deliveries are cancelled. For delegated opening, observing commitment through a public reading
also preserves `changed` if finalisation prevents notification delivery from starting.

## Observation, failures and cleanup

Opening payloads describe the previous and current booleans of one effective transition. The
directions are opposite: closed to open or open to closed. They are snapshots of that transition,
not writable state authorities. Activation subscribers receive the acceptance notification
without a universal payload. Neither subscription reports rejected or unchanged requests as
effective changes; their request results carry those distinctions.

Capability notifications and a conforming authority's change notifications run synchronously in
registration order. Each subscription is a separate
registration, including multiple registrations of the same callback. A registration added during a delivery
does not join that delivery. Unsubscribing before a callback's turn prevents its invocation;
repeated unsubscription is a no-op. A callback already executing is allowed to finish. Owner
finalisation cancels its remaining capability deliveries and prevents later notifications from
reviving component work. It retires the component's source registration without cancelling other
authority registrations or the authority's unrelated notification deliveries.

One callback failure does not cancel other callbacks still eligible for that delivery. After
attempting those callbacks, delivery throws an opaque error; no error class, aggregation shape
or failure ordering is selected. Commitments and accepted activations are not rolled back.
An exception can therefore occur after the requested effect or activation was accepted. A caller
must not infer rejection from an exception or automatically retry an activation. Failures from
borrowed external code can also propagate without undoing source commitment.

Callbacks and guards must obey their synchronous contracts. A `void` callback type does not
prove synchrony: TypeScript can accept Promise-returning implementations in that position.
No returned promise is awaited as part of this protocol, and asynchronous callback effects
provide no additional ordering, cancellation or completion guarantee.

The component owns its subscription registrations and any connection it creates to an external
authority. Its lifecycle owner releases those resources under the foundation's disposal rules.
Consumer unsubscribe operations release only their own registrations; holding one confers no
authority to finalise the component. The authority and callback collaborators are borrowed and
must not be finalised as an incidental consequence of component disposal.

Finalisation retains the last observed openness, attempts source disconnection and rejects subsequent
requests. It does not command the external authority to close, mutate a shared source or emit
an artificial closing notification. Its terminal projection no longer follows later source
updates. Subscription attempts after finalisation fail without registration; existing unsubscribe
operations remain valid and idempotent.

Resource-release failures retain the foundation's semantics: attempt every owned release, then
throw an opaque error if a required release failed. Only the initial disposal call's normal
return proves successful completion of those synchronous obligations. Logical finalisation,
frozen projection and cancellation of component deliveries do not depend on successful physical
disconnection; a failed release must not revive the component or its notifications.

Creation captures the chosen control mode, initial value where applicable, source reference and
configured callback references before exposure. Later mutation of the original options object does not
reconfigure the component. This does not freeze caller-owned objects or make captured closures
immutable. The explicitly selected external source remains live in the projection while active;
there is no other implicit cross-instance state sharing.

## Evidence and later implementation

The private prototype and its non-executed examples describe consumption, composition, legal
control options, results and callback payloads. The [tooling guide](../tooling/index.md#current-verification)
owns actual commands and check coverage. Types can reject conflicting initial-state options,
invalid result shapes, writable access through readonly contracts and unsupported capability
members. They do not prove source coherence, synchrony, ownership or runtime immutability.

Later implementation evidence must verify effective transitions, refusal and no-op distinctions,
guard rechecks, re-entrant rejection, notification order, subscription mutation during delivery,
callback failures, disposal during requests, freezing a value read before source forwarding,
borrowed-source cleanup and instance isolation.
No listeners, state store, transition algorithm, runtime component or functional adapter is
implemented here. Family contracts, host integration, public package boundaries and distribution
remain with their owning work.
