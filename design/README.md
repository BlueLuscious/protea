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
owns their semantics. All example collaborators are declaration-only: do not execute either file.

[tsconfig.json](tsconfig.json) explicitly lists the real declarations, entrypoints and both example
files, and extends the shared strict
baseline without emitting JavaScript. Run `pnpm run typecheck:design` from the repository root;
`pnpm run verify` includes that check alongside lint and formatting. Static acceptance does not
demonstrate resource release, lifecycle transitions, runtime ownership or implementation conformance.

No component constructor, runtime value, package export or functional implementation is provided.
