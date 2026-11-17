# Button

Status: **Portable Button runtime, availability and public factory implemented**

Button models a discrete application action with its own lifetime and explicit, observable
availability. Its reviewed contract combines [Component](../../component/index.md) and
[Activatable](../../capabilities/activatable/index.md). Activation fits the request/acceptance case;
availability remains family-owned because a per-call guard cannot publish disabled changes.
No implementation inheritance is required. Production interfaces/types and their generated
declarations own signatures; the runtime implements the behaviour specified here.

For example, an application keeps a Save button disabled while its input is invalid. It later
enables the same model, observes accepted activations and owns the resulting save operation.
A future representation can read and observe availability without replacing the model or polling
a guard. Button supplies this availability and complete owned lifetime, rather than another name
for an isolated activation capability.

## Construction and ownership

The core root exports `Button`, `ButtonFactory`, `ButtonOptionsType` and
`ButtonDisabledChangeType` as types. The
[Button contract](../../../../../../packages/core/src/components/button/contracts/button.contract.ts)
owns its family operations. The root also exports the frozen, stateless `buttonFactory` value;
its contextual `create` supplies the executable construction described by ButtonFactory. The
[family factory boundary](../index.md#construction-contracts-and-factories) owns that distinction
and the conditional possibility of a common factory interface.
The contextual factory's `create` operation accepts optional initial configuration and returns
a new active Button. When present, configuration must be a non-null, non-array object; omission
or undefined selects the defaults. Every instance owns a private scope, independent disabled state and its
observation registrations. The caller owns that model's disposal authority.

`initialDisabled` is the optional boolean configuration, defaulting to false when omitted or
undefined. Capture it once; other supplied values and invalid option shapes fail before exposing
a model. Mutating the original options does not reconfigure Button, and the caller's object is
neither frozen nor adopted. There is no public scope parameter, capability instance or cleanup
registration method. Borrowing a Button does not transfer its disposal authority.

The options type admits both omission and explicit undefined under the strict compiler's
exact-optional-property rules. Other non-boolean values remain invalid; this does not change the
existing capability option types.

Failed creation exposes no partial model, invalidates acquired work and finalises only the scope
created for that attempt, attempting all required owned releases. Preserve borrowed collaborators;
report failures opaquely without promising an error class or aggregation shape. Factory creation
performs no application action, initial change notification or host effect.

## Activation and input

```ts
import { buttonFactory } from "@luscious-garden/protea-core";

const save = buttonFactory.create({ initialDisabled: true });
const disconnect = save.subscribeActivation(() => {
  save.setDisabled(true);
});

save.setDisabled(false);
save.activate();
disconnect();
save.dispose();
```

The activation result reports acceptance; the application owns its actual save work and connection.
The observer can disable later requests without undoing acceptance of this one.

`activate` and `subscribeActivation` preserve the existing Activatable meanings, results, rejection
vocabulary and subscription protocol. Internal activation authorisation reads the Button's
disabled state through the existing
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
Neither participant acquires the other's lifetime. The reviewed [Modal](../modal/index.md)
composition leaves the closing connection with the application; neither family accepts a
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

## Implementation and evidence

The fresh packed-package type consumer checks construction contracts, readonly availability,
activation results, opposite-direction snapshots, the real factory and absence of public scope
or implementation constructors. Modal and Sidebar examples still use typed collaborators;
their runtime implementations are not supplied by this package.

The [public runtime suite](../../../../../../tests/runtime/button.test.mjs) exercises fresh packed
Button instances: independent lifetimes/state, captured and invalid configuration, activation
precedence, repeated writes, frozen opposite-direction snapshots, subscription mutation,
cross-operation reentrancy, callback failures and terminal behaviour. A throwing configuration
getter exercises failure before resource acquisition while preserving existing models. The
post-acquisition cleanup path is reviewed in source; the public API has no injected scope or
collaborator that exposes it for fault injection.

Internally Button creates its private lifetime through componentScopeFactory and obtains
Activatable through activatableFactory. Disabled state and delivery occupation stay family-owned.
The internal [ButtonComponent](../../../../../../packages/core/src/components/button/runtime/button.component.ts)
class implements the public Button contract; buttonFactory constructs it without exporting its
constructor. This follows the [family implementation naming](../index.md#module-and-public-boundaries).
The existing ordered-listener mechanism now belongs to shared/runtime as ObservationListeners,
serving Button and both capabilities without a public event bus, new availability capability or
family base class. Public contracts and existing capability protocols are unchanged.

Fresh package consumers verify the actual factory, root exports and strict NodeNext/Bundler types.
The [tooling guide](../../../../tooling/index.md) owns those checks and their limits. Portable
Button evidence establishes no rendered button, browser input or accessible host interaction.
