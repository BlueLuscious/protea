import { Scope } from "@luscious-garden/protea-core";
import {
  Checking, Opening, checkableResultStatuses, openableResultStatuses,
} from "@luscious-garden/protea-components/capabilities";
import { Button } from "@luscious-garden/protea-components/button";
import { Modal } from "@luscious-garden/protea-components/modal";
import { Sidebar } from "@luscious-garden/protea-components/sidebar";
import { Switch } from "@luscious-garden/protea-components/switch";
import { bindButton } from "./button.mjs";
import { bindModal } from "./modal.mjs";
import { bindSidebar } from "./sidebar.mjs";
import { bindSwitch } from "./switch.mjs";

/**
 * @description Owns one dialogue model and its application-controlled opening source.
 * @remarks Page teardown detaches the connection before closing the supplied view.
 * @param {import("@luscious-garden/protea-core").ComponentScope} lifetime - The page owner.
 * @param {HTMLDialogElement} dialog - The page's native dialogue.
 * @param {() => boolean} canClose - The application's synchronous closing policy.
 * @returns {import("@luscious-garden/protea-components/modal").ModalInstance} The page-owned model.
 */
function mountDialogue(lifetime, dialog, canClose) {
  const opening = Opening.create(lifetime, { control: "internal" });
  const modal = Modal.create({
    control: "external",
    authority: {
      get isOpen() {
        return opening.isOpen;
      },
      requestOpen(nextOpen) {
        if (!nextOpen && !canClose()) {
          return false;
        }
        const result = nextOpen ? opening.open() : opening.close();
        return result.status !== openableResultStatuses.rejected;
      },
      subscribeOpenChange: opening.subscribeOpenChange.bind(opening),
    },
  });
  lifetime.addCleanup(modal.dispose);

  let detach;
  lifetime.addCleanup(() => {
    try {
      detach?.();
    } finally {
      dialog.close();
    }
  });
  detach = bindModal(dialog, modal, () => {
    opening.close();
  });
  return modal;
}

/**
 * @description Connects an application action to a page-owned Button and its native control.
 * @param {import("@luscious-garden/protea-core").ComponentScope} lifetime - The page owner.
 * @param {HTMLButtonElement} control - The native action control.
 * @param {() => void} action - The application action requested on activation.
 * @returns No value.
 */
function connectAction(lifetime, control, action) {
  const button = Button.create();
  lifetime.addCleanup(button.dispose);
  lifetime.addCleanup(button.subscribeActivation(action));
  lifetime.addCleanup(bindButton(control, button));
}

/**
 * @description Mounts an editor whose draft survives a browser-completed closure.
 * @param {import("@luscious-garden/protea-core").ComponentScope} lifetime - The page owner.
 * @param {AddEventListenerOptions} listenerOptions - The caller's listener release options.
 * @returns No value.
 */
function mountEditor(lifetime, listenerOptions) {
  const dialog = document.getElementById("editor-dialog");
  const opener = document.getElementById("open-editor");
  const input = document.getElementById("editor-draft");
  const save = document.getElementById("save-draft");
  const discard = document.getElementById("discard-draft");

  if (!(dialog instanceof HTMLDialogElement) || !(input instanceof HTMLInputElement) ||
    !(opener instanceof HTMLButtonElement) || !(save instanceof HTMLButtonElement) ||
    !(discard instanceof HTMLButtonElement)) {
    throw new TypeError("The example requires its native editor controls.");
  }

  let savedValue = input.value;
  let draftValue = savedValue;
  const modal = mountDialogue(lifetime, dialog, () => draftValue === savedValue);
  input.addEventListener("input", () => {
    draftValue = input.value;
  }, listenerOptions);

  connectAction(lifetime, opener, () => {
    input.value = draftValue;
    modal.open();
  });
  connectAction(lifetime, save, () => {
    savedValue = draftValue;
    modal.close();
  });
  connectAction(lifetime, discard, () => {
    draftValue = savedValue;
    input.value = draftValue;
    modal.close();
  });
}

/**
 * @description Connects Switch and Button to one application-owned help preference.
 * @param {import("@luscious-garden/protea-core").ComponentScope} lifetime - The page owner.
 * @returns No value.
 */
function mountHelp(lifetime) {
  const control = document.getElementById("show-help");
  const toggle = document.getElementById("toggle-help");
  const help = document.getElementById("help-content");

  if (!(control instanceof HTMLInputElement) || !(toggle instanceof HTMLButtonElement) ||
    !(help instanceof HTMLElement)) {
    throw new TypeError("The example requires its native help controls and content.");
  }

  const preference = Checking.create(lifetime, { control: "internal" });
  /** @type {import("@luscious-garden/protea-components/capabilities/checking").CheckedStateAuthority} */
  const authority = {
    get isChecked() {
      return preference.isChecked;
    },
    requestChecked(nextChecked) {
      return preference.requestChecked(nextChecked).status !== checkableResultStatuses.rejected;
    },
    subscribeCheckedChange: preference.subscribeCheckedChange.bind(preference),
  };
  const model = Switch.create({ control: "external", authority });
  lifetime.addCleanup(model.dispose);
  lifetime.addCleanup(bindSwitch(control, model));
  lifetime.addCleanup(authority.subscribeCheckedChange(({ current }) => {
    help.hidden = !current;
  }));
  help.hidden = !authority.isChecked;

  connectAction(lifetime, toggle, () => {
    authority.requestChecked(!authority.isChecked);
  });
}

/**
 * @description Connects the page's native controls to application-owned Protea models.
 * @returns No value.
 */
function mountExample() {
  const openElement = document.getElementById("open-dialog");
  const closeElement = document.getElementById("close-dialog");
  const dialog = document.getElementById("example-dialog");
  const refuseClose = document.getElementById("refuse-close");
  const sidebarControl = document.getElementById("toggle-sidebar");
  const navigation = document.getElementById("example-sidebar");

  if (!(openElement instanceof HTMLButtonElement) || !(closeElement instanceof HTMLButtonElement) ||
    !(dialog instanceof HTMLDialogElement) || !(refuseClose instanceof HTMLInputElement) ||
    !(sidebarControl instanceof HTMLButtonElement) || !(navigation instanceof HTMLElement)) {
    throw new TypeError("The example requires its native dialogue and navigation controls.");
  }

  const lifetime = Scope.create();

  try {
    const events = new AbortController();
    const listenerOptions = { signal: events.signal };
    lifetime.addCleanup(() => events.abort());

    const sidebar = Sidebar.create({ control: "internal" });
    lifetime.addCleanup(sidebar.dispose);
    lifetime.addCleanup(bindSidebar(sidebarControl, navigation, sidebar));

    const modal = mountDialogue(lifetime, dialog, () => !refuseClose.checked);
    connectAction(lifetime, openElement, modal.open);
    connectAction(lifetime, closeElement, modal.close);
    mountEditor(lifetime, listenerOptions);
    mountHelp(lifetime);

    window.addEventListener("pagehide", ({ persisted }) => {
      if (!persisted) {
        lifetime.dispose();
      }
    }, listenerOptions);
  } catch (error) {
    try {
      lifetime.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "The example failed to mount and release its resources.");
    }
    throw error;
  }
}

mountExample();
