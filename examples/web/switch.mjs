import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";

/**
 * @description Projects a borrowed Switch onto a native checkbox and forwards its changes.
 * @remarks Reads back the effective value after input, including after a refusal or failure.
 * @param {HTMLInputElement} control - The caller's checkbox with switch semantics.
 * @param {import("@luscious-garden/protea-components").SwitchInstance} model - The live model.
 * @returns {() => void} An idempotent detach of the listener and subscription.
 */
export function bindSwitch(control, model) {
  if (control.type !== "checkbox" || model.lifecycle !== componentLifecycleStates.active) {
    throw new Error("The Switch binding requires a native checkbox and a live model.");
  }

  const connection = Scope.create();
  let mounted = false;

  function isLive() {
    return connection.lifecycle === componentLifecycleStates.active &&
      model.lifecycle === componentLifecycleStates.active;
  }

  function projectChecked(isChecked) {
    if (isLive()) {
      control.checked = isChecked;
    }
  }

  function projectCurrent() {
    if (isLive()) {
      projectChecked(model.isChecked);
    }
  }

  function requestChange() {
    if (!mounted || !isLive()) {
      return;
    }

    try {
      model.requestChecked(control.checked);
    } catch (error) {
      try {
        projectCurrent();
      } catch (projectionError) {
        throw new AggregateError([error, projectionError], "The Switch request and state projection failed.");
      }
      throw error;
    }
    projectCurrent();
  }

  try {
    connection.addCleanup(model.subscribeCheckedChange(({ current }) => projectChecked(current)));
    connection.addCleanup(() => control.removeEventListener("change", requestChange));
    control.addEventListener("change", requestChange);
    projectCurrent();
    if (!isLive()) {
      throw new Error("The Switch model ended during binding.");
    }
    mounted = true;
    return connection.dispose;
  } catch (error) {
    try {
      connection.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "The Switch binding failed to connect and release its resources.");
    }
    throw error;
  }
}
