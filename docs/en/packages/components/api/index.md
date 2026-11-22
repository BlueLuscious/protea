# Components API

Status: **Public Button, Modal, Sidebar, opening and activation construction implemented**

The package-level `src/api/` feature exposes frozen API objects through the Components package
root. Capability constructors receive an active scope from the caller. Each family instance
receives its own scope from [Core](../../core/api/index.md).

## Contracts and values

| Contract | Operation | Result |
| --- | --- | --- |
| `ActivationApi` | `Activation.create(scope, options?)` | `Activatable`, bound to the borrowed scope. |
| `OpeningApi` | `Opening.create(scope, options)` | `Openable`, bound to the borrowed scope and selected authority. |
| `ButtonApi` | `Button.definition` | The prepared definition shared by all built-in Button instances. |
| `ButtonApi` | `Button.create(options?)` | A fresh `ButtonInstance` using that definition. |
| `ModalApi` | `Modal.definition` | The prepared definition shared by all built-in Modal instances. |
| `ModalApi` | `Modal.create(options)` | A fresh `ModalInstance` with an explicit opening authority. |
| `SidebarApi` | `Sidebar.definition` | The prepared definition shared by all built-in Sidebar instances. |
| `SidebarApi` | `Sidebar.create(options)` | A fresh `SidebarInstance` with an explicit opening authority. |

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

Modal and Sidebar accept the same two creation entries. Call the family's `create` with the
required options or pass its prepared definition and the options to `Component.create`.
The [Modal guide](../components/modal/index.md#construction-and-state-authority) and
[Sidebar guide](../components/sidebar/index.md#construction-and-state-authority) describe their
opening authority choices. The [capabilities guide](../capabilities/index.md#construction-and-composition)
shows composition with a standalone scope.

## Package exports

The public `"."` entry of `@luscious-garden/protea-components` exposes these runtime values:

- `Activation`
- `Button`
- `Modal`
- `Opening`
- `Sidebar`
- `activatableResultStatuses`
- `capabilityRejectionReasons`
- `openableResultStatuses`

The same root exposes the public feature contracts and types mapped in the
[package guide](../index.md#documentation).
