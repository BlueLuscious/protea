import type { ActivatableResultType } from "../activatable/api/index.js";
import type { buttonFactory as buttonFactoryPrototype } from "../button/api/index.js";
import type { modalFactory as modalFactoryPrototype } from "../modal/api/index.js";
import type { OpenableResultType } from "../openable/api/index.js";
import type { floatingSidebarFactory as floatingSidebarFactoryPrototype } from "../sidebar/api/index.js";

// These declared collaborators and consumer expressions must not be executed.
// The lexical blocks select no product scope, manager, registry or coordination API.
// Their cleanup structure expresses separate attempts, not runtime isolation or release evidence.
declare const buttonFactory: typeof buttonFactoryPrototype;
declare const modalFactory: typeof modalFactoryPrototype;
declare const floatingSidebarFactory: typeof floatingSidebarFactoryPrototype;

declare function consumeActivationResult(result: ActivatableResultType): void;
declare function consumeOpeningResult(result: OpenableResultType): void;
declare function consumeVoid(result: void): void;

// The caller owns both lifetimes; the modal only borrows its closing control.
{
  const closeControl = buttonFactory.create();
  try {
    const modal = modalFactory.create({ control: "internal", closeControl });
    try {
      consumeOpeningResult(modal.open());
      consumeActivationResult(closeControl.activate());
    } finally {
      consumeVoid(modal.dispose());
    }
  } finally {
    consumeVoid(closeControl.dispose());
  }
}

// This separate composition owns its external subscription and both model lifetimes.
// Each enclosing finally retains its cleanup attempt if an inner operation fails.
{
  const trigger = buttonFactory.create();
  try {
    const sidebar = floatingSidebarFactory.create({ control: "internal" });
    try {
      const unsubscribe = trigger.subscribeActivation(() => {
        consumeOpeningResult(sidebar.open());
      });
      try {
        consumeActivationResult(trigger.activate());
      } finally {
        consumeVoid(unsubscribe());
      }
    } finally {
      consumeVoid(sidebar.dispose());
    }
  } finally {
    consumeVoid(trigger.dispose());
  }
}
