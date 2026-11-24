import * as core from "@luscious-garden/protea-core";
import { Component, type ComponentInstance, type ComponentLifetime } from "@luscious-garden/protea-core";
import { Button, Modal, Select, Sidebar, Switch, selectResultStatuses } from "@luscious-garden/protea-components";
import type {
  Activatable,
  ActivatableResultType,
  ButtonApi,
  ButtonDisabledChangeType,
  ButtonInstance,
  ButtonOptionsType,
  CapabilityRejectionReasonType,
  CapabilityUnsubscribeType,
  Checkable,
  CheckableResultType,
  CheckedStateAuthority,
  ModalApi,
  ModalInstance,
  ModalOptionsType,
  Openable,
  OpenableResultType,
  OpenStateAuthority,
  SelectApi,
  SelectChangeType,
  SelectInstance,
  SelectOption,
  SelectOptionsType,
  SelectResultStatusType,
  SelectResultType,
  SelectionAuthority,
  SidebarApi,
  SidebarInstance,
  SidebarOptionsType,
  SwitchApi,
  SwitchInstance,
  SwitchOptionsType,
} from "@luscious-garden/protea-components";
import {
  Button as SubpathButton,
  type ButtonApi as SubpathButtonApi,
  type ButtonDisabledChangeType as SubpathButtonDisabledChangeType,
  type ButtonInstance as SubpathButtonInstance,
  type ButtonOptionsType as SubpathButtonOptionsType,
} from "@luscious-garden/protea-components/button";
import {
  Modal as SubpathModal,
  type ModalApi as SubpathModalApi,
  type ModalInstance as SubpathModalInstance,
  type ModalOptionsType as SubpathModalOptionsType,
} from "@luscious-garden/protea-components/modal";
import {
  Sidebar as SubpathSidebar,
  type SidebarApi as SubpathSidebarApi,
  type SidebarInstance as SubpathSidebarInstance,
  type SidebarOptionsType as SubpathSidebarOptionsType,
} from "@luscious-garden/protea-components/sidebar";
import {
  Switch as SubpathSwitch,
  type SwitchApi as SubpathSwitchApi,
  type SwitchInstance as SubpathSwitchInstance,
  type SwitchOptionsType as SubpathSwitchOptionsType,
} from "@luscious-garden/protea-components/switch";
import {
  Select as SubpathSelect,
  selectResultStatuses as subpathSelectResultStatuses,
  type SelectApi as SubpathSelectApi,
  type SelectChangeType as SubpathSelectChangeType,
  type SelectInstance as SubpathSelectInstance,
  type SelectOption as SubpathSelectOption,
  type SelectOptionsType as SubpathSelectOptionsType,
  type SelectResultStatusType as SubpathSelectResultStatusType,
  type SelectResultType as SubpathSelectResultType,
  type SelectionAuthority as SubpathSelectionAuthority,
} from "@luscious-garden/protea-components/select";
import { ButtonDefinition } from "@luscious-garden/protea-components/definitions/button";
import { ModalDefinition } from "@luscious-garden/protea-components/definitions/modal";
import { SidebarDefinition } from "@luscious-garden/protea-components/definitions/sidebar";
import { SwitchDefinition } from "@luscious-garden/protea-components/definitions/switch";
import { SelectDefinition } from "@luscious-garden/protea-components/definitions/select";

// @ts-expect-error Named definitions are available through their explicit routes, not the root.
import { ButtonDefinition as RootButtonDefinition } from "@luscious-garden/protea-components";
// @ts-expect-error A definition route exposes its definition rather than the construction API.
import { Modal as DefinitionModal } from "@luscious-garden/protea-components/definitions/modal";
// @ts-expect-error A family route does not expose its definition under a second named export.
import { SidebarDefinition as FamilySidebarDefinition } from "@luscious-garden/protea-components/sidebar";
// @ts-expect-error Authored definition source paths remain internal to the package.
import { SwitchDefinition as InternalSwitchDefinition } from "@luscious-garden/protea-components/components/switch/definitions/switch.definition";
void [RootButtonDefinition, DefinitionModal, FamilySidebarDefinition, InternalSwitchDefinition];
// @ts-expect-error The reserved definitions aggregate remains unavailable.
import * as DefinitionsAggregate from "@luscious-garden/protea-components/definitions";
// @ts-expect-error The family pattern does not expose the opening capability API.
import { Opening as SubpathOpening } from "@luscious-garden/protea-components/opening";
// @ts-expect-error The family pattern does not expose the checking capability API.
import { Checking as SubpathChecking } from "@luscious-garden/protea-components/checking";
// @ts-expect-error The family pattern does not expose the activation capability API.
import { Activation as SubpathActivation } from "@luscious-garden/protea-components/activation";
void [DefinitionsAggregate, SubpathOpening, SubpathChecking, SubpathActivation];

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

function consumeSwitch(authority: CheckedStateAuthority): void {
  const api: SwitchApi = Switch;
  const internal: SwitchOptionsType = { control: "internal", initialChecked: true };
  const external: SwitchOptionsType = { control: "external", authority };
  const local: SwitchInstance = api.create(internal);
  const delegated: SwitchInstance = api.create(external);
  const explicitLocal = Component.create(Switch.definition, internal);
  const explicitDelegated = Component.create(Switch.definition, external);
  const definition: typeof Switch.definition = explicitDelegated.definition;
  const instance: ComponentInstance = explicitLocal;
  const checking: Checkable = explicitDelegated;
  const checked: boolean = local.isChecked;
  const result: CheckableResultType = delegated.requestChecked(checked);
  const release: CapabilityUnsubscribeType = local.subscribeCheckedChange(() => {});
  release();
  void [definition, instance, checking, result];

  // @ts-expect-error Switch requires an explicit control mode.
  Switch.create();
  // @ts-expect-error Core creation requires the same explicit control mode.
  Component.create(Switch.definition);
  // @ts-expect-error External control cannot add a separate initial value.
  Switch.create({ control: "external", authority, initialChecked: true });
  // @ts-expect-error External control requires an authority through Core construction too.
  Component.create(Switch.definition, { control: "external" });
  // @ts-expect-error Options for logical opening are not checked-state options.
  Component.create(Switch.definition, { control: "internal", initialOpen: true });
  // @ts-expect-error Switch exposes an explicit checked-state request rather than opening.
  local.open();
  // @ts-expect-error The borrowed authority does not make the family view writable.
  delegated.isChecked = true;
  // @ts-expect-error The prepared family definition is readonly.
  api.definition = definition;
  // @ts-expect-error The foundation does not export a Switch family.
  core.Switch;
  // @ts-expect-error The Switch API is a factory object.
  new Switch();
}

void consumeSwitch;

function consumeSubpaths(opening: OpenStateAuthority, checking: CheckedStateAuthority): void {
  const buttonApi: SubpathButtonApi = Button;
  const buttonOptions: SubpathButtonOptionsType = { initialDisabled: true };
  const button: SubpathButtonInstance = SubpathButton.create(buttonOptions);
  const rootButton: ButtonInstance = button;
  const explicitButton: SubpathButtonInstance = Component.create(ButtonDefinition, buttonOptions);
  const inferredButton = Component.create(ButtonDefinition);
  const disabled: boolean = inferredButton.isDisabled;
  const activation: ActivatableResultType = inferredButton.activate();
  const change: SubpathButtonDisabledChangeType = { previous: true, current: false };
  const buttonDefinition: typeof ButtonDefinition = button.definition;
  SubpathButton.create();
  SubpathButton.create(undefined);
  Component.create(ButtonDefinition, undefined);

  const modalApi: SubpathModalApi = Modal;
  const modalOptions: SubpathModalOptionsType = { control: "external", authority: opening };
  const modal: SubpathModalInstance = SubpathModal.create(modalOptions);
  const rootModal: ModalInstance = modal;
  const inferredModal = Component.create(ModalDefinition, { control: "internal" });
  const modalDefinition: typeof ModalDefinition = modal.definition;
  const modalOpen: boolean = inferredModal.isOpen;
  const modalResult: OpenableResultType = inferredModal.close();

  const sidebarApi: SubpathSidebarApi = Sidebar;
  const sidebarOptions: SubpathSidebarOptionsType = { control: "internal", initialOpen: true };
  const sidebar: SubpathSidebarInstance = SubpathSidebar.create(sidebarOptions);
  const rootSidebar: SidebarInstance = sidebar;
  const inferredSidebar = Component.create(SidebarDefinition, { control: "external", authority: opening });
  const sidebarDefinition: typeof SidebarDefinition = sidebar.definition;
  const sidebarOpen: boolean = inferredSidebar.isOpen;
  const sidebarResult: OpenableResultType = inferredSidebar.open();

  const switchApi: SubpathSwitchApi = Switch;
  const switchOptions: SubpathSwitchOptionsType = { control: "external", authority: checking };
  const model: SubpathSwitchInstance = SubpathSwitch.create(switchOptions);
  const rootSwitch: SwitchInstance = model;
  const inferredSwitch = Component.create(SwitchDefinition, { control: "internal" });
  const switchDefinition: typeof SwitchDefinition = model.definition;
  const checked: boolean = inferredSwitch.isChecked;
  const switchResult: CheckableResultType = inferredSwitch.requestChecked(true);

  // Equivalent opening surfaces retain structural compatibility across the new routes.
  const modalFromSidebar: SubpathModalInstance = inferredSidebar;
  const sidebarFromModal: SubpathSidebarInstance = inferredModal;
  const modalFromSidebarDefinition: typeof ModalDefinition = SidebarDefinition;
  const sidebarFromModalDefinition: typeof SidebarDefinition = ModalDefinition;
  void [buttonApi, rootButton, explicitButton, disabled, activation, change, buttonDefinition,
    modalApi, rootModal, modalDefinition, modalOpen, modalResult,
    sidebarApi, rootSidebar, sidebarDefinition, sidebarOpen, sidebarResult,
    switchApi, rootSwitch, switchDefinition, checked, switchResult,
    modalFromSidebar, sidebarFromModal, modalFromSidebarDefinition, sidebarFromModalDefinition];

  // @ts-expect-error The extracted definition preserves Button's boolean configuration.
  Component.create(ButtonDefinition, { initialDisabled: "disabled" });
  // @ts-expect-error Button's family route accepts the same boolean configuration as the root.
  SubpathButton.create({ initialDisabled: "disabled" });
  // @ts-expect-error The extracted Button definition retains availability as readonly state.
  inferredButton.isDisabled = false;
  // @ts-expect-error The prepared identity remains readonly through its definition route.
  ButtonDefinition.identity.name = "other";
  // @ts-expect-error Modal requires explicit options through its family route.
  SubpathModal.create();
  // @ts-expect-error Modal requires explicit options through its definition route.
  Component.create(ModalDefinition);
  // @ts-expect-error External Modal state requires its sole authority.
  Component.create(ModalDefinition, { control: "external" });
  // @ts-expect-error Internal Modal state cannot add an external authority.
  SubpathModal.create({ control: "internal", authority: opening });
  // @ts-expect-error Sidebar requires explicit options through its family route.
  SubpathSidebar.create();
  // @ts-expect-error Sidebar requires explicit options through its definition route.
  Component.create(SidebarDefinition);
  // @ts-expect-error External Sidebar state excludes a competing initial value.
  Component.create(SidebarDefinition, { control: "external", authority: opening, initialOpen: true });
  // @ts-expect-error External Sidebar control cannot omit its authority.
  SubpathSidebar.create({ control: "external" });
  // @ts-expect-error Switch requires explicit options through its family route.
  SubpathSwitch.create();
  // @ts-expect-error Switch requires explicit options through its definition route.
  Component.create(SwitchDefinition);
  // @ts-expect-error External Switch state cannot add a competing initial value.
  Component.create(SwitchDefinition, { control: "external", authority: checking, initialChecked: true });
  // @ts-expect-error Internal Switch state excludes an external authority.
  SubpathSwitch.create({ control: "internal", authority: checking });
  // @ts-expect-error Extracting the definition does not add opening to Switch's surface.
  inferredSwitch.open();
}

void consumeSubpaths;

function consumeSelect(authority: SelectionAuthority): void {
  const leafAuthority: SubpathSelectionAuthority = authority;
  const option: SubpathSelectOption = { value: "light" };
  const disabledOption: SelectOption = { value: "dark", disabled: true };
  const options: readonly SelectOption[] = [option, disabledOption, { value: "system" }];
  const config: SubpathSelectOptionsType = { options, authority: leafAuthority };
  const rootConfig: SelectOptionsType = config;
  const api: SubpathSelectApi = Select;
  const rootApi: SelectApi = SubpathSelect;
  const select: SubpathSelectInstance = api.create(config);
  const rootSelect: SelectInstance = select;
  const explicit: SelectInstance = Component.create(SelectDefinition, rootConfig);
  const inferred = Component.create(SelectDefinition, config);
  const selected: string = inferred.selectedValue;
  const captured: readonly SubpathSelectOption[] = inferred.options;
  const definition: typeof SelectDefinition = select.definition;
  const leafResult: SubpathSelectResultType = inferred.requestSelection("light");
  const result: SelectResultType = leafResult;
  const leafStatus: SubpathSelectResultStatusType = selectResultStatuses.changed;
  const status: SelectResultStatusType = subpathSelectResultStatuses.changed;
  const change: SubpathSelectChangeType = { previous: "system", current: "light" };
  const rootChange: SelectChangeType = change;
  const release: CapabilityUnsubscribeType = select.subscribeSelectionChange((snapshot) => {
    const current: string = snapshot.current;
    const previous: string = snapshot.previous;
    void [current, previous];
  });
  if (result.status === subpathSelectResultStatuses.rejected) {
    const reason: CapabilityRejectionReasonType = result.reason;
    void reason;
  } else {
    // @ts-expect-error Successful selection outcomes carry no rejection reason.
    result.reason;
  }
  // Membership is a runtime guarantee; both creation routes retain string keys.
  select.requestSelection("another-application-key");
  release();
  void [rootApi, rootSelect, explicit, selected, captured, definition, leafStatus, status, rootChange];

  // @ts-expect-error Select requires its fixed options and external authority.
  SubpathSelect.create();
  // @ts-expect-error Core creation requires the same Select configuration.
  Component.create(SelectDefinition);
  // @ts-expect-error The selected authority is required.
  Select.create({ options });
  // @ts-expect-error The catalogue is required.
  Select.create({ authority });
  // @ts-expect-error The first Select does not offer a locally owned selection mode.
  SubpathSelect.create({ options, control: "internal", initialValue: "light" });
  // @ts-expect-error An external authority excludes an additional initial selection field.
  Component.create(SelectDefinition, { options, authority, initialValue: "light" });
  // @ts-expect-error Option values are strings.
  SubpathSelect.create({ options: [{ value: 1 }], authority });
  // @ts-expect-error Explicit option availability must be boolean.
  SubpathSelect.create({ options: [{ value: "light", disabled: "yes" }], authority });
  // @ts-expect-error Selection requests require string keys.
  inferred.requestSelection(false);
  // @ts-expect-error A selection request requires a target.
  select.requestSelection();
  // @ts-expect-error Selection state is readonly to consumers.
  select.selectedValue = "dark";
  // @ts-expect-error Captured option arrays are readonly.
  select.options.push(option);
  // @ts-expect-error Captured option properties are readonly.
  option.value = "other";
  // @ts-expect-error Change snapshots are readonly.
  change.current = "dark";
  // @ts-expect-error Definition references cannot be replaced.
  select.definition = SelectDefinition;
  // @ts-expect-error The family result vocabulary is immutable.
  subpathSelectResultStatuses.changed = "changed";
  // @ts-expect-error Selection authority outcomes must be synchronous booleans.
  Select.create({ options, authority: { ...authority, async requestSelection() { return true; } } });
  // @ts-expect-error A rejected selection result includes its reason.
  const rejection: SelectResultType = { status: "rejected" };
  void rejection;
  // @ts-expect-error Selection does not supply opening operations.
  select.open();
  // @ts-expect-error Selection does not expose its private cleanup-registration owner.
  select.addCleanup(() => {});
  // @ts-expect-error Core does not export the Select family.
  core.Select;
}

void consumeSelect;
