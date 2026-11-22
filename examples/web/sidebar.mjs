import { Scope } from "@luscious-garden/protea-core";

/**
 * @description Connects a native disclosure button and a navigation region to a borrowed Sidebar.
 * @param {HTMLButtonElement} control - The disclosure button in the example.
 * @param {HTMLElement} region - The navigation region controlled by the button.
 * @param {import("@luscious-garden/protea-components").SidebarInstance} sidebar - The model owned by the caller.
 * @returns {() => void} An idempotent release of the binding's listener and subscription.
 */
export function connectSidebar(control, region, sidebar) {
  const connection = Scope.create();

  try {
    const events = new AbortController();
    connection.addCleanup(() => events.abort());

    function projectPresence() {
      const isOpen = sidebar.isOpen;
      region.hidden = !isOpen;
      control.setAttribute("aria-expanded", String(isOpen));
    }

    connection.addCleanup(sidebar.subscribeOpenChange(projectPresence));
    control.addEventListener("click", () => {
      if (sidebar.isOpen) {
        sidebar.close();
      } else {
        sidebar.open();
      }
    }, { signal: events.signal });
    projectPresence();

    return connection.dispose;
  } catch (error) {
    try {
      connection.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "The Sidebar binding failed to connect and release its resources.");
    }
    throw error;
  }
}
