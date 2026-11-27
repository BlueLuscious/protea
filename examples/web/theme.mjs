import { Select } from "@luscious-garden/protea-components/select";
import { bindSelect } from "./select.mjs";
import { ThemeManager } from "./theme-manager.mjs";

/**
 * @description Connects the page's theme preference and native colour scheme to its Theme Manager.
 * @remarks The page releases the binding and media observation before disposing the model and manager.
 * @param {import("@luscious-garden/protea-core").ComponentScope} lifetime - The page owner.
 * @param {AddEventListenerOptions} listenerOptions - The page's listener release options.
 * @returns No value.
 */
export function mountTheme(lifetime, listenerOptions) {
  const control = document.getElementById("theme-preference");
  const effective = document.getElementById("effective-theme");
  const refuse = document.getElementById("refuse-theme");
  const useSystem = document.getElementById("use-system-theme");
  if (!(control instanceof HTMLSelectElement) || !(effective instanceof HTMLOutputElement) ||
    !(refuse instanceof HTMLInputElement) || !(useSystem instanceof HTMLButtonElement)) {
    throw new TypeError("The example requires its native theme controls and output.");
  }

  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
  const manager = new ThemeManager(systemPreference.matches ? "dark" : "light", () => !refuse.checked);
  let model;
  let detach;

  function project(value) {
    document.documentElement.style.colorScheme = value;
    effective.value = `Effective theme: ${value}`;
  }

  function updateSystem({ matches }) {
    manager.setSystemTheme(matches ? "dark" : "light");
  }

  lifetime.addCleanup(() => detach?.());
  lifetime.addCleanup(() => systemPreference.removeEventListener("change", updateSystem));
  lifetime.addCleanup(manager.subscribeEffectiveThemeChange(({ current }) => project(current)));
  lifetime.addCleanup(() => model?.dispose());
  lifetime.addCleanup(() => manager.dispose());

  const options = Array.from(control.options, ({ value, disabled }) => ({ value, disabled }));
  model = Select.create({ options, authority: manager });
  detach = bindSelect(control, model);
  useSystem.addEventListener("click", () => manager.requestSelection("system"), listenerOptions);
  systemPreference.addEventListener("change", updateSystem);
  manager.setSystemTheme(systemPreference.matches ? "dark" : "light");
  project(manager.effectiveTheme);
}
