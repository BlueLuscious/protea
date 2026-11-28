import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";

/**
 * @description Projects borrowed checked state onto a native input and forwards its changes.
 * @remarks Reads back the effective value after input, including after a refusal or failure.
 * @param {HTMLInputElement} control - The caller's native checkbox input.
 * @param {import("@luscious-garden/protea-components/capabilities/checking").Checkable} checkable - The checked-state model.
 * @param {import("@luscious-garden/protea-core").ComponentLifetime} lifetime - The model's lifetime.
 * @returns {() => void} An idempotent detach of the listener and subscription.
 */
export function bindCheckedInput(control, checkable, lifetime) {
  if (!(control instanceof HTMLInputElement) || control.type !== "checkbox" ||
    lifetime.lifecycle !== componentLifecycleStates.active) {
    throw new Error("The checked input binding requires a native checkbox and a live model.");
  }

  const connection = Scope.create();
  let mounted = false;

  function isLive() {
    return connection.lifecycle === componentLifecycleStates.active &&
      lifetime.lifecycle === componentLifecycleStates.active;
  }

  function projectChecked(isChecked) {
    if (isLive()) {
      control.checked = isChecked;
    }
  }

  function projectCurrent() {
    if (isLive()) {
      projectChecked(checkable.isChecked);
    }
  }

  function requestChange() {
    if (!mounted || !isLive()) {
      return;
    }

    try {
      checkable.requestChecked(control.checked);
    } catch (error) {
      try {
        projectCurrent();
      } catch (projectionError) {
        throw new AggregateError([error, projectionError], "The checked input request and state projection failed.");
      }
      throw error;
    }
    projectCurrent();
  }

  try {
    connection.addCleanup(checkable.subscribeCheckedChange(({ current }) => projectChecked(current)));
    connection.addCleanup(() => control.removeEventListener("change", requestChange));
    control.addEventListener("change", requestChange);
    projectCurrent();
    if (!isLive()) {
      throw new Error("The checked input model ended during binding.");
    }
    mounted = true;
    return connection.dispose;
  } catch (error) {
    try {
      connection.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "The checked input binding failed to connect and release its resources.");
    }
    throw error;
  }
}
