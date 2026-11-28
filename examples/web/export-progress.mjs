import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";
import { Button } from "@luscious-garden/protea-components/button";
import { bindButton } from "./button.mjs";
import { SampleExport } from "./sample-export.mjs";

/**
 * @description Connects the sample export to the native action, progress bar and status.
 * @remarks The page owns the case scope, which releases the Button and its connections.
 * @param {import("@luscious-garden/protea-core").ComponentScope} lifetime - The page owner.
 * @returns No value.
 */
export function mountSampleExport(lifetime) {
  const control = document.getElementById("export-action");
  const progress = document.getElementById("export-progress");
  const count = document.getElementById("export-count");
  const status = document.getElementById("export-status");
  if (!(control instanceof HTMLButtonElement) || !(progress instanceof HTMLProgressElement) ||
    !(count instanceof HTMLElement) || !(status instanceof HTMLOutputElement)) {
    throw new TypeError("The sample export requires its action, progress bar, count and status.");
  }

  const scope = Scope.create();
  lifetime.addCleanup(scope.dispose);

  const sample = new SampleExport();
  const button = Button.create();
  scope.addCleanup(button.dispose);

  function projectMeasurement() {
    const { value, total } = sample;
    progress.value = value;
    count.textContent = `${value} of ${total}`;
  }

  function projectStage() {
    if (sample.isComplete) {
      status.value = "Export complete";
      button.setDisabled(true);
    } else if (sample.value === sample.total) {
      control.textContent = "Finish export";
      status.value = "Export status: Ready to finish";
    } else if (status.value !== "Export status: Processing records") {
      status.value = "Export status: Processing records";
    }
  }

  function advanceExport() {
    if (scope.lifecycle !== componentLifecycleStates.active) {
      return;
    }

    if (sample.value === sample.total) {
      sample.finish();
    } else if (sample.reportProcessed(sample.value + 1)) {
      projectMeasurement();
    }
    projectStage();
  }

  progress.max = sample.total;
  projectMeasurement();
  scope.addCleanup(button.subscribeActivation(advanceExport));
  scope.addCleanup(bindButton(control, button));
}
