# Core Quality

Status: **Public runtime and packed-consumer coverage**

This page owns conformance evidence for `@luscious-garden/protea-core`. The
[API guide](api/index.md) lists the public exports. The [Core guide](index.md) maps each feature
to its behaviour and contracts. The [workspace tooling](../../tooling/workspace/index.md) owns
the output producer and its filesystem checks.

## Checks

| Evidence | Guarantees exercised | Behaviour authority |
| --- | --- | --- |
| [Construction runtime](../../../../tests/runtime/component-construction.test.mjs) | Definition preparation and identity, independent instances, reserved members, flat descriptors and receivers, and cleanup when setup or composition fails. | [Component runtime](component/runtime/index.md). |
| [Scope runtime](../../../../tests/runtime/component-scope.test.mjs) | Cleanup registration, terminal ordering, repeated and reentrant disposal, ownership, borrowed lifetimes and failures. | [Component lifetime](component/index.md). |
| [Type and distribution checks](../../../../tests/distribution/core-package.test.mjs) | Standalone Core installation, archive inclusion, exact runtime exports, private subpaths, and portable declarations compiled under NodeNext and Bundler. | [API](api/index.md) and [package boundary](index.md#boundary). |

The runtime and distribution suites build fresh local archives, install them offline in isolated
consumers and load the public package root. Each suite owns its build prerequisites and temporary
directory. The root [tooling commands](../../tooling/index.md#installation-and-commands) run these
checks separately from build-output ownership tests.

## Consumer conformance

The [construction fixture](../../../../tests/distribution/component-consumer.test.ts) checks
required, optional and absent options, inferred methods and getters, readonly lifetime and
definition association, and rejected surface members. The clean consumer installs the Core
archive on its own. It checks that Core declares no runtime dependencies and that its packed
root surface contains only the foundation. The [Components quality guide](../components/quality.md)
owns family and capability evidence.

An expected error in a type fixture records a compiler diagnostic. Review its cause independently.
Structural assignment alone cannot verify synchrony or cleanup behaviour.

## Support and evidence

The qualification targets are Node 24.22.2, TypeScript 5.9.3 and the Ubuntu and Windows jobs
documented by [repository automation](../../tooling/automation/index.md#continuous-integration).
Hosted evidence belongs to the revision the jobs checked. Contributor pins define the check
environment. The package's portable [ES2022 ESM boundary](index.md#boundary) remains its
separate runtime contract.

Broader runtime and bundler support, browser behaviour, hydration, SSR, accessibility, framework
compatibility and publication need evidence at their respective integration or release boundary.
