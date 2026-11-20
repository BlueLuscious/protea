# Workspace Tooling

Status: **Guarded Core builds and package output ownership**

The [workspace tooling](../../../../tooling/workspace/) owns production build output and its
filesystem boundary. The [Core guide](../../packages/core/index.md) owns the package surface.
The [repository tooling index](../index.md) lists contributor pins and root commands.

## Package outputs

| Subject | Current selection |
| --- | --- |
| Package | `packages/core/`. |
| Producer | TypeScript emission through the owned build configuration and repository build entrypoint. |
| Outputs | Package-owned `dist/` containing JavaScript and declarations; no maps or committed generated outputs. |
| Archive inputs | Current built output, manifest, package README and ISC licence. |

The [Core package boundary](../../packages/core/index.md) describes the module format, public API
and dependency policy.

## Canonical producer and ownership

[build-core.mjs](../../../../tooling/workspace/build-core.mjs) runs the package compiler using its
production configuration. [tsconfig.json](../../../../packages/core/tsconfig.json) checks without
emission. [tsconfig.build.json](../../../../packages/core/tsconfig.build.json) enables JavaScript
and declaration output from production sources, excluding tests. Production TypeScript is the canonical
declaration source. Generated files are never edited manually.

Compilation stages files in an [owned temporary directory](../shared/index.md#temporary-directories)
before changing existing outputs. The owner inspects the destination, links and prior output state.
It preserves unknown files and refuses conflicting or modified output instead of recursively
deleting an unrecognised directory.

The package's `.build/core-output.json` records owned output paths and SHA-256 preimages outside
`dist/`. Output and this build metadata are ignored generated state. The producer preserves
source, entries outside its ownership and linked targets when it refuses a change.

Building regenerates owned outputs. The separate no-emit check reads source without producing
output. Production changes flow through the source and configuration used by the producer.

## Tests

The root `build` and package build command invoke this producer.
[Build tests](../../../../tests/tooling/core-build.test.mjs) exercise output ownership, guarded
updates and failure handling with isolated candidates. The expected output set follows production
source inputs. [Core Quality](../../packages/core/quality.md#checks) covers the independent
runtime and distribution checks that consume fresh package output.

The [Components migration](../../future-capabilities.md#pending-components-migration) will
extend workspace builds to a second package once its source and manifest exist.
