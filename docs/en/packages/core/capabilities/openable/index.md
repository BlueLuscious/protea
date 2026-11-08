# Opening

Status: **Logical opening runtime with internal or borrowed external state authority**

Openable provides `isOpen`, `open()`, `close()` and `subscribeOpenChange()`. Its
`openableFactory.create(scope, options)` returns a capability bound to the supplied active
ComponentScope. Consume these through the [core root](../../index.md); the
[capability guide](../index.md) owns shared construction, lifetime, subscription and error rules.
Production contracts and generated declarations own complete signatures.

Logical opening is independent of visibility, mounting, animation and focus. This capability
does not define a Sidebar variant, modal interaction, host representation or style. `toggle`
is excluded because the retained consumers justify explicit opening and closing only.

## State authority and initial value

Creation requires one explicit control mode and keeps that choice for the captured lifetime.
Changing the original options later cannot switch modes or replace the selected authority.

| Mode | State owner | Inputs and initialisation |
| --- | --- | --- |
| `internal` | This capability. | Optional `initialOpen` defaults to false. The value is established before exposure without a change notification. An external authority is excluded. |
| `external` | One borrowed OpenStateAuthority. | Required `authority`, without a separate initial value, fallback writer or public setter. Establish the initial reading and source subscription before exposure without losing a transition. |

Internal opening has no additional opening guard or public authorisation hook. A live, idle
request commits a differing target and returns changed after eligible delivery. A repeated
target returns unchanged without notification.

In external control the capability projects the conforming source's value and notifications.
A public `isOpen` reading is an observation of that authoritative value, just as receiving the
source callback is. It creates no subscription or notification. A value already exposed by a
public read must not retreat to an older projection at finalisation. While active the public
reading agrees with the conforming source; after finalisation it returns the last observed
projection without reading or subscribing to the source again.

## External authority protocol

OpenStateAuthority supplies current `isOpen`, `requestOpen(nextOpen)` and change subscription.
The consumer provides this borrowed collaborator; Protea does not create another public state
store or assume lifetime ownership. Shape checks and TypeScript compatibility do not prove
that an arbitrary provider obeys the protocol.

A conforming authority must:

1. Establish a defined initial boolean before use. Its subscription registers without initial
   replay or a synthetic notification and follows the shared synchronous observation rules.
2. Return true only when the requested value is authorised and committed before return. An
   effective change must also have been delivered synchronously before return; an already
   satisfied request needs no transition or notification.
3. Return false on refusal without a state change, change notification or queued request from
   that call. The authority may refuse for its own busy state or domain rule without exposing
   that distinction. A live capability maps refusal to denied, not capability-local busy.
4. Publish exactly one coherent synchronous change for every effective source transition,
   including application-initiated changes outside capability requests. No-op transitions
   publish nothing.
5. Return false for reentrant source requests during its own request or notification delivery.
   Application mutation of that authority during its delivery is outside the supported protocol;
   no nested source transition or implicit queue is permitted.

A satisfied live, idle capability request returns unchanged without calling `requestOpen` again.
Otherwise it asks the source and projects the committed change. Its projection callback is
permitted inside the pending request; public reentrant opening requests remain busy.

This protocol excludes pending authorisation, asynchronous commitment and cancellation. A refused
request cannot silently become an accepted queued update. A future host must demonstrate that
its real public source meets the synchronous contract rather than treating a scheduler or promise
as immediate commitment. Sources and callbacks remain borrowed and are never incidentally disposed.

## Results and request ordering

`openableResultStatuses` provides changed, unchanged and rejected. OpenableResultStatusType
derives that closed set; OpenableResultType discriminates each outcome and requires a shared
reason when rejected. Rejection is distinct from a satisfied request. No caller-visible second
state authority or asynchronous acknowledgement is introduced.

| Condition | Result and effect |
| --- | --- |
| Owner disposed | Rejected with disposed before checking busy or target satisfaction; start no capability work. |
| Capability occupied | Rejected with busy before checking target satisfaction; no new transition, source request or queue. |
| Live, idle and target already effective | Unchanged; no authority call or change notification. |
| Internal target differs | Commit the target, deliver one effective change, then return changed normally. |
| External request accepted and its effective commitment observed while live | Project the source commitment, deliver eligible changes, then return changed normally. |
| External request refused while the owner remains active | Rejected with denied; no change, notification or queue caused by that refused delegation. |
| Application changes a conforming source | Project and deliver the effective change synchronously while this capability is occupied; there is no capability request result. |

Opening payloads describe opposite previous/current booleans: closed to open or open to closed.
They are transition snapshots, not writable state or a universal event payload. Shared
[subscription and failure rules](../index.md#subscriptions-and-synchronous-delivery) determine
registration order, eligibility and remaining callbacks after an error.

## Delegation and finalisation

Delegation is not an atomic transaction over the capability, its scope and the application.
Distinguish observation of commitment from an effect that a borrowed source may perform later:

| Disposal timing | Capability outcome and terminal projection |
| --- | --- |
| Owner ends before the capability observes an effective commitment for that request | Return rejected with disposed unless a collaborator throws. Freeze the last value observed before finalisation. An already-delegated source request may still change that source without notifying or reviving the capability; rejection promises no external rollback. |
| Owner ends after the capability observes commitment through a public read or source callback | Preserve changed when no error occurs. Keep the observed projection even if finalisation cancels every pending capability delivery before a listener starts. |

The authority's false response still guarantees that its own refused call caused no change or
notification. A provider exception may instead follow commitment or notification; preserve the
borrowed source and never infer refusal or roll it back from that exception.

Finalisation freezes the last observed projection, invalidates capability work, retires its
registrations and attempts source disconnection through the existing scope cleanup. It neither
requests closing nor emits a synthetic close. Failed physical disconnection cannot revive the
projection or deliveries; unrelated source consumers retain their own ownership and delivery.

## Qualification boundary

Actual runtime checks must distinguish no-op/refusal/commitment, both fixed authority modes,
source-driven changes, nested requests, public observation before source forwarding, disposal
before/after observed commitment and failed source release. Type checks cover compatible options,
results and readonly access; they cannot prove provider coherence, synchrony or cleanup.

No framework, DOM, renderer, animation engine or accessibility support follows from an open
boolean. The [integration guide](../../../../project/integration-boundaries.md) owns those future
host requirements, and [repository tooling](../../../../tooling/index.md) owns actual gates.
