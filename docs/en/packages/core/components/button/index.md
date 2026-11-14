# Button

Status: **Initial contract baseline awaiting joint family review; no Button source or export exists**

Button will model a discrete application action with its own lifetime and explicit, observable
availability. This initial baseline identifies the existing [Component](../../component/index.md)
and [Activatable](../../capabilities/activatable/index.md) as likely composition boundaries.
The [joint family review](../index.md#contract-led-development) must first validate the family's
requirements and their semantic fit with those contracts. Existing capabilities do not dictate
the family API. No implementation inheritance is required; production source and generated
declarations will own signatures when authored.

For example, an application keeps a Save button disabled while its input is invalid. It later
enables the same model, observes accepted activations and owns the resulting save operation.
A future representation can read and observe availability without replacing the model or polling
a guard. Button supplies this availability and complete owned lifetime, rather than another name
for an isolated activation capability.

## Construction and ownership

The initial names for review are `Button`, `ButtonFactory`, `ButtonOptionsType`,
`ButtonDisabledChangeType` and `buttonFactory`. They are not current core exports. A reviewed
factory interface can describe construction before its runtime value is implemented; the
[family factory boundary](../index.md#construction-contracts-and-factories) owns that distinction
and the conditional possibility of a common factory interface.
The contextual factory's `create` operation will accept optional initial configuration and return
a new active Button. When present, configuration must be a non-null, non-array object; omission
or undefined selects the defaults. Every instance owns a private scope, independent disabled state and its
observation registrations. The caller owns that model's disposal authority.

`initialDisabled` is the optional boolean configuration, defaulting to false when omitted or
undefined. Capture it once; other supplied values and invalid option shapes fail before exposing
a model. Mutating the original options does not reconfigure Button, and the caller's object is
neither frozen nor adopted. There is no public scope parameter, capability instance or cleanup
registration method. Borrowing a Button does not transfer its disposal authority.

The future options type must admit both omission and explicit undefined under the strict compiler's
exact-optional-property rules. Other non-boolean values remain invalid; this does not change the
existing capability option types.

Failed creation exposes no partial model, invalidates acquired work and finalises only the scope
created for that attempt, attempting all required owned releases. Preserve borrowed collaborators;
report failures opaquely without promising an error class or aggregation shape. Factory creation
performs no application action, initial change notification or host effect.

## Activation and input

The initial baseline proposes `activate` and `subscribeActivation` with the existing Activatable
meanings, results, rejection vocabulary and subscription protocol. The joint review must confirm
that these meanings meet the Button cases before selecting that composition. If retained,
internal activation authorisation reads the Button's disabled state through the existing
capability guard, preserving lifecycle and occupation checks before disabled authorisation.

| Condition | Activation outcome |
| --- | --- |
| Disposed | Rejected with disposed, irrespective of disabled state. |
| Activation already occupied | Rejected with busy, irrespective of disabled state. |
| Active, idle and disabled | Rejected with denied; no acceptance notification. |
| Active, idle and enabled | Accept one activation and notify under the existing protocol. |

Accepted activation is not proof that application work or another component's request succeeded.
Disabling from an activation observer affects later requests without revoking the accepted action.
The model has no second `click` operation, Clickable capability, `onClick` channel or public
canActivate configuration. Availability has one internal authority controlled by explicit model
updates; external state-authority protocols require a separate justified design.

HTML's [activation behaviour](https://html.spec.whatwg.org/multipage/interaction.html#activation-behavior-of-elements)
also routes non-pointer activation through click. A future host maps its supported inputs to the
model's activation request while avoiding duplicate activation paths. Browser input does not
become part of the portable activation contract.

## Availability and changes

The readonly `isDisabled` reading exposes the current application-set policy. It remains readable
with its last committed value after finalisation. Enabled does not imply a live or idle model,
focusability, current authorisation of unrelated business work, or completion of an earlier action.
Disabled is distinct from transient capability occupation, pressed state and persistent selection.

`setDisabled` is a synchronous write to that authority, taking a boolean and returning no value.
It does not ask a second owner for permission. A successful changed write commits before delivery;
an unchanged idle write returns normally without notification. Invalid values and terminal writes
throw before mutation. Any reentrant setter call during disabled-change delivery also throws
before mutation, including an equal-value write; it creates no queue or nested transition.

`subscribeDisabledChange` observes effective changes without replay. Each notification is a frozen
ButtonDisabledChangeType snapshot with readonly previous/current booleans in opposite directions:
false to true or true to false. This family-owned meaning does not reuse OpenableChangeType merely
because its fields have the same shape. Repeated values, initialisation and disposal produce no
disabled-change event.

Registrations are independent, including duplicate callbacks. Delivery is synchronous and ordered:
additions wait for the next delivery, removal before a turn cancels it, and an executing callback
may finish. The returned CapabilityUnsubscribeType operation releases only that registration and
remains idempotent after finalisation. Invalid listeners or terminal registration throw without
retaining a registration. Callbacks are borrowed; returned promises are not awaited.

One callback failure does not cancel remaining eligible callbacks. Attempt them before reporting
an opaque failure; preserve the committed state without rollback or automatic retry. Disposal
cancels remaining deliveries, including along that error path. Availability delivery and activation
have separate occupation: enabling may allow an activation from its observer if activation is idle;
an activation observer may change availability if disabled-change delivery is not occupied.

## Finalisation and connections

Button follows the existing component finalisation protocol: its scope becomes terminal before
owned releases, every required synchronous release is attempted and repeated/reentrant disposal
does not retry work. No finalisation callback can revive activation or pending availability
delivery merely because physical cleanup has not yet run or fails.

After disposal, lifecycle and the final disabled reading remain available. Activation returns
rejected/disposed; state writes and new subscriptions throw without mutation or registration.
Disposal invents no activation or disabled transition and does not force isDisabled to true.
Existing release handles remain valid. No scope or internal capability escapes through Button.

An application connecting Button activation to another model owns that connection and its release.
Neither participant acquires the other's lifetime. The later Modal work will decide whether a
closing control is a real owned part or application composition; this contract selects no
closeControl option, manager membership or implicit target.

## Host responsibilities and verification

| Owner | Responsibility |
| --- | --- |
| Button model | Owned lifetime, disabled authority/changes and accepted or rejected logical activation. |
| Application | Availability inputs, action effects, business results and connections between borrowed models. |
| Future host | Accessible naming/role, supported input, focus, disabled representation, default browser actions and mounting/teardown. |

The [APG Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) informs future keyboard,
naming and interaction work. Native submit/reset behaviour, DOM events and their cancellation,
tab order, gestures, rendering, icons and motion are not supplied by this model.

Implementation must verify independent lifetimes/state, configuration capture/validation,
activation precedence, repeated writes, immutable opposite-direction snapshots, subscription
mutation, cross-operation reentrancy, callback failures, setup cleanup and terminal behaviour.
Public type consumers must protect readonly members, available operations, initial configuration,
transition shapes and absence of public scope/private constructors. Fresh built/package consumers
must verify intentional exports and portable consumption in the existing supported modes.
Contract review and strict type examples precede runtime implementation. Confirm or refine this
baseline against the family cases, recording accepted differences before implementation rather
than silently changing an existing core contract. These are required future checks, not evidence
already supplied by the current core suite.
