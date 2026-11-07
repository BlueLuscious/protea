# Component Coordination

Status: **Direct composition selected for the current pilots; no management contract introduced**

This guide records which discovery and coordination responsibilities the current pilots need.
The [component foundation](component-foundation.md) owns reference identity, lifetime and
disposal. [Reusable capabilities](reusable-capabilities.md) own requests, state authority,
observations and results. [Representative families](representative-families.md) own creation,
parts and the modal's closing connection. Those contracts remain unchanged.

Current consumers already hold their controls and targets. Direct public requests and owned
subscriptions express their selected interactions. No separate manager, registration contract,
coordinator class or product scope API is needed to describe them.

## Candidate decisions

| Candidate                                                        | Current consumer and decision                                                                                             | Direct alternative                                                                                      | Evidence needed to revisit                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Application trigger-to-target connection                         | Retain the existing application-owned composition. A control requests an operation on an explicitly supplied target.      | Borrow the narrow public capability and own the returned unsubscribe obligation.                        | A real composition responsibility that direct references and existing requests cannot express clearly.             |
| Modal-owned closing connection                                   | Retain the existing optional `closeControl` composition. The modal already owns its connection and terminal invalidation. | Use the Button's public activation subscription and the modal's public closing request.                 | A new family requirement beyond the selected fixed borrowed part and accepted delivery rules.                      |
| Scoped component registry or generic component manager           | Defer. No current consumer needs to discover an unknown target by an address or enumerate registered components.          | Keep the references supplied to creation or application composition.                                    | A concrete addressed-lookup or membership consumer, with scope, identity and ownership requirements.               |
| Modal topmost, exclusivity or shared-focus coordinator           | Defer. Simultaneous modal interaction in one host context has no accepted policy or supported host scenario.              | Current models remain independent; their direct opening contracts select no stack or focus arbitration. | An accepted host scenario and explicit family/application policy for overlapping modals and their failures.        |
| Combined generic factory and lookup owner                        | Defer. The selected factory owners create models without a retained-membership contract.                                  | Use `create` and retain the returned model reference at its actual owner.                               | Consumers needing both creation and discovery, with defined retention and removal responsibilities.                |
| Mandatory global manager, service locator or empty manager shell | Reject for the current design. These introduce authority or structure without a pilot consumer.                           | Explicitly supply required references and collaborators.                                                | Reassess a demonstrated responsibility at its narrowest owner; a name or empty interface is insufficient evidence. |

Deferring a scoped registry is not a permanent prohibition. It records that the current consumers
do not justify selecting its inputs, operations or guarantees. A future family policy is likewise
independent from generic membership: a lookup owner would not acquire authority over modal state,
focus or component lifetime merely by retaining a reference.

## Current operations and authority

| Existing operation or relationship              | Authority and ownership                                                                                                                                                                               | Cleanup and terminal limits                                                                                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Family factory owner's `create` operation       | The caller owns the newly created model's lifetime. Supplied controls, callbacks and external authorities retain their existing owners.                                                               | Creation establishes the selected connections before exposure and cleans up a failed attempt under the family rules. It introduces no hidden registration or factory lookup contract.  |
| Public activation, opening or closing request   | The addressed capability applies its own lifetime, busy and authorisation checks. An external opening source remains its sole state authority when selected.                                          | Outcomes and exceptions remain local to their owning contracts; no manager accepts the request on the target's behalf.                                                                 |
| Application subscribes to a control             | The source maintains its registration record and borrows the listener. The application owns the release obligation represented by the returned unsubscribe function and its own composition callback. | The application releases its connection. Finalising an unrelated target does not automatically remove this source registration.                                                        |
| Modal subscribes to its borrowed closing Button | The Button maintains the activation registration; the modal owns its acquired connection and release obligation.                                                                                      | Modal finalisation invalidates the connection and attempts physical release without finalising the Button. A retained callback cannot revive target work if release fails.             |
| Consumer calls an unsubscribe function          | The consumer releases its acquired observation registration through the source's public operation.                                                                                                    | Repeated calls are idempotent under the capability contract. Unsubscription does not finalise the source, listener or target.                                                          |
| A source Button is finalised                    | Its own lifecycle owner ends that model; the source retires its registrations and pending deliveries under its existing rules.                                                                        | This does not finalise borrowed targets, transfer their ownership or replace a modal's retained closing-control reference. Existing release handles retain their idempotent semantics. |
| A target component is finalised                 | Its lifecycle owner ends its logical lifetime and attempts all owned release obligations.                                                                                                             | It rejects later work and preserves its allowed terminal observations. External application connections on other sources remain the application's cleanup responsibility.              |
| Component projects a borrowed opening authority | The authority owns state and its subscription records; the component owns its acquired source connection and projection obligations.                                                                  | Component disposal freezes its last observed projection and attempts disconnection. It neither disposes the source nor establishes a provider-lifetime protocol.                       |

Storage ownership and release responsibility are distinct. A source maintaining a subscription
record does not own every consumer's application composition. A consumer holding an unsubscribe
function does not own the source or gain permission to finalise its component. Borrowing and
membership establish no disposal authority.

## Identity and absent registration operations

Component identity remains object-reference identity. No universal key, global identifier,
registration identity, automatic discovery or root registry is added. Family factory owners
describe creation rather than singleton model storage, component tracking or shared global state.

There is no selected registration or lookup API. Duplicate keys, missing lookup addresses,
repeated registration, replacement, repeated membership removal and returned registry collections
are therefore not applicable product operations. No snapshot, borrowed-view, ordering or stale
lookup guarantee is implied for such collections.

An application may maintain its own map or collection. Its key policy, retained references,
replacement, enumeration and cleanup belong to that application; they are not Protea guarantees.
Removing a reference from that collection does not itself finalise a component. Holding a stale
reference does not revive its model or bypass the capability's terminal request rules.

## Lifetime, observation and failure boundaries

The foundation exposes a readonly lifecycle reading, not a disposal publisher. Reading lifecycle
does not subscribe to finalisation. Opening-change subscriptions report effective opening changes;
they cannot be treated as disposal notifications or used to infer automatic registry removal.
No new foundation observer is introduced to support a hypothetical manager.

An external trigger connection can outlive its target. The application must release that
connection according to its own lifetime, rather than expect target disposal to remove a record
maintained by another source. A request reaching a finalised target follows the existing `disposed`
outcome. Source finalisation follows that source's rules; it does not silently adopt or finalise
the target. A borrowed external opening authority supplies no additional lifecycle protocol.

Existing capability rules continue to distinguish change, unchanged requests, acceptance and
rejection. A locally occupied capability rejects re-entrant requests with `busy`; an external
authority's refusal maps to its existing denied outcome. Subscriptions retain their existing
ordering, eligibility and callback-failure semantics. Coordination adds no implicit queue or
alternative result vocabulary.

An exception may follow committed state or accepted activation. A delegated external request may
have effects after its component ends under the accepted authority protocol. Direct composition
does not supply rollback across those boundaries, and a rejected or failed request is not proof
that all application collaborators are unchanged.

In particular, no atomic policy of closing another model and then opening a target is selected.
One request may succeed before another is denied, becomes busy, encounters finalisation or throws.
Current models provide no topmost selection, transaction, compensation, cancellation or focus
arbitration for that sequence. Such policy requires its own accepted responsibility and outcomes.

The modal's existing connection invalidation and failed-creation cleanup remain with the family
owner. No physical release failure may revive an invalidated modal connection. This is not a new
manager lifecycle or a promise that all external application callbacks are automatically cancelled.

## Static evidence and application compositions

The [coordination examples](../../../design/examples/component-coordination.test.ts) use two local
lexical application compositions with explicit references and independently owned cleanup obligations.
They introduce no product scope identity, manager interface, lookup stub or registration API.
Their public calls demonstrate consumption of the selected contracts without management.

The examples' `try`/`finally` cleanup illustrates the consumer's release responsibility. It is
statically checked application consumption, not an executed listener system or runtime suite.
The examples do not prove that cleanup succeeds, exceptions preserve a particular identity,
callbacks stop at runtime or the two compositions have isolated runtime state. Explicitly sharing
an external state authority would retain the existing intentional shared-source semantics.

The existing 54 negative expectations remain static checks of the accepted foundation, capability
and family boundaries. They do not verify registration consistency, physical resource release,
independent instances, notification execution, host accessibility or focus behaviour. No management
implementation or new automated enforcement is created by this design decision.

## Requirements for a future retained contract

Before selecting a registry or coordinator, identify a concrete consumer and resolve the relevant
responsibilities at their actual owner:

- Who creates and owns the scope, how its identity is established and when its lifetime ends.
- Why addresses or membership are needed, who supplies keys, and what duplicates, missing
  entries, repeated operations, replacement and stale references mean.
- Whether retained components are borrowed or explicitly transferred, what lookup exposes,
  and whether any returned collection is a snapshot or a borrowed view.
- Who removes membership when a component or scope ends, using which accepted observation
  or explicit caller operation. Automatic disposal observation cannot be assumed.
- Who owns acquired subscriptions, how logical invalidation precedes cleanup when required,
  and what happens when release fails or an observer invokes a re-entrant operation.
- For modal coordination, which host context and interaction policy are supported, who owns
  focus and exclusivity, and how partial results, source refusal, finalisation and exceptions
  are reported without silently adding another state authority.

Any selected contract must preserve unmanaged component use and consume public requests and
observations. Later implementation evidence must verify its actual consistency, ordering,
cleanup and isolation guarantees; host evidence must establish any promised interaction policy.
The current decision introduces none of those future APIs or runtime effects.
