# Integration Boundaries

Status: **Prospective integration boundaries selected; no host adapter implemented**

This guide owns how the candidate [public API](public-api.md) may be consumed by applications
and future hosts. The [component foundation](component-foundation.md),
[reusable capabilities](reusable-capabilities.md), [representative families](representative-families.md)
and [coordination decisions](component-coordination.md) retain their semantic authority. Their
private declaration prototypes establish no executable host integration or published package.

## Responsibility boundaries

| Owner                    | Responsibility                                                                                                          | Boundary                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Portable component model | Logical identity, lifetime, supported requests, state authority, results and observations.                              | No incidental DOM, Node, concrete framework, rendering or scheduling dependency.                         |
| Application              | Purpose, supplied configuration and collaborators, composition policy and ownership of application-created connections. | A trigger's accepted activation does not establish the target's outcome or transfer its state authority. |
| Future host adapter      | Translate supported host interactions and public model observations into a concrete representation.                     | Preserve model semantics; own its acquired host/model subscriptions without importing product internals. |

The family guide owns the [scenario-specific accessibility responsibilities](representative-families.md#accessibility-responsibilities).
A Button needs an appropriate host control and action mapping; a static sidebar needs no opening
binding; a floating sidebar projects effective openness; a Modal additionally needs an accepted
host interaction and dismissal policy. These needs select no renderer, host element type or
framework hook. Labels, roles, keyboard handling, focus and interaction restrictions require
their actual application and host evidence rather than another portable abstraction here.

## Lifetime and connection ownership

Model lifetime is distinct from host mounting, logical closing and animation. Closing does not
dispose a component; unmounting a representation does not by itself authorise ending a borrowed
model's lifetime. A readonly lifecycle reading is not a subscription to disposal. Opening-change
notifications likewise provide no lifecycle publisher or universal teardown signal.

A future adapter borrowing a component owns only the connections it acquires, unless an explicit
owning contract transfers more. It must not automatically dispose that model on host teardown.
An adapter that creates a component through a family factory is the caller and owns the new
model's lifetime under the existing creation rules. Supplied controls, authorities and callback
collaborators retain their own owners in either case.

Before failed setup or an ending adapter can leave retained callbacks behind, its owned bindings
must be logically invalidated. It must attempt all cleanup it owns even if one release fails;
physical release failure cannot revive work through an invalidated binding. Cleanup of an owned
model and of acquired host/model connections must not prevent the remaining required attempts.
The concrete host owner must define its teardown and failure handling; no universal host disposal
protocol, callback interface or new foundation observer is declared here.

A source maintains its registration records; a subscribing consumer acquires the corresponding
release obligation. Target disposal does not automatically remove an application or adapter
registration maintained by another source. Connection ownership and borrowed model ownership
remain separate, including during partial setup and failed release.

## Requests, observations and state authority

A host interaction may request activation, opening or closing through the selected public
capability. Its adapter must consume the actual result and preserve changed, unchanged, accepted
and rejected outcomes. Those results are not DOM event cancellation flags, a `defaultPrevented`
equivalent, proof of rendering or successful application business completion.

The activation eligibility callback is synchronous authorisation, not an observable disabled-state
API. A host must not infer continuous availability or a disabled-state subscription from that
callback or from a previous request result. No new availability contract is selected here.

Observers retain their accepted synchronous ordering, eligibility, re-entrancy and error rules.
An exception may follow commitment or accepted activation. A wrapper must not infer rollback,
automatically retry an action or reinterpret acceptance as visual completion. The model's
readonly views also establish no runtime freezing or automatic framework tracking.

External opening control requires a source satisfying the
[synchronous authority protocol](reusable-capabilities.md#external-control): acceptance commits
the requested value and delivers an effective change before return; refusal creates no queued
request. A host scheduler, promise or deferred update cannot be presented as that commitment
without evidence that the public source actually meets the contract.

An integration unable to satisfy a selected mode must explicitly reject or defer support for
that mode. It must not silently weaken synchrony, introduce a second state owner or add an
asynchronous acknowledgement, cancellation or queue protocol. Existing internal control remains
its own selected model; no host-specific control mode is introduced by this guide.

## Lilium availability and dependency direction

The reviewed public [Lilium master README](https://github.com/BlueLuscious/lilium/blob/master/README.md)
is a placeholder. That master supplies no public framework signatures, source entrypoints,
package exports or host documentation on which this design can base an adapter. This is a
current availability finding, not a permanent restriction on Lilium's development.

Garden's [Lilium integration direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/lilium/index.md#integration-boundary)
describes intentional public extension contracts as a future boundary; it does not provide
implemented hooks. No Lilium import path, lifecycle operation, reactive primitive, rendering
API or supported version range is selected or invented here. Public upstream authorities must
be inspected again before a concrete adapter relies on them.

The accepted [Protea/Lilium boundary](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#lilium-integration)
places the adapter with Protea, consuming public contracts from both products. Lilium must not
import Protea, and the portable Protea foundation must not depend on Lilium internals. No empty
adapter, ceremonial bridge, host ambient type or reverse dependency is introduced to illustrate
that direction. Other framework integrations retain the same ownership principle.

## Optional integrations and distribution

A future Protea Icon component remains a candidate with its own UI semantics and accessibility
responsibilities. The optional [Aster boundary](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#aster-integration)
permits public definitions or a suitable public capability without selecting a concrete API,
duplicating an icon catalogue or making Aster mandatory for basic component use. Aster acquires
no reverse dependency on Protea.

Motion and presentation remain optional integrations through explicit public contracts. Logical
opening and its request result remain distinct from visual or animation completion. This design
adds no motion API, required style system or completion protocol.

Logical module owners are not package boundaries. No framework package, workspace member,
runtime export map, registry name or release range follows from this guide. The type-only
design entrypoints do not establish browser, server-rendering, hydration, accessibility or
framework compatibility. Such claims require their own implementation and host evidence.

## Outstanding owners and evidence

| Outstanding subject                                    | Owner and required evidence                                                                                                                    | Effect on this design                                                                                       |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Public Lilium extension surface                        | Lilium publishes intentional public contracts; a prospective Protea adapter reviews the actual signatures and supported versions.              | Blocks a working Lilium adapter, not the current portable API and boundary consolidation.                   |
| Host request, observation and external-control mapping | The adapter demonstrates the selected mode's synchrony, results, ordering and error behaviour against its real host.                           | Blocks claims of support for that mode; no imaginary host contract is needed to retain the portable design. |
| Binding ownership, teardown and failed setup           | The adapter and application identify owned models and connections, validate setup, and verify invalidation plus all required cleanup attempts. | Blocks a working binding's lifetime guarantees; existing component ownership remains unchanged.             |
| Accessible representation and overlapping modal policy | The application, family and host owners verify the family guide's responsibilities and select any required scoped coordination policy.         | Blocks corresponding interaction or accessibility claims; no stack or generic manager is selected here.     |
| Icons, motion and packaging                            | Their product owners justify consumers, public dependencies, actual implementations and distribution decisions.                                | Remain separate candidate work, not prerequisites for the current portable component contracts.             |

These outstanding integration qualifications do not require placeholder APIs to complete the
current boundary design. Later runtime, host and accessibility checks must establish the promises
of each retained adapter; static type acceptance alone cannot provide that evidence.
The [implementation handover](implementation-handover.md) maps those obligations alongside the
portable model regressions without claiming a host implementation or compatibility result.
