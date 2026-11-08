# Remaining Private Capability Prototypes

This temporary workspace contains the opening and activation declaration prototypes and their
non-executed type examples. It is not a product package or an executable library. The
[remaining design guide](../docs/en/design/index.md) explains its scope; the
[capability guide](../docs/en/design/reusable-capabilities.md) owns its proposed semantics.

The component foundation now belongs to [core](../packages/core/README.md). The remaining
[capability examples](examples/capabilities.test.ts) import that production source contract
explicitly during migration. This is a private authoring dependency, not evidence of package
distribution. The separate [package consumer suite](../tests/distribution/core-package.test.mjs)
checks the built package through its manifest.

The [opening](openable/api/index.ts), [activation](activatable/api/index.ts) and
[shared-type](capabilities/api/index.ts) entrypoints remain type-only. Their ambient result
vocabularies supply no runtime values. A capability does not acquire a separate component lifetime.
Its eventual package owner and construction API remain undecided until the foundation is executable.

The family, variant and factory prototypes have been retired. Their useful design considerations
remain proposals in [component direction](../docs/en/project/component-direction.md); the
[integration guide](../docs/en/project/integration-boundaries.md) owns product-wide boundaries.
There are no Button, Sidebar or Modal exports here or in the core package.

[tsconfig.json](tsconfig.json) explicitly lists 18 capability and example TypeScript inputs and
extends the strict, host-free baseline. Its imported production types also enter the compiler
closure. Run `pnpm run typecheck:design` from the root; `pnpm run verify` includes this no-emit check.
These examples must not be executed. Static acceptance does not demonstrate notification delivery,
state transitions, resource release or runtime ownership. The remaining prototypes will be
reconciled and removed as their implementation decisions are made.
