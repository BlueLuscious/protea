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
| [Opening](../../../../tests/runtime/openable.test.mjs), [activation](../../../../tests/runtime/activatable.test.mjs) and [composition](../../../../tests/runtime/capability-composition.test.mjs) | State authority, request results, observations, reentrancy, failed setup, and independence or explicit sharing across capabilities. | [Capabilities](capabilities/index.md). |
| [Button runtime](../../../../tests/runtime/button.test.mjs) | Private lifetime, availability, activation, listener changes, terminal behaviour and borrowed control connections. | [Button](components/button/index.md). |
| [Type and distribution checks](../../../../tests/distribution/core-package.test.mjs) | Archive inclusion, exact runtime exports, private subpaths, and portable declarations compiled in clean consumers under NodeNext and Bundler. | [API](api/index.md) and [package boundary](index.md#boundary). |

The runtime and distribution suites build fresh local archives, install them offline in isolated
consumers and load the public package root. Each suite owns its build prerequisites and temporary
directory. The root [tooling commands](../../tooling/index.md#installation-and-commands) run these
checks separately from build-output ownership tests.

## Consumer conformance

The [construction fixture](../../../../tests/distribution/component-consumer.test.ts) checks
required, optional and absent options, inferred methods and getters, readonly lifetime and
definition association, and rejected surface members. The
[capability fixture](../../../../tests/distribution/capability-consumer.test.ts) checks state
authority modes, request results, named vocabularies and scope ownership. The
[family fixture](../../../../tests/distribution/family-consumer.test.ts) imports the real Button
factory and supplies typed Modal and Sidebar inputs. It checks family options, borrowed lifetime
views and separate activation and opening results. The runtime smoke case creates, enables,
activates and disposes a Button.

An expected error in a type fixture records a compiler diagnostic. Review its cause independently.
Structural assignment neither verifies a collaborator's synchrony and cleanup behaviour nor
establishes that two structurally compatible family contracts have the same semantics.

## Support and evidence

The qualification targets are Node 24.22.2, TypeScript 5.9.3 and the Ubuntu and Windows jobs
documented by [repository automation](../../tooling/automation/index.md#continuous-integration).
Hosted evidence belongs to the revision the jobs checked. Contributor pins define the check
environment. The package's portable [ES2022 ESM boundary](index.md#boundary) remains its
separate runtime contract.

Broader runtime and bundler support, browser behaviour, hydration, SSR, accessibility, framework
compatibility and publication need evidence at their respective integration or release boundary.
