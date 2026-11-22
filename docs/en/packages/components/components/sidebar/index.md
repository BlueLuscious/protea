# Sidebar

Status: **Portable runtime for changeable logical presence**

Sidebar models a lateral region whose logical presence can change. For example, an application
opens its supplementary navigation when requested and closes it after selection. Each instance
has its own lifetime and delegates logical opening to its selected authority.

The Components root exports the frozen `Sidebar` API object and the `SidebarApi`,
`SidebarInstance` and `SidebarOptionsType` contracts. `SidebarInstance` composes
[ComponentInstance](../../../core/component/index.md) and
[Openable](../../capabilities/openable/index.md). Production source and generated declarations
own the signatures.

## Supported cases and independent axes

Model-owned opening and a borrowed synchronous application authority both support changeable
presence. Their request and observation rules come from [Openable](../../capabilities/openable/index.md).
Starting open sets the initial logical state in internal mode. An external authority can refuse a
request under its own policy. A permanently present region falls outside this contract and needs
its own capability and construction decision.

| Axis | Responsibility |
| --- | --- |
| Logical presence | Sidebar exposes the current open state and requests open or close through the selected authority. |
| Positioning and rendered visibility | A host decides where the region appears, how much space it occupies and when to show it. Fixed and floating positioning can each present a changeable region. |
| Interaction | A host defines input, focus and any modal interaction according to the region's purpose. |

A persistent layout can reserve a region's space while the model's logical presence changes.
Each presentation can choose its policy independently of the opening authority.

## Construction and state authority

`Sidebar.definition` is the prepared definition with identity
`{ namespace: "protea", name: "sidebar" }`. `Sidebar.create(options)` delegates to
`Component.create(Sidebar.definition, options)`. Both entries require `SidebarOptionsType`,
an alias of `OpenableOptionsType`, with an explicit control mode.

| Mode | Required meaning |
| --- | --- |
| Internal | The model owns logical openness. Omitted initialOpen defaults to false; an explicitly supplied value must be boolean. An external authority is excluded. |
| External | A required borrowed OpenStateAuthority is the sole state owner. No separate initialOpen value is accepted. |

The internal `initialOpen` value must be a boolean when present. Excluded properties must be
omitted entirely. The model captures the selected configuration and the source and callback
references at creation. Later mutations to the options object leave those selections intact.
The source must satisfy the
[external authority protocol](../../capabilities/openable/index.md#external-authority-protocol),
including synchronous commitment, notification and refusal without queued work.

Each successful creation returns a new active model with a private Core scope. The caller owns
disposal. The [Sidebar recipe](../../../../../../packages/components/src/api/sidebar.api.ts)
uses `Opening` on that scope and exposes the opening operations on the instance. A supplied
authority retains its original lifetime owner.

Failed construction invalidates the attempt and finalises its scope before reporting an error.
Cleanup attempts every required release and preserves earlier models and borrowed sources. The
[setup protocol](../../capabilities/index.md#failed-setup) governs acquired connections, late
release handles and opaque failures without external rollback.

## Requests, observation and finalisation

`isOpen` reports logical presence under the selected authority. `open`, `close` and
`subscribeOpenChange` preserve the Openable contract. Disposed checks precede busy checks and
target satisfaction. A satisfied idle request returns `unchanged`, a commitment returns
`changed`, and a live source refusal returns `rejected` with reason `denied`.

The [opening guide](../../capabilities/openable/index.md#results-and-request-ordering) owns exact
outcomes. The [shared observation rules](../../capabilities/index.md#subscriptions-and-synchronous-delivery)
own synchronous ordered delivery, independent registrations, mutation, unsubscribe and errors.
Treat an opening change as logical state. If a callback or provider fails, read the current state
before deciding how to recover because the change may already have committed.

An application may connect another model's activation to a Sidebar request through public
operations. It owns the subscription and its release. Each endpoint retains its own lifetime.
A closed Sidebar stays active and can open again.

Disposal follows the [component protocol](../../../core/component/index.md#finalisation-and-ownership).
The model becomes terminal before external cleanup and attempts every owned release. Requests and
pending observations stop even when an authority fails to disconnect. The borrowed authority
retains its state.

Terminal lifecycle and the last observed `isOpen` value stay readable without further source
access. New requests return `rejected` with reason `disposed`. New subscriptions throw and
existing unsubscribe operations remain idempotent. The
[delegated-request finalisation rules](../../capabilities/openable/index.md#delegation-and-finalisation)
govern requests that overlap disposal.

## Example

This application-owned model opens a supplementary navigation region on request and closes it
when selection completes. Its observer records the two effective changes.

```ts
import { Sidebar } from "@luscious-garden/protea-components";

export function recordNavigationPresence() {
  const navigation = Sidebar.create({ control: "internal" });
  const changes: boolean[] = [];
  const unsubscribe = navigation.subscribeOpenChange(({ current }) => {
    changes.push(current);
  });

  try {
    const opening = navigation.open();
    const closing = navigation.close();
    return { opening, closing, changes };
  } finally {
    unsubscribe();
    navigation.dispose();
  }
}
```

## Structural types and host evidence

`SidebarInstance` has a structural `ComponentInstance` and `Openable` surface.
[Modal](../modal/index.md) instances can satisfy consumers that require the same shape. Each
instance keeps its own definition, domain purpose and host responsibilities.

Future hosts own landmarks, accessible naming, supported input, focus, positioning, responsive
layout, representation and any modal interaction. Evaluate those behaviours in the chosen host.
The [integration guide](../../../../project/integration-boundaries.md) keeps DOM/framework
binding, styling, icons and motion at their explicit optional owners.

The [Components quality guide](../../quality.md) owns the packed runtime and declaration checks
for creation, opening authority, cleanup and the public surface.
