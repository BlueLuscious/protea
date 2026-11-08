# Portable Core Foundation

Status: **Scope and consumption selected for implementation; package and runtime not yet present**

Protea's first production package will own portable component lifetime and reusable opening and
activation behaviour. It supports the standalone UI library without requiring a renderer, framework
or visual system. This guide owns its selected scope and construction responsibilities. The
[package tooling baseline](../tooling/core-package.md) owns identity, outputs and qualification.
These are implementation decisions, not available imports or demonstrated runtime guarantees.

## Responsibilities and consumers

The minimum `Component` contract remains reference identity, a readable `active`/`disposed`
lifecycle and terminal `dispose()`. It gains no universal identifier, configuration, state store,
event bus, opening operation or activation operation. A consumer needing only that contract
does not acquire resource-registration or construction authority.

The selected construction owner is `ComponentScope`, a structural contract extending `Component`
with `addCleanup(release)`. It represents one logical component lifetime, not an application
scope, group, registry or required implementation superclass. The caller creating it owns disposal.
Opening and activation borrow that fixed owner and do not expose a second disposal operation.

The justified consumers are a resource-owning model with no interaction, an opening model using
internal or external state, and one model combining opening and activation. Later families may
retain a scope privately and delegate their public operations without importing core internals.
Their placement in this same package or another package remains a later decision.

## Selected construction surface

| Owner                   | Operation and result                              | Responsibility                                                                                   |
| ----------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `componentScopeFactory` | `create()` returns a new active `ComponentScope`. | Establish one owned logical lifetime with no capabilities or registrations attached.             |
| `openableFactory`       | `create(scope, options)` returns `Openable`.      | Borrow an active scope and create opening with the explicit internal/external authority options. |
| `activatableFactory`    | `create(scope, options?)` returns `Activatable`.  | Borrow an active scope and create activation with the optional eligibility guard.                |

These are stateless factory objects with readonly `create` operations. Runtime classes, storage
and dispatcher helpers remain internal. No generic factory catalogue, class hierarchy or protected
extension hook is required. The actual production contracts and generated declarations will own
signatures as their implementations arrive; this decision introduces no ambient value placeholder.

Capabilities retain the existing responsibilities: opening exposes `isOpen`, `open`, `close` and
change subscription; activation exposes `activate` and acceptance subscription. Opening requires
one explicit control mode, with internal state initially closed unless configured otherwise.
External control borrows its sole synchronous state authority. There is no independent setter,
implicit asynchronous commitment, `toggle` or persistent pressed/selected state.

Opening results distinguish `changed`, `unchanged` and `rejected`; activation distinguishes
`activated` and `rejected`. Rejection reasons remain `disposed`, `busy` and `denied`. Each capability
owns a real immutable result vocabulary and derives its status type from that authority. Accepted
activation is distinct from a resulting opening request or completion of application work.

## Lifetime and release protocol

`addCleanup` accepts a synchronous release function only while the scope is active. A successful
call retains one obligation and does not invoke it. Invalid or terminal registration throws
opaquely before retaining or invoking that obligation. Registration failure transfers no cleanup
responsibility. Separate calls register separate obligations, including repeated function references.

The first `dispose()` makes the terminal state observable before calling external release code,
attempts every retained obligation and then throws opaquely if any required release failed.
Cleanup order is not a public guarantee. Repeated or reentrant disposal does not run, retry,
wait for or resurface releases. Adding cleanup during disposal sees the terminal state and fails.
The protocol is synchronous; returned promises are not awaited and establish no later completion
or cancellation guarantee. Borrowed collaborators are never incidentally finalised.

No remove/replace/transfer operation is selected for cleanup entries. An unsubscribe may be
called early and remain registered as an idempotent release until scope finalisation. Callers
must not register duplicate obligations unless invoking each is valid. This owner is not a
general lifecycle observable or a universal resource container.

Conforming structural scope implementations are permitted; no hidden recognition registry or
implementation-class dependency is required. They must obey the same terminal, synchronous and
atomic-registration protocol. Shape validation and TypeScript compatibility do not prove those
semantics, just as they do not prove an external opening authority is coherent.

Every capability checks its captured scope before work or callback delivery. Terminal state
therefore cancels its logical work before physical disconnection, even when another release
fails or its own release has not yet been attempted. Opening retains its last observed projection;
finalisation neither requests closing nor invents an activation or change notification.

## Creation, failure and composition

Factories validate their inputs, capture fixed option values and borrowed references, and establish
their own connections before exposing a completed capability. Changing the original options does
not reconfigure it or freeze the caller's objects. Each creation has independent state and busy
checks; explicitly sharing a scope shares lifetime, and sharing an external authority deliberately
shares that authority's state. Neither creates a global manager or implicit capability singleton.

A failed capability creation invalidates and attempts to release only what that call acquired.
It does not dispose the borrowed scope, previously created capabilities or external authorities.
If setup disposes the scope before returning a resource, the creator must still clean up that
resource and expose no capability. Any already-registered failed-attempt cleanup becomes inert
after its own attempt; it must not retain a retry or unnecessary borrowed handles. Cleanup failures
propagate opaquely without promising rollback of effects in borrowed collaborators.

The owner chooses all-or-nothing composition by disposing its scope when an intermediate step
fails. The following is a target consumption example, not executable against the current repository:

```ts
import {
  activatableFactory,
  componentScopeFactory,
  openableFactory,
} from "@luscious-garden/protea-core";

const scope = componentScopeFactory.create();

try {
  const opening = openableFactory.create(scope, { control: "internal" });
  const activation = activatableFactory.create(scope);

  scope.addCleanup(
    activation.subscribeActivation(() => {
      opening.open();
    }),
  );

  activation.activate();
} finally {
  scope.dispose();
}
```

The connection is application-owned until registered for release. It invokes public operations;
it neither copies live getters into another object nor equates activation with successful opening.
Production type/runtime consumers must validate this example when those values exist. A model
combining capabilities can keep their references separate; no merge API or fictional family is needed.

## Deferred components and environments

Button, Sidebar and Modal will start as original families in later work. The legacy prototype's
StaticSidebar/FloatingSidebar split is not an accepted production classification. Floating
presentation and static state or interaction may be independent axes and may coexist. The original
Sidebar's responsibilities, whether it always needs Openable, and any justified variants remain
for that family's work. No current core export or mandatory hierarchy follows from those pilots.

DOM binding, rendering, styles, focus, accessible host interaction, icons/Aster, motion, framework
adapters and managers are outside this portable implementation. Optional integrations will consume
public contracts; the core must work without them. This scope makes no claim of browser,
framework, accessibility or server-rendering conformance.

## Documentation ownership and transition

While no package exists, this project guide owns the selected scope and construction protocol.
When production source exists, its current API and useful design rationale belong in parallel
guides under `docs/en/packages/core/`, with component, opening and activation features at their
actual owners. Move ownership rather than keep duplicate specifications. Product-wide component
direction and integration boundaries need their own justified project owners.

The current private declarations remain legacy checking inputs until their responsibilities are
migrated or retired. Their family names and type-only value restrictions are not an export quota.
Implementation must remove the entire root `design/` workspace and its checker/link dependencies,
retire obsolete prototype guides, and preserve useful constraints in real tests and self-sufficient
documentation. No handwritten prototype is to become a permanent parallel signature authority.
