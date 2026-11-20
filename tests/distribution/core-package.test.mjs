import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { access, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { runNode, withCoreConsumer } from "../shared/core-candidate.mjs";

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

test("packed core exposes production contracts and available runtime values", async () => {
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
      assert.deepEqual(Object.keys(core).sort(), [
        "Component", "Scope",
        "activatableFactory", "activatableResultStatuses", "buttonFactory", "capabilityRejectionReasons",
        "componentLifecycleStates", "openableFactory", "openableResultStatuses",
      ]);
      assert.deepEqual(core.componentLifecycleStates, { active: "active", disposed: "disposed" });
      assert.equal(Object.isFrozen(core.componentLifecycleStates), true);
      assert.equal(typeof core.Component.define, "function");
      assert.equal(typeof core.Component.create, "function");
      assert.equal(Object.isFrozen(core.Component), true);
      assert.equal(typeof core.Scope.create, "function");
      assert.equal(Object.isFrozen(core.Scope), true);
      assert.equal(typeof core.buttonFactory.create, "function");
      assert.equal(Object.isFrozen(core.buttonFactory), true);
      const button = core.buttonFactory.create({ initialDisabled: true });
      assert.equal(button.lifecycle, core.componentLifecycleStates.active);
      assert.deepEqual(button.activate(), { status: "rejected", reason: "denied" });
      button.setDisabled(false);
      assert.deepEqual(button.activate(), { status: "activated" });
      button.dispose();
      assert.deepEqual(button.activate(), { status: "rejected", reason: "disposed" });
      assert.deepEqual(core.openableResultStatuses, { changed: "changed", unchanged: "unchanged", rejected: "rejected" });
      assert.deepEqual(core.activatableResultStatuses, { activated: "activated", rejected: "rejected" });
      assert.deepEqual(core.capabilityRejectionReasons, { disposed: "disposed", busy: "busy", denied: "denied" });
      for (const value of [core.openableFactory, core.activatableFactory, core.openableResultStatuses, core.activatableResultStatuses, core.capabilityRejectionReasons]) {
        assert.equal(Object.isFrozen(value), true);
      }
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

    await writeFile(join(consumer, "consumer.ts"), source);
    const fixtures = ["component-consumer", "capability-consumer", "family-consumer"];
    for (const name of fixtures) {
      const fixture = await readFile(new URL(`./${name}.test.ts`, import.meta.url), "utf8");
      await writeFile(join(consumer, `${name}.ts`), fixture);
    }
    const compiler = createRequire(import.meta.url).resolve("typescript/bin/tsc");

    for (const resolution of ["NodeNext", "Bundler"]) {
      const options = {
        target: "ES2022", lib: ["ES2022"], types: [], strict: true, skipLibCheck: false,
        exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true,
        noUnusedLocals: true, noUnusedParameters: true, verbatimModuleSyntax: true,
        noEmit: true, module: resolution === "NodeNext" ? "NodeNext" : "ESNext", moduleResolution: resolution,
      };
      await writeFile(join(consumer, "tsconfig.json"), JSON.stringify({
        compilerOptions: options,
        files: ["consumer.ts", ...fixtures.map((name) => `${name}.ts`)],
      }));
      const checked = runNode([compiler, "--project", join(consumer, "tsconfig.json"), "--pretty", "false"], consumer);
      assert.equal(checked.status, 0, `${resolution}\n${checked.stdout}\n${checked.stderr}`);
    }
  });
});
