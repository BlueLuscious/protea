import * as core from "@luscious-garden/protea-core";
import { buttonFactory } from "@luscious-garden/protea-core";
import type {
  Activatable,
  ActivatableResultType,
  Button,
  ButtonDisabledChangeType,
  ButtonFactory,
  ButtonOptionsType,
  CapabilityRejectionReasonType,
  CapabilityUnsubscribeType,
  ComponentInstance,
  ComponentLifetime,
  Modal,
  ModalFactory,
  ModalOptionsType,
  Openable,
  OpenableResultType,
  OpenStateAuthority,
  Sidebar,
  SidebarFactory,
  SidebarOptionsType,
} from "@luscious-garden/protea-core";

function consumeFamilies(
  modalFactory: ModalFactory,
  sidebarFactory: SidebarFactory,
  authority: OpenStateAuthority,
): void {
  const construction: ButtonFactory = buttonFactory;
  void construction;
  const buttonOptions: ButtonOptionsType = { initialDisabled: undefined };
  const button: Button = buttonFactory.create(buttonOptions);
  buttonFactory.create();
  buttonFactory.create(undefined);
  buttonFactory.create({ initialDisabled: false });

  const modalInternal: ModalOptionsType = { control: "internal", initialOpen: true };
  const modalExternal: ModalOptionsType = { control: "external", authority };
  const modal: Modal = modalFactory.create(modalInternal);
  modalFactory.create(modalExternal);

  const sidebarInternal: SidebarOptionsType = { control: "internal" };
  const sidebarExternal: SidebarOptionsType = { control: "external", authority };
  const sidebar: Sidebar = sidebarFactory.create(sidebarInternal);
  sidebarFactory.create(sidebarExternal);

  const component: ComponentLifetime = button;
  const modalComponent: ComponentLifetime = modal;
  const sidebarComponent: ComponentLifetime = sidebar;
  const activation: Activatable = button;
  const modalOpening: Openable = modal;
  const sidebarOpening: Openable = sidebar;
  const disabled: boolean = button.isDisabled;
  const update: void = button.setDisabled(false);
  void [component, modalComponent, sidebarComponent, activation, modalOpening, sidebarOpening, disabled, update];

  // Structural compatibility supplies no nominal family identity or ownership proof.
  const modalFromSidebar: Modal = sidebar;
  const sidebarFromModal: Sidebar = modal;
  void [modalFromSidebar, sidebarFromModal];

  const disabling: ButtonDisabledChangeType = { previous: false, current: true };
  const enabling: ButtonDisabledChangeType = { previous: true, current: false };
  const unsubscribeDisabled: CapabilityUnsubscribeType = button.subscribeDisabledChange((change) => {
    const snapshot: ButtonDisabledChangeType = change;
    const previous: boolean = snapshot.previous;
    const current: boolean = snapshot.current;
    void [previous, current];
  });
  void [disabling, enabling];

  const disconnect: CapabilityUnsubscribeType = button.subscribeActivation(() => {
    const targetOutcome: OpenableResultType = modal.close();

    if (targetOutcome.status === "rejected") {
      const reason: CapabilityRejectionReasonType = targetOutcome.reason;
      void reason;
    }
  });
  const accepted: ActivatableResultType = button.activate();
  const openingOutcome: OpenableResultType = sidebar.open();
  void [accepted, openingOutcome];
  disconnect();
  unsubscribeDisabled();

  // @ts-expect-error Availability is read-only through the consumer property.
  button.isDisabled = true;
  // @ts-expect-error Lifecycle cannot be assigned through a family contract.
  button.lifecycle = "disposed";
  // @ts-expect-error Availability writes require a boolean.
  button.setDisabled("disabled");
  // @ts-expect-error Availability writes require an argument.
  button.setDisabled();
  // @ts-expect-error Disabled-change subscription requires a callable listener.
  button.subscribeDisabledChange(false);
  // @ts-expect-error Disabled-change snapshots are read-only.
  disabling.current = true;
  // @ts-expect-error A disabled-change snapshot cannot describe an unchanged state.
  const unchanged: ButtonDisabledChangeType = { previous: false, current: false };
  void unchanged;
  // @ts-expect-error Family options are read-only configuration.
  buttonOptions.initialDisabled = false;
  // @ts-expect-error Button configuration accepts no non-boolean initial value.
  buttonFactory.create({ initialDisabled: "disabled" });
  // @ts-expect-error Null is not Button configuration.
  buttonFactory.create(null);
  // @ts-expect-error An array is not Button configuration.
  buttonFactory.create([]);
  // @ts-expect-error Button does not expose a second authorisation configuration.
  buttonFactory.create({ canActivate: () => true });
  // @ts-expect-error The factory operation is read-only.
  buttonFactory.create = () => button;
  // @ts-expect-error A contextual factory is not a callable function.
  buttonFactory();
  // @ts-expect-error Button exposes no public resource-owner extension.
  button.addCleanup(() => {});
  // @ts-expect-error The family's private scope is not part of the public contract.
  button.scope;
  // @ts-expect-error A borrowed family does not expose its internal capability instance.
  button.activation;
  // @ts-expect-error Button provides activation rather than a duplicate click operation.
  button.click();
  // @ts-expect-error Opening is not part of the Button contract.
  button.open();
  // @ts-expect-error The transitional Button has no definition-based instance contract.
  const definitionInstance: ComponentInstance = button;
  void definitionInstance;

  // @ts-expect-error Modal construction requires an explicit state-authority mode.
  modalFactory.create();
  // @ts-expect-error A control mode is required in Modal options.
  modalFactory.create({});
  // @ts-expect-error Internal Modal state excludes an external authority.
  modalFactory.create({ control: "internal", authority });
  // @ts-expect-error External Modal state excludes a second initial value.
  modalFactory.create({ control: "external", authority, initialOpen: false });
  // @ts-expect-error Modal construction does not consume Button options.
  modalFactory.create(buttonOptions);
  // @ts-expect-error Modal does not acquire activation merely by being a component.
  modal.activate();
  // @ts-expect-error Modal projects its selected opening authority through a read-only view.
  modal.isOpen = true;
  // @ts-expect-error Modal owns cleanup privately rather than exposing a resource-owner extension.
  modal.addCleanup(() => {});
  // @ts-expect-error The Modal factory operation cannot be replaced.
  modalFactory.create = () => modal;

  // @ts-expect-error Sidebar construction requires explicit options.
  sidebarFactory.create();
  // @ts-expect-error External Sidebar control requires its sole authority.
  sidebarFactory.create({ control: "external" });
  // @ts-expect-error Explicit undefined does not introduce an initial value for external control.
  sidebarFactory.create({ control: "external", authority, initialOpen: undefined });
  // @ts-expect-error Internal initialOpen accepts omission rather than explicit undefined.
  sidebarFactory.create({ control: "internal", initialOpen: undefined });
  // @ts-expect-error The reviewed Sidebar contract has no presentation-based control mode.
  sidebarFactory.create({ control: "floating" });
  // @ts-expect-error Sidebar has no inherited activation operation.
  sidebar.activate();
  // @ts-expect-error Sidebar projects its selected opening authority through a read-only view.
  sidebar.isOpen = true;
  // @ts-expect-error Sidebar owns cleanup privately rather than exposing a resource-owner extension.
  sidebar.addCleanup(() => {});
  // @ts-expect-error The Sidebar factory operation cannot be replaced.
  sidebarFactory.create = () => sidebar;

  // @ts-expect-error Activation acceptance is not an opening result.
  const openingFromActivation: OpenableResultType = accepted;
  // @ts-expect-error An opening result is not activation acceptance.
  const activationFromOpening: ActivatableResultType = openingOutcome;
  void [openingFromActivation, activationFromOpening];

  // @ts-expect-error A construction interface does not export a Modal factory value.
  core.modalFactory;
  // @ts-expect-error A construction interface does not export a Sidebar factory value.
  core.sidebarFactory;
  // @ts-expect-error The Button interface is not a public runtime constructor.
  core.Button;
  // @ts-expect-error The Modal interface is not a public runtime constructor.
  core.Modal;
  // @ts-expect-error The Sidebar interface is not a public runtime constructor.
  core.Sidebar;
}

void consumeFamilies;
