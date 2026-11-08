# Legacy Capability Design

Status: **Opening and activation prototypes retained; foundation and family prototypes retired**

This remaining private workspace specifies opening and activation before their production
implementation. The [capability guide](reusable-capabilities.md) owns request, state-authority,
result and subscription semantics. The [vocabulary](vocabulary.md) and
[responsibility map](responsibilities.md) distinguish concepts and dependency direction.

The production [component foundation](../packages/core/component/index.md) now owns reference
identity, logical lifetime and cleanup registration. Its signatures live in production source,
not this workspace. The legacy capability example imports the production root source during migration.

## Current artefacts

The [private workspace](../../../design/README.md) retains shared capability types, opening and
activation declarations, three type-only entrypoints, two ambient vocabulary descriptors and one
non-executed consumer example. Its 18 explicitly listed legacy TypeScript inputs supply no runtime
values or product exports. Their compiler closure also follows the production foundation import.
The [tooling guide](../tooling/index.md#design-authoring) owns checking coverage.

Concrete Button, Sidebar and Modal prototypes, their factories and the static/floating Sidebar
union are retired. [Future component direction](../project/component-direction.md) preserves
useful composition questions without presenting those experiments as current API. Original
families, Sidebar's opening requirement and meaningful variants remain deferred.

## Transition boundary

Opening and activation are candidate reusable responsibilities. Their exact production
placement, construction and independent teardown/replacement require review after the foundation
runtime. The old component/family prototype surface is not an export quota, and this workspace
does not allocate capability packages or subpaths.

Implementation must preserve useful semantic constraints in actual production contracts, tests
and self-sufficient parallel documentation, then remove superseded prototypes. Real vocabulary
values must replace ambient descriptions when implemented; the two legacy runtime-absence checks
must become current export/conformance evidence. No duplicate handwritten signature authority
should survive that transition.

All remaining root `design/` files and their current checker/link dependencies must be retired
when their responsibilities are implemented or explicitly deferred. This guide claims no
lifecycle runtime, accessible interaction, rendering or framework support.
