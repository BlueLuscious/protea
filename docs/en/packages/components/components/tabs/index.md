# Tabs

Status: **Portable runtime for local tab selection and panel association**

Tabs selects one logical tab from a fixed ordered set and associates it with a panel. A note
detail can use Preview and History while the application retains the note and its destination.
The model owns selection; the host supplies panel content and representation.

## Construction and ownership

Import `Tabs` and its family types from `@luscious-garden/protea-components/tabs` or the
Components root. Import `TabsDefinition` from
`@luscious-garden/protea-components/definitions/tabs` for explicit Core construction. It has
identity `{ namespace: "protea", name: "tabs" }` and is the same value as `Tabs.definition`.
Both `Tabs.create(options)` and `Component.create(TabsDefinition, options)` create an independent
`TabsInstance` with its own Core lifetime. The caller owns disposal. The
[API guide](../../api/index.md#family-and-definition-entries) lists the public values and types.

```ts
import { Tabs } from "@luscious-garden/protea-components/tabs";

const tabs = Tabs.create({
  tabs: [
    { key: "preview", panelKey: "note-preview" },
    { key: "history", panelKey: "note-history" },
  ],
  initialTabKey: "preview",
});

tabs.requestSelection("history");
tabs.activeTab.panelKey;
tabs.dispose();
```

`TabsOptionsType` requires a non-null, non-array options object containing a non-empty `tabs`
array and an explicit `initialTabKey`. Each `TabOption` contains `key`, `panelKey` and an optional
`disabled` flag. Both keys are exact non-empty strings. Tab keys must be unique among tabs and
panel keys among panels; the two key spaces are independent. Case and spacing are preserved.
Malformed records, duplicate keys and invalid fields raise `TypeError`.

Construction captures the declared fields, preserves order and freezes the copied array and
records. The caller retains ownership of its inputs; later input changes do not reconfigure the
model. An omitted `disabled` flag means enabled. A supplied flag must be boolean, including at
the JavaScript boundary where explicit `undefined` raises `TypeError`.

The initial key must name an enabled captured tab. A malformed key raises `TypeError`; a
well-formed unknown key or disabled initial tab raises `RangeError`. Initial selection is
established before exposure without notification. The model owns selection over this fixed
membership for its lifetime.

## Requests and observations

Read the captured list through `tabs` and the effective captured record through `activeTab`.
Its `panelKey` supplies the corresponding logical panel identity. Call
`requestSelection(tabKey)` to request another tab.

`tabsResultStatuses` is the immutable vocabulary for `TabsResultStatusType` and
`TabsResultType`. A rejection requires a shared reason.

| Condition in evaluation order | Outcome |
| --- | --- |
| The model is disposed. | `rejected` with `disposed`, before target validation. |
| A request or selection delivery occupies the model. | `rejected` with `busy`, including for the active key. |
| The target is malformed or unknown. | Throw `TypeError` for malformed input or `RangeError` for an unknown key. |
| The target is already active. | `unchanged`, without notification. |
| A differing target is disabled. | `rejected` with `denied`, preserving selection. |
| A differing target is enabled. | Commit the captured target, deliver eligible observations, then return `changed` normally. |

`subscribeSelectionChange(listener)` observes subsequent effective changes without replay.
Each `TabsChangeType` snapshot is frozen and contains `previous` and `current` captured tab
records. During delivery, `activeTab` is the committed current record, so its key and panel
association agree. The model remains occupied through delivery.

Registrations follow the [shared observation rules](../../shared/index.md#runtime): independent
releases, registration order, additions deferred to the next delivery and removals cancelling
pending turns. Observer failures preserve the committed tab and are reported after the remaining
eligible callbacks. A returned promise is not awaited. The
[Select guide](../select/index.md) owns its separate external-authority selection contract.

## Finalisation

The [Tabs recipe](../../../../../../packages/components/src/components/tabs/definitions/tabs.definition.ts)
borrows the scope created by Core and registers cleanup for its observations.
Failed creation exposes no partial model and finalises that attempt's scope under the
[Core setup protocol](../../../core/component/runtime/index.md#construction-and-failed-preparation).
Other instances and caller-owned inputs retain their ownership.

Disposal retires registrations and cancels pending deliveries. The captured list and last active
tab remain readable. Requests return `rejected` with `disposed`, new subscriptions fail and
previously returned releases remain idempotent. Finalisation emits no selection change.
If an observer disposes the model after commitment and delivery returns normally, the request
still returns `changed`. An exception can follow commitment and does not establish rollback.

## Host and evidence

The application owns note data, commands and routing. A concrete host supplies labels, tab and
panel elements, DOM identifiers, focus, keyboard and pointer interaction, visibility and content
mounting. Logical keys are independent of DOM IDs. Host mounting and connection teardown are
separate from the model's lifetime; a binding releases its connections while preserving a
borrowed model. See the [integration boundaries](../../../../project/integration-boundaries.md).

The [Tabs runtime suite](../../../../../../tests/runtime/tabs.test.mjs) exercises portable
selection, capture, observations and finalisation through the packed public API.
[Components quality](../../quality.md#checks) owns runtime, declaration and distribution evidence.
The current [web example](../../../../../../examples/web/README.md) covers the earlier five
families. A Tabs host and its browser and accessibility evidence remain pending.
