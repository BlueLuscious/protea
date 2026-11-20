# Shared Capability Contracts

Status: **Implemented in Core**

This feature owns the public contracts common to [Openable](../openable/index.md) and
[Activatable](../activatable/index.md). Each capability owns its state, operation results and
rules for accepting a request.

## Rejection reasons

The immutable `capabilityRejectionReasons` vocabulary supplies `CapabilityRejectionReasonType`.

| Reason | Meaning |
| --- | --- |
| `disposed` | The captured owner has ended its logical lifetime. |
| `busy` | This capability is already processing a request or delivering a notification. |
| `denied` | The relevant external authority or activation guard refused authorisation. |

These are expected rejection reasons. The [capability composition guide](../index.md#results-and-named-vocabularies)
describes request precedence and the effect of unexpected failures.

## Observation release

`CapabilityUnsubscribeType` releases one subscription. Repeated calls are harmless, including
after finalisation. The caller owns the release obligation. The source retains its own lifetime,
and other registrations, including repeat registrations of the same listener, remain independent.
The [shared observation runtime](../../shared/index.md#runtime) owns in-package delivery behaviour.
