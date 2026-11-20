# Protea Packages

Status: **One private package with portable foundation, capability and Button runtime**

| Package | Current responsibility |
| --- | --- |
| [Core](core/index.md) | Portable definitions and instances, lifetime, cleanup, reusable opening and activation, Button runtime and reviewed Modal/Sidebar type contracts. The package emits ESM and declarations with one public root. |

The package set follows implemented responsibilities. Logical features do not allocate separate
npm packages. Core is private and its local version is not a published release. The
[project guide](../project/index.md) owns the wider component-library direction;
[repository tooling](../tooling/index.md) owns actual commands and qualification coverage.
