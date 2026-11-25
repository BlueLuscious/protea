import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";

/**
 * @description Projects a borrowed Tabs model onto labelled native controls and panels.
 * @remarks Focus can move inside the list independently of selection. Leaving the list restores the selected tab as its entry point.
 * @param {HTMLElement} tabList - The labelled horizontal tablist containing the buttons in model order.
 * @param {readonly { key: string, panelKey: string, tab: HTMLButtonElement, panel: HTMLElement }[]} bindings - The ordered host pairs for logical tab and panel keys.
 * @param {import("@luscious-garden/protea-components/tabs").TabsInstance} model - The live model.
 * @returns {() => void} An idempotent release of the binding's listeners and subscription.
 */
export function bindTabs(tabList, bindings, model) {
  if (!(tabList instanceof HTMLElement) || tabList.getAttribute("role") !== "tablist" ||
    model.lifecycle !== componentLifecycleStates.active) {
    throw new Error("The Tabs binding requires a tablist and a live model.");
  }
  const controls = tabList.querySelectorAll('[role="tab"]');
  if (bindings.length !== model.tabs.length || controls.length !== bindings.length) {
    throw new TypeError("The tablist must contain a button and panel pair for each model tab.");
  }

  const ids = new Set();
  const entries = model.tabs.map(({ key, panelKey, disabled }, index) => {
    const binding = bindings[index];
    if (binding?.key !== key || binding.panelKey !== panelKey) {
      throw new TypeError("Each supplied pair must match the ordered model keys.");
    }
    const { tab, panel } = binding;
    if (!(tab instanceof HTMLButtonElement) || tab.type !== "button" || controls[index] !== tab ||
      tab.disabled || disabled || !(panel instanceof HTMLElement) || panel.ownerDocument !== tabList.ownerDocument ||
      panel.getAttribute("role") !== "tabpanel" || !tab.id || !panel.id || tab.id === panel.id ||
      ids.has(tab.id) || ids.has(panel.id) || tab.getAttribute("aria-controls") !== panel.id ||
      panel.getAttribute("aria-labelledby") !== tab.id) {
      throw new TypeError("Each tab requires an enabled button and a distinct, reciprocally labelled panel.");
    }
    ids.add(tab.id);
    ids.add(panel.id);
    return { key, tab, panel };
  });

  const connection = Scope.create();
  let mounted = false;

  function isLive() {
    return connection.lifecycle === componentLifecycleStates.active &&
      model.lifecycle === componentLifecycleStates.active;
  }

  function setTabStop(target) {
    for (const { tab } of entries) {
      tab.tabIndex = tab === target ? 0 : -1;
    }
  }

  function projectSelection(activeKey) {
    if (!isLive()) {
      return;
    }

    const selected = entries.find(({ key }) => key === activeKey);
    const focused = tabList.ownerDocument.activeElement;
    const focusedTab = entries.find(({ tab }) => tab === focused);
    for (const entry of entries) {
      entry.tab.setAttribute("aria-selected", String(entry === selected));
    }
    setTabStop(focusedTab?.tab ?? selected.tab);

    if (entries.some((entry) => entry !== selected && entry.panel.contains(focused))) {
      selected.tab.focus();
      if (!isLive()) {
        return;
      }
    }
    for (const entry of entries) {
      entry.panel.hidden = entry !== selected;
    }
  }

  function clickTab(event) {
    if (!mounted || !isLive()) {
      return;
    }
    const entry = entries.find(({ tab }) => tab.contains(event.target));
    if (entry) {
      model.requestSelection(entry.key);
    }
  }

  function moveFocus(event) {
    if (!mounted || !isLive() || event.defaultPrevented || event.altKey || event.ctrlKey ||
      event.metaKey || event.shiftKey || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
      return;
    }
    const index = entries.findIndex(({ tab }) => tab === event.target);
    if (index === -1) {
      return;
    }
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    entries[(index + step + entries.length) % entries.length].tab.focus();
  }

  function followFocus(event) {
    if (mounted && isLive() && entries.some(({ tab }) => tab === event.target)) {
      setTabStop(event.target);
    }
  }

  function restoreEntry(event) {
    if (mounted && isLive() && !tabList.contains(event.relatedTarget)) {
      setTabStop(entries.find(({ key }) => key === model.activeTab.key).tab);
    }
  }

  try {
    const events = new AbortController();
    const options = { signal: events.signal };
    connection.addCleanup(() => events.abort());
    connection.addCleanup(model.subscribeSelectionChange(({ current }) => projectSelection(current.key)));
    tabList.addEventListener("click", clickTab, options);
    tabList.addEventListener("keydown", moveFocus, options);
    tabList.addEventListener("focusin", followFocus, options);
    tabList.addEventListener("focusout", restoreEntry, options);
    projectSelection(model.activeTab.key);
    if (!isLive()) {
      throw new Error("The Tabs model ended during binding.");
    }
    mounted = true;
    return connection.dispose;
  } catch (error) {
    try {
      connection.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "The Tabs binding failed to connect and release its resources.");
    }
    throw error;
  }
}
