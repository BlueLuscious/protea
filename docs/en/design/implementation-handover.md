# Implementation Handover

Status: **Declaration design specified; runtime and host qualification remain future work**

This guide owns the static qualification boundary and the requirements handed to a future
implementation. The [proposed public API](public-api.md) maps the selected names and modules;
the [integration guide](integration-boundaries.md) owns prospective host responsibilities.
Declarations own signatures. The [foundation](component-foundation.md),
[capability](reusable-capabilities.md), [family](representative-families.md) and
[coordination](component-coordination.md) guides retain their semantic authority. This handover
organises their evidence and required regressions without replacing those contracts.

## Retained inputs and consumers

The private [design workspace](../../../design/README.md) has 37 explicit TypeScript inputs:
33 declaration and entrypoint files, including six ambient `.d.ts` files, and four non-executed
consumption examples. The six ambient files describe four factory owners and two result
vocabularies. Seven logical modules expose 26 selected names through type-only entrypoints;
the [module map](public-api.md#module-and-symbol-owners) owns their catalogue.

| Consumer example                                                                  | Positive evidence                                                                                                           | Negative expectations                                                                                                                                                |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Component foundation](../../../design/examples/component-foundation.test.ts)     | Independent simple and interactive shapes, exact lifecycle vocabulary, readable lifetime and callable disposal.             | 9: readonly lifetime, invalid lifecycle, missing disposal, unsupported universal members and absent implicit host globals.                                           |
| [Reusable capabilities](../../../design/examples/capabilities.test.ts)            | Authority modes, guards, subscriptions, change directions, named statuses, result narrowing and capability composition.     | 28: conflicting or missing inputs, readonly views, invalid results or payloads, asynchronous boolean providers, unsupported members and absent runtime vocabularies. |
| [Representative families](../../../design/examples/families.test.ts)              | Family creation, capability-only views, sidebar narrowing, optional compatible parts and public trigger-to-target requests. | 17: incompatible families or inputs, readonly composition, distinct target outcomes, non-callable factory owners and absent runtime factories.                       |
| [Component coordination](../../../design/examples/component-coordination.test.ts) | Two lexical application compositions with separately owned lifetimes and cleanup obligations.                               | 0: no registry, manager or product scope contract is selected.                                                                                                       |

The 54 negative expectations protect stated restrictions rather than a target test count.
Declaration-only collaborators and consumer expressions supply no component implementation.
The examples must not be executed: their references describe values that this workspace does
not provide. Their lexical blocks and cleanup expressions are static consumption evidence.

## Static qualification boundary

The [tooling guide](../tooling/index.md#current-verification) owns the actual prerequisites,
commands and coverage. Its pinned contributor environment and frozen dependency installation
support `pnpm run typecheck:design`; `pnpm run verify` also checks lint and formatting.
The strict design configuration checks real declarations and examples with `noEmit: true`
and `skipLibCheck: false`. It generates no JavaScript, public declarations or product artefacts.

Positive examples check assignability, valid calls, selected literal vocabularies, narrowing
and structural composition. Negative examples reject specific invalid uses. A successful
`@ts-expect-error` line establishes that a diagnostic occurred, not that it was the intended
diagnostic. Its meaning needs separate review.

Qualification of the negative examples uses a bounded diagnostic audit:

1. Start from the current source and its explicit compiler inputs, retaining the ordinary
   strict check with all 54 expectations present.
2. Prepare an owned system-temporary copy for the diagnostic experiment. Remove only the
   suppression text from those 54 directive lines, preserving filenames, line positions,
   declarations and the relevant compiler configuration and resolution context.
3. Run the existing TypeScript checker against that temporary input set without executing
   examples or emitting runtime output. Do not modify the repository examples for the audit.
4. Match diagnostics to each current source file, line, intended diagnostic code and stated
   restriction. Reject missing expectations, unexpected locations, different causes and any
   additional unrelated diagnostics; matching the total count alone is insufficient.
5. Review the original examples and remove the owned temporary experiment under the shared
   cleanup rules. Keep permanent restrictions in their existing examples rather than retaining
   a disposable verifier, copied runtime or new test framework.

This audit complements the existing command; it is not a permanent automated architecture gate.
Documentary review separately checks links, semantic agreement, symbol ownership and the
[import graph](public-api.md#import-and-dependency-direction). All current imports and re-exports
are type-only. Explicit imports and reference directives still need review: ES2022 library
selection and `types: []` avoid implicit host globals without forbidding explicit host types.

Readonly restricts writes through a particular type view; it proves no runtime freezing or
ownership. Structural compatibility proves neither nominal identity nor a valid active part.
No static check here establishes synchrony, cleanup, instance isolation, accessible interaction
or executable distribution conformance. Exact-source hosted results and live integrations have
their own [automation evidence boundary](../tooling/automation/index.md).

## Semantic guarantees and required regressions

The following matrix groups the retained guarantees by their existing semantic owners.
Static evidence is deliberately narrower than the required runtime behaviour. Later tests
must exercise actual implementations and collaborators, including failures and re-entrant calls.

| Guarantee and semantic owner                                                                                     | Current static evidence and limit                                                                                                                                        | Required implementation regressions                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Reference identity](component-foundation.md#identity-and-creation)                                              | Structural component consumption and absence of a universal identifier. Types do not establish instance identity or disposal authority.                                  | Preserve identity through aliases and after finalisation; create distinct instances and retain borrowed references without transferring lifetime ownership.                                                                                                                                                                                                                                                                                                                                                |
| [Logical lifetime](component-foundation.md#logical-lifetime)                                                     | Exact `active`/`disposed` vocabulary and readonly consumer view. No transition is executed.                                                                              | Expose new models as active, make finalisation irreversible and keep permitted terminal readings valid; mounting, visibility and openness must not redefine lifetime. Closing is not disposal, and disposal invents no closing or activation notification.                                                                                                                                                                                                                                                 |
| [Initial disposal](component-foundation.md#disposal-and-ownership)                                               | A required callable operation with a consumer return type of `void`. Ownership and release ordering are semantic preconditions.                                          | Mark disposed before external release callbacks; attempt every owned synchronous release, never finalise borrowed collaborators and return normally only after successful required releases.                                                                                                                                                                                                                                                                                                               |
| [Repeated disposal and release errors](component-foundation.md#disposal-and-ownership)                           | No static proof of idempotence, re-entrancy or failure handling.                                                                                                         | Repeated and re-entrant calls perform no retry or wait and do not resurface the original failure; the initial call attempts all required releases before throwing an opaque failure. No error class or aggregation representation is promised.                                                                                                                                                                                                                                                             |
| [Internal opening](reusable-capabilities.md#internal-control)                                                    | Internal options, boolean observation, effective-change payloads and changed/unchanged results. Defaults and transitions are not executed.                               | Default to closed, establish initial state without notification, distinguish repeat requests from changes and check disposed then busy before satisfaction; rejected calls must create no new capability work.                                                                                                                                                                                                                                                                                             |
| [Single fixed authority](reusable-capabilities.md#opening-and-state-authority)                                   | Exclusive internal/external option branches, including incompatible variables and excluded initial values.                                                               | Capture one mode and the selected source reference for the lifetime; later option mutation must not replace them or create a second state writer.                                                                                                                                                                                                                                                                                                                                                          |
| [External source protocol](reusable-capabilities.md#external-control)                                            | Required source members and boolean request results; directly asynchronous providers are incompatible. Shape compatibility does not establish source coherence.          | Commit accepted targets and effective notifications synchronously; refusal causes no change, notification or queue and maps to denied while the owner remains active. Keep capability-local busy distinct and skip source requests for satisfied live, idle targets. Verify initial reading/subscription without lost transitions, no replay, one notification per effective source change including application-initiated changes outside capability requests, and refusal of re-entrant source requests. |
| [Observed commitment and terminal projection](reusable-capabilities.md#external-control)                         | Readonly public observation and typed results; no runtime observation is demonstrated.                                                                                   | Treat a public reading as an observation, including before source forwarding; freeze the last observed value at finalisation, never retreat to an older projection or continue reading the source afterwards.                                                                                                                                                                                                                                                                                              |
| [Disposal during external delegation](reusable-capabilities.md#request-ordering-and-operation-matrix)            | Result shapes express outcomes without proving timing or atomicity.                                                                                                      | Before observed commitment, return disposed when the owner ends unless a collaborator throws; external effects may still occur. After observed commitment, preserve changed without error even if finalisation prevents delivery. Neither case guarantees rollback of the source.                                                                                                                                                                                                                          |
| [Activation authorisation](reusable-capabilities.md#activation)                                                  | Optional boolean guard, directly asynchronous guard rejection and activated/rejected narrowing.                                                                          | Default to acceptance, check lifetime and busy before the guard, recheck lifetime after it and map false to denied while active. Propagate a thrown guard failure before acceptance and keep accepted activation distinct from completed business work. Repeated accepted calls are separate activations.                                                                                                                                                                                                  |
| [Result vocabularies](reusable-capabilities.md#result-vocabularies)                                              | Named readonly choices, derived status types, required rejection reasons and separation of activation/opening results.                                                   | Produce the selected outcome and reason for each actual request. Unexpected exceptions remain outside the result union, can follow commitment and must not be converted into rejection or an automatic retry.                                                                                                                                                                                                                                                                                              |
| [Notification membership and order](reusable-capabilities.md#observation-failures-and-cleanup)                   | Listener payloads and release handles are callable; types do not execute delivery.                                                                                       | Deliver synchronously in registration order; treat duplicate callback registrations independently, defer new registrations to the next delivery and skip a removed registration before its turn. Allow an executing callback to finish and produce no initial replay. New subscriptions after finalisation throw opaquely without registering; existing unsubscribe operations remain idempotent after finalisation.                                                                                       |
| [Notification failure and cancellation](reusable-capabilities.md#observation-failures-and-cleanup)               | Result narrowing does not prove callback eligibility or cancellation.                                                                                                    | Attempt remaining eligible callbacks after failure, then throw opaquely without rollback. Finalisation cancels pending own deliveries and invalidates retained callbacks even if physical release fails, without cancelling unrelated authority deliveries.                                                                                                                                                                                                                                                |
| [Synchronous contracts](reusable-capabilities.md#observation-failures-and-cleanup)                               | Boolean providers exclude direct promises, but TypeScript permits some value- or Promise-returning implementations in `void` positions.                                  | Verify disposal and callback synchrony against real implementations; do not await returned callback promises or infer ordering, cancellation or completion guarantees for later asynchronous effects.                                                                                                                                                                                                                                                                                                      |
| [Family constraints](representative-families.md#pilot-matrix)                                                    | Minimal structural shapes, capability-only consumers and readonly sidebar discrimination. No family name establishes nominal identity, inheritance or rendered presence. | Preserve the static sidebar's permanently present scenario without artificial opening; give floating sidebars and Modals their selected opening capability and Button its activation. Keep fixed variant and part observations readable after finalisation without promising live host presentation.                                                                                                                                                                                                       |
| [Creation and captured inputs](representative-families.md#creation-and-fixed-composition)                        | Factory call shapes, compatible options and return contracts. Types do not validate real input or allocate resources.                                                    | Validate inputs, capture selected values and borrowed references, establish connections before exposing an active model and produce no synthetic activation or initial change. Capturing references must not freeze caller data or captured closures.                                                                                                                                                                                                                                                      |
| [Failed creation](representative-families.md#creation-and-fixed-composition)                                     | No constructor or setup path is executed.                                                                                                                                | Expose no partial instance; invalidate every allocated link and callback before attempting all owned cleanup, including after another failure. Preserve borrowed collaborators and propagate opaque failure without promising external rollback or an aggregation shape.                                                                                                                                                                                                                                   |
| [Fixed optional closing control](representative-families.md#modal-closing-part)                                  | Compatible optional input, omission rather than explicit undefined and a readonly exposed reference. Active status and ownership are not proven.                         | Accept absence, reject an incompatible or already-disposed supplied control, retain the fixed borrowed reference and own only the connection. Later control disposal must not dispose, replace or revive the Modal.                                                                                                                                                                                                                                                                                        |
| [Closing delivery and explicit sharing](representative-families.md#modal-closing-part)                           | Public request composition and distinct activation/target result types.                                                                                                  | Request public closing once per eligible linked activation; keep each target's changed/unchanged/rejected outcome distinct from activation. Verify normal fan-out when several Modals borrow one Button, including exceptions, independent finalisation and failed physical unsubscribe.                                                                                                                                                                                                                   |
| [Application connections](component-coordination.md#current-operations-and-authority)                            | Public calls and nested cleanup expressions distinguish owned lifetimes and cleanup obligations. They prove no successful cleanup or error aggregation.                  | Release application-owned registrations independently of target disposal; preserve source storage ownership, borrowed target lifetime and all required own cleanup attempts during partial setup or failure.                                                                                                                                                                                                                                                                                               |
| [Independent and intentionally shared instances](reusable-capabilities.md#request-ordering-and-operation-matrix) | Separate lexical compositions select no shared scope object or global manager. They prove no runtime isolation.                                                          | Keep instance state, busy checks and owned registrations independent; deliberately shared external authorities retain their explicit shared state and refusal constraints. No hidden global membership or authority may appear.                                                                                                                                                                                                                                                                            |
| [Host, accessibility and deferred policy](integration-boundaries.md#outstanding-owners-and-evidence)             | Portable signatures and reviewed dependency direction; no host fixture or adapter is implemented.                                                                        | Verify concrete representation, request mapping, teardown, labels, focus and supported dismissal. Lilium needs real public contracts before adapter support; overlapping-modal policy, icons, motion and distribution need their own accepted owners and evidence.                                                                                                                                                                                                                                         |

Registry registration, lookup, duplicate-key and removal outcomes are not applicable operations:
the [coordination decision](component-coordination.md#identity-and-absent-registration-operations)
selects no registry contract. That decision does not supply hidden membership behaviour or a
modal stack. A future retained manager or policy needs its own consumer and qualification.

## Transition to implementation-generated declarations

The [portable core scope](../project/core-foundation.md) and
[production baseline](../tooling/core-package.md) now select construction and package requirements.
The evidence inventory here describes the retained prototype. Its family/variant/factory names
are not required production exports; the Sidebar classification is reopened. Reconcile retained
core responsibilities and their real consumers, explicitly retiring deferred family prototypes
instead of moving ambient promises into a package. This does not change the accepted lifetime,
opening or activation operation semantics.

The intended canonical producer is the TypeScript declaration emitter operating on future
production TypeScript contracts and implementation through their owning build configuration.
No such product build, output directory, package or declaration-generation script exists yet.
Its concrete layout and invocation belong to the separately authorised implementation work.

Reconciliation must preserve one current signature authority:

1. Establish the production source owners and the real declaration producer. Keep contracts
   independent of private implementations and preserve the reviewed public dependency direction.
2. When separately authorised, replace ambient factory and vocabulary placeholders with actual
   runtime values. Derive status types from their real vocabulary authority rather than keeping
   disconnected literal catalogues or parallel handwritten declarations.
3. Compare the generated surface with the retained core names and newly selected construction
   contracts, explicitly accounting for retired family names, and check their requirements: call shapes,
   required and optional inputs, exclusivity, readonly modifiers, result branches, callback
   shapes and provider semantics. Assignability alone cannot establish equivalence or synchrony.
   Resolve intentional differences at the declaration and semantic owners before accepting them.
4. Change generated declarations through their producer. Distinguish regeneration from read-only
   drift verification, and preserve files outside that producer's ownership.
5. Migrate representative consumers to the implemented public modules. Distribution checks must
   consume current built outputs in the intended consumer environment, not stale artefacts,
   private source paths or the design prototypes.
6. Retire or explicitly re-scope superseded prototypes and examples. Keep useful design history
   distinguishable from the current public authority rather than maintaining competing signatures.

Six current negative expectations reject runtime access to four factories and two vocabularies.
They protect the private type-only prototype boundary, not a permanent ban on future product
values. Replace that evidence, where applicable, with actual module and export conformance
checks owned by the implemented product; do not silently retain an obsolete expectation or
claim that a type-only import proves an executable value exists.

## Implementation entry decisions

The design has no known unresolved signature contradiction blocking implementation planning.
Runtime qualification remains outstanding as specified above. The current core scope and package
baseline now select production construction, layout, module/output boundaries, public entry and
qualification targets. Their implementation and evidence are still pending. Future family and
integration packaging is undecided; it cannot be inferred from this prototype or another product.

A bounded implementation can first establish lifetime and disposal, then the selected
capabilities and their authority/notification regressions. Concrete family factories and borrowed
parts are deferred. Reconcile generated declarations and real public core consumers alongside
that implementation. Introduce host bindings only when actual public host contracts and supported
scenarios justify them, preserving the [integration boundaries](integration-boundaries.md).

This suggested order creates no implementation work, package, manager, inheritance requirement
or adapter. Implementation remains separately authorised; publication, runtime conformance and
framework/browser support require their own evidence.
