import {
  activatableFactory,
  activatableResultStatuses,
  capabilityRejectionReasons,
  componentScopeFactory,
  openableFactory,
  openableResultStatuses,
} from "@luscious-garden/protea-core";
import type {
  Activatable,
  ActivatableFactory,
  ActivatableOptionsType,
  ActivatableResultStatusType,
  ActivatableResultType,
  CapabilityRejectionReasonType,
  CapabilityUnsubscribeType,
  Component,
  Openable,
  OpenableChangeType,
  OpenableFactory,
  OpenableOptionsType,
  OpenableResultStatusType,
  OpenableResultType,
  OpenStateAuthority,
} from "@luscious-garden/protea-core";

declare const authority: OpenStateAuthority;
declare const owner: Component & Openable & Activatable;
declare const minimumComponent: Component;
declare const asynchronousGuard: () => Promise<boolean>;
declare const asynchronousAuthority: Omit<OpenStateAuthority, "requestOpen"> & {
  requestOpen(nextOpen: boolean): Promise<boolean>;
};
declare const missingReason: { readonly status: "rejected" };
declare const change: OpenableChangeType;
declare const mixedInternal: { readonly control: "internal"; readonly authority: OpenStateAuthority };
declare const mixedExternal: { readonly control: "external"; readonly authority: OpenStateAuthority; readonly initialOpen: boolean };
declare const undefinedExternalInitial: { readonly control: "external"; readonly authority: OpenStateAuthority; readonly initialOpen: undefined };

declare function consumeOpening(value: Openable): void;
declare function consumeActivation(value: Activatable): void;
declare function consumeComponent(value: Component): void;
declare function consumeAuthority(value: OpenStateAuthority): void;
declare function consumeOpeningResult(value: OpenableResultType): void;
declare function consumeActivationResult(value: ActivatableResultType): void;
declare function consumeOpeningStatus(value: OpenableResultStatusType): void;
declare function consumeActivationStatus(value: ActivatableResultStatusType): void;
declare function consumeReason(value: CapabilityRejectionReasonType): void;
declare function consumeChange(value: OpenableChangeType): void;
declare function consumeVoid(value: void): void;

const scope = componentScopeFactory.create();
const openingFactory: OpenableFactory = openableFactory;
const activationFactory: ActivatableFactory = activatableFactory;
const internalOptions: OpenableOptionsType = { control: "internal", initialOpen: true };
const externalOptions: OpenableOptionsType = { control: "external", authority };
const activationOptions: ActivatableOptionsType = { canActivate: () => true };
const opening = openingFactory.create(scope, internalOptions);
consumeOpening(openingFactory.create(scope, { control: "internal" }));
consumeOpening(openingFactory.create(scope, externalOptions));
const activation = activationFactory.create(scope, activationOptions);
consumeActivation(activationFactory.create(scope));
consumeActivation(activationFactory.create(scope, {}));
const unsubscribeOpening: CapabilityUnsubscribeType = opening.subscribeOpenChange((value) => consumeChange(value));
const unsubscribeActivation: CapabilityUnsubscribeType = activation.subscribeActivation(() => {});
consumeVoid(unsubscribeOpening());
consumeVoid(unsubscribeActivation());
consumeOpeningResult(opening.open());
consumeOpeningResult(opening.close());
consumeActivationResult(activation.activate());
consumeOpeningStatus(openableResultStatuses.changed);
consumeOpeningStatus(openableResultStatuses.unchanged);
consumeOpeningStatus(openableResultStatuses.rejected);
consumeActivationStatus(activatableResultStatuses.activated);
consumeActivationStatus(activatableResultStatuses.rejected);
consumeReason(capabilityRejectionReasons.disposed);
consumeReason(capabilityRejectionReasons.busy);
consumeReason(capabilityRejectionReasons.denied);
consumeOpeningResult({ status: "changed" });
consumeOpeningResult({ status: "unchanged" });
consumeOpeningResult({ status: "rejected", reason: "denied" });
consumeActivationResult({ status: "activated" });
consumeActivationResult({ status: "rejected", reason: "busy" });
consumeChange({ previous: false, current: true });
consumeChange({ previous: true, current: false });
consumeComponent(owner);
consumeOpening(owner);
consumeActivation(owner);

const openingResult = opening.open();
if (openingResult.status === openableResultStatuses.rejected) {
  consumeReason(openingResult.reason);
} else {
  consumeOpeningStatus(openingResult.status);
  // @ts-expect-error A successful result has no rejection reason.
  openingResult.reason;
}
const activationResult = activation.activate();
if (activationResult.status === activatableResultStatuses.rejected) {
  consumeReason(activationResult.reason);
} else {
  consumeActivationStatus(activationResult.status);
  // @ts-expect-error A committed activation has no rejection reason.
  activationResult.reason;
}

// @ts-expect-error Internal control excludes a borrowed authority through variables too.
openingFactory.create(scope, mixedInternal);
// @ts-expect-error External control excludes a separate initial value through variables too.
openingFactory.create(scope, mixedExternal);
// @ts-expect-error An excluded initial value cannot be present as undefined.
openingFactory.create(scope, undefinedExternalInitial);
// @ts-expect-error External control requires its authority.
openingFactory.create(scope, { control: "external" });
// @ts-expect-error Opening construction requires the selected control options.
openingFactory.create(scope);
// @ts-expect-error A component consumer does not have cleanup-registration authority.
openingFactory.create(minimumComponent, internalOptions);
// @ts-expect-error The opening view is readonly.
opening.isOpen = false;
// @ts-expect-error The borrowed authority view is readonly.
authority.isOpen = false;
// @ts-expect-error Change snapshots are readonly.
change.current = true;
// @ts-expect-error An unchanged pair is not an effective opening change.
consumeChange({ previous: false, current: false });
// @ts-expect-error An unchanged pair is not an effective closing change.
consumeChange({ previous: true, current: true });
// @ts-expect-error Expected rejection reasons form a closed vocabulary.
consumeReason("pending");
// @ts-expect-error Rejected opening results require their reason.
consumeOpeningResult(missingReason);
// @ts-expect-error Rejected activation results require their reason.
consumeActivationResult(missingReason);
// @ts-expect-error Activation does not expose an unchanged outcome.
consumeActivationResult({ status: "unchanged" });
// @ts-expect-error A guard must synchronously return a boolean.
activationFactory.create(scope, { canActivate: asynchronousGuard });
// @ts-expect-error An authority must synchronously commit its request.
consumeAuthority(asynchronousAuthority);
// @ts-expect-error Opening grants no activation operation.
opening.activate();
// @ts-expect-error Opening selects explicit requests, without toggle.
opening.toggle();
// @ts-expect-error A capability grants no parent disposal authority.
opening.dispose();
// @ts-expect-error Activation grants no opening operation.
activation.open();
// @ts-expect-error Activation has no persistent opening state.
activation.isOpen;
// @ts-expect-error A capability alone is not a component lifetime.
consumeComponent(activation);
// @ts-expect-error Activation success is not an opening outcome.
consumeOpeningStatus(activatableResultStatuses.activated);
// @ts-expect-error Opening change is not an activation outcome.
consumeActivationStatus(openableResultStatuses.changed);
// @ts-expect-error Named opening choices cannot be replaced.
openableResultStatuses.changed = "changed";
// @ts-expect-error Named activation choices cannot be replaced.
activatableResultStatuses.activated = "activated";
// @ts-expect-error Named rejection reasons cannot be replaced.
capabilityRejectionReasons.busy = "busy";
// @ts-expect-error A factory creation operation cannot be replaced.
openingFactory.create = openingFactory.create;
// @ts-expect-error A factory creation operation cannot be replaced.
activationFactory.create = activationFactory.create;
