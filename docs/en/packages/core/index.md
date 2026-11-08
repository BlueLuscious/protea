# Core

Status: **Private portable lifetime, opening and activation runtime implemented**

`@luscious-garden/protea-core` owns Protea's portable component foundation and reusable
capabilities. Its one public root exports current contracts, factories and immutable vocabularies.
Production TypeScript owns signatures and emits declarations; these guides own semantics,
ownership and limitations.

| Owner | Public responsibility |
| --- | --- |
| [Component](component/index.md) | Component, ComponentScope, ComponentScopeFactory and ComponentLifecycleType; componentScopeFactory creates independent lifetimes, and componentLifecycleStates owns the lifecycle choices. |
| [Opening](capabilities/openable/index.md) | OpenableFactory and openableFactory create Openable against one scope and selected state authority. OpenStateAuthority is a consumer-provided contract; opening options, changes, results and status types remain feature-owned. |
| [Activation](capabilities/activatable/index.md) | ActivatableFactory and activatableFactory create Activatable with an optional synchronous eligibility guard; activation options, results and status types remain feature-owned. |
| [Shared capability rules](capabilities/index.md) | CapabilityUnsubscribeType and CapabilityRejectionReasonType, with capabilityRejectionReasons; opening and activation each own their result-status vocabulary. |

The runtime values are componentScopeFactory, componentLifecycleStates, openableFactory,
activatableFactory, openableResultStatuses, activatableResultStatuses and capabilityRejectionReasons.
No public constructor, implementation class, generic manager or capability base is exported.

## Package boundary

The source lives under `packages/core/`, with component and capabilities as sibling feature
groups. Opening, activation and their genuinely shared pieces belong under `src/capabilities/`.
Grouping features allocates no public subpaths or additional npm package.

The package is ESM-only and emits ES2022 JavaScript plus declarations to its owned `dist/`.
Its root export resolves types to `dist/index.d.ts` and JavaScript to `dist/index.js`.
There are no wildcard exports or supported private runtime imports. The initial `0.0.0`
package is private; its identity establishes no registry reservation or published release.

Core has no production dependencies and requires no implicit Node, DOM or framework types.
The [package tooling guide](../../tooling/core-package.md) owns build, inclusion, consumer
qualification and supported-evidence boundaries.

## Composition and limits

The minimum Component contract remains lifetime and finalisation. A resource-owning consumer
can accept ComponentScope explicitly. Opening and activation borrow that owner without widening
Component or acquiring disposal authority. Instantiating a scope does not instantiate every
capability, and sharing a scope shares lifetime rather than state, occupation or listeners.

Factories expose `create` operations in their own context. Failed creation invalidates and
releases its own acquisitions, preserving borrowed owners and previously created capabilities.
Independent capability disposal, detach, replacement and reparenting remain deferred. Public
composition examples and detailed failure rules belong to the [capability guide](capabilities/index.md).

Concrete [families](../../project/component-direction.md), DOM binding, rendering, accessibility,
SSR, frameworks, icons and motion retain their own product/host responsibilities. Runtime and
public-consumer checks qualify their actual portable boundaries; they do not establish those
future [integration guarantees](../../project/integration-boundaries.md).
