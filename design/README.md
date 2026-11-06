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
Their collaborators are declaration-only: do not execute the example file.

[tsconfig.json](tsconfig.json) lists the four real TypeScript inputs and extends the shared strict
baseline without emitting JavaScript. Run `pnpm run typecheck:design` from the repository root;
`pnpm run verify` includes that check alongside lint and formatting. Static acceptance does not
demonstrate resource release, lifecycle transitions, runtime ownership or implementation conformance.

No component constructor, runtime value, package export or functional implementation is provided.
