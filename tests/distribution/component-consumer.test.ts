import { Component, Scope } from "@luscious-garden/protea-core";
import type {
  ComponentApi,
  ComponentDefinition,
  ComponentDefinitionInput,
  ComponentIdentity,
  ComponentInstance,
  ComponentLifetime,
  ComponentScope,
  ComponentSetupContext,
  ScopeApi,
} from "@luscious-garden/protea-core";

// @ts-expect-error A module inside the archive does not become a public TypeScript entrypoint.
import { Component as privateComponent } from "@luscious-garden/protea-core/dist/api/component.api.js";

const api: ComponentApi = Component;
const scopes: ScopeApi = Scope;
const scope: ComponentScope = scopes.create();
const identity: ComponentIdentity = { namespace: "example", name: "notice" };
const receiveMessage = Symbol("receive-message");

const definition = api.define({
  identity,
  setup({ options, scope }: ComponentSetupContext<{ message: string }>) {
    let message = options.message;
    scope.addCleanup(() => { message = ""; });

    return {
      get message() { return message; },
      [receiveMessage](next: string) { message = next; },
    };
  },
});

const notice = Component.create(definition, { message: "Saved" });
const sameDefinition: ComponentInstance<typeof definition> = notice;
const sharedInstance: ComponentInstance = notice;
const lifetime: ComponentLifetime = notice;
const message: string = notice.message;
const update: void = notice[receiveMessage]("Ready");
void [sameDefinition, sharedInstance, lifetime, message, update, privateComponent];

const optionalInput: ComponentDefinitionInput<{ message: string } | undefined, { message: string }> = {
  identity: { name: "optional-notice" },
  setup({ options }) {
    return { message: options?.message ?? "" };
  },
};
const optionalDefinition: ComponentDefinition<{ message: string } | undefined, { message: string }> =
  Component.define(optionalInput);
Component.create(optionalDefinition).message.toUpperCase();
Component.create(optionalDefinition, undefined);
Component.create(optionalDefinition, { message: "Sent" });

const emptyDefinition = Component.define({
  identity: { name: "empty", namespace: undefined },
  setup: () => ({}),
});
const empty = Component.create(emptyDefinition);
empty.dispose();

// @ts-expect-error The required recipe options cannot be omitted.
Component.create(definition);
// @ts-expect-error The definition fixes the option types.
Component.create(definition, { message: 42 });
// @ts-expect-error Option omission does not permit an unrelated value.
Component.create(optionalDefinition, false);
// @ts-expect-error A recipe without options does not accept a configuration object.
Component.create(emptyDefinition, {});
// @ts-expect-error An identity without a name is incomplete.
Component.define({ identity: { namespace: "example" }, setup: () => ({}) });
// @ts-expect-error A prepared definition must carry a construction recipe.
Component.create({ identity });
// @ts-expect-error Core owns the definition reference.
Component.define({ identity, setup: () => ({ definition }) });
// @ts-expect-error Core owns the lifecycle getter.
Component.define({ identity, setup: () => ({ lifecycle: "active" }) });
// @ts-expect-error Core owns finalisation.
Component.define({ identity, setup: () => ({ dispose() {} }) });
// @ts-expect-error A synchronous surface may not declare then, even as undefined.
Component.define({ identity, setup: () => ({ then: undefined }) });
// @ts-expect-error Asynchronous recipes cannot furnish a synchronous surface.
Component.define({ identity, setup: async () => ({ message: "Saved" }) });
Component.define({
  identity,
  setup() {
    // @ts-expect-error Core invokes the recipe without a receiver.
    return { identity: this.identity };
  },
});
// @ts-expect-error Consumers cannot replace the prepared recipe.
definition.setup = () => ({ message: "Replaced", [receiveMessage]() {} });
// @ts-expect-error Consumers cannot rename a prepared definition.
definition.identity.name = "different";
// @ts-expect-error A model's definition association is readonly.
notice.definition = definition;
// @ts-expect-error A model's lifecycle is readonly.
notice.lifecycle = "disposed";
// @ts-expect-error Consumers cannot replace the common disposal operation.
notice.dispose = () => {};
// @ts-expect-error Cleanup registration is not available on the public instance.
notice.addCleanup(() => {});
// @ts-expect-error The recipe's inferred accessor is readonly.
notice.message = "Changed";
// @ts-expect-error The inferred method retains its parameter type.
notice[receiveMessage](42);
// @ts-expect-error Author-defined models do not acquire family operations.
notice.activate();
// @ts-expect-error Cleanup registration cannot be overwritten through the scope view.
scope.addCleanup = () => {};
// @ts-expect-error Scope finalisation cannot be overwritten through the scope view.
scope.dispose = () => {};
// @ts-expect-error Standalone scopes have no component definition.
scope.definition;
