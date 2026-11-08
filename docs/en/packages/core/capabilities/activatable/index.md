# Activation

Status: **Synchronous activation acceptance runtime implemented**

Activatable provides `activate()` and `subscribeActivation()` without persistent activation,
pressed, selected or opening state. `activatableFactory.create(scope, options?)` binds one
capability to the supplied active ComponentScope. Consume it through the [core root](../../index.md);
the [capability guide](../index.md) owns shared construction, lifetime, observation and failure rules.
Production source and generated declarations own complete signatures.

## Eligibility and acceptance

An omitted options object or omitted `canActivate` guard defaults to acceptance. The optional
guard is synchronous authorisation, not an action executor, persistent disabled-state API,
browser event handler or lifecycle owner. Its configured reference is captured at creation;
mutating the original options object cannot replace it.

Every accepted call is one new activation, including a repeated call after the preceding call
has completed. Acceptance precedes notification, which precedes a normal result. Notification
reports that acceptance; it does not prove navigation, application-work completion, rendering
or another component's operation succeeded.

## Results and request order

`activatableResultStatuses` provides activated and rejected. ActivatableResultStatusType derives
that closed set; ActivatableResultType requires a shared reason for rejection. Activation does
not reuse opening's changed/unchanged meanings or become a generic successful resource action.

| Condition | Result and observable work |
| --- | --- |
| Owner disposed | Rejected with disposed before any busy or authorisation check; no guard or notification. |
| This capability occupied | Rejected with busy, without guard execution, notification or queued work. |
| Guard returns false and the owner remains active | Rejected with denied; no accepted activation or persistent-state change. |
| Guard finalises the owner before acceptance | Rejected with disposed after the lifecycle recheck, even if the guard authorises. |
| Guard throws | Propagate the failure without acceptance; it is not a denial result. |
| Live, idle request passes authorisation | Accept once, deliver eligible observers synchronously, then return activated normally. |

The capability remains occupied through authorisation, acceptance and notification. Requests on
that same occupied capability are rejected with busy; other capabilities and instances have no
implicit shared busy flag. Their captured scope can still give them a shared lifetime.

A callback may finalise the owner after acceptance. Keep activated when no error occurs while
cancelling pending deliveries under the shared rules. If an eligible observer throws, attempt
remaining eligible observers and throw opaquely without undoing acceptance. Do not infer refusal,
application rollback or safe automatic retry from the exception.

## Observation and ownership

`subscribeActivation` registers a synchronous listener without replay, initial invocation or a
universal payload. Independent duplicates, additions/removals during delivery, idempotent
unsubscribe and errors follow the [shared protocol](../index.md#subscriptions-and-synchronous-delivery).
No activation count, timestamp, action identifier or business-result channel is introduced.

The capability borrows its scope, guard and listeners. It owns its registrations and registers
cleanup with that fixed scope without gaining disposal authority over the parent or borrowed
collaborators. Disposing the parent cancels pending delivery; subscribe after finalisation throws
without registration. Existing unsubscribe handles remain valid and idempotent.

There is no independent dispose/detach/replace operation. A future persistent pressed or selected
state needs its own justified contract; Pressable and browser gesture processing remain deferred.

## Qualification boundary

Runtime checks exercise default acceptance, guard refusal/failure, finalisation during guard and
delivery, repeats, reentrancy, subscription mutation, callback failures, setup failure and instance
isolation. Public type/distribution consumers independently check options, outcomes and real
exports. The [tooling guide](../../../../tooling/index.md) owns actual commands and evidence limits.

The optional guard does not continuously publish availability. A future host cannot infer a
disabled-state subscription, accessible button interaction or input/focus behaviour from it.
Those remain with [concrete component and host work](../../../../project/component-direction.md).
