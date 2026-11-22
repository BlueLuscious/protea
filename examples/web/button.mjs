import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";

/**
 * @description Projects a borrowed Button's availability and forwards native activation.
 * @remarks The caller owns the model and its action subscriptions.
 * @param {HTMLButtonElement} control - The caller's native button.
 * @param {import("@luscious-garden/protea-components").ButtonInstance} button - The live model.
 * @returns {() => void} An idempotent detach that keeps the last projected value.
 */
export function bindButton(control, button) {
  const connection = Scope.create();

  function activate() {
    if (connection.lifecycle === componentLifecycleStates.active) {
      button.activate();
    }
  }

  try {
    connection.addCleanup(button.subscribeDisabledChange(({ current }) => {
      if (connection.lifecycle === componentLifecycleStates.active) {
        control.disabled = current;
      }
    }));
    connection.addCleanup(() => control.removeEventListener("click", activate));
    control.addEventListener("click", activate);
    control.disabled = button.isDisabled;
    return connection.dispose;
  } catch (error) {
    try {
      connection.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "The Button binding failed to connect and release its resources.");
    }
    throw error;
  }
}
