import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { runNode, withCoreConsumer } from "../shared/core-candidate.mjs";
import { checkConsumerTypes } from "../shared/consumer-types.mjs";

const source = `import { Scope, componentLifecycleStates } from "@luscious-garden/protea-core";
import type { ComponentLifetime, ComponentLifecycleType, ComponentScope, ScopeApi } from "@luscious-garden/protea-core";

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
declare const scope: ComponentScope;
declare const release: () => void;
declare const createScope: () => ComponentScope;
declare function consumeComponent(component: ComponentLifetime): void;
declare function consumeLifecycle(lifecycle: ComponentLifecycleType): void;
declare function consumeText(text: string): void;
declare function consumeVoid(result: void): void;

const staticComponent: ComponentLifetime = staticExampleComponent;
const interactiveComponent: ComponentLifetime = interactiveExampleComponent;
type TOnlySelectedLifecycleStates = Exclude<ComponentLifecycleType, "active" | "disposed"> extends never ? true : false;
const onlySelectedLifecycleStates: TOnlySelectedLifecycleStates = true;
void onlySelectedLifecycleStates;
consumeComponent(staticComponent);
consumeComponent(interactiveComponent);
consumeLifecycle(staticComponent.lifecycle);
consumeLifecycle(interactiveComponent.lifecycle);
consumeLifecycle("active");
consumeLifecycle("disposed");
const initialState: "active" = componentLifecycleStates.active;
const terminalState: "disposed" = componentLifecycleStates.disposed;
consumeLifecycle(initialState);
consumeLifecycle(terminalState);
consumeText(staticExampleComponent.exampleText);
consumeVoid(interactiveExampleComponent.invokeExampleAction());
consumeVoid(staticComponent.dispose());
consumeVoid(interactiveComponent.dispose());
consumeComponent(scope);
consumeVoid(scope.addCleanup(release));
consumeVoid(scope.dispose());
const scopeApi: ScopeApi = Scope;
const createdScope: ComponentScope = scopeApi.create();
consumeComponent(createdScope);
consumeVoid(createdScope.addCleanup(release));
consumeVoid(createdScope.dispose());

// @ts-expect-error Consumers cannot assign the lifecycle through ComponentLifetime.
staticComponent.lifecycle = "disposed";
// @ts-expect-error Mounting is not a lifecycle state.
consumeLifecycle("mounted");
// @ts-expect-error Finalisation is required.
consumeComponent(missingDisposal);
// @ts-expect-error Opening is not universal.
staticComponent.open();
// @ts-expect-error Activation is not universal.
interactiveComponent.activate();
// @ts-expect-error A universal identifier is not required.
staticComponent.id;
// @ts-expect-error A universal event mechanism is not required.
interactiveComponent.events;
// @ts-expect-error The consumer has no implicit browser environment.
document;
// @ts-expect-error The consumer has no implicit Node environment.
process;
// @ts-expect-error Cleanup registration requires a callable release.
scope.addCleanup("release");
// @ts-expect-error Cleanup registration requires an argument.
scope.addCleanup();
// @ts-expect-error Lifetime consumers acquire no cleanup-registration authority.
staticComponent.addCleanup(release);
// @ts-expect-error A lifetime does not implement the resource-owner extension.
const missingCleanup: ComponentScope = staticComponent;
void missingCleanup;
// @ts-expect-error The construction operation cannot be replaced through its public contract.
scopeApi.create = createScope;
// @ts-expect-error Scope construction accepts no configuration.
scopeApi.create({});
// @ts-expect-error Scope construction is available through the create operation.
scopeApi();
// @ts-expect-error Lifecycle vocabulary members cannot be replaced, even by the same literal.
componentLifecycleStates.active = "active";
// @ts-expect-error Mounting is not a member of the closed lifecycle vocabulary.
componentLifecycleStates.mounted;
`;

test("packed Core stands alone and exposes only its foundational surface", async () => {
  await withCoreConsumer("protea-core-consumer-test", async ({ consumer, installed }) => {
    const entries = (await readdir(installed)).sort();
    assert.deepEqual(entries, ["LICENSE", "README.md", "dist", "package.json"]);
    await assert.rejects(access(join(installed, "src")), { code: "ENOENT" });
    await assert.rejects(access(join(installed, "..", "protea-components")), { code: "ENOENT" });
    const manifest = JSON.parse(await readFile(join(installed, "package.json"), "utf8"));
    assert.deepEqual(Object.keys(manifest.exports), ["."]);
    assert.equal(manifest.type, "module");
    assert.equal(manifest.private, true);
    assert.equal(manifest.dependencies, undefined);
    assert.equal(manifest.peerDependencies, undefined);
    assert.equal(manifest.optionalDependencies, undefined);
    assert.deepEqual((await readdir(join(installed, "dist"))).sort(), ["api", "component", "index.d.ts", "index.js"]);

    const runtime = runNode(["--input-type=module", "--eval", `
      import assert from "node:assert/strict";
      const core = await import("@luscious-garden/protea-core");
      assert.deepEqual(Object.keys(core).sort(), ["Component", "Scope", "componentLifecycleStates"]);
      assert.deepEqual(core.componentLifecycleStates, { active: "active", disposed: "disposed" });
      assert.equal(Object.isFrozen(core.componentLifecycleStates), true);
      assert.equal(typeof core.Component.define, "function");
      assert.equal(typeof core.Component.create, "function");
      assert.equal(Object.isFrozen(core.Component), true);
      assert.equal(typeof core.Scope.create, "function");
      assert.equal(Object.isFrozen(core.Scope), true);
      const privatePaths = [
        "api", "component", "capabilities", "capabilities/openable", "components", "components/button",
        "components/modal", "components/sidebar", "shared", "package.json", "dist/index.js",
        "dist/api/component.api.js", "dist/api/scope.api.js", "dist/component/runtime/component-scope.js",
        "dist/component/runtime/component-definition.factory.js", "dist/component/runtime/component-instance.factory.js",
        "dist/shared/runtime/observation-listeners.js", "dist/components/button/contracts/button.contract.js",
        "dist/components/button/runtime/button.component.js",
      ];
      for (const suffix of privatePaths) {
        await assert.rejects(import("@luscious-garden/protea-core/" + suffix), { code: "ERR_PACKAGE_PATH_NOT_EXPORTED" });
      }
    `], consumer);
    assert.equal(runtime.status, 0, runtime.stderr);
    assert.equal(runtime.stdout, "");
    assert.equal(runtime.stderr, "");

    await checkConsumerTypes(consumer, {
      "consumer.ts": source,
      "component-consumer.ts": await readFile(new URL("./component-consumer.test.ts", import.meta.url), "utf8"),
    });
  });
});
