# Representative Families, Variants and Parts

Status: **Legacy family pilots; production families deferred and Sidebar classification reopened**

The [portable core scope](../project/core-foundation.md#deferred-components-and-environments)
supersedes this prototype's production classification. Button, Sidebar and Modal will start as
original families in later work. Floating presentation and static state/interaction may be
independent axes and may coexist; whether Sidebar needs Openable remains undecided. The retained
declarations and matrix below describe legacy experiments, not selected production variants or
future core exports. They will be retired without implementing their families in the portable slice.

This guide describes the legacy button, sidebar and modal pilots: their composition, variant
meaning, creation obligations, parts and future accessibility responsibilities. The
[component foundation](component-foundation.md) owns identity, lifetime and disposal;
[reusable capabilities](reusable-capabilities.md) own opening, activation, state authority,
results and notification semantics. These families compose those contracts without changing them.
The [responsibility map](responsibilities.md) retains the dependency and integration boundaries.

The private [button](../../../design/button/api/index.ts),
[sidebar](../../../design/sidebar/api/index.ts) and [modal](../../../design/modal/api/index.ts)
entrypoints own their declarations. [Consumption examples](../../../design/examples/families.test.ts)
challenge the intended relationships without executing them. The declarations describe an
experimental API, not an installed package, runtime component or compatibility promise.

## Pilot matrix

| Pilot            | Purpose and capability composition                                                                                                                                                                      | State authority and parts                                                                                                 | Future host responsibility                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Button           | [Button](../../../design/button/contracts/button.contract.ts) combines `Component` and `Activatable` for a discrete action. It requires no opening or persistent pressed state.                         | Activation follows its optional eligibility guard. No separate model part is justified by this pilot.                     | Supply the action's accessible name and appropriate control semantics, input handling and focus behaviour.                                 |
| Static sidebar   | [StaticSidebar](../../../design/sidebar/contracts/static-sidebar.contract.ts) combines `Component` with the fixed `static` variant. It represents a permanently present sidebar in the stated scenario. | No opening authority, `isOpen`, fake closing operation or required model part.                                            | Represent its content and structure appropriately; permanent logical presence is not a claim that a DOM node exists.                       |
| Floating sidebar | [FloatingSidebar](../../../design/sidebar/contracts/floating-sidebar.contract.ts) combines `Component`, `Openable` and the fixed `floating` variant. Its logical presence can change.                   | Uses the selected internal or borrowed external opening authority. No panel or content model part is required.            | Map actual openness to host presentation and accessibility, without imposing modal behaviour merely because the sidebar floats.            |
| Modal            | [Modal](../../../design/modal/contracts/modal.contract.ts) combines `Component` and `Openable` for a logically openable modal interaction.                                                              | Uses the selected opening authority and may borrow one closing Button. It owns the closing subscription, not that Button. | Establish accessible dialog semantics, interaction boundaries, focus placement and restoration, keyboard handling and supported dismissal. |

The [SidebarType union](../../../design/sidebar/types/sidebar.type.ts) admits the two sidebar
variants. Their readonly discriminant lets a consumer distinguish them before using the floating
variant's opening surface. Those declarations assigned different behavioural contracts to static
and floating; that experimental classification is now reopened. It must not determine the future
Sidebar family, its presentation axes, opening requirement or implementation hierarchy.

These are structural interfaces. Their names establish no nominal identity, base class or
implementation inheritance. Consumers needing only opening or activation can depend on the
capability alone. No family introduces a second lifecycle or requires manager registration.

Visual choices such as `Default`, `Minimal` or `Glass` remain presentation choices. They create
no behavioural class, theme dependency or additional variant by themselves. The legacy floating
prototype selected logical opening semantics; future Sidebar work must distinguish those semantics
from positioning, static state, animation, focus management and modality.

## Creation and fixed composition

Private ambient factory owners provide the selected consumption surface:

- [buttonFactory.create](../../../design/button/api/button.factory.d.ts) accepts optional activation
  options and creates the minimum action control.
- [staticSidebarFactory.create](../../../design/sidebar/api/static-sidebar.factory.d.ts) creates the
  permanently present variant without opening options.
- [floatingSidebarFactory.create](../../../design/sidebar/api/floating-sidebar.factory.d.ts) accepts
  opening options and creates the floating variant.
- [modalFactory.create](../../../design/modal/api/modal.factory.d.ts) accepts
  [ModalOptionsType](../../../design/modal/types/modal-options.type.ts), combining the selected
  opening options with an optional borrowed closing Button.

Each owner is an ambient constant-object declaration exposing a named readonly `create` function.
The entrypoints export these owners for type queries only. No runtime factory object, callable
creation export or class implementation is supplied. Readonly members constrain the type view;
they do not establish runtime freezing. This experimental surface introduces no creator registry
or global shared state and does not demonstrate input validation, allocation or successful
construction.

A future creator must validate its inputs and establish an `active` instance before exposure.
Opening uses exactly one selected authority under the existing capability rules. An internal
initial value is established before exposure; an external source is read and subscribed without
losing a transition. Creation does not activate a control, request closing or produce a synthetic
initial activation or opening-change notification.

Creation captures selected option values, callback references, the source reference and any
closing-control reference. Mutating the original options object later does not reconfigure the
model. This does not freeze caller-owned data or captured closures. The external opening source
remains explicitly live while the component is active, as specified by its capability contract.

If a closing control is supplied, it must satisfy the Button contract and be active when the
composition is created. An omitted control is valid. An incompatible or already-finalised
supplied control, or another invalid creation input, causes creation to fail with an opaque
error; it must not be silently ignored or replaced. Runtime validation must check actual inputs;
TypeScript compatibility cannot prove those preconditions.

The creator establishes all required connections, including the modal's closing subscription,
before exposing a completed instance. Creation failure exposes no partial instance. It must
invalidate every link and callback allocated for that attempt before cleanup, so failed physical
unsubscription cannot leave the failed attempt able to perform later component work. It must
attempt cleanup of every resource allocated for that attempt, even when another cleanup fails,
and propagate an opaque failure. No error class or aggregation representation is selected.
Failure neither finalises borrowed controls, sources or callbacks nor guarantees rollback of
effects in external collaborators. Cleanup must not invent activation, closing or other actions.

## Modal closing part

The modal's readonly `closeControl` is either the fixed borrowed Button or `undefined`. Its
multiplicity is zero or one per modal. The pilot provides no live replacement, part setter,
automatic fallback or general part collection. Reading the retained reference remains valid
after finalisation; the referenced control has its own independent lifecycle.

When present, the modal creates and owns an activation subscription on that Button. For each
eligible activation delivery, the link requests the modal's public closing operation once.
It does not write private opening state, bypass an external authority or create a new state
owner. An already-closed modal still follows the ordinary unchanged-request rule.

The target's closing result is consumed without replacing or translating the Button's activation
result. The Button can report `activated` while the closing request is unchanged or rejected.
An activation is not proof that the target closed. Target exceptions follow the existing
observer-failure contract: an accepted activation or committed opening change is not rolled
back, remaining eligible observers are attempted and an opaque failure can propagate.
The link introduces no special priority or callback ordering over other subscriptions.

The control is borrowed, not adopted. If its owner finalises it later, the modal remains active,
retains that terminal reference and still exposes its public closing operation. It does not
revive or replace the control. A future host must account for the available dismissal mechanisms
rather than assuming this optional part always supplies a usable visible close button.

Explicitly sharing one Button among several modals creates separate subscriptions and deliberate
fan-out: one accepted activation can request closing on every still-eligible linked modal.
There is no implied single-target ownership, global uniqueness check or automatic selection of
the topmost modal. Each target retains its own authority and request outcome. An unchanged or
rejected target request does not cancel other eligible listeners; exceptions and independent
finalisation continue to follow the capability's normal delivery rules.

When the modal is finalised, it invalidates its link and attempts to release that subscription,
its capability registrations and any owned source connection under the foundation rules.
It never finalises the borrowed Button, external authority or callback collaborators. A failed
physical release can leave external resources retained, but the invalidated link must perform
no later target work. The terminal model cannot be revived by a callback that remains retained.
Repeated disposal retains the foundation's no-op and no-retry semantics.

## External triggers and targets

A triggering control and its target are distinct models. Applications may establish zero or more
external trigger subscriptions using public activation and target capability contracts. An
opening trigger requests opening; a closing trigger requests closing. The trigger does not gain
the target's opening state, disposal authority or private implementation merely by requesting it.
The target's existing state authority authorises the result.

The application owns these external subscriptions, their callbacks and cleanup. Neither target
finalisation nor unrelated control finalisation transfers that ownership. Target disposal does
not automatically remove registrations on other controls: the application must release its own
links. A later target request still follows the capability's terminal rejection rules. Disposing
a target does not finalise borrowed triggers or infer ownership of application subscriptions.

External composition can inspect a target operation's result inside its own callback when it
needs to distinguish change, no change and rejection. That result is not the triggering control's
activation result. The same observer, re-entrancy and error rules apply; no implicit queue,
cross-component transaction or second state store is introduced.

## Composition and terminal behaviour

| Situation                                                            | Selected outcome and owner                                                                                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modal has no closing-control part                                    | Creation is valid; no closing subscription is allocated. The application and future host remain responsible for supported dismissal.                     |
| Supplied closing control is incompatible or already disposed         | Creation fails before exposure; attempt cleanup of owned allocations and preserve borrowed collaborators.                                                |
| Original options later point at another control or authority         | No replacement occurs; the captured composition remains fixed.                                                                                           |
| Closing control accepts an activation but the target does not change | Retain the activation outcome and the target's own unchanged or rejected outcome separately; other eligible listeners remain eligible.                   |
| Closing callback encounters a target exception                       | Apply the existing observer-error rules without rollback or automatic retry.                                                                             |
| Borrowed closing control is finalised independently                  | The modal retains its reference and lifetime; no automatic replacement, revival or modal finalisation.                                                   |
| Several modals explicitly borrow the same closing control            | Independent eligible subscriptions fan out in the control's normal delivery order. No manager or exclusive target is inferred.                           |
| Modal is finalised before its closing link's turn                    | Invalidate the link and cancel its target work, including when physical unsubscription fails. Other eligible control subscriptions keep their own rules. |
| Modal is finalised during an already-accepted target request         | Preserve the accepted capability's ordering, observation and result rules; finalisation supplies no rollback.                                            |
| Family observations after finalisation                               | Lifecycle, fixed variant and part references remain readable; opening retains its terminal projection. No operation revives the model.                   |

Closing a component is not disposal. Disposal is not a synthetic close or host unmount. A disposed
static sidebar keeps its descriptive variant without retaining a promise of live presentation;
a disposed opening-capable model retains the last observed opening value without accepting work.
Only the lifetime owner may finalise a model; holding a family or part reference proves no such
authority in either TypeScript or runtime behaviour.

## Accessibility responsibilities

The model contracts do not contain labels, DOM identifiers, host elements or rendered children.
The application owns the purpose, appropriate accessible name and content for the actual use.
A future host adapter owns their correct representation and the concrete interaction mechanisms.
Family semantics identify the intended kind of interaction; their type names alone provide no
accessible control, landmark or dialog.

| Scenario         | Application and family responsibility                                                                                                                                                          | Future host adapter and verification responsibility                                                                                                                                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button           | Supply a meaningful action and accessible name; keep application eligibility consistent with the intended interaction. An eligibility callback is not an observable disabled-state API.        | Provide appropriate button semantics, accessible naming, keyboard/input activation, focus behaviour and any unavailable-state representation. Verify actual interactions and assistive-technology exposure.                                                           |
| Static sidebar   | Supply the content's purpose and structure. This scenario is permanently present and has no disclosure operation.                                                                              | Choose appropriate structural semantics for that content. Do not infer a particular landmark, role or DOM identifier from the family name. Verify reading and focus order in the actual page.                                                                         |
| Floating sidebar | Distinguish logical openness from the host's displayed and interactive state; define the content and relevant trigger relationships. Floating does not imply modal.                            | Map effective state to visibility and supported interactions, including any suitable trigger relationships and keyboard/focus behaviour. Verify hidden content and focus handling without treating animation completion as state commitment.                          |
| Modal            | Identify the modal interaction and supported dismissal policy. An optional model close control and an external source's ability to deny closing do not establish that the host is dismissible. | Supply accessible naming and dialog semantics, initial focus, focus containment and restoration, keyboard dismissal and outside-interaction restrictions as appropriate. Resolve or reject unsupported policy combinations before claiming correct modal interaction. |

W3C's [button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) and
[modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) provide relevant
host-interaction guidance. They are not evidence that these prototypes implement those patterns
or conform to an accessibility standard. No role attribute or logical state alone establishes
correct modal behaviour.

Modal focus and interaction boundaries can conflict when several models share one host context.
This pilot establishes no stack, focus-arbitration algorithm, topmost selection or global manager.
Later coordination design must justify the responsible application or family policy and any
required scoped service before a host advertises support for such combinations. Independent
models and explicit trigger links need no manager for basic use.

## Evidence and deferred abstractions

The private examples check family composition, sidebar discrimination, capability-only consumers,
creation-option compatibility and the borrowed part surface. The
[tooling guide](../tooling/index.md#current-verification) owns actual commands and check coverage.
Declarations and type queries do not execute factories, establish live subscriptions or prove
construction validation, ownership, visibility, accessibility or successful cleanup.

Later runtime and host evidence must cover partial-creation failure and cleanup, fixed reference
capture, link delivery and invalidation, activation versus target outcomes, explicit sharing,
independent finalisation, failed release, terminal observations and actual accessible interaction.
The selected static examples do not replace that evidence.

No universal part base, component-valued content placeholder, mandatory panel model, replaceable
part registry, mandatory family class hierarchy or shared controller is justified here. Host-rendered
content remains a later host responsibility rather than a fake portable part contract. Optional
icons, motion and styles remain independent. Public packages, runtime distribution and additional
catalogue entries remain outside these pilot declarations.

## Future design considerations

The following candidates preserve Protea's component-library purpose. They establish no additional
API, implementation commitment or package. Protea's own semantics and consumers must justify
their design before a shared mechanism or integration is selected.

A generic factory contract or a combined creation-and-lookup surface may be useful when real
consumers need shared responsibilities. The current owners select only creation; they introduce
no common factory base, lookup registry or global service. Any later design must assign state,
ownership and scope explicitly under Garden's
[responsibility rules](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#responsibilities-layers-and-dependencies).

A family may later share implementation logic through composition or a genuine base implementation
when actual responsibilities justify it and substitution preserves the public contracts. A static
sidebar must retain its permanently present scenario without acquiring artificial opening methods.
Garden's [family direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#responsibility)
allows that implementation choice without prescribing an inheritance hierarchy. No runtime base
class is introduced by these declarations.

An Icon component is a candidate for later Protea UI design. Its own semantics, accessibility and
composition with controls such as these pilots must be designed by Protea. It may consume public
icon definitions or a suitable rendering capability through the optional
[Aster integration](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#aster-integration),
or another compatible provider. This direction selects no concrete Aster API, mandatory dependency,
duplicated geometry model or icon catalogue. Changing the provider alone does not establish a
behavioural variant. No Icon contract or implementation is introduced here.

Motion remains optional future integration through explicit public contracts under Garden's
[integration direction](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#other-optional-integrations).
Logical opening and its accepted results remain distinct from visual completion; this candidate
adds no animation operation or asynchronous completion protocol.

The [core package baseline](../tooling/core-package.md) is selected. Future family and integration
package placement and distribution remain open. Factory ownership, family identity and candidate
integrations do not establish separate packages or registry names; those decisions remain with
Protea's later concrete distribution work under Garden's
[dependency and distribution rules](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#dependencies-and-distribution).
