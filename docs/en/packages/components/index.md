# Components

Status: **Private Button and capability runtime with Modal and Sidebar type contracts**

`@luscious-garden/protea-components` owns Protea's portable built-in families and reusable
capabilities. Button has an incorporated definition and live instances. Modal and Sidebar
have reviewed instance and construction contracts.

## Boundary

Components is ESM-only and emits ES2022 JavaScript and declarations to its owned `dist/`. Its
root resolves declarations to `dist/index.d.ts` and runtime imports to `dist/index.js`. The
package is private at `0.0.0`. Package feature and runtime paths are internal.

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
| [API](api/index.md) | `Button`, `Opening` and `Activation` usage and exact root exports. |
| [Capabilities](capabilities/index.md) | Opening, activation and composition over a borrowed lifetime. |
| [Component Families](components/index.md) | Button behaviour and the Modal and Sidebar type contracts. |
| [Shared Runtime](shared/index.md) | Listener registration and delivery across families and capabilities. |
| [Quality](quality.md) | Runtime, declaration and packed-consumer evidence. |
