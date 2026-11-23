# Checking

Status: **Checked-state runtime with internal or borrowed external authority**

`Checking.create(scope, options)` returns a `Checkable` with a readable `isChecked` value,
an explicit `requestChecked(nextChecked)` operation and `subscribeCheckedChange(listener)`.
Import `Checking` and its `CheckingApi` contract from the [Components root](../../api/index.md).
The caller owns the supplied active `ComponentScope`. [Switch](../../components/switch/index.md)
uses Checking with its own family instance scope.

## State authority

`CheckableOptionsType` requires one fixed mode. Creation captures its inputs and, in external mode,
the selected source and its operations. Calls preserve the source's receiver.

| Mode | State owner and input |
| --- | --- |
| `internal` | Checking owns the boolean. Omit `initialChecked` to start at `false`. A supplied initial value must be a boolean. Omit `authority`. |
| `external` | Supply a `CheckedStateAuthority` as the sole state owner. Omit `initialChecked`. Checking borrows the source and connects before exposing the capability. |

Both modes establish the initial reading before exposure, with no change notification. In external
mode, reading `isChecked` while active reads the authoritative value and retains it for terminal
reads. An earlier read of the new value during source delivery still leaves the corresponding
change available to observers through the source notification.

## External authority protocol

A `CheckedStateAuthority` supplies `isChecked`, `requestChecked(nextChecked)` with a boolean
result, and `subscribeCheckedChange(listener)`. It owns authorisation, commitment and its
own registrations. It establishes a boolean before use and registers listeners without replay.

- Commit an authorised differing target and deliver its change synchronously before returning
  `true`. An already satisfied target needs no transition.
- Return `false` on refusal without changing the value, notifying or queuing work from that call.
- Publish one coherent transition for each effective update, including changes initiated by the
  application. Refuse nested writes during an authority request or notification delivery.

The source retains its lifetime owner. Type compatibility alone cannot establish its timing or
delivery guarantees. Application work that takes time can finish before the application makes a
new synchronous request. See the [integration boundaries](../../../../project/integration-boundaries.md#requests-and-observations).

## Requests and observation

`CheckableResultType` discriminates outcomes using `checkableResultStatuses`. The immutable
vocabulary also supplies `CheckableResultStatusType`. A rejection carries a
[shared reason](../shared/index.md#rejection-reasons).

| Condition | Outcome |
| --- | --- |
| The scope is terminal. | `rejected` with `disposed` before any other request work. |
| This capability is occupied by a request or change delivery. | `rejected` with `busy`, even for a satisfied target. |
| The validated target already matches the effective value. | `unchanged` without delegation or notification. |
| The differing target commits internally or its accepted authority commitment is observed. | `changed` after eligible synchronous delivery. |
| The borrowed authority refuses while the scope remains active. | `rejected` with `denied`. |

An active, idle request validates its boolean target before reading or delegating. Each effective
change supplies a readonly `CheckableChangeType` with opposite `previous` and `current` booleans.
Registrations have independent, idempotent releases and follow the
[shared observation rules](../index.md#subscriptions-and-synchronous-delivery). A source
callback can publish its commitment during delegation while new public requests remain busy.

## Finalisation and failure

If the scope ends during a request, preserve `changed` when Checking already observed the
accepted commitment. Otherwise the request returns `rejected` with `disposed`, unless a
collaborator throws. The source may finish work already delegated to it independently.

Finalisation keeps the last observed value readable and stops requests and delivery. It releases
the acquired source subscription and retires local registrations without finalising the source.
New subscriptions throw. Failed setup or teardown invalidates retained callbacks before physical
release, following the [shared setup and ownership rules](../index.md#failed-setup).

Invalid inputs, malformed source results or transitions, and collaborator exceptions are failures.
A report of acceptance with the target still uncommitted is a protocol failure. An exception can
follow a commitment, so recovery reads the effective value before deciding whether to retry.
The [quality guide](../../quality.md#checks) records portable runtime and consumer coverage.
