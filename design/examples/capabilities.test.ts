import type {
  Activatable,
  ActivatableOptionsType,
  ActivatableResultType,
  ActivatableResultStatusType,
  activatableResultStatuses,
} from "../activatable/api/index.js";
import type {
  CapabilityRejectionReasonType,
  CapabilityUnsubscribeType,
} from "../capabilities/api/index.js";
import type { Component } from "../component/api/index.js";
import type {
  Openable,
  OpenableChangeType,
  OpenableOptionsType,
  OpenableResultType,
  OpenableResultStatusType,
  openableResultStatuses,
  OpenStateAuthority,
} from "../openable/api/index.js";

// These declaration-only fixture factories consume options without adding product factories.
// All expressions are static consumption examples and must not be executed.
declare function createOpenableFixture(options: OpenableOptionsType): Openable;
declare function createActivatableFixture(
  options?: ActivatableOptionsType,
): Activatable;

declare const authority: OpenStateAuthority;
declare const openingStatuses: typeof openableResultStatuses;
declare const activationStatuses: typeof activatableResultStatuses;
declare const openingRuntimeApi: typeof import("../openable/api/index.js");
declare const activationRuntimeApi: typeof import("../activatable/api/index.js");
declare const ownerFixture: Component & Openable & Activatable;
declare const openChangeListener: (change: OpenableChangeType) => void;
declare const activationListener: () => void;
declare const activationGuard: () => boolean;
declare const asynchronousGuard: () => Promise<boolean>;
declare const asynchronousAuthority: Omit<OpenStateAuthority, "requestOpen"> & {
  requestOpen(nextOpen: boolean): Promise<boolean>;
};
declare const mixedInternalOptions: {
  readonly control: "internal";
  readonly initialOpen: boolean;
  readonly authority: OpenStateAuthority;
};
declare const mixedExternalOptions: {
  readonly control: "external";
  readonly authority: OpenStateAuthority;
  readonly initialOpen: boolean;
};
declare const undefinedExternalInitialValue: {
  readonly control: "external";
  readonly authority: OpenStateAuthority;
  readonly initialOpen: undefined;
};
declare const missingExternalAuthority: { readonly control: "external" };
declare const change: OpenableChangeType;
declare const missingRejectionReason: { readonly status: "rejected" };

declare function consumeComponent(component: Component): void;
declare function consumeOpenable(openable: Openable): void;
declare function consumeAuthority(authority: OpenStateAuthority): void;
declare function consumeActivatable(activatable: Activatable): void;
declare function consumeBoolean(value: boolean): void;
declare function consumeVoid(result: void): void;
declare function consumeChange(change: OpenableChangeType): void;
declare function consumeUnsubscribe(
  unsubscribe: CapabilityUnsubscribeType,
): void;
declare function consumeReason(reason: CapabilityRejectionReasonType): void;
declare function consumeOpenableResult(result: OpenableResultType): void;
declare function consumeActivatableResult(result: ActivatableResultType): void;
declare function consumeOpeningStatus(status: OpenableResultStatusType): void;
declare function consumeActivationStatus(
  status: ActivatableResultStatusType,
): void;
declare function consumeOpenableSuccess(status: "changed" | "unchanged"): void;
declare function consumeActivationSuccess(status: "activated"): void;

const internalOpenable = createOpenableFixture({ control: "internal" });
const externalOpenable = createOpenableFixture({
  control: "external",
  authority,
});
const activatable = createActivatableFixture({ canActivate: activationGuard });

consumeOpenable(
  createOpenableFixture({ control: "internal", initialOpen: true }),
);
consumeActivatable(createActivatableFixture());
consumeActivatable(createActivatableFixture({}));
consumeBoolean(internalOpenable.isOpen);
consumeBoolean(externalOpenable.isOpen);
consumeBoolean(authority.isOpen);
consumeBoolean(authority.requestOpen(true));

const cancelOpenChange =
  internalOpenable.subscribeOpenChange(openChangeListener);
const cancelExternalChange = authority.subscribeOpenChange(openChangeListener);
const cancelActivation = activatable.subscribeActivation(activationListener);
consumeUnsubscribe(cancelOpenChange);
consumeUnsubscribe(cancelExternalChange);
consumeUnsubscribe(cancelActivation);
consumeVoid(cancelOpenChange());
consumeVoid(cancelExternalChange());
consumeVoid(cancelActivation());

consumeChange({ previous: false, current: true });
consumeChange({ previous: true, current: false });
consumeReason("disposed");
consumeReason("busy");
consumeReason("denied");
consumeOpenableResult({ status: "changed" });
consumeOpenableResult({ status: "unchanged" });
consumeOpenableResult({ status: "rejected", reason: "denied" });
consumeActivatableResult({ status: "activated" });
consumeActivatableResult({ status: "rejected", reason: "busy" });
consumeOpeningStatus(openingStatuses.changed);
consumeOpeningStatus(openingStatuses.unchanged);
consumeOpeningStatus(openingStatuses.rejected);
consumeActivationStatus(activationStatuses.activated);
consumeActivationStatus(activationStatuses.rejected);
consumeOpenableResult({ status: openingStatuses.changed });
consumeOpenableResult({ status: openingStatuses.unchanged });
consumeOpenableResult({ status: openingStatuses.rejected, reason: "busy" });
consumeActivatableResult({ status: activationStatuses.activated });
consumeActivatableResult({
  status: activationStatuses.rejected,
  reason: "denied",
});

const openingResult = internalOpenable.open();
if (openingResult.status === openingStatuses.rejected) {
  consumeReason(openingResult.reason);
} else {
  consumeOpenableSuccess(openingResult.status);
  // @ts-expect-error A successful or unchanged result exposes no rejection reason.
  openingResult.reason;
}
consumeOpenableResult(externalOpenable.close());

const activationResult = activatable.activate();
if (activationResult.status === activationStatuses.rejected) {
  consumeReason(activationResult.reason);
} else {
  consumeActivationSuccess(activationResult.status);
  // @ts-expect-error A committed activation exposes no rejection reason.
  activationResult.reason;
}

// One fixture owner can expose both capabilities without selecting a product family or class.
consumeComponent(ownerFixture);
consumeOpenable(ownerFixture);
consumeActivatable(ownerFixture);
consumeVoid(ownerFixture.dispose());

// @ts-expect-error Internal control cannot borrow an external authority, even through a variable.
createOpenableFixture(mixedInternalOptions);

// @ts-expect-error External control cannot supply an independent initial value through a variable.
createOpenableFixture(mixedExternalOptions);

// @ts-expect-error An excluded external initial value cannot be present as undefined either.
createOpenableFixture(undefinedExternalInitialValue);

// @ts-expect-error External control must supply its sole state authority.
createOpenableFixture(missingExternalAuthority);

// @ts-expect-error Consumers cannot write the observed opening value through the capability.
internalOpenable.isOpen = true;

// @ts-expect-error Consumers cannot write state through the borrowed authority contract.
authority.isOpen = false;

// @ts-expect-error A change snapshot exposes readonly current state.
change.current = true;

// @ts-expect-error Closed-to-closed is not an effective change.
consumeChange({ previous: false, current: false });

// @ts-expect-error Open-to-open is not an effective change.
consumeChange({ previous: true, current: true });

// @ts-expect-error Expected rejection reasons form a closed selected vocabulary.
consumeReason("pending");

// @ts-expect-error A rejected opening result must explain its expected reason.
consumeOpenableResult(missingRejectionReason);

// @ts-expect-error Activation outcomes do not use opening-state results.
consumeActivatableResult({ status: "unchanged" });

// @ts-expect-error An asynchronous guard cannot satisfy synchronous boolean authorisation.
createActivatableFixture({ canActivate: asynchronousGuard });

// @ts-expect-error Asynchronous authority requests cannot satisfy synchronous commitment.
consumeAuthority(asynchronousAuthority);

// @ts-expect-error Opening does not grant an activation operation.
internalOpenable.activate();

// @ts-expect-error Opening selects explicit target requests without a toggle operation.
internalOpenable.toggle();

// @ts-expect-error A borrowed capability does not expose its owner's disposal authority.
internalOpenable.dispose();

// @ts-expect-error Activation does not grant opening operations.
activatable.open();

// @ts-expect-error Activation introduces no persistent opening state.
activatable.isOpen;

// @ts-expect-error A capability alone does not provide the component foundation's lifetime members.
consumeComponent(activatable);

// @ts-expect-error Opening statuses cannot describe an activation outcome.
consumeOpeningStatus(activationStatuses.activated);

// @ts-expect-error Activation statuses cannot describe an opening-state change.
consumeActivationStatus(openingStatuses.changed);

// @ts-expect-error The declared opening vocabulary exposes readonly members.
openingStatuses.changed = "changed";

// @ts-expect-error The declared activation vocabulary exposes readonly members.
activationStatuses.activated = "activated";

// @ts-expect-error The private opening entrypoint supplies no runtime vocabulary object.
openingRuntimeApi.openableResultStatuses;

// @ts-expect-error The private activation entrypoint supplies no runtime vocabulary object.
activationRuntimeApi.activatableResultStatuses;
