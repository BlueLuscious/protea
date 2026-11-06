import type {
  Component,
  ComponentLifecycleType,
} from "../component/api/index.js";

// These non-executed fixtures describe consumer shapes, not product families or capabilities.
// They deliberately declare their minimum lifetime members without inheriting additional ones.
interface IStaticExampleComponent {
  readonly lifecycle: ComponentLifecycleType;
  readonly exampleText: string;
  dispose(): void;
}

interface IInteractiveExampleComponent {
  readonly lifecycle: ComponentLifecycleType;
  dispose(): void;
  invokeExampleAction(): void;
}

declare const staticExampleComponent: IStaticExampleComponent;
declare const interactiveExampleComponent: IInteractiveExampleComponent;
declare const missingDisposal: { readonly lifecycle: ComponentLifecycleType };

declare function consumeComponent(component: Component): void;
declare function consumeLifecycle(lifecycle: ComponentLifecycleType): void;
declare function consumeText(text: string): void;
declare function consumeVoid(result: void): void;

const staticComponent: Component = staticExampleComponent;
const interactiveComponent: Component = interactiveExampleComponent;

type TOnlySelectedLifecycleStates =
  Exclude<ComponentLifecycleType, "active" | "disposed"> extends never
    ? true
    : false;
const onlySelectedLifecycleStates: TOnlySelectedLifecycleStates = true;
void onlySelectedLifecycleStates;

consumeComponent(staticComponent);
consumeComponent(interactiveComponent);
consumeLifecycle(staticComponent.lifecycle);
consumeLifecycle(interactiveComponent.lifecycle);
consumeLifecycle("active");
consumeLifecycle("disposed");
consumeText(staticExampleComponent.exampleText);
consumeVoid(interactiveExampleComponent.invokeExampleAction());

// This checks the consumer return type, not synchronous cleanup or implementation conformance.
// TypeScript permits value-returning implementations to satisfy a void-returning method shape.
consumeVoid(staticComponent.dispose());
consumeVoid(interactiveComponent.dispose());

// @ts-expect-error Consumers cannot assign the component's lifecycle through its public contract.
staticComponent.lifecycle = "disposed";

// @ts-expect-error Mounting is not a component lifecycle value.
consumeLifecycle("mounted");

// @ts-expect-error A component must provide its finalisation operation.
consumeComponent(missingDisposal);

// @ts-expect-error Opening is not a universal component operation.
staticComponent.open();

// @ts-expect-error Activation is not a universal component operation.
interactiveComponent.activate();

// @ts-expect-error Reference identity does not require a common identifier property.
staticComponent.id;

// @ts-expect-error The foundation does not require a common event mechanism.
interactiveComponent.events;

// @ts-expect-error Portable declarations and examples have no implicit browser ambient environment.
document;

// @ts-expect-error Portable declarations and examples have no implicit Node ambient environment.
process;
