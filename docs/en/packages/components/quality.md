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
| [Modal runtime](../../../../tests/runtime/modal.test.mjs) | Shared definition and independent instances, internal and external opening authority, failed setup, terminal projection and application-owned Button collaboration. | [Modal](components/modal/index.md). |
| [Sidebar runtime](../../../../tests/runtime/sidebar.test.mjs) | Shared definition and independent instances, changeable logical presence, internal and external opening authority, and ownership and cleanup boundaries. | [Sidebar](components/sidebar/index.md). |
| [Type and distribution checks](../../../../tests/distribution/components-package.test.mjs) | Archive inclusion, concrete packed Core dependency, exact runtime exports, private subpaths, both Button creation paths and their shared definition reference, and portable declarations under NodeNext and Bundler. | [API](api/index.md) and [package boundary](index.md#boundary). |

Each independent Components consumer builds and packs Core and Components, installs both actual
archives offline and resolves the public package roots. The [Core quality guide](../core/quality.md)
owns the separate consumer that installs only Core.

## Consumer conformance

The [capability fixture](../../../../tests/distribution/capability-consumer.test.ts) checks
authority modes, request results, vocabularies and scope ownership. The
[family fixture](../../../../tests/distribution/family-consumer.test.ts) checks both construction
entries for Button, Modal and Sidebar. It checks option requirements, definition and lifetime
contracts, distinct activation and opening results, and the public family surfaces.

The [root tooling commands](../../tooling/index.md#installation-and-commands) run the checks in
the pinned contributor environment. Portable model checks establish lifecycle and behaviour
within the declared cases. Rendered accessibility, browser events, framework support and
publication require evidence at their own boundaries.
