# Components

Status: **Private Button, Modal, Sidebar, Switch and capability runtimes**

`@luscious-garden/protea-components` owns Protea's portable built-in families and reusable
capabilities. Button, Modal, Sidebar and Switch have prepared definitions and create live instances.

## Boundary

Components is ESM-only and emits ES2022 JavaScript and declarations to its owned `dist/`. Its
root resolves declarations to `dist/index.d.ts` and runtime imports to `dist/index.js`. The
[manifest](../../../../packages/components/package.json) maps family, definition and capability
entries to their emitted modules. The `/capabilities` entry collects the capability exports.
The [API guide](api/index.md#package-exports) lists the supported entries and named exports.
Physical source and build paths remain internal. The package is private at `0.0.0`.

Components depends on the public root of [Core](../core/index.md) for definition-based
construction, lifetime and cleanup. Core remains independently consumable. The workspace
manifest declares Core through `workspace:*`, and the packed manifest records the concrete Core
version. The [workspace tooling](../../tooling/workspace/index.md) owns compilation order and
generated output.

The package models behaviour without Node, DOM or framework types. The
[integration boundaries](../../project/integration-boundaries.md) own concrete host and provider
responsibilities.

## Documentation

| Page | Owns |
| --- | --- |
| [API](api/index.md) | Family and capability construction, usage and public package entries. |
| [Capabilities](capabilities/index.md) | Activation, opening and checking over a borrowed lifetime. |
| [Component Families](components/index.md) | Button, Modal, Sidebar and Switch behaviour and contracts. |
| [Shared Runtime](shared/index.md) | Listener registration and delivery across families and capabilities. |
| [Quality](quality.md) | Runtime, declaration and packed-consumer evidence. |
