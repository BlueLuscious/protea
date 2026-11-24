# Select

Status: **Portable single selection with an application-owned authority**

Select projects one selected string value from a fixed, ordered set of options. The
application owns the selection and its policy. A host uses the option values for identity and
supplies labels and presentation.
The [native theme example](../../../../../../examples/web/README.md#try-theme-selection) supplies
an application-owned authority and connects Select to a labelled native chooser.

## Construction and ownership

Import `Select` and its public family types from
`@luscious-garden/protea-components/select` or the Components root. The
`@luscious-garden/protea-components/definitions/select` entry exports `SelectDefinition`
with identity `{ namespace: "protea", name: "select" }`. It is the same prepared object as
`Select.definition`. Both `Select.create(config)` and
`Component.create(SelectDefinition, config)` use it to create a `SelectInstance` with its own
Core lifetime. The caller owns disposal. The
[Components API guide](../../api/index.md#family-and-definition-entries) lists the exact exports.

`SelectOptionsType` requires ordered `options` and a borrowed `SelectionAuthority`. Each
`SelectOption` has a non-empty string `value` and an optional boolean `disabled`. Identity
uses the exact string. Construction rejects empty option lists, duplicate values and malformed
records before observing the authority. The model copies and freezes the list and its records
and exposes the captured list as readonly `options`.

The authority supplies the initial `selectedValue`, which must belong to the captured options.
It may be a disabled option. Each instance keeps its own observations and lifetime, including
when instances borrow the same authority.

## Selection authority

The authority provides a readonly `selectedValue`, synchronous
`requestSelection(nextValue)` returning a boolean, and
`subscribeSelectionChange(listener)` returning a release. It commits an accepted change
and synchronously reports the transition. The source refuses reentrant writes. A refusal
leaves the effective value unchanged and produces no notification.
Direct application changes follow the same membership and observation rules. Select observes
them without delegating a request back. The application may select a disabled option directly.

Setup reads the authority, subscribes and reads again to capture changes during registration.
Select checks authority values, effective transitions and synchronous request results. An
accepted request must reach the requested value and deliver one matching transition during
the call. A non-boolean outcome, a change during a refusal or acceptance without the matching
transition raises a protocol error. Valid changes already committed by the authority stay effective.

## Requests and observation

Read `selectedValue` for the effective selection and call `requestSelection(nextValue)`
with an explicit target. `selectResultStatuses` supplies the vocabulary for
`SelectResultStatusType` and `SelectResultType`.

| Condition | Result |
| --- | --- |
| The model is disposed or already processing a request or delivery. | Return `rejected` with reason `disposed` or `busy` before validating the target. |
| The target is malformed or a string outside the option set. | Throw `TypeError` for a malformed target or `RangeError` for an unknown string. |
| The target is the current value, including a disabled current option. | Return `unchanged` without delegation or notification. |
| A differing target is disabled or the authority refuses it. | Return `rejected` with reason `denied`. |
| The authority accepts and delivers the requested change. | Return `changed` after the synchronous transition. |

`subscribeSelectionChange(listener)` observes effective changes in registration order. Each
`SelectChangeType` snapshot is frozen and contains distinct `previous` and `current` values.
The new value is readable during delivery. Subscriptions start with the next change. Callback
failures preserve committed selection and are reported after the remaining eligible callbacks
are attempted. The
[shared delivery rules](../../capabilities/index.md#subscriptions-and-synchronous-delivery)
describe registration mutation and release during delivery.

## Finalisation

An unsuccessful setup releases the connections acquired by that attempt. Disposal invalidates
work before releasing the authority subscription. The model retains its last valid selection and
captured options for reading after finalisation. Previously returned releases stay idempotent.
If disposal occurs during delegation, a change observed before disposal retains its
`changed` result. A request that has yet to observe its change returns with reason `disposed`.
The authority retains its application owner and lifetime.

The [Select runtime suite](../../../../../../tests/runtime/select.test.mjs) exercises the model
against packed public artefacts. [Components quality](../../quality.md) owns the distribution and
type checks.
