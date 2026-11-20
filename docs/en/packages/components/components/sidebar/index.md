# Sidebar

Status: **Portable type contract for changeable logical presence; runtime implementation pending**

This first Sidebar contract covers a lateral region whose logical presence can be opened and
closed. For example, an application opens a supplementary navigation region when requested and
closes it when that task ends. The model owns an independent lifetime and opening relationship;
it does not measure rendered visibility or perform layout.

The type-only contracts are `SidebarInstance`, `SidebarApi` and `SidebarOptionsType`. For these
cases, `SidebarInstance` composes [ComponentInstance](../../../core/component/index.md) and
[Openable](../../capabilities/openable/index.md). This does not establish that every possible
sidebar must be Openable. Production source and generated declarations own signatures. The
Sidebar API value, incorporated definition and runtime implementation remain future work.

## Supported cases and independent axes

Both model-owned opening and a borrowed synchronous application authority support the selected
changeable-presence cases. The complete source and request obligations are those of Openable;
the Sidebar name introduces no weaker authority protocol.

A permanently invariable presence is outside this initial contract. Starting open still leaves
a meaningful closing request and does not select a permanent mode. An authority may refuse a
request under its existing policy, but that refusal does not introduce a permanent-sidebar
variant or establish support for every persistent-layout scenario.

Floating positioning, persistent layout, modality and responsive presentation are separate
questions. No StaticSidebar/FloatingSidebar classes, variant union, presentation discriminator
or inherited operation that is meaningless by construction is selected. A future permanently
present model must justify its own capability/construction boundary instead of implementing
close as a filler operation. Reconsidering the public family boundary requires an explicit
compatibility decision; this contract does not promise an automatic future subtype hierarchy.

## Construction and state authority

`SidebarApi` describes a readonly contextual `create` operation with a required
`SidebarOptionsType` argument. That type aliases `OpenableOptionsType`, preserving its explicit
control choice and mutually exclusive inputs:

| Mode | Required meaning |
| --- | --- |
| Internal | The model owns logical openness. Omitted initialOpen defaults to false; an explicitly supplied value must be boolean. An external authority is excluded. |
| External | A required borrowed OpenStateAuthority is the sole state owner. No separate initialOpen value is accepted. |

Missing options or control mode are unsupported. An excluded member remains excluded when
supplied as undefined; internal initialOpen also rejects explicit undefined. The model captures
the selected configuration and source/callback references, leaving the caller's options mutable
without making later mutations a reconfiguration mechanism. The source must satisfy the
[external authority protocol](../../capabilities/openable/index.md#external-authority-protocol),
including synchronous commitment, notification and refusal without queued work.

Each successful creation must return a new active model with its own private scope. The caller
owns that model's lifetime; there is no public scope parameter, cleanup-registration operation,
capability instance or manager membership. A supplied authority is borrowed and must not be
finalised incidentally.

Failed construction exposes no partial model. Invalidate its work and finalise only the scope
created for that attempt, becoming terminal before attempting every required owned release.
Preserve earlier models and borrowed sources. The
[setup protocol](../../capabilities/index.md#failed-setup) governs acquired connections, late
release handles and opaque failures without external rollback.

## Requests, observation and finalisation

isOpen reports logical opening under the selected authority. open, close and subscribeOpenChange
retain the full Openable meanings. Disposed checks precede busy checks and satisfaction; an idle
satisfied request is unchanged, effective commitment is changed, and a live source refusal is
rejected/denied. No family-specific result vocabulary, toggle, opening guard or second state
writer is introduced.

The [opening guide](../../capabilities/openable/index.md#results-and-request-ordering) owns exact
outcomes. The [shared observation rules](../../capabilities/index.md#subscriptions-and-synchronous-delivery)
own synchronous ordered delivery, independent registrations, mutation, unsubscribe and errors.
An effective opening change is not a measurement of visual visibility or evidence of rendering.
Callback/provider failure may follow commitment and cannot be treated as rollback or safe retry.

An application may connect another model's activation to a Sidebar request through public
operations. It owns that subscription and its release; neither endpoint acquires the other's
lifetime or an implicit target-selection policy. A closed Sidebar remains an active model.

Disposal follows the [component protocol](../../../core/component/index.md#finalisation-and-ownership),
becoming terminal before external cleanup and attempting every required owned release. It stops
requests and pending observations even if physical source disconnection has not run or fails.
It does not request closing, alter the borrowed source or emit a synthetic opening change.

Terminal lifecycle and the last observed isOpen projection remain readable without further
source access. New requests return rejected/disposed; new subscriptions throw and existing
unsubscribe operations remain idempotent. Preserve the
[delegated-request finalisation rules](../../capabilities/openable/index.md#delegation-and-finalisation)
when the owner ends before or after an observed commitment; no external rollback is promised.

## Structural types and host evidence

`SidebarInstance` expresses a structural `ComponentInstance` and `Openable` surface. The reviewed
[Modal](../modal/index.md) surface may therefore be assignable where the
same shape is required. This does not establish shared object identity, interchangeable domain
purpose or equivalent host semantics. No family brand or runtime discriminator is introduced.

Future hosts own landmarks/naming, supported input, focus, positioning, responsive layout,
representation and any modal interaction. An open model alone proves none of those behaviours.
The [integration guide](../../../../project/integration-boundaries.md) keeps DOM/framework
binding, styling, icons and motion at their explicit optional owners.

Public type consumers must protect explicit control options, inherited requests/observation,
readonly state, structural compatibility and the absence of public scope or unavailable factory
values. Runtime implementation must later exercise the selected changeable-presence cases,
independent models, both authority modes, connection/setup failures and terminal behaviour using
fresh built-package consumers. Permanent presence, variants and host accessibility require their
own evidence.
