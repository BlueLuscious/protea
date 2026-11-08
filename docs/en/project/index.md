# Protea Project

Status: **Private component foundation and capability runtime; original families pending**

## Purpose and authority

Protea is Garden's independent UI component library. Its direction includes component behaviour,
accessibility, composition and optional presentation. A portable foundation supports the product;
concrete integrations consume public contracts at their own boundaries.

Garden's [Protea record](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md)
owns ecosystem identity and accepted direction. The
[ecosystem authority](https://github.com/BlueLuscious/garden/blob/master/docs/en/ecosystem.md)
owns cross-product relationships. Protea owns its actual APIs, implementation, packages, tooling
and releases; a Garden summary does not establish an implemented or published product API.

## Current scope

The private [core package](../packages/core/index.md) provides componentScopeFactory and its
production component/scope contracts, with JavaScript/declaration emission and one root export.
Its [component guide](../packages/core/component/index.md) owns actual creation, lifetime and
cleanup registration. [Capabilities](../packages/core/capabilities/index.md) implement opening
and activation beneath the same package, with contextual factories and a borrowed shared lifetime.
State, occupation and listeners remain independent; individual teardown/replacement is deferred.
[Component direction](component-direction.md) owns later
original Button, Sidebar and Modal work, reopened Sidebar axes and composition questions.
[Integration boundaries](integration-boundaries.md) own future hosts, icons and motion.
No renderer, concrete framework adapter, manager or optional provider is implemented.

The [tooling guide](../tooling/index.md) owns contributor pins, actual scripts and checking limits;
the [package baseline](../tooling/core-package.md) owns production resolution, output ownership
and consumer qualification. Source/build presence is distinct from registry publication.

## Shared rules adoption

Protea follows the applicable
[Garden shared project rules](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md),
including the TypeScript/JavaScript profile. Shared policy remains with Garden; compatible
product-specific decisions stay at their narrowest Protea owner.

No shared-rule exception is approved by this adoption. A future exception requires explicit
maintainer acceptance through [Garden's procedure](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#exceptions).
A Protea decision cannot silently change another product's public contract or ecosystem boundary.

### Actual enforcement

The current gate combines focused lint, strict production type checks, manifest/config
formatting, bounded-build tests, public component/capability runtime tests and fresh package consumers.
Accessible host interaction still requires separate evidence. The exact
[coverage](../tooling/index.md#current-verification) distinguishes static, build, filesystem and
distribution evidence.

[CI orchestration](../tooling/automation/index.md) invokes the root gate on Ubuntu and Windows.
Hosted success requires evidence for the exact source checked. Links, fragments, semantic
architecture, naming, complete JSDoc/comment coverage, British English and prose accuracy remain
review subjects; adoption of a rule is separate from automated enforcement.

## Contributing

Read the relevant product authority and applicable Garden rules, inspect the worktree and preserve
unrelated changes. Keep implementation and documentation current within the requested slice.
Use [British English](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#british-english)
while preserving exact external identifiers. Link one canonical owner instead of maintaining
parallel API explanations or copying the shared rulebook.

Repository-local links follow checked-out source. Cross-project navigation targets the owning
repository's master branch under [Garden's link policy](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#cross-project-links).
Report pending destinations, current source and published behaviour according to their evidence.

The maintainer performs Git delivery and publication. Use Garden's
[handover convention](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#commit-proposals-and-handover).
Successful checks do not grant delivery or publication permission.

## Licence

Protea software and documentation follow [ISC](../../../LICENSE).
