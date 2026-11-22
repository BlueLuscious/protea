# Components API

Status: **Public Button, Modal, opening and activation construction implemented**

The package-level `src/api/` feature exposes frozen API objects through the Components package
root. Capability constructors receive an active scope from the caller. Each Button or Modal
instance receives its own scope from [Core](../../core/api/index.md).

## Contracts and values

| Contract | Operation | Result |
| --- | --- | --- |
| `ActivationApi` | `Activation.create(scope, options?)` | `Activatable`, bound to the borrowed scope. |
| `OpeningApi` | `Opening.create(scope, options)` | `Openable`, bound to the borrowed scope and selected authority. |
| `ButtonApi` | `Button.definition` | The prepared definition shared by all built-in Button instances. |
| `ButtonApi` | `Button.create(options?)` | A fresh `ButtonInstance` using that definition. |
| `ModalApi` | `Modal.definition` | The prepared definition shared by all built-in Modal instances. |
| `ModalApi` | `Modal.create(options)` | A fresh `ModalInstance` with an explicit opening authority. |
| `SidebarApi` | Type-only `create(options)` contract | `SidebarInstance` describes the future family runtime. |

## Usage

```ts
import { Component } from "@luscious-garden/protea-core";
import { Button } from "@luscious-garden/protea-components";

const save = Button.create();
const submit = Component.create(Button.definition, { initialDisabled: true });

save.definition === submit.definition;
save.activate();
save.dispose();
submit.dispose();
```

Both Button entry points use the same Core construction protocol. Each result has independent
state and lifetime. See [Button](../components/button/index.md#construction-and-ownership) for
configuration and disposal.

Modal accepts the same two creation entries. Use `Modal.create({ control: "internal" })` or pass
`Modal.definition` and the options to `Component.create`. The
[Modal guide](../components/modal/index.md#construction-and-state-authority) describes the required
authority choices. The [capabilities guide](../capabilities/index.md#construction-and-composition)
shows composition with a standalone scope.

## Package exports

The public `"."` entry of `@luscious-garden/protea-components` exposes these runtime values:

- `Activation`
- `Button`
- `Modal`
- `Opening`
- `activatableResultStatuses`
- `capabilityRejectionReasons`
- `openableResultStatuses`

The same root exposes the public feature contracts and types mapped in the
[package guide](../index.md#documentation). Sidebar's API value and definition await its runtime
implementation.
