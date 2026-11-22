import { Scope } from "@luscious-garden/protea-core";
import { Button, Modal, Opening, Sidebar, openableResultStatuses } from "@luscious-garden/protea-components";
import { connectSidebar } from "./sidebar.mjs";

/**
 * @description Connects the page's native controls to application-owned Protea models.
 * @remarks A cancelable native dismissal passes through Modal. A completed native dismissal
 * updates the borrowed authority so the model follows the browser when it enforces closing.
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
    lifetime.addCleanup(connectSidebar(sidebarControl, navigation, sidebar));

    const opening = Opening.create(lifetime, { control: "internal" });
    const openButton = Button.create();
    lifetime.addCleanup(openButton.dispose);
    const closeButton = Button.create();
    lifetime.addCleanup(closeButton.dispose);
    const modal = Modal.create({
      control: "external",
      authority: {
        get isOpen() {
          return opening.isOpen;
        },
        requestOpen(nextOpen) {
          if (!nextOpen && refuseClose.checked) {
            return false;
          }
          const result = nextOpen ? opening.open() : opening.close();
          return result.status !== openableResultStatuses.rejected;
        },
        subscribeOpenChange: opening.subscribeOpenChange.bind(opening),
      },
    });
    lifetime.addCleanup(modal.dispose);

    function connectButton(element, model, action) {
      element.disabled = model.isDisabled;
      lifetime.addCleanup(model.subscribeDisabledChange(({ current }) => {
        element.disabled = current;
      }));
      lifetime.addCleanup(model.subscribeActivation(action));
      element.addEventListener("click", () => model.activate(), listenerOptions);
    }

    function projectOpenness() {
      const isOpen = modal.isOpen;
      if (isOpen && !dialog.open) {
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    }

    connectButton(openElement, openButton, modal.open);
    connectButton(closeElement, closeButton, modal.close);
    lifetime.addCleanup(modal.subscribeOpenChange(projectOpenness));
    lifetime.addCleanup(() => dialog.close());
    dialog.addEventListener("cancel", (event) => {
      if (event.cancelable) {
        event.preventDefault();
        modal.close();
      }
    }, listenerOptions);
    dialog.addEventListener("close", () => {
      if (!dialog.open && modal.isOpen) {
        opening.close();
      }
    }, listenerOptions);
    window.addEventListener("pagehide", ({ persisted }) => {
      if (!persisted) {
        lifetime.dispose();
      }
    }, listenerOptions);
    projectOpenness();
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
