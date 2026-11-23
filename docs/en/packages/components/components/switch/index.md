# Switch

Status: **Portable runtime for retained boolean checked state**

Switch models a two-state choice such as showing help. Its checked value remains available
between requests. The Components root exports the frozen `Switch` API object and the
`SwitchApi`, `SwitchInstance` and `SwitchOptionsType` contracts. `SwitchInstance` combines
[ComponentInstance](../../../core/component/index.md) with
[Checkable](../../capabilities/checkable/index.md).

## Construction and ownership

`Switch.definition` is the prepared definition with identity
`{ namespace: "protea", name: "switch" }`. `Switch.create(options)` delegates to
`Component.create(Switch.definition, options)`. Both entries use the same definition and create
a new active instance with its own lifetime. The caller owns disposal.

`SwitchOptionsType` aliases `CheckableOptionsType`. Choose `control: "internal"` to own an
independent checked value, initially `false` unless `initialChecked` is supplied. Choose
`control: "external"` with a `CheckedStateAuthority` to use a value owned by the application.
Multiple external instances can observe one borrowed authority while keeping their lifetimes and
subscriptions independent. A failed construction releases the attempt's resources without
finalising other models or their borrowed authority.

## Checked state and collaboration

Read `isChecked`, use `requestChecked(nextChecked)` to express an explicit target, and use
`subscribeCheckedChange(listener)` to observe effective changes. The
[Checking guide](../../capabilities/checkable/index.md#requests-and-observation) owns request
outcomes, ordering, delivery and failure behaviour. A satisfied request produces no notification.

An application can connect [Button](../button/index.md) activation to a shared preference that
Switch observes. The application owns that connection and sends the Button's request directly to
the authority. Button's action acceptance and the preference's effective change are separate
outcomes. Disposing Switch disconnects its own observations and preserves its last observed value.
The source and other consumers retain their lifetimes.

## Host evidence

The model's checked value and operations are portable. A concrete host supplies role, accessible
name, pointer and keyboard interaction, projection of the authoritative value, and release of its
own connections. See the [integration boundaries](../../../../project/integration-boundaries.md)
and the [Components quality guide](../../quality.md#checks) for their respective scopes.
The [web example](../../../../../../examples/web/README.md#try-the-shared-help-preference)
connects a native Switch and a Button to one application-owned help preference.
