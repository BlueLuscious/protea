import { Scope, type ComponentLifetime } from "@luscious-garden/protea-core";
import {
  Activation,
  Checking,
  Opening,
  activatableResultStatuses,
  capabilityRejectionReasons,
  checkableResultStatuses,
  openableResultStatuses,
} from "@luscious-garden/protea-components";
import * as capabilityEntries from "@luscious-garden/protea-components/capabilities";
import * as activationEntry from "@luscious-garden/protea-components/capabilities/activation";
import * as checkingEntry from "@luscious-garden/protea-components/capabilities/checking";
import * as openingEntry from "@luscious-garden/protea-components/capabilities/opening";
import type {
  Activatable,
  ActivationApi,
  ActivatableOptionsType,
  ActivatableResultStatusType,
  ActivatableResultType,
  CapabilityRejectionReasonType,
  CapabilityUnsubscribeType,
  Checkable,
  CheckableChangeType,
  CheckableOptionsType,
  CheckableResultStatusType,
  CheckableResultType,
  CheckedStateAuthority,
  CheckingApi,
  Openable,
  OpenableChangeType,
  OpeningApi,
  OpenableOptionsType,
  OpenableResultStatusType,
  OpenableResultType,
  OpenStateAuthority,
} from "@luscious-garden/protea-components";

declare const authority: OpenStateAuthority;
declare const owner: ComponentLifetime & Openable & Activatable;
declare const minimumComponent: ComponentLifetime;
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
declare function consumeComponent(value: ComponentLifetime): void;
declare function consumeAuthority(value: OpenStateAuthority): void;
declare function consumeOpeningResult(value: OpenableResultType): void;
declare function consumeActivationResult(value: ActivatableResultType): void;
declare function consumeOpeningStatus(value: OpenableResultStatusType): void;
declare function consumeActivationStatus(value: ActivatableResultStatusType): void;
declare function consumeReason(value: CapabilityRejectionReasonType): void;
declare function consumeChange(value: OpenableChangeType): void;
declare function consumeVoid(value: void): void;

const scope = Scope.create();
const openingApi: OpeningApi = Opening;
const activationApi: ActivationApi = Activation;
const internalOptions: OpenableOptionsType = { control: "internal", initialOpen: true };
const externalOptions: OpenableOptionsType = { control: "external", authority };
const activationOptions: ActivatableOptionsType = { canActivate: () => true };
const opening = openingApi.create(scope, internalOptions);
consumeOpening(openingApi.create(scope, { control: "internal" }));
consumeOpening(openingApi.create(scope, externalOptions));
const activation = activationApi.create(scope, activationOptions);
consumeActivation(activationApi.create(scope));
consumeActivation(activationApi.create(scope, {}));
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

function consumeChecking(authority: CheckedStateAuthority): void {
  const checkingApi: CheckingApi = Checking;
  const internal: CheckableOptionsType = { control: "internal" };
  const external: CheckableOptionsType = { control: "external", authority };
  const checking: Checkable = checkingApi.create(scope, internal);
  checkingApi.create(scope, { control: "internal", initialChecked: true });
  const borrowed: Checkable = checkingApi.create(scope, external);
  const current: boolean = borrowed.isChecked;
  const result: CheckableResultType = borrowed.requestChecked(!current);
  if (result.status === checkableResultStatuses.rejected) {
    consumeReason(result.reason);
  } else {
    const status: CheckableResultStatusType = result.status;
    void status;
    // @ts-expect-error A successful request has no rejection reason.
    result.reason;
  }
  const release: CapabilityUnsubscribeType = checking.subscribeCheckedChange((change) => {
    const snapshot: CheckableChangeType = change;
    // @ts-expect-error An effective change snapshot is readonly.
    snapshot.current = true;
  });
  consumeVoid(release());

  const mixedInternal = { ...internal, authority };
  const mixedExternal = { ...external, initialChecked: undefined };
  // @ts-expect-error Internal control excludes an authority through structurally typed inputs.
  checkingApi.create(scope, mixedInternal);
  // @ts-expect-error The excluded initial value cannot be present as undefined.
  checkingApi.create(scope, mixedExternal);
  // @ts-expect-error An explicitly supplied internal initial value must be boolean.
  checkingApi.create(scope, { control: "internal", initialChecked: undefined });
  // @ts-expect-error External control requires its authority.
  checkingApi.create(scope, { control: "external" });
  // @ts-expect-error The construction requires a cleanup owner.
  checkingApi.create(minimumComponent, internal);
  // @ts-expect-error An authority may not acknowledge requests asynchronously.
  checkingApi.create(scope, { control: "external", authority: { ...authority, async requestChecked() { return true; } } });
  // @ts-expect-error The checked reading is readonly.
  checking.isChecked = false;
  // @ts-expect-error Request targets are explicit booleans.
  checking.requestChecked();
  // @ts-expect-error A borrowed capability grants no authority to dispose its owner.
  checking.dispose();
  // @ts-expect-error Unchanged pairs are not effective changes.
  const noChange: CheckableChangeType = { previous: true, current: true };
  // @ts-expect-error Rejections carry a reason.
  const missingRejectionReason: CheckableResultType = { status: "rejected" };
  void [noChange, missingRejectionReason];
}

void consumeChecking;

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
openingApi.create(scope, mixedInternal);
// @ts-expect-error External control excludes a separate initial value through variables too.
openingApi.create(scope, mixedExternal);
// @ts-expect-error An excluded initial value cannot be present as undefined.
openingApi.create(scope, undefinedExternalInitial);
// @ts-expect-error External control requires its authority.
openingApi.create(scope, { control: "external" });
// @ts-expect-error Opening construction requires the selected control options.
openingApi.create(scope);
// @ts-expect-error A component consumer does not have cleanup-registration authority.
openingApi.create(minimumComponent, internalOptions);
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
activationApi.create(scope, { canActivate: asynchronousGuard });
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
// @ts-expect-error A creation operation cannot be replaced.
openingApi.create = openingApi.create;
// @ts-expect-error A creation operation cannot be replaced.
activationApi.create = activationApi.create;

function consumeCapabilityEntries(openAuthority: OpenStateAuthority, checkedAuthority: CheckedStateAuthority): void {
  const leafActivationApi: activationEntry.ActivationApi = capabilityEntries.Activation;
  const leafActivationOptions: activationEntry.ActivatableOptionsType = activationOptions;
  const leafActivation: activationEntry.Activatable = leafActivationApi.create(scope, leafActivationOptions);
  const leafActivationResult: activationEntry.ActivatableResultType = leafActivation.activate();
  const leafActivationStatus: activationEntry.ActivatableResultStatusType = activationEntry.activatableResultStatuses.activated;
  const aggregateActivation: [
    capabilityEntries.ActivationApi, capabilityEntries.ActivatableOptionsType, capabilityEntries.Activatable,
    capabilityEntries.ActivatableResultType, capabilityEntries.ActivatableResultStatusType,
  ] = [leafActivationApi, leafActivationOptions, leafActivation, leafActivationResult, leafActivationStatus];
  const rootActivation: [ActivationApi, ActivatableOptionsType, Activatable, ActivatableResultType, ActivatableResultStatusType] = aggregateActivation;

  const leafOpeningApi: openingEntry.OpeningApi = capabilityEntries.Opening;
  const leafOpenAuthority: openingEntry.OpenStateAuthority = openAuthority;
  const leafOpeningOptions: openingEntry.OpenableOptionsType = { control: "external", authority: leafOpenAuthority };
  const leafOpening: openingEntry.Openable = leafOpeningApi.create(scope, leafOpeningOptions);
  const leafOpeningResult: openingEntry.OpenableResultType = leafOpening.open();
  const leafOpeningStatus: openingEntry.OpenableResultStatusType = openingEntry.openableResultStatuses.changed;
  const leafOpeningChange: openingEntry.OpenableChangeType = { previous: false, current: true };
  const aggregateOpening: [
    capabilityEntries.OpeningApi, capabilityEntries.OpenStateAuthority, capabilityEntries.OpenableOptionsType,
    capabilityEntries.Openable, capabilityEntries.OpenableResultType, capabilityEntries.OpenableResultStatusType,
    capabilityEntries.OpenableChangeType,
  ] = [leafOpeningApi, leafOpenAuthority, leafOpeningOptions, leafOpening, leafOpeningResult, leafOpeningStatus, leafOpeningChange];
  const rootOpening: [
    OpeningApi, OpenStateAuthority, OpenableOptionsType, Openable, OpenableResultType, OpenableResultStatusType, OpenableChangeType,
  ] = aggregateOpening;

  const leafCheckingApi: checkingEntry.CheckingApi = capabilityEntries.Checking;
  const leafCheckedAuthority: checkingEntry.CheckedStateAuthority = checkedAuthority;
  const leafCheckingOptions: checkingEntry.CheckableOptionsType = { control: "external", authority: leafCheckedAuthority };
  const leafChecking: checkingEntry.Checkable = leafCheckingApi.create(scope, leafCheckingOptions);
  const leafCheckingResult: checkingEntry.CheckableResultType = leafChecking.requestChecked(true);
  const leafCheckingStatus: checkingEntry.CheckableResultStatusType = checkingEntry.checkableResultStatuses.changed;
  const leafCheckingChange: checkingEntry.CheckableChangeType = { previous: false, current: true };
  const aggregateChecking: [
    capabilityEntries.CheckingApi, capabilityEntries.CheckedStateAuthority, capabilityEntries.CheckableOptionsType,
    capabilityEntries.Checkable, capabilityEntries.CheckableResultType, capabilityEntries.CheckableResultStatusType,
    capabilityEntries.CheckableChangeType,
  ] = [leafCheckingApi, leafCheckedAuthority, leafCheckingOptions, leafChecking, leafCheckingResult, leafCheckingStatus, leafCheckingChange];
  const rootChecking: [
    CheckingApi, CheckedStateAuthority, CheckableOptionsType, Checkable, CheckableResultType, CheckableResultStatusType, CheckableChangeType,
  ] = aggregateChecking;

  const aggregateRelease: capabilityEntries.CapabilityUnsubscribeType = leafOpening.subscribeOpenChange(() => {});
  const rootRelease: CapabilityUnsubscribeType = aggregateRelease;
  const reason: capabilityEntries.CapabilityRejectionReasonType = capabilityEntries.capabilityRejectionReasons.denied;
  consumeReason(reason);
  rootRelease();
  void [rootActivation, rootOpening, rootChecking];

  // @ts-expect-error Capability aggregates do not expose family construction.
  capabilityEntries.Button;
  // @ts-expect-error An opening leaf does not expose another capability's construction API.
  openingEntry.Activation;
  // @ts-expect-error Shared rejection vocabulary belongs to the aggregate rather than each leaf.
  checkingEntry.capabilityRejectionReasons;
  // @ts-expect-error Leaf result vocabularies retain their readonly choices.
  activationEntry.activatableResultStatuses.activated = "activated";
  // @ts-expect-error The leaf API preserves required opening options.
  leafOpeningApi.create(scope);
  // @ts-expect-error The leaf API excludes a competing initial checked value.
  leafCheckingApi.create(scope, { control: "external", authority: checkedAuthority, initialChecked: true });
}

void consumeCapabilityEntries;
