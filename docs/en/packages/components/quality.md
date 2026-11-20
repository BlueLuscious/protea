# Components Quality

Status: **Public runtime and packed-consumer coverage**

This page owns conformance evidence for `@luscious-garden/protea-components`. The
[API guide](api/index.md) lists exact public exports, and
[workspace tooling](../../tooling/workspace/index.md) owns both output producers.

## Checks

| Evidence | Guarantees exercised | Behaviour authority |
| --- | --- | --- |
| [Opening](../../../../tests/runtime/openable.test.mjs), [activation](../../../../tests/runtime/activatable.test.mjs) and [composition](../../../../tests/runtime/capability-composition.test.mjs) | State authority, request results, observations, reentrancy, failed setup, and independent or explicitly shared capability state. | [Capabilities](capabilities/index.md). |
| [Button runtime](../../../../tests/runtime/button.test.mjs) | Independent lifetime, availability, activation, listener changes and terminal behaviour through `Button.create`. | [Button](components/button/index.md). |
| [Type and distribution checks](../../../../tests/distribution/components-package.test.mjs) | Archive inclusion, concrete packed Core dependency, exact runtime exports, private subpaths, both Button creation paths and their shared definition reference, and portable declarations under NodeNext and Bundler. | [API](api/index.md) and [package boundary](index.md#boundary). |

Each independent Components consumer builds and packs Core and Components, installs both actual
archives offline and resolves the public package roots. The [Core quality guide](../core/quality.md)
owns the separate consumer that installs only Core.

## Consumer conformance

The [capability fixture](../../../../tests/distribution/capability-consumer.test.ts) checks
authority modes, request results, vocabularies and scope ownership. The
[family fixture](../../../../tests/distribution/family-consumer.test.ts) checks both Button
construction signatures and supplies typed Modal and Sidebar inputs. It checks option requirements,
definition and lifetime contracts, and distinct activation and opening results. Runtime behaviour
for Modal and Sidebar requires their implementations and dedicated evidence.

The [root tooling commands](../../tooling/index.md#installation-and-commands) run the checks in
the pinned contributor environment. Portable model checks establish lifecycle and behaviour
within the declared cases. Rendered accessibility, browser events, framework support and
publication require evidence at their own boundaries.
