import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";

/**
 * @description Connects a native dialogue to a borrowed Modal's logical opening.
 * @remarks Starts with a connected, closed dialogue and a live model. The caller owns both
 * and reconciles a browser-completed closure through its own opening authority.
 * @param {HTMLDialogElement} dialog - The caller's native dialogue.
 * @param {import("@luscious-garden/protea-components").ModalInstance} modal - The live model.
 * @param {() => void} reconcileNativeClose - Synchronously records an already-completed closure.
 * @returns {() => void} An idempotent detach of the connection's listeners and subscription.
 */
export function bindModal(dialog, modal, reconcileNativeClose) {
  if (!dialog.isConnected || dialog.open || modal.lifecycle !== componentLifecycleStates.active) {
    throw new Error("The Modal binding requires a connected, closed dialogue and an active model.");
  }

  const connection = Scope.create();

  function isLive() {
    return connection.lifecycle === componentLifecycleStates.active &&
      modal.lifecycle === componentLifecycleStates.active && dialog.isConnected;
  }

  function projectOpenness(isOpen) {
    if (!isLive() || dialog.open === isOpen) {
      return;
    }

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }

  function requestClose(event) {
    if (isLive() && dialog.open && event.cancelable) {
      event.preventDefault();
      modal.close();
    }
  }

  function reconcileClosedView() {
    if (!isLive() || dialog.open) {
      return;
    }

    const isOpen = modal.isOpen;
    if (isOpen && isLive() && !dialog.open) {
      reconcileNativeClose();
    }
  }

  try {
    connection.addCleanup(modal.subscribeOpenChange(({ current }) => projectOpenness(current)));
    connection.addCleanup(() => dialog.removeEventListener("cancel", requestClose));
    dialog.addEventListener("cancel", requestClose);
    connection.addCleanup(() => dialog.removeEventListener("close", reconcileClosedView));
    dialog.addEventListener("close", reconcileClosedView);
    projectOpenness(modal.isOpen);
    if (!isLive()) {
      throw new Error("The dialogue or its model became unavailable during binding.");
    }
    return connection.dispose;
  } catch (error) {
    try {
      connection.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "The Modal binding failed to connect and release its resources.");
    }
    throw error;
  }
}
