# Protea Packages

Status: **Private Core and Components packages**

| Package | Current responsibility |
| --- | --- |
| [Core](core/index.md) | Portable definitions and instances, standalone scopes, lifetime and cleanup. |
| [Components](components/index.md) | Built-in Button, Modal, Sidebar and Switch with reusable activation, opening and checking. |

Components depends on the public Core root. Core has no runtime dependencies. Both packages
emit ES2022 ESM and declarations. Core exposes its foundation at the root. Components exposes
its root and the [family, definition and capability entries](components/api/index.md#package-exports).
Their local versions identify private, unpublished workspace packages.
The [project guide](../project/index.md) owns product direction.
The [tooling guide](../tooling/index.md) owns build and verification commands.
