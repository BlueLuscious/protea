# Workspace Tooling

Status: **Ordered Core and Components builds with guarded package outputs**

The [workspace tooling](../../../../tooling/workspace/) owns production build output and its
filesystem boundary. The [package guides](../../packages/index.md) own the public surfaces.
The [repository tooling index](../index.md) lists contributor pins and root commands.

## Package outputs

| Subject | Current selection |
| --- | --- |
| Packages | `packages/core/` and `packages/components/`. |
| Producer | TypeScript emission through the owned build configuration and repository build entrypoint. |
| Outputs | Each package owns its `dist/` with JavaScript and declarations. |
| Archive inputs | Current built output, manifest, package README and ISC licence. |

The [Core](../../packages/core/index.md) and [Components](../../packages/components/index.md)
guides describe module format, public API and dependency policy.

## Canonical producer and ownership

[build-core.mjs](../../../../tooling/workspace/build-core.mjs) builds the foundation independently.
[build-components.mjs](../../../../tooling/workspace/build-components.mjs) builds Core before
Components so the latter resolves Core's public package declarations. Both entry points use the
[shared build implementation](../../../../tooling/workspace/runtime/package-build.mjs). Each package
has a no-emit typecheck configuration and a separate build configuration, including
[Core](../../../../packages/core/tsconfig.build.json) and
[Components](../../../../packages/components/tsconfig.build.json). Production TypeScript is the
canonical declaration source.

Compilation stages files in an [owned temporary directory](../shared/index.md#temporary-directories)
before changing existing outputs. The owner inspects the destination, links and prior output state.
It preserves unknown files and refuses conflicting or modified output instead of recursively
deleting an unrecognised directory.

Core's `.build/core-output.json` and Components' `.build/components-output.json` record their
respective output paths and SHA-256 preimages outside `dist/`. Output and build metadata are
ignored generated state. The producer preserves source, entries outside its ownership and linked
targets when it refuses a change. Retired Core files are removed through the same ownership checks.

Building regenerates owned outputs. Root `typecheck` prepares Core output before checking both
production projects without emission. The preparation writes Core output and gives Components
real package declarations on a clean checkout. Production changes flow through the source and
configuration used by the producer.

## Tests

The root and Components package `build` commands invoke the dependency-ordered build. The Core
package command invokes its independent build.
[Build tests](../../../../tests/tooling/core-build.test.mjs) exercise output ownership, guarded
updates and failure handling with isolated candidates. The expected output set follows production
source inputs. [Core quality](../../packages/core/quality.md#checks) covers standalone runtime
and distribution checks. [Components quality](../../packages/components/quality.md#checks)
covers consumers of both fresh archives.
