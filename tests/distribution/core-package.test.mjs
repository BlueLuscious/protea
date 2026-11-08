import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { access, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { runNode, withCoreConsumer } from "../shared/core-candidate.mjs";

const source = `import { componentLifecycleStates, componentScopeFactory } from "@luscious-garden/protea-core";
import type { Component, ComponentLifecycleType, ComponentScope, ComponentScopeFactory } from "@luscious-garden/protea-core";

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
declare function consumeComponent(component: Component): void;
declare function consumeLifecycle(lifecycle: ComponentLifecycleType): void;
declare function consumeText(text: string): void;
declare function consumeVoid(result: void): void;

const staticComponent: Component = staticExampleComponent;
const interactiveComponent: Component = interactiveExampleComponent;
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
const factory: ComponentScopeFactory = componentScopeFactory;
const createdScope: ComponentScope = factory.create();
consumeComponent(createdScope);
consumeVoid(createdScope.addCleanup(release));
consumeVoid(createdScope.dispose());

// @ts-expect-error Consumers cannot assign the lifecycle through Component.
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
// @ts-expect-error Minimum Component consumers acquire no cleanup-registration authority.
staticComponent.addCleanup(release);
// @ts-expect-error A minimum Component does not implement the resource-owner extension.
const missingCleanup: ComponentScope = staticComponent;
void missingCleanup;
// @ts-expect-error The construction operation cannot be replaced through its public contract.
factory.create = createScope;
// @ts-expect-error Scope construction accepts no configuration.
factory.create({});
// @ts-expect-error The factory is an owner with a create operation, not a callable function.
factory();
// @ts-expect-error Lifecycle vocabulary members cannot be replaced, even by the same literal.
componentLifecycleStates.active = "active";
// @ts-expect-error Mounting is not a member of the closed lifecycle vocabulary.
componentLifecycleStates.mounted;
`;

test("packed core exposes its lifecycle vocabulary, factory and current contracts", async () => {
  await withCoreConsumer("protea-core-consumer-test", async ({ consumer, installed }) => {
    const entries = (await readdir(installed)).sort();
    assert.deepEqual(entries, ["LICENSE", "README.md", "dist", "package.json"]);
    await assert.rejects(access(join(installed, "src")), { code: "ENOENT" });
    const manifest = JSON.parse(await readFile(join(installed, "package.json"), "utf8"));
    assert.deepEqual(Object.keys(manifest.exports), ["."]);
    assert.equal(manifest.type, "module");
    assert.equal(manifest.private, true);
    assert.equal(manifest.dependencies, undefined);

    const runtime = runNode(["--input-type=module", "--eval", `
      import assert from "node:assert/strict";
      const core = await import("@luscious-garden/protea-core");
      assert.deepEqual(Object.keys(core).sort(), ["componentLifecycleStates", "componentScopeFactory"]);
      assert.deepEqual(core.componentLifecycleStates, { active: "active", disposed: "disposed" });
      assert.equal(Object.isFrozen(core.componentLifecycleStates), true);
      assert.equal(typeof core.componentScopeFactory.create, "function");
      assert.equal(Object.isFrozen(core.componentScopeFactory), true);
      for (const suffix of ["component", "package.json", "dist/index.js", "dist/component/runtime/component-scope.js"]) {
        await assert.rejects(import("@luscious-garden/protea-core/" + suffix), { code: "ERR_PACKAGE_PATH_NOT_EXPORTED" });
      }
    `], consumer);
    assert.equal(runtime.status, 0, runtime.stderr);
    assert.equal(runtime.stdout, "");
    assert.equal(runtime.stderr, "");

    await writeFile(join(consumer, "consumer.ts"), source);
    const compiler = createRequire(import.meta.url).resolve("typescript/bin/tsc");

    for (const resolution of ["NodeNext", "Bundler"]) {
      const options = {
        target: "ES2022", lib: ["ES2022"], types: [], strict: true, skipLibCheck: false,
        exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true,
        noUnusedLocals: true, noUnusedParameters: true, verbatimModuleSyntax: true,
        noEmit: true, module: resolution === "NodeNext" ? "NodeNext" : "ESNext", moduleResolution: resolution,
      };
      await writeFile(join(consumer, "tsconfig.json"), JSON.stringify({ compilerOptions: options, files: ["consumer.ts"] }));
      const checked = runNode([compiler, "--project", join(consumer, "tsconfig.json"), "--pretty", "false"], consumer);
      assert.equal(checked.status, 0, `${resolution}\n${checked.stdout}\n${checked.stderr}`);
    }
  });
});
