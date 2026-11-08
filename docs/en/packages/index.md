# Protea Packages

Status: **One private package with component lifetime and cleanup runtime**

| Package | Current responsibility |
| --- | --- |
| [Core](core/index.md) | Portable component lifetime and cleanup ownership, with an ESM/declaration build and one public root. |

The package set follows implemented responsibilities. Logical features do not allocate separate
npm packages. Core is private and its local version is not a published release. The
[project guide](../project/index.md) owns the wider component-library direction;
[repository tooling](../tooling/index.md) owns actual commands and qualification coverage.
