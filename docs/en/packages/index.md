# Protea Packages

Status: **Private Core and Components packages**

| Package | Current responsibility |
| --- | --- |
| [Core](core/index.md) | Portable definitions and instances, standalone scopes, lifetime and cleanup. |
| [Components](components/index.md) | Built-in Button and Modal, reusable opening and activation, and reviewed Sidebar type contracts. |

Components depends on the public Core root. Core has no runtime dependencies. Each package
emits ES2022 ESM and declarations with one public root. Their local versions identify private,
unpublished workspace packages. The [project guide](../project/index.md) owns product direction.
The [tooling guide](../tooling/index.md) owns build and verification commands.
