# Modal

Status: **Portable type contract; runtime implementation pending**

Modal describes a dialogue model with its own lifetime and logical opening. A representative
application opens a confirmation dialogue and connects a separate Button to its closing request.
The model keeps that opening state and lifetime distinct from application work and the future
host's actual modality, focus and representation.

The type-only contracts are `ModalInstance`, `ModalApi` and `ModalOptionsType`. `ModalInstance`
composes [ComponentInstance](../../../core/component/index.md) and [Openable](../../capabilities/openable/index.md)
contracts; this selects their semantic obligations without requiring implementation inheritance.
Production TypeScript and its generated declarations own signatures. There is no executable
Modal API value, incorporated definition or runtime implementation supplied by these types.

## Construction and state authority

`ModalApi` describes a readonly contextual `create` operation. Its required `ModalOptionsType`
argument is an alias of OpenableOptionsType: every creation explicitly selects internal or
external control. Omitting the options or the control mode is unsupported.

| Mode | Required meaning |
| --- | --- |
| Internal | The model owns logical openness. Omitted initialOpen defaults to false; an explicitly supplied value must be boolean. An external authority is excluded. |
| External | One borrowed OpenStateAuthority owns openness. Its authority is required; a second initialOpen value is excluded. |

The existing option exclusions apply even when an excluded member is supplied as undefined.
Unlike Button's initialDisabled option, internal initialOpen does not admit explicit undefined.
Creation captures the mode, initial value and relevant source/callback references without
freezing or adopting the caller's configuration. It cannot be reconfigured by mutating those
options later. A supplied source must satisfy the complete
[synchronous authority protocol](../../capabilities/openable/index.md#external-authority-protocol).

Each successful creation must expose a new active model with a private, independently owned
scope. The caller owns its disposal authority. There is no public scope argument, addCleanup
method, capability instance, closing-control option or implicit registration in a manager.
Borrowing a Modal reference or supplying an authority does not transfer either collaborator's
lifetime.

Failed creation exposes no partial model. Invalidate the attempt's work and finalise only its
newly owned lifetime, becoming terminal before attempting every required owned release. Preserve
supplied authorities, other models and unrelated registrations; report failures opaquely without
promising rollback of collaborator effects. The
[capability setup rules](../../capabilities/index.md#failed-setup) own acquired-connection and
late-release obligations.

## Opening, results and observation

The model provides isOpen, open, close and subscribeOpenChange under the existing Openable
contract. An active idle request for an already effective target returns unchanged; an effective
commitment returns changed after eligible synchronous delivery. Disposed and busy checks take
precedence over target satisfaction. A live external refusal maps to denied rather than creating
a second state writer or a queued request.

No modal-specific result vocabulary, opening guard, toggle method or dismissal event is added.
The [opening guide](../../capabilities/openable/index.md#results-and-request-ordering) owns exact
outcomes and ordering; the [shared observation rules](../../capabilities/index.md#subscriptions-and-synchronous-delivery)
own independent registrations, callback mutation, release and failures. Acceptance or commitment
does not prove application-work completion, rendering or animation completion. An exception may
follow commitment and does not establish refusal or rollback.

## Collaboration and finalisation

The application can subscribe to a [Button](../button/index.md) activation and request this
Modal's close operation through their public contracts. It owns that connection and its release.
Button activation acceptance and the closing result are separate: a trigger can be accepted
while the target is already closed, refuses closing or has ended its lifetime.

No participant acquires the other's disposal authority. Ending Modal does not remove an
application-owned registration from a still-active Button; ending Button does not finalise
Modal. The application must retire connections it no longer needs. A family-owned closeControl
part, automatic dismissal, topmost selection and cross-modal policy are not selected here.

Closing changes logical openness without ending the model. Disposal follows the
[component finalisation protocol](../../../core/component/index.md#finalisation-and-ownership): become
terminal before external releases, attempt all required owned cleanup and preserve borrowed
lifetimes. Logical work and pending deliveries must stop even before physical disconnection
runs or when it fails.

After finalisation, lifecycle and the last observed isOpen projection remain readable. Requests
return rejected/disposed; new observation throws and existing release handles remain idempotent.
Disposal requests no closing, emits no synthetic change and never reads the source to advance
the retained projection. The [delegation rules](../../capabilities/openable/index.md#delegation-and-finalisation)
own disposal before or after observed commitment, including already delegated source effects.

## Structural types and host evidence

`ModalInstance` describes a structural `ComponentInstance` and `Openable` surface. That surface
may be type-compatible with the reviewed [Sidebar](../sidebar/index.md) surface. Compatibility
does not make two objects the same instance or establish the same application purpose, ownership
or host guarantees. No hidden brand or runtime family discriminator is promised.

A future host owns accessible naming, dialogue semantics, supported input and dismissal,
focus movement/return, background interaction, mounting and representation. None follows from
an open boolean. The [integration boundary](../../../../project/integration-boundaries.md)
also keeps DOM, frameworks, icons, motion and styling outside this portable model.

Public type consumers must check explicit authority options, inherited operations, readonly
state and construction relationships without resolving a missing runtime factory. Runtime
implementation must later demonstrate independent lifetimes, both authority modes, setup
cleanup, repeated/refused requests, terminal projection and application-owned Button connections
through fresh public package artefacts. Those behaviours and accessible host interaction require
their own runtime evidence.
