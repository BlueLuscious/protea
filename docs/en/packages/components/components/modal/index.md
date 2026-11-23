# Modal

Status: **Portable definition, construction and runtime implemented**

Modal models a dialogue with its own lifetime and logical opening. A representative
application opens a confirmation dialogue and connects a separate Button to its closing request.
The model keeps that opening state and lifetime distinct from application work and the future
host's actual modality, focus and representation.

The Components root and `@luscious-garden/protea-components/modal` export the same frozen
`Modal` object and the family types `ModalApi`, `ModalInstance` and `ModalOptionsType`.
`ModalInstance` composes
[ComponentInstance](../../../core/component/index.md) and
[Openable](../../capabilities/openable/index.md). Production TypeScript and its generated
declarations own the signatures.

## Construction and state authority

Import `ModalDefinition` from `@luscious-garden/protea-components/definitions/modal` for explicit
Core construction. It has identity `{ namespace: "protea", name: "modal" }` and is the same
value as `Modal.definition`. `Modal.create(options)` delegates to
`Component.create(ModalDefinition, options)`. Both routes require `ModalOptionsType`, an alias
of `OpenableOptionsType`, with an explicit control mode.

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

Each creation returns a new active model with a private Core scope. Its caller owns disposal.
`Opening.create` borrows that scope. The
[Modal recipe](../../../../../../packages/components/src/components/modal/definitions/modal.definition.ts) exposes the Openable
operations directly on the instance and keeps the capability and cleanup registration private.
Supplied authorities and borrowed Modal references retain their original lifetime ownership.

Failed construction invalidates the attempt's work, finalises its newly owned lifetime and
reports an error. Cleanup attempts all required owned releases and preserves
supplied authorities, other models and unrelated registrations. The
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
Button can accept activation while its target is already closed, refuses closing or has ended
its lifetime. The application handles each outcome independently.

In this example the application owns both models and releases the connection after one
activation. The result contains the activation outcome and the observed closing outcome.

```ts
import { Button, Modal, type OpenableResultType } from "@luscious-garden/protea-components";

export function requestConfirmationClose() {
  const modal = Modal.create({ control: "internal", initialOpen: true });
  const closeButton = Button.create();
  const outcomes: { closing?: OpenableResultType } = {};
  let disconnect: (() => void) | undefined;

  try {
    disconnect = closeButton.subscribeActivation(() => {
      outcomes.closing = modal.close();
    });

    const activation = closeButton.activate();
    return { activation, closing: outcomes.closing };
  } finally {
    disconnect?.();
    closeButton.dispose();
    modal.dispose();
  }
}
```

An invalid listener or a disposed Button causes registration to throw before it acquires a
connection. The application still cleans up any resources it already owns. Disposing Button
clears its subscriptions and leaves Modal alive. Disposing Modal leaves the connection on an
active Button until the application releases it. Each registration has its own idempotent
release, including when the same listener is added twice. Release the connection when the
pairing ends, and dispose only models your application owns. Application composition owns any
policy for selecting or changing the target.

Closing changes logical openness without ending the model. Disposal makes Modal terminal before
attempting all required owned releases and preserves borrowed lifetimes, following the
[component finalisation protocol](../../../core/component/index.md#finalisation-and-ownership).
If a borrowed authority's release throws, any retained callbacks remain inert.

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

## Evidence

The [Components quality guide](../../quality.md) owns packed runtime and declaration checks for
both creation entries, explicit authority options, terminal projection and application-owned
Button connections.
