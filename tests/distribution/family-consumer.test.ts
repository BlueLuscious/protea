import * as core from "@luscious-garden/protea-core";
import { Component, type ComponentInstance, type ComponentLifetime } from "@luscious-garden/protea-core";
import { Button, Modal, Sidebar } from "@luscious-garden/protea-components";
import type {
  Activatable,
  ActivatableResultType,
  ButtonApi,
  ButtonDisabledChangeType,
  ButtonInstance,
  ButtonOptionsType,
  CapabilityRejectionReasonType,
  CapabilityUnsubscribeType,
  ModalApi,
  ModalInstance,
  ModalOptionsType,
  Openable,
  OpenableResultType,
  OpenStateAuthority,
  SidebarApi,
  SidebarInstance,
  SidebarOptionsType,
} from "@luscious-garden/protea-components";

// @ts-expect-error Internal family implementation modules are not public TypeScript entrypoints.
import { ButtonComponent } from "@luscious-garden/protea-components/dist/components/button/runtime/button.component.js";
void ButtonComponent;

function consumeFamilies(authority: OpenStateAuthority): void {
  const construction: ButtonApi = Button;
  void construction;
  const buttonOptions: ButtonOptionsType = { initialDisabled: undefined };
  const button: ButtonInstance = Button.create(buttonOptions);
  const explicit: ButtonInstance = Component.create(Button.definition, buttonOptions);
  const inferred = Component.create(Button.definition);
  const inferredDisabled: boolean = inferred.isDisabled;
  const definition: typeof Button.definition = explicit.definition;
  void [inferredDisabled, definition];
  Button.create();
  Button.create(undefined);
  Button.create({ initialDisabled: false });

  const modalInternal: ModalOptionsType = { control: "internal", initialOpen: true };
  const modalExternal: ModalOptionsType = { control: "external", authority };
  const modalApi: ModalApi = Modal;
  const modal: ModalInstance = modalApi.create(modalInternal);
  const explicitModal: ModalInstance = Component.create(Modal.definition, modalExternal);
  const inferredModal = Component.create(Modal.definition, { control: "internal" });
  const modalDefinition: typeof Modal.definition = inferredModal.definition;
  const modalOpen: boolean = inferredModal.isOpen;
  const modalOutcome: OpenableResultType = explicitModal.close();
  Modal.create(modalExternal);
  void [modalDefinition, modalOpen, modalOutcome];

  const sidebarInternal: SidebarOptionsType = { control: "internal" };
  const sidebarExternal: SidebarOptionsType = { control: "external", authority };
  const sidebarApi: SidebarApi = Sidebar;
  const sidebar: SidebarInstance = sidebarApi.create(sidebarInternal);
  const explicitSidebar: SidebarInstance = Component.create(Sidebar.definition, sidebarExternal);
  const inferredSidebar = Component.create(Sidebar.definition, sidebarInternal);
  const sidebarDefinition: typeof Sidebar.definition = inferredSidebar.definition;
  const sidebarOpen: boolean = inferredSidebar.isOpen;
  const sidebarOutcome: OpenableResultType = explicitSidebar.close();
  Sidebar.create(sidebarExternal);
  void [sidebarDefinition, sidebarOpen, sidebarOutcome];

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
  const modalFromSidebar: ModalInstance = sidebar;
  const sidebarFromModal: SidebarInstance = modal;
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
  Button.create({ initialDisabled: "disabled" });
  // @ts-expect-error Null is not Button configuration.
  Button.create(null);
  // @ts-expect-error An array is not Button configuration.
  Button.create([]);
  // @ts-expect-error Button does not expose a second authorisation configuration.
  Button.create({ canActivate: () => true });
  // @ts-expect-error The construction operation is read-only.
  Button.create = () => button;
  // @ts-expect-error The public API is not a callable function.
  Button();
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
  const definitionInstance: ComponentInstance = button;
  const modalInstance: ComponentInstance = modal;
  const sidebarInstance: ComponentInstance = sidebar;
  void [definitionInstance, modalInstance, sidebarInstance];
  // @ts-expect-error The built-in definition is read-only on its API.
  Button.definition = button.definition;
  // @ts-expect-error The definition is read-only on the instance as well.
  button.definition = Button.definition;
  // @ts-expect-error Explicit construction checks the same options as the Button API.
  Component.create(Button.definition, { initialDisabled: "disabled" });

  // @ts-expect-error Modal construction requires an explicit state-authority mode.
  modalApi.create();
  // @ts-expect-error A control mode is required in Modal options.
  modalApi.create({});
  // @ts-expect-error Internal Modal state excludes an external authority.
  modalApi.create({ control: "internal", authority });
  // @ts-expect-error External Modal state excludes a second initial value.
  modalApi.create({ control: "external", authority, initialOpen: false });
  // @ts-expect-error Internal Modal state does not accept an explicit undefined initial value.
  Modal.create({ control: "internal", initialOpen: undefined });
  // @ts-expect-error Modal construction does not consume Button options.
  modalApi.create(buttonOptions);
  // @ts-expect-error Explicit Modal creation also requires options.
  Component.create(Modal.definition);
  // @ts-expect-error Explicit Modal creation requires a source for external opening.
  Component.create(Modal.definition, { control: "external" });
  // @ts-expect-error Button-to-Modal composition is registered by the application.
  Modal.create({ control: "internal", closeControl: button });
  // @ts-expect-error Modal does not acquire activation merely by being a component.
  modal.activate();
  // @ts-expect-error Modal projects its selected opening authority through a read-only view.
  modal.isOpen = true;
  // @ts-expect-error Modal owns cleanup privately rather than exposing a resource-owner extension.
  modal.addCleanup(() => {});
  // @ts-expect-error The Modal construction operation cannot be replaced.
  modalApi.create = () => modal;
  // @ts-expect-error The built-in Modal definition cannot be replaced.
  Modal.definition = modal.definition;
  // @ts-expect-error The instance retains a readonly reference to its definition.
  explicitModal.definition = Modal.definition;

  // @ts-expect-error Sidebar construction requires explicit options.
  sidebarApi.create();
  // @ts-expect-error External Sidebar control requires its sole authority.
  sidebarApi.create({ control: "external" });
  // @ts-expect-error Explicit undefined does not introduce an initial value for external control.
  sidebarApi.create({ control: "external", authority, initialOpen: undefined });
  // @ts-expect-error Internal initialOpen accepts omission rather than explicit undefined.
  sidebarApi.create({ control: "internal", initialOpen: undefined });
  // @ts-expect-error The reviewed Sidebar contract has no presentation-based control mode.
  sidebarApi.create({ control: "floating" });
  // @ts-expect-error Constructing a Sidebar does not select its presentation.
  Sidebar.create({ control: "internal", positioning: "floating" });
  // @ts-expect-error Explicit Sidebar creation also requires options.
  Component.create(Sidebar.definition);
  // @ts-expect-error Explicit creation requires the same authority as the Sidebar API.
  Component.create(Sidebar.definition, { control: "external" });
  // @ts-expect-error Sidebar has no inherited activation operation.
  sidebar.activate();
  // @ts-expect-error Sidebar exposes explicit requests through open and close.
  sidebar.toggle();
  // @ts-expect-error Sidebar projects its selected opening authority through a read-only view.
  sidebar.isOpen = true;
  // @ts-expect-error Sidebar owns cleanup privately rather than exposing a resource-owner extension.
  sidebar.addCleanup(() => {});
  // @ts-expect-error The Sidebar construction operation cannot be replaced.
  sidebarApi.create = () => sidebar;
  // @ts-expect-error The built-in Sidebar definition cannot be replaced.
  Sidebar.definition = sidebar.definition;
  // @ts-expect-error The instance retains a readonly reference to its definition.
  explicitSidebar.definition = Sidebar.definition;

  // @ts-expect-error Activation acceptance is not an opening result.
  const openingFromActivation: OpenableResultType = accepted;
  // @ts-expect-error An opening result is not activation acceptance.
  const activationFromOpening: ActivatableResultType = openingOutcome;
  void [openingFromActivation, activationFromOpening];

  // @ts-expect-error Core no longer exports a family API.
  core.Button;
  // @ts-expect-error Core does not export the Modal family.
  core.Modal;
  // @ts-expect-error Core does not export the Sidebar family.
  core.Sidebar;
  // @ts-expect-error The Button API is not an implementation constructor.
  new Button();
  // @ts-expect-error The Modal API is not an implementation constructor.
  new Modal();
  // @ts-expect-error The Sidebar API is not an implementation constructor.
  new Sidebar();
}

void consumeFamilies;
