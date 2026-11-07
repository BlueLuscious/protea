# Protea Project

Status: **Component, capability and representative family prototypes specified; runtime not implemented**

## Purpose and authority

Protea is Garden's independent UI component library project. Its direction includes component
behaviour, accessibility, composition and optional presentation. A framework-neutral foundation
supports that product; concrete integrations use public contracts and retain their own boundaries.

Garden's [Protea record](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md)
owns the product's ecosystem identity and accepted direction. The
[ecosystem authority](https://github.com/BlueLuscious/garden/blob/master/docs/en/ecosystem.md)
owns relationships between products. This repository owns the contracts, implementation, packages,
tooling and releases it introduces; ecosystem summaries do not establish implemented APIs here.

## Current scope

The current source contains private contributor infrastructure, documentation, an ISC licence,
repository text hygiene configuration and private component, capability and family prototypes with checked,
non-executed consumption examples. There are no runtime implementations, product package manifests
or functional adapters. The [repository tooling guide](../tooling/index.md) owns the configured contributor
baseline, available commands and current verification.

The [foundation design guide](../design/index.md) owns the selected cases, vocabulary and
responsibility boundaries. The [component foundation](../design/component-foundation.md) owns
reference identity, logical lifetime and disposal semantics for the current prototype.
[Reusable capabilities](../design/reusable-capabilities.md) specify logical opening with one
internal or external synchronous state authority, and activation without persistent pressed state.
[Representative families](../design/representative-families.md) contrast buttons, static/floating
sidebars and modals, including fixed borrowed parts and owned connections.
[Component coordination](../design/component-coordination.md) retains direct references and public
capabilities for these pilots; registry and multi-modal policy candidates are explicitly deferred
until their consumers justify them. The [proposed public API](../design/public-api.md) consolidates
the existing type-only modules and extension surface. [Integration boundaries](../design/integration-boundaries.md)
assign future host responsibilities and record unavailable upstream contracts; no implementation hierarchy is selected.
Integrations with Lilium, Aster and other hosts
are optional product directions, not current dependencies or compatibility guarantees.

## Shared rules adoption

Protea follows the applicable
[Garden shared project rules](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md),
including their applicable TypeScript/JavaScript profile. General policy
remains with Garden; compatible Protea-specific decisions stay at their narrowest product owner.
The [tooling guide](../tooling/index.md) owns the contributor baseline and concrete hygiene
and verification boundaries.

No shared-rule exception is approved by this adoption. A future exception requires the explicit
maintainer decision and product-owned record described by
[Garden's exception procedure](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#exceptions).
A Protea decision cannot silently change another product's public contract or a Garden boundary.

### Actual enforcement

The current `verify` command runs focused lint, strict private-design type checking and formatting
over the files identified by [repository tooling](../tooling/index.md#current-verification).
Consumption examples are not executed; there is no runtime test suite or product build yet.
[CI orchestration](../tooling/automation/index.md) runs the same gate
independently on Ubuntu and Windows; hosted results require evidence for the exact revision.
Documentary links, fragments and authority claims still receive manual review. Adopting a rule
does not create its enforcement: semantic design, naming, complete JSDoc/comment coverage,
British English and prose accuracy remain review subjects.

## Contributing

Read this guide, the applicable Garden rules and the current authority for the affected subject
before editing. Inspect the worktree and preserve unrelated changes. Keep each change within its
requested scope and review its affected documentation and consumers.

Use [British English](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#british-english)
for owned content, preserving exact external identifiers. Keep one canonical owner per subject;
link it instead of copying a rulebook or maintaining competing API explanations. Create packages,
layers and documentation sections only when a real responsibility requires them.

Use relative links within this repository. Cross-project navigation follows Garden's
[canonical link policy](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#cross-project-links)
and targets the owning repository's `master` authority. Pending destinations and published-package
behaviour must be reported according to their actual evidence.

The maintainer performs Git delivery operations and publication. Use the shared
[commit proposal and handover convention](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#commit-proposals-and-handover)
for reviewed changes. Successful local checks, pushes or integrations do not authorise publication.

## Licence

Protea software and documentation follow [ISC](../../../LICENSE).
