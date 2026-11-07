import type {
  Activatable,
  ActivatableResultType,
} from "../activatable/api/index.js";
import type {
  Button,
  buttonFactory as buttonFactoryPrototype,
} from "../button/api/index.js";
import type { CapabilityUnsubscribeType } from "../capabilities/api/index.js";
import type { Component } from "../component/api/index.js";
import type {
  Modal,
  modalFactory as modalFactoryPrototype,
} from "../modal/api/index.js";
import type {
  Openable,
  OpenableResultType,
  OpenStateAuthority,
} from "../openable/api/index.js";
import type {
  FloatingSidebar,
  floatingSidebarFactory as floatingSidebarFactoryPrototype,
  SidebarType,
  StaticSidebar,
  staticSidebarFactory as staticSidebarFactoryPrototype,
} from "../sidebar/api/index.js";

// The declared factory collaborators model the intended signatures without providing values.
// Every expression is a non-executed consumption example, not a component implementation.
declare const buttonFactory: typeof buttonFactoryPrototype;
declare const staticSidebarFactory: typeof staticSidebarFactoryPrototype;
declare const floatingSidebarFactory: typeof floatingSidebarFactoryPrototype;
declare const modalFactory: typeof modalFactoryPrototype;
declare const buttonRuntimeApi: typeof import("../button/api/index.js");
declare const sidebarRuntimeApi: typeof import("../sidebar/api/index.js");
declare const modalRuntimeApi: typeof import("../modal/api/index.js");
declare const authority: OpenStateAuthority;
declare const activationGuard: () => boolean;
declare const minimalButton: Component & Activatable;
declare const minimalStaticSidebar: Component & { readonly variant: "static" };
declare const sidebar: SidebarType;
declare const incompatiblePartOptions: {
  readonly control: "internal";
  readonly closeControl: StaticSidebar;
};
declare const mixedModalOptions: {
  readonly control: "external";
  readonly authority: OpenStateAuthority;
  readonly initialOpen: boolean;
};
declare const undefinedCloseControlOptions: {
  readonly control: "internal";
  readonly closeControl: undefined;
};

declare function consumeButton(button: Button): void;
declare function consumeComponent(component: Component): void;
declare function consumeActivatable(activatable: Activatable): void;
declare function consumeOpenable(openable: Openable): void;
declare function consumeStaticSidebar(sidebar: StaticSidebar): void;
declare function consumeFloatingSidebar(sidebar: FloatingSidebar): void;
declare function consumeModal(modal: Modal): void;
declare function consumeOptionalControl(control: Button | undefined): void;
declare function consumeOpenableResult(result: OpenableResultType): void;
declare function consumeActivationResult(result: ActivatableResultType): void;
declare function consumeUnsubscribe(
  unsubscribe: CapabilityUnsubscribeType,
): void;
declare function consumeVoid(result: void): void;

const button = buttonFactory.create();
const closeControl = buttonFactory.create({ canActivate: activationGuard });
const staticSidebar = staticSidebarFactory.create();
const floatingSidebar = floatingSidebarFactory.create({ control: "internal" });
const standaloneModal = modalFactory.create({ control: "internal" });
const composedModal = modalFactory.create({
  control: "external",
  authority,
  closeControl,
});

consumeButton(minimalButton);
consumeStaticSidebar(minimalStaticSidebar);
consumeActivatable(button);
consumeComponent(staticSidebar);
consumeFloatingSidebar(floatingSidebar);
consumeOpenable(floatingSidebar);
consumeOpenable(
  floatingSidebarFactory.create({ control: "external", authority }),
);
consumeModal(standaloneModal);
consumeModal(composedModal);
consumeOpenable(composedModal);
consumeOptionalControl(standaloneModal.closeControl);
consumeOptionalControl(composedModal.closeControl);

consumeComponent(sidebar);
if (sidebar.variant === "floating") {
  consumeFloatingSidebar(sidebar);
  consumeOpenable(sidebar);
} else {
  consumeStaticSidebar(sidebar);
  // @ts-expect-error The static branch has no opening requests.
  sidebar.open();
}

// The application owns this separate subscription; both control and target remain borrowed.
// The modal's own optional close-control connection is a distinct, model-owned registration.
// This callback is a non-executed consumer expression, not a product implementation.
const openTarget: Pick<Openable, "open"> = floatingSidebar;
const releaseApplicationConnection = button.subscribeActivation(() => {
  consumeOpenableResult(openTarget.open());
});
consumeUnsubscribe(releaseApplicationConnection);
const activationResult = button.activate();
consumeActivationResult(activationResult);
consumeOpenableResult(composedModal.close());
consumeVoid(releaseApplicationConnection());

// @ts-expect-error Button activation does not grant opening operations.
button.open();

// @ts-expect-error The static scenario accepts no opening configuration.
staticSidebarFactory.create({ control: "internal" });

// @ts-expect-error A floating variant cannot substitute for the permanently present static one.
consumeStaticSidebar(floatingSidebar);

// @ts-expect-error The modal is an opening target, not its activating control.
composedModal.activate();

// @ts-expect-error Modal creation preserves the exclusive external-authority configuration.
modalFactory.create(mixedModalOptions);

// @ts-expect-error A component without activation cannot serve as the closing button.
modalFactory.create(incompatiblePartOptions);

// @ts-expect-error The optional closing control must be omitted rather than explicitly undefined.
modalFactory.create(undefinedCloseControlOptions);

// @ts-expect-error A captured borrowed control cannot be replaced through the modal contract.
composedModal.closeControl = button;

// @ts-expect-error The static variant discriminator cannot be reassigned.
staticSidebar.variant = "static";

// @ts-expect-error Accepted activation does not describe the outcome of the target's close request.
consumeOpenableResult(activationResult);

// @ts-expect-error The button entrypoint provides no runtime factory value.
buttonRuntimeApi.buttonFactory;

// @ts-expect-error The sidebar entrypoint provides no runtime static factory value.
sidebarRuntimeApi.staticSidebarFactory;

// @ts-expect-error The sidebar entrypoint provides no runtime floating factory value.
sidebarRuntimeApi.floatingSidebarFactory;

// @ts-expect-error The modal entrypoint provides no runtime factory value.
modalRuntimeApi.modalFactory;

// @ts-expect-error The factory owner exposes creation through its member rather than a call signature.
buttonFactory();

// @ts-expect-error Consumers cannot replace the declared owner's creation operation.
buttonFactory.create = buttonFactory.create;
