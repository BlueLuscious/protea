import type { Openable } from "../../contracts/openable.contract.js";

/**
 * @description Exposes an opening capability as a flat surface for Core construction.
 * @remarks Reads remain live and detached operations retain their capability receiver.
 * @param opening - The capability already bound to the new component's scope.
 * @returns The own-property record to expose on the component instance.
 */
export function createOpenableSurface(opening: Openable): Openable {
  return {
    get isOpen() {
      return opening.isOpen;
    },
    open: opening.open.bind(opening),
    close: opening.close.bind(opening),
    subscribeOpenChange: opening.subscribeOpenChange.bind(opening),
  };
}
