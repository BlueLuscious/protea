# Components API

Status: **Public family and capability construction implemented**

The package-level `src/api/` feature owns the frozen family and capability API objects.
Family entries live under `src/api/families/`, and capability entries live under
`src/api/capabilities/`. Each entry declares its public values and types. The root
re-exports the family entries and the capability aggregate. Capability constructors receive
an active scope from the caller. Each family instance receives its own scope from
[Core](../../core/api/index.md).

## Contracts and values

| Contract | Operation | Result |
| --- | --- | --- |
| `ActivationApi` | `Activation.create(scope, options?)` | `Activatable`, bound to the borrowed scope. |
| `CheckingApi` | `Checking.create(scope, options)` | `Checkable`, bound to the borrowed scope and selected state authority. |
| `OpeningApi` | `Opening.create(scope, options)` | `Openable`, bound to the borrowed scope and selected authority. |
| `ButtonApi` | `Button.definition` | The prepared definition shared by all built-in Button instances. |
| `ButtonApi` | `Button.create(options?)` | A fresh `ButtonInstance` using that definition. |
| `ModalApi` | `Modal.definition` | The prepared definition shared by all built-in Modal instances. |
| `ModalApi` | `Modal.create(options)` | A fresh `ModalInstance` with an explicit opening authority. |
| `SidebarApi` | `Sidebar.definition` | The prepared definition shared by all built-in Sidebar instances. |
| `SidebarApi` | `Sidebar.create(options)` | A fresh `SidebarInstance` with an explicit opening authority. |
| `SwitchApi` | `Switch.definition` | The prepared definition shared by all built-in Switch instances. |
| `SwitchApi` | `Switch.create(options)` | A fresh `SwitchInstance` with an explicit checked-state authority. |

## Usage

```ts
import { Component } from "@luscious-garden/protea-core";
import { Button } from "@luscious-garden/protea-components/button";
import { ButtonDefinition } from "@luscious-garden/protea-components/definitions/button";

const save = Button.create();
const submit = Component.create(ButtonDefinition, { initialDisabled: true });

save.definition === submit.definition;
save.activate();
save.dispose();
submit.dispose();
```

The Button API delegates to the same Core construction call with `ButtonDefinition`. Both
instances retain that definition and have independent state and lifetimes. See
[Button](../components/button/index.md#construction-and-ownership) for configuration and disposal.

Modal, Sidebar and Switch accept the same two creation entries. Call the family's `create` with the
required options or pass its prepared definition and the options to `Component.create`.
The [Modal guide](../components/modal/index.md#construction-and-state-authority) and
[Sidebar guide](../components/sidebar/index.md#construction-and-state-authority) describe their
opening authority choices. The [Switch guide](../components/switch/index.md#construction-and-ownership)
describes its checked-state authority. The
[capabilities guide](../capabilities/index.md#construction-and-composition) shows composition with a
standalone scope.

## Package exports

The public `"."` entry of `@luscious-garden/protea-components` exposes these runtime values:

- `Activation`
- `Button`
- `Checking`
- `Modal`
- `Opening`
- `Sidebar`
- `Switch`
- `activatableResultStatuses`
- `capabilityRejectionReasons`
- `checkableResultStatuses`
- `openableResultStatuses`

The same root exposes the public feature contracts and types mapped in the
[package guide](../index.md#documentation).

### Family and definition entries

The manifest resolves `/<family>` to the family's
API module and `/definitions/<family>` to its prepared definition module. It reserves the bare
`/definitions` path with a null target. The available entries use suffixes of
`@luscious-garden/protea-components`.

| Suffix | Named runtime export | Named type exports |
| --- | --- | --- |
| `/button` | `Button` | `ButtonApi`, `ButtonInstance`, `ButtonOptionsType`, `ButtonDisabledChangeType` |
| `/modal` | `Modal` | `ModalApi`, `ModalInstance`, `ModalOptionsType` |
| `/sidebar` | `Sidebar` | `SidebarApi`, `SidebarInstance`, `SidebarOptionsType` |
| `/switch` | `Switch` | `SwitchApi`, `SwitchInstance`, `SwitchOptionsType` |
| `/definitions/button` | `ButtonDefinition` | — |
| `/definitions/modal` | `ModalDefinition` | — |
| `/definitions/sidebar` | `SidebarDefinition` | — |
| `/definitions/switch` | `SwitchDefinition` | — |

The root and family entries share the same API object. Its `definition` property refers to the
same prepared value exported by the definition entry. Use `typeof ButtonDefinition` or the
corresponding value's type when a definition type is needed.

### Capability entries

Use the following suffixes of `@luscious-garden/protea-components` for individual capabilities
and their contracts.

| Suffix | Named runtime exports | Named type exports |
| --- | --- | --- |
| `/capabilities/activation` | `Activation`, `activatableResultStatuses` | `ActivationApi`, `Activatable`, `ActivatableOptionsType`, `ActivatableResultStatusType`, `ActivatableResultType` |
| `/capabilities/checking` | `Checking`, `checkableResultStatuses` | `CheckingApi`, `Checkable`, `CheckedStateAuthority`, `CheckableChangeType`, `CheckableOptionsType`, `CheckableResultStatusType`, `CheckableResultType` |
| `/capabilities/opening` | `Opening`, `openableResultStatuses` | `OpeningApi`, `Openable`, `OpenStateAuthority`, `OpenableChangeType`, `OpenableOptionsType`, `OpenableResultStatusType`, `OpenableResultType` |

The `/capabilities` entry collects these exports and adds `capabilityRejectionReasons`,
`CapabilityRejectionReasonType` and `CapabilityUnsubscribeType`. A factory or vocabulary
keeps the same object identity wherever it is exported.
