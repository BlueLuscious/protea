# Core Package Tooling

Status: **Private contract package, ESM/declaration producer and consumer checks configured**

This guide owns the actual package/build boundary and its qualification requirements. The
[core guide](../packages/core/index.md) owns current scope and the
[component guide](../packages/core/component/index.md) owns semantics.
[Repository tooling](index.md) owns contributor pins and root commands.

## Identity and outputs

| Subject | Current selection |
| --- | --- |
| Owner | `packages/core/`, currently production component contracts only. |
| Identity | `@luscious-garden/protea-core`, version `0.0.0`, `private: true`. |
| Runtime format | ESM only with `type: "module"`; ES2022 output and standard libraries. |
| TypeScript resolution | NodeNext modules/resolution with explicit relative `.js` specifiers, strict checking, `types: []` and checked declarations. |
| Producer | TypeScript emission through the owned build configuration and repository build entrypoint. |
| Outputs | Package-owned `dist/` containing JavaScript and declarations; no maps or committed generated outputs. |
| Public boundary | One root: `types` selects `dist/index.d.ts`; `import` and `default` select `dist/index.js`. No public subpaths or wildcard. |
| Inclusion | Current built output plus manifest, package README and ISC licence. Tests, prototypes, local plans, caches and build metadata are excluded. |
| Dependencies | No production dependency or intrinsic Node engine requirement. Contributor tooling stays outside portable contracts. |

The root exports three type names. Its emitted JavaScript has no executable component exports;
an empty runtime namespace at this checkpoint is intentional. A contract-only package does not
advertise a scope factory, component constructor or capability value.

## Canonical producer and ownership

[build-core.mjs](../../../tooling/workspace/build-core.mjs) runs the package compiler using its
production configuration. [tsconfig.json](../../../packages/core/tsconfig.json) checks without
emission; [tsconfig.build.json](../../../packages/core/tsconfig.build.json) enables JavaScript
and declaration output and excludes tests/prototypes. Production TypeScript is the canonical
declaration source. Generated files are never edited manually.

Compilation occurs in a staged, exactly owned temporary location before existing outputs are
changed. The owner inspects the destination, links and prior output state before applying it.
It preserves unknown files and refuses conflicting or modified output instead of recursively
deleting an unrecognised directory.

The package's `.build/core-output.json` records owned output paths and SHA-256 preimages outside
published `dist/`. Output and this build metadata are ignored generated state. Their ownership
does not include source, arbitrary files beside outputs or linked targets. Failure must not
silently claim a completed build or discard preserved inputs. The actual helper and its tests
own the detailed filesystem protocol; this guide does not promise a universal transaction.

Building regenerates owned outputs. No-emit checking is read-only; a successful build is not
automatically a separate comparison proving zero drift. Production changes must flow through
the source/configuration producer, preserving files outside its boundary.

## Actual checks

The root `build` and package build command invoke this producer.
[Build tests](../../../tests/tooling/core-build.test.mjs) use isolated candidates to exercise
output ownership, guarded updates and failures. The
[distribution tests](../../../tests/distribution/core-package.test.mjs) build fresh candidates,
pack a local archive, inspect included files, install it offline and consume the actual package
root in a clean environment. TypeScript
consumers use both NodeNext and Bundler resolution without source aliases or private imports.
The emitted runtime module must resolve while exposing no unavailable values.

These checks establish build/distribution boundaries and present type restrictions, not lifetime
execution, resource cleanup, capability state, accessible interaction or a published release.
Every independently runnable consumer suite owns fresh prerequisites rather than inspect stale
repository output. Owned temporary directories must be precisely identified, contained and cleaned
without following links.

Node's built-in runner executes these current JavaScript suites. Executable TypeScript runtime
tests, `tsx` and Node ambient types are deferred until actual implementation inputs require them.
Future lifetime and capability tests must exercise accepted semantic guarantees, failure,
reentrancy, borrowing, subscription mutation and independent state at their actual owners.

## Support and evidence

The product's selected language contract is standard ES2022 consumed as ESM. Current concrete
build/consumer qualification targets pinned Node 24.22.2, TypeScript 5.9.3 and the existing
Ubuntu/Windows CI platforms. Configuration identifies targets, not successful hosted results;
review exact-source outcomes before reporting qualification.

Do not inherit the root contributor engine range as an intrinsic package runtime dependency.
Broader Node versions, browsers, bundlers, frameworks, hydration, SSR and accessibility support
need their own evidence. A local archive and clean consumer establish no registry publication.

## Migration

The retained [legacy capability design](../design/index.md) is outside the package producer and
package inclusion. Component/family prototypes have been removed rather than packaged as ambient
runtime promises. Production opening/activation location, construction and independent teardown
remain pending; their current type-only entrypoints allocate no core subpaths.

The complete root experiment must disappear once its responsibilities are implemented or
explicitly deferred. Reconcile signatures, useful restrictions and semantics into production
sources, tests and parallel documentation together, removing stale imports, checker inputs and
links. One current production producer must own each retained declaration.
