import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";

/**
 * @description Projects a borrowed Sidebar's openness and forwards disclosure requests.
 * @remarks External state reads can run application code. A detached connection ignores any
 * callbacks still in progress or retained by a failed release.
 * @param {HTMLButtonElement} control - The caller's native disclosure button.
 * @param {HTMLElement} region - The caller's controlled region.
 * @param {import("@luscious-garden/protea-components").SidebarInstance} sidebar - The live model.
 * @returns {() => void} An idempotent detach that keeps the last projected values.
 */
export function bindSidebar(control, region, sidebar) {
  const connection = Scope.create();
  let mounted = false;

  function projectPresence(isOpen) {
    if (connection.lifecycle === componentLifecycleStates.active) {
      region.hidden = !isOpen;
      control.setAttribute("aria-expanded", String(isOpen));
    }
  }

  function toggle() {
    if (!mounted || connection.lifecycle !== componentLifecycleStates.active) {
      return;
    }

    const isOpen = sidebar.isOpen;
    if (connection.lifecycle !== componentLifecycleStates.active) {
      return;
    }

    if (isOpen) {
      sidebar.close();
    } else {
      sidebar.open();
    }
  }

  try {
    connection.addCleanup(sidebar.subscribeOpenChange(({ current }) => projectPresence(current)));
    connection.addCleanup(() => control.removeEventListener("click", toggle));
    control.addEventListener("click", toggle);
    projectPresence(sidebar.isOpen);
    mounted = true;
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
