# Components Quality

Status: **Public runtime and packed-consumer coverage**

This page owns conformance evidence for `@luscious-garden/protea-components`. The
[API guide](api/index.md) lists exact public exports, and
[workspace tooling](../../tooling/workspace/index.md) owns both output producers.

## Checks

| Evidence | Guarantees exercised | Behaviour authority |
| --- | --- | --- |
| [Opening](../../../../tests/runtime/openable.test.mjs), [activation](../../../../tests/runtime/activatable.test.mjs) and [composition](../../../../tests/runtime/capability-composition.test.mjs) | State authority, request results, observations, reentrancy, failed setup, and independent or explicitly shared capability state. | [Capabilities](capabilities/index.md). |
| [Checking and Switch runtime](../../../../tests/runtime/checkable.test.mjs) | Direct capability creation and both Switch entry points, internal and external control, checked-state observation, refusal, reentrancy, failed setup and disposal. | [Checking](capabilities/checkable/index.md) and [Switch](components/switch/index.md). |
| [Button runtime](../../../../tests/runtime/button.test.mjs) | Independent lifetime, availability, activation, listener changes and terminal behaviour through `Button.create`. | [Button](components/button/index.md). |
| [Modal runtime](../../../../tests/runtime/modal.test.mjs) | Shared definition and independent instances, internal and external opening authority, failed setup, terminal projection and application-owned Button collaboration. | [Modal](components/modal/index.md). |
| [Select runtime](../../../../tests/runtime/select.test.mjs) | Both creation routes, captured options, selection authority, request results, change delivery, protocol failures and independent cleanup. | [Select](components/select/index.md). |
| [Sidebar runtime](../../../../tests/runtime/sidebar.test.mjs) | Shared definition and independent instances, changeable logical presence, internal and external opening authority, and ownership and cleanup boundaries. | [Sidebar](components/sidebar/index.md). |
| [Tabs runtime](../../../../tests/runtime/tabs.test.mjs) | Both creation routes, captured tab-to-panel associations, local selection, disabled and invalid targets, observation, reentrancy and finalisation. | [Tabs](components/tabs/index.md). |
| [Type and distribution checks](../../../../tests/distribution/components-package.test.mjs) | Archive inclusion, concrete packed Core dependency, exact public exports, identity across root, family, definition and capability entries, independent creation, private subpaths and declarations under NodeNext and Bundler. | [API](api/index.md) and [package boundary](index.md#boundary). |

Each independent Components consumer builds and packs Core and Components, installs both actual
archives offline and resolves the public entries. The [Core quality guide](../core/quality.md)
owns the separate consumer that installs only Core.

## Consumer conformance

The [capability fixture](../../../../tests/distribution/capability-consumer.test.ts) checks
aggregate and individual imports, authority modes, request results, vocabularies and scope ownership.
The [family fixture](../../../../tests/distribution/family-consumer.test.ts) checks both construction
routes for Button, Modal, Select, Sidebar, Switch and Tabs. It checks named subpath imports, inferred options
and instance methods, definition and lifetime contracts, capability-specific results and the
public family surfaces.

The [web example](../../../../examples/web/README.md) owns the browser cases for the six family
imports and their use with native controls. Its
[Tabs checks](../../../../examples/web/README.md#try-the-note-panels) cover manual activation,
focus-only navigation and panel projection. Browser interaction and connection teardown require
separate host evidence from the portable model gate.

The [root tooling commands](../../tooling/index.md#installation-and-commands) run the checks in
the pinned contributor environment. Portable model checks establish lifecycle and behaviour
within the declared cases. Rendered accessibility, browser events, framework support and
publication require evidence at their own boundaries.
