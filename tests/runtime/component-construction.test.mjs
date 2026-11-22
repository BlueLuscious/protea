import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withCoreConsumer } from "../shared/core-candidate.mjs";

test("component construction honours its protocol through the packed public API", async (context) => {
  await withCoreConsumer("protea-component-construction-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { Component, Scope, componentLifecycleStates } from "@luscious-garden/protea-core";
        ${source}
      `], consumer);
      assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("definition preparation captures identity and recipe without running or freezing author data", () => {
      check(`
        let setups = 0;
        const setup = function () {
          assert.equal(this, undefined);
          setups += 1;
          return {};
        };
        const identity = { name: "counter-1", namespace: "my-ui", ignored: true };
        const draft = { identity, setup, ignored: true };
        const definition = Component.define(draft);
        assert.equal(setups, 0);
        assert.notEqual(definition, draft);
        assert.notEqual(definition.identity, identity);
        assert.equal(Object.isFrozen(definition), true);
        assert.equal(Object.isFrozen(definition.identity), true);
        assert.equal(Object.isFrozen(setup), false);
        assert.equal(Object.hasOwn(definition, "ignored"), false);
        assert.equal(Object.hasOwn(definition.identity, "ignored"), false);
        assert.equal(definition.setup, setup);

        identity.name = "changed";
        draft.setup = () => { throw new Error("The draft recipe should no longer be used"); };
        assert.equal(definition.identity.name, "counter-1");
        assert.equal(definition.identity.namespace, "my-ui");
        assert.throws(() => Component.create(draft));
        assert.equal(setups, 0);

        const instance = Component.create(definition);
        assert.equal(instance.definition, definition);
        assert.equal(setups, 1);
        instance.dispose();
        const unnamespaced = Component.define({ identity: { name: "counter", namespace: undefined }, setup });
        assert.equal(Object.hasOwn(unnamespaced.identity, "namespace"), false);
      `);
    });

    await context.test("creation accepts a separately prepared structural definition without replacing it", () => {
      check(`
        const extra = {};
        const identity = { name: "foreign-counter" };
        const setup = () => Object.assign(Object.create(null), { read: () => 42 });
        const incomplete = Object.freeze({ identity, setup });
        assert.throws(() => Component.create(incomplete));

        const definition = Object.freeze({ identity: Object.freeze(identity), setup, extra });
        const instance = Component.create(definition);
        assert.equal(instance.definition, definition);
        assert.equal(instance.definition.extra, extra);
        assert.equal(Object.isFrozen(extra), false);
        assert.equal(instance.read(), 42);
        instance.dispose();
      `);
    });

    await context.test("invalid definition fields are rejected without evaluating accessors or recipes", () => {
      check(`
        let calls = 0;
        const setup = () => { calls += 1; return {}; };
        const identity = Object.freeze({ name: "counter" });
        const accessor = () => { calls += 1; return setup; };
        const withRecipeGetter = Object.freeze(Object.defineProperty({ identity }, "setup", { get: accessor }));
        const withIdentityGetter = Object.freeze(Object.defineProperty({ setup }, "identity", {
          get() { calls += 1; return identity; },
        }));
        const withNamespaceGetter = Object.freeze({
          identity: Object.freeze(Object.defineProperty({ name: "counter" }, "namespace", { get: accessor })),
          setup,
        });
        for (const invalid of [withRecipeGetter, withIdentityGetter, withNamespaceGetter]) {
          assert.throws(() => Component.define(invalid));
          assert.throws(() => Component.create(invalid));
        }
        const inheritedNamespace = Object.freeze({
          identity: Object.freeze(Object.assign(Object.create({ get namespace() { return accessor(); } }), {
            name: "counter",
          })),
          setup,
        });
        assert.throws(() => Component.create(inheritedNamespace));
        assert.equal(Object.hasOwn(Component.define(inheritedNamespace).identity, "namespace"), false);
        assert.throws(() => Component.define(Object.create({ identity, setup })));
        for (const name of ["", "Counter", " counter", "counter ", "counter\\n", "two--parts", "ö", 5]) {
          assert.throws(() => Component.define({ identity: { name }, setup }));
          assert.throws(() => Component.create(Object.freeze({ identity: Object.freeze({ name }), setup })));
        }
        assert.throws(() => Component.define({ identity: { name: "valid", namespace: "Not-valid" }, setup }));
        assert.throws(() => Component.define({ identity, setup: true }));
        assert.equal(calls, 0);
      `);
    });

    await context.test("flat instances preserve receivers and descriptors with independent state and lifetime", () => {
      check(`
        class Counter {
          #value;
          constructor(value) { this.#value = value; }
          get value() { return this.#value; }
          increment() { this.#value += 1; }
        }

        const marker = Symbol("counter-marker");
        const releaseStates = [];
        let reads = 0;
        const definition = Component.define({
          identity: { name: "counter" },
          setup(context) {
            const { scope, options } = context;
            assert.equal(Object.isFrozen(context), true);
            assert.equal(Object.isFrozen(options), false);
            assert.equal(Object.isFrozen(scope), true);
            scope.addCleanup(() => { releaseStates.push(scope.lifecycle); });
            const counter = new Counter(options.initial);
            const surface = {
              label: "initial",
              get title() { return this.label; },
              set title(label) { this.label = label; },
              get value() { reads += 1; return counter.value; },
              increment() {
                if (this.lifecycle !== componentLifecycleStates.active) {
                  throw new Error("Counter is disposed");
                }
                counter.increment();
                return this.value;
              },
              [marker]: "counter",
            };
            return Object.defineProperty(surface, "hidden", { value: "retained" });
          },
        });

        const options = { initial: 7 };
        const first = Component.create(definition, options);
        const second = Component.create(definition, options);
        assert.equal(reads, 0);
        assert.notEqual(first, second);
        assert.equal(first.definition, definition);
        assert.equal(second.definition, definition);
        assert.equal(Object.getPrototypeOf(first), null);
        assert.equal(Object.isSealed(first), true);
        assert.equal(first[marker], "counter");
        assert.equal(first.hidden, "retained");
        assert.equal(Object.keys(first).includes("hidden"), false);
        assert.throws(() => { first.hidden = "write"; });
        first.title = "updated";
        assert.equal(first.title, "updated");
        assert.equal(second.title, "initial");
        assert.throws(() => { first.definition = {}; });
        assert.throws(() => { first.lifecycle = "disposed"; });
        assert.throws(() => { first.dispose = () => {}; });
        assert.throws(() => { first.additional = true; });
        assert.equal(first.increment(), 8);
        assert.equal(second.value, 7);
        first.dispose();
        first.dispose();
        assert.equal(first.lifecycle, componentLifecycleStates.disposed);
        assert.equal(second.lifecycle, componentLifecycleStates.active);
        assert.deepEqual(releaseStates, [componentLifecycleStates.disposed]);
        assert.throws(() => first.increment());
        assert.equal(first.value, 8);
        second.dispose();
        assert.deepEqual(releaseStates, [componentLifecycleStates.disposed, componentLifecycleStates.disposed]);
      `);
    });

    await context.test("failed setup attempts every acquired release and preserves borrowed scope ownership", () => {
      check(`
        const borrowedScope = Scope.create();
        const connections = new Set();
        let borrowedReleases = 0;
        borrowedScope.addCleanup(() => { borrowedReleases += 1; });
        assert.equal(Object.hasOwn(borrowedScope, "definition"), false);
        const borrowed = {
          scope: borrowedScope,
          connect() {
            const token = Symbol("borrowed-connection");
            connections.add(token);
            return () => { connections.delete(token); };
          },
        };

        let capturedScope;
        let scopeReplacementResults;
        const releases = [];
        const definition = Component.define({
          identity: { name: "partially-created" },
          setup({ scope, options }) {
            capturedScope = scope;
            scope.addCleanup(() => {
              releases.push(scope.lifecycle);
              scope.dispose();
              throw new Error("release reported failure");
            });
            const disconnect = options.borrowed.connect();
            scope.addCleanup(() => {
              releases.push(scope.lifecycle);
              disconnect();
            });
            scopeReplacementResults = [
              Reflect.set(scope, "dispose", () => {}),
              Reflect.set(scope, "addCleanup", () => {}),
            ];
            throw new Error("construction failed");
          },
        });
        assert.throws(() => Component.create(definition, { borrowed }));
        assert.deepEqual(scopeReplacementResults, [false, false]);
        assert.equal(capturedScope.lifecycle, componentLifecycleStates.disposed);
        assert.deepEqual(releases, [componentLifecycleStates.disposed, componentLifecycleStates.disposed]);
        assert.equal(connections.size, 0);
        assert.equal(borrowed.scope.lifecycle, componentLifecycleStates.active);
        assert.equal(borrowedReleases, 0);
        capturedScope.dispose();
        assert.equal(releases.length, 2);
        borrowed.scope.dispose();
        assert.equal(borrowedReleases, 1);
      `);
    });

    await context.test("reserved descriptors and unsupported surfaces fail before publication and release the new scope", () => {
      check(`
        let getterCalls = 0;
        const surfaces = [
          ...["definition", "lifecycle", "dispose", "then"].map((key) => Object.defineProperty({}, key, {
            get() { getterCalls += 1; return undefined; },
          })),
          { then: undefined },
          Promise.resolve({}),
          new (class Surface {})(),
          [],
          () => ({}),
          null,
        ];
        let releases = 0;
        for (const [index, surface] of surfaces.entries()) {
          const definition = Component.define({
            identity: { name: "invalid-surface" },
            setup({ scope }) {
              scope.addCleanup(() => {
                assert.equal(scope.lifecycle, componentLifecycleStates.disposed);
                releases += 1;
              });
              return surface;
            },
          });
          assert.throws(() => Component.create(definition));
          assert.equal(releases, index + 1);
        }
        assert.equal(getterCalls, 0);
      `);
    });

    await context.test("a recipe cannot publish an instance after ending its setup scope", () => {
      check(`
        let releases = 0;
        const definition = Component.define({
          identity: { name: "terminal-at-setup" },
          setup({ scope }) {
            scope.addCleanup(() => { releases += 1; });
            scope.dispose();
            return {};
          },
        });
        assert.throws(() => Component.create(definition));
        assert.equal(releases, 1);
      `);
    });
  });
});
