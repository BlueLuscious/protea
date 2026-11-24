import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";

/**
 * @description Projects a borrowed Select onto a native single-choice control.
 * @remarks Reconciles the native value after each request, including refusal or failure.
 * @param {HTMLSelectElement} control - The caller's labelled select with corresponding choices.
 * @param {import("@luscious-garden/protea-components/select").SelectInstance} model - The live model.
 * @returns {() => void} An idempotent detach of the listener and observation.
 */
export function bindSelect(control, model) {
  if (control.multiple || model.lifecycle !== componentLifecycleStates.active) {
    throw new Error("The Select binding requires a single-choice control and a live model.");
  }

  const connection = Scope.create();
  let mounted = false;

  function isLive() {
    return connection.lifecycle === componentLifecycleStates.active &&
      model.lifecycle === componentLifecycleStates.active;
  }

  function projectSelection(value) {
    if (isLive() && control.value !== value) {
      control.value = value;
    }
  }

  function projectCurrent() {
    if (isLive()) {
      projectSelection(model.selectedValue);
    }
  }

  function requestChange() {
    if (!mounted || !isLive()) {
      return;
    }

    try {
      model.requestSelection(control.value);
    } catch (error) {
      try {
        projectCurrent();
      } catch (projectionError) {
        throw new AggregateError([error, projectionError], "The Select request and state projection failed.");
      }
      throw error;
    }
    projectCurrent();
  }

  try {
    connection.addCleanup(model.subscribeSelectionChange(({ current }) => projectSelection(current)));
    connection.addCleanup(() => control.removeEventListener("change", requestChange));
    control.addEventListener("change", requestChange);
    projectCurrent();
    if (!isLive()) {
      throw new Error("The Select model ended during binding.");
    }
    mounted = true;
    return connection.dispose;
  } catch (error) {
    try {
      connection.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "The Select binding failed to connect and release its resources.");
    }
    throw error;
  }
}
