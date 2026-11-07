# Private Design Workspace

This directory is the private authoring space for Protea's foundation declaration prototypes and
non-executed consumption examples. It is not a product package or executable library.

The [foundation design guide](../docs/en/design/index.md) owns scope and semantic design decisions.
[Design authoring](../docs/en/tooling/index.md#design-authoring) owns the layout, check prerequisites
and actual coverage.

The [type-only component entrypoint](component/api/index.ts) exposes the experimental foundation
contracts. Their [semantic guide](../docs/en/design/component-foundation.md) owns identity,
lifetime and disposal obligations. The [consumption examples](examples/component-foundation.test.ts)
check simple and interactive shapes, intended restrictions and the absence of implicit host globals.

The [opening](openable/api/index.ts) and [activation](activatable/api/index.ts) entrypoints expose
narrow capabilities. Their [shared types](capabilities/api/index.ts) cover rejection reasons and
subscription cleanup; neither capability acquires a second component lifetime. The
[capability examples](examples/capabilities.test.ts) check authority modes, results, change payloads
and composition through type-only fixtures. The [capability guide](../docs/en/design/reusable-capabilities.md)
owns their semantics.

The [button](button/api/index.ts), [sidebar](sidebar/api/index.ts) and [modal](modal/api/index.ts)
entrypoints describe representative families and ambient factory objects through type-only exports.
Each factory exposes a `create` operation with its own component inputs and result. No creation
implementation, runtime factory object or executable export is supplied. The
public factory declarations sit beside their feature's type-only `api/` entrypoints. The
[family guide](../docs/en/design/representative-families.md) owns their purposes, fixed borrowed
parts and cleanup boundaries. The [family examples](examples/families.test.ts) check capability
consumption, static/floating discrimination, creation options and trigger/target composition.
Model, factory and application-service fixtures are declaration-only. The family subscription
callback is a non-executed consumer expression; do not execute these files.

The [coordination examples](examples/component-coordination.test.ts) use those existing factories
and capabilities in two application-local lexical scopes. Nested cleanup expressions distinguish
a Modal-owned borrowed-control connection from an application-owned trigger subscription; they
introduce no scope object or manager API. The [coordination guide](../docs/en/design/component-coordination.md)
owns that assessment and its deferred registry and multi-modal candidates. Static acceptance
does not prove isolation, notification delivery or successful cleanup.

The [public-API map](../docs/en/design/public-api.md) consolidates the seven existing type-only
entrypoints, their selected names and structural extension surface. The
[integration guide](../docs/en/design/integration-boundaries.md) assigns future host responsibilities
without adding a host contract or adapter. The existing examples supply their consumer evidence;
this consolidation adds no declaration, runtime export or duplicate fixture.

[tsconfig.json](tsconfig.json) explicitly lists the real declarations, entrypoints and four example
files, and extends the shared strict
baseline without emitting JavaScript. Run `pnpm run typecheck:design` from the repository root;
`pnpm run verify` includes that check alongside lint and formatting. Static acceptance does not
demonstrate resource release, lifecycle transitions, runtime ownership or implementation conformance.

No component constructor implementation, runtime value, package export or functional implementation is provided.
