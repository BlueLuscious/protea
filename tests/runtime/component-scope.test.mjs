import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withCoreConsumer } from "../shared/core-candidate.mjs";

test("component scopes honour their lifetime and release protocol through the packed public API", async (context) => {
  await withCoreConsumer("protea-core-runtime-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { componentLifecycleStates, componentScopeFactory } from "@luscious-garden/protea-core";
        ${source}
      `], consumer);
      assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("creation exposes fresh active owners with independent state and cleanup", () => {
      check(`
        const first = componentScopeFactory.create();
        const second = componentScopeFactory.create();
        assert.notEqual(first, second);
        assert.equal(first.lifecycle, componentLifecycleStates.active);
        assert.equal(second.lifecycle, componentLifecycleStates.active);
        assert.equal(typeof first.addCleanup, "function");
        assert.equal(typeof first.dispose, "function");
        let firstCalls = 0;
        let secondCalls = 0;
        first.addCleanup(() => { firstCalls += 1; });
        second.addCleanup(() => { secondCalls += 1; });
        assert.equal(first.dispose(), undefined);
        assert.equal(first.lifecycle, componentLifecycleStates.disposed);
        assert.equal(second.lifecycle, componentLifecycleStates.active);
        assert.equal(firstCalls, 1);
        assert.equal(secondCalls, 0);
        second.dispose();
        assert.equal(second.lifecycle, componentLifecycleStates.disposed);
        assert.equal(firstCalls, 1);
        assert.equal(secondCalls, 1);
      `);
    });

    await context.test("registration defers invocation and preserves duplicate obligations", () => {
      check(`
        const scope = componentScopeFactory.create();
        let calls = 0;
        const release = () => { calls += 1; };
        assert.equal(scope.addCleanup(release), undefined);
        scope.addCleanup(release);
        assert.equal(calls, 0);
        scope.dispose();
        assert.equal(calls, 2);
      `);
    });

    await context.test("invalid and terminal registration fail without adopting an obligation", () => {
      check(`
        const scope = componentScopeFactory.create();
        let calls = 0;
        scope.addCleanup(() => { calls += 1; });
        for (const invalid of [undefined, null, false, 0, "release", {}, []]) {
          let failed = false;
          try { scope.addCleanup(invalid); } catch { failed = true; }
          assert.equal(failed, true);
          assert.equal(scope.lifecycle, "active");
          assert.equal(calls, 0);
        }
        assert.doesNotThrow(() => scope.dispose());
        assert.equal(calls, 1);
        let lateCalls = 0;
        let terminalFailed = false;
        try { scope.addCleanup(() => { lateCalls += 1; }); } catch { terminalFailed = true; }
        assert.equal(terminalFailed, true);
        assert.equal(scope.lifecycle, "disposed");
        scope.dispose();
        assert.equal(lateCalls, 0);
        assert.equal(calls, 1);
      `);
    });

    await context.test("every release observes the terminal lifetime before external work", () => {
      check(`
        const scope = componentScopeFactory.create();
        const observed = [];
        for (const name of ["first", "second", "third"]) {
          scope.addCleanup(() => { observed.push({ name, lifecycle: scope.lifecycle }); });
        }
        scope.dispose();
        assert.deepEqual(observed.map((entry) => entry.name).sort(), ["first", "second", "third"]);
        assert.equal(observed.every((entry) => entry.lifecycle === "disposed"), true);
      `);
    });

    await context.test("falsey failures are reported after all required attempts", () => {
      check(`
        for (const failure of [undefined, null, false, 0, ""]) {
          const scope = componentScopeFactory.create();
          const attempted = [];
          scope.addCleanup(() => { attempted.push("failed"); throw failure; });
          scope.addCleanup(() => { attempted.push("completed"); });
          let failed = false;
          try { scope.dispose(); } catch { failed = true; }
          assert.equal(failed, true);
          assert.equal(scope.lifecycle, "disposed");
          assert.deepEqual(attempted.sort(), ["completed", "failed"]);
          assert.doesNotThrow(() => scope.dispose());
          assert.equal(attempted.length, 2);
        }
        const scope = componentScopeFactory.create();
        const attempted = [];
        for (const [index, failure] of [undefined, null, false, 0, ""].entries()) {
          scope.addCleanup(() => { attempted.push(index); throw failure; });
        }
        scope.addCleanup(() => { attempted.push(5); });
        let failed = false;
        try { scope.dispose(); } catch { failed = true; }
        assert.equal(failed, true);
        assert.deepEqual(attempted.sort(), [0, 1, 2, 3, 4, 5]);
        assert.equal(scope.lifecycle, "disposed");
      `);
    });

    await context.test("reentrant disposal returns before the ongoing release and never retries failures", () => {
      check(`
        const scope = componentScopeFactory.create();
        const reentrant = [];
        let calls = 0;
        let otherCalls = 0;
        scope.addCleanup(() => {
          calls += 1;
          reentrant.push("entered");
          try {
            const result = scope.dispose();
            reentrant.push(result === undefined ? "returned normally" : "unexpected result");
          } catch { reentrant.push("unexpected failure"); }
          reentrant.push("finished");
          throw undefined;
        });
        scope.addCleanup(() => { otherCalls += 1; });
        let firstFailed = false;
        try { scope.dispose(); } catch { firstFailed = true; }
        assert.equal(firstFailed, true);
        assert.deepEqual(reentrant, ["entered", "returned normally", "finished"]);
        assert.equal(calls, 1);
        assert.equal(otherCalls, 1);
        assert.doesNotThrow(() => scope.dispose());
        assert.equal(scope.dispose(), undefined);
        assert.equal(calls, 1);
        assert.equal(otherCalls, 1);
      `);
    });

    await context.test("registration during disposal is rejected without delaying other releases", () => {
      check(`
        const scope = componentScopeFactory.create();
        let refused = false;
        let lateCalls = 0;
        let otherCalls = 0;
        scope.addCleanup(() => {
          try { scope.addCleanup(() => { lateCalls += 1; }); } catch { refused = true; }
        });
        scope.addCleanup(() => { otherCalls += 1; });
        assert.doesNotThrow(() => scope.dispose());
        assert.equal(refused, true);
        assert.equal(lateCalls, 0);
        assert.equal(otherCalls, 1);
        scope.dispose();
        assert.equal(lateCalls, 0);
      `);
    });

    await context.test("releasing an owned connection preserves the borrowed source and its other registrations", () => {
      check(`
        const registrations = new Set(["source-owned"]);
        let sourceDisposals = 0;
        const borrowed = {
          connect() {
            const token = Symbol("connection");
            registrations.add(token);
            return () => { registrations.delete(token); };
          },
          dispose() { sourceDisposals += 1; registrations.clear(); },
        };
        const scope = componentScopeFactory.create();
        scope.addCleanup(borrowed.connect());
        assert.equal(registrations.size, 2);
        scope.dispose();
        assert.equal(sourceDisposals, 0);
        assert.deepEqual([...registrations], ["source-owned"]);
      `);
    });

    await context.test("an early idempotent release remains registered until finalisation", () => {
      check(`
        const scope = componentScopeFactory.create();
        let attempts = 0;
        let effectiveReleases = 0;
        let active = true;
        const release = () => {
          attempts += 1;
          if (active) { active = false; effectiveReleases += 1; }
        };
        scope.addCleanup(release);
        release();
        assert.equal(scope.lifecycle, "active");
        assert.equal(attempts, 1);
        assert.equal(effectiveReleases, 1);
        scope.dispose();
        assert.equal(attempts, 2);
        assert.equal(effectiveReleases, 1);
        scope.dispose();
        assert.equal(attempts, 2);
      `);
    });

    await context.test("disposal is synchronous and does not await a fulfilled returned promise", () => {
      check(`
        const scope = componentScopeFactory.create();
        let calls = 0;
        let continuationRan = false;
        const returned = Promise.resolve();
        returned.then(() => { continuationRan = true; });
        scope.addCleanup(() => { calls += 1; return returned; });
        assert.equal(scope.dispose(), undefined);
        assert.equal(calls, 1);
        assert.equal(scope.lifecycle, "disposed");
        assert.equal(continuationRan, false);
        await returned;
        assert.equal(continuationRan, true);
      `);
    });

    await context.test("application-owned partial setup cleans acquired obligations without publishing or rolling back borrowed effects", () => {
      check(`
        const externalEffects = [];
        let connections = 0;
        const borrowed = {
          scope: componentScopeFactory.create(),
          connect() {
            connections += 1;
            return () => { connections -= 1; };
          },
          perform() { externalEffects.push("performed by borrowed collaborator"); },
        };
        let ownedAttempts = 0;
        let inspectedScope;
        function assemble(completeSetup) {
          const scope = componentScopeFactory.create();
          inspectedScope = scope;
          let completed = false;
          try {
            scope.addCleanup(borrowed.connect());
            scope.addCleanup(() => { ownedAttempts += 1; });
            borrowed.perform();
            completeSetup();
            completed = true;
            return scope;
          } finally {
            if (!completed) { scope.dispose(); }
          }
        }
        let published;
        let failed = false;
        try { published = assemble(() => { throw new Error("application setup failure"); }); }
        catch { failed = true; }
        assert.equal(failed, true);
        assert.equal(published, undefined);
        assert.equal(inspectedScope.lifecycle, "disposed");
        assert.equal(ownedAttempts, 1);
        assert.equal(connections, 0);
        assert.equal(borrowed.scope.lifecycle, "active");
        assert.deepEqual(externalEffects, ["performed by borrowed collaborator"]);
        inspectedScope.dispose();
        assert.equal(ownedAttempts, 1);
        borrowed.scope.dispose();
      `);
    });
  });
});
