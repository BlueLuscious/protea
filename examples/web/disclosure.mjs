import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";
import { bindButton } from "./button.mjs";

/**
 * @description Routes accepted Button activations to Opening and projects its effective state.
 * @remarks Detach releases the connection while preserving both borrowed models.
 * @param {HTMLButtonElement} control - The native disclosure button.
 * @param {HTMLElement} region - The content identified by the button's aria-controls.
 * @param {import("@luscious-garden/protea-components/button").ButtonInstance} button - The live action model.
 * @param {import("@luscious-garden/protea-components/capabilities/opening").Openable} opening - The internal opening model.
 * @param {import("@luscious-garden/protea-core").ComponentLifetime} lifetime - The owning case's lifetime.
 * @returns {() => void} An idempotent detach that keeps the last projection.
 */
export function bindDisclosure(control, region, button, opening, lifetime) {
  if (!(control instanceof HTMLButtonElement) || control.type !== "button" ||
    !(region instanceof HTMLElement) || !region.id || control.getAttribute("aria-controls") !== region.id) {
    throw new TypeError("The disclosure requires a native button and the content it controls.");
  }
  if (lifetime.lifecycle !== componentLifecycleStates.active) {
    throw new TypeError("The disclosure requires an active case.");
  }

  const connection = Scope.create();

  function isConnected() {
    return connection.lifecycle === componentLifecycleStates.active &&
      lifetime.lifecycle === componentLifecycleStates.active;
  }

  function projectPresence(isOpen) {
    if (isConnected()) {
      region.hidden = !isOpen;
      control.setAttribute("aria-expanded", String(isOpen));
    }
  }

  function requestPresence() {
    if (!isConnected()) {
      return;
    }

    if (opening.isOpen) {
      opening.close();
    } else {
      opening.open();
    }
  }

  try {
    connection.addCleanup(button.subscribeActivation(requestPresence));
    connection.addCleanup(opening.subscribeOpenChange(({ current }) => projectPresence(current)));
    projectPresence(opening.isOpen);
    connection.addCleanup(bindButton(control, button));
    return connection.dispose;
  } catch (error) {
    try {
      connection.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "The disclosure failed to connect and release its resources.");
    }
    throw error;
  }
}
