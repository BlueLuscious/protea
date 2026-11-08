import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withCoreConsumer } from "../shared/core-candidate.mjs";

test("activation capabilities honour acceptance, observation and borrowed lifetimes through the packed public API", async (context) => {
  await withCoreConsumer("protea-activatable-runtime-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import {
          activatableFactory,
          activatableResultStatuses,
          capabilityRejectionReasons,
          componentLifecycleStates,
          componentScopeFactory,
        } from "@luscious-garden/protea-core";
        ${source}
      `], consumer);
      assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("named immutable outcomes and default acceptance expose no persistent action state", () => {
      check(`
        assert.equal(Object.isFrozen(activatableFactory), true);
        assert.equal(Object.isFrozen(activatableResultStatuses), true);
        assert.deepEqual(activatableResultStatuses, { activated: "activated", rejected: "rejected" });
        const scope = componentScopeFactory.create();
        const activation = activatableFactory.create(scope);
        let calls = 0;
        activation.subscribeActivation(function (...arguments_) {
          calls += 1;
          assert.equal(arguments_.length, 0);
        });
        assert.equal(calls, 0);
        for (let index = 0; index < 2; index += 1) {
          assert.deepEqual(activation.activate(), { status: activatableResultStatuses.activated });
          assert.equal(calls, index + 1);
        }
        for (const member of ["dispose", "lifecycle", "isOpen", "open", "close", "pressed", "selected"]) {
          assert.equal(member in activation, false);
        }
        scope.dispose();
      `);
    });

    await context.test("creation captures one guard reference while each request rechecks its live eligibility", () => {
      check(`
        const scope = componentScopeFactory.create();
        let allowed = false;
        let reads = 0;
        let guardCalls = 0;
        let replacementCalls = 0;
        let notifications = 0;
        const guard = () => { guardCalls += 1; return allowed; };
        const options = { get canActivate() { reads += 1; return guard; } };
        const activation = activatableFactory.create(scope, options);
        activation.subscribeActivation(() => { notifications += 1; });
        assert.equal(reads, 1);
        assert.equal(guardCalls, 0);
        assert.deepEqual(activation.activate(), { status: "rejected", reason: capabilityRejectionReasons.denied });
        assert.equal(notifications, 0);
        Object.defineProperty(options, "canActivate", { value: () => { replacementCalls += 1; return false; } });
        allowed = true;
        assert.deepEqual(activation.activate(), { status: "activated" });
        assert.equal(guardCalls, 2);
        assert.equal(replacementCalls, 0);
        assert.equal(reads, 1);
        assert.equal(notifications, 1);
        scope.dispose();
      `);
    });

    await context.test("occupation rejects a guard's nested request without invoking the guard again", () => {
      check(`
        const scope = componentScopeFactory.create();
        let activation;
        let nested;
        let guards = 0;
        let notifications = 0;
        activation = activatableFactory.create(scope, { canActivate() {
          guards += 1;
          nested = activation.activate();
          return false;
        } });
        activation.subscribeActivation(() => { notifications += 1; });
        assert.deepEqual(activation.activate(), { status: "rejected", reason: "denied" });
        assert.deepEqual(nested, { status: "rejected", reason: "busy" });
        assert.equal(guards, 1);
        assert.equal(notifications, 0);
        scope.dispose();
        assert.deepEqual(activation.activate(), { status: "rejected", reason: "disposed" });
        assert.equal(guards, 1);
      `);
    });

    await context.test("guard disposal wins over denial and occupation before any activation is accepted", () => {
      check(`
        const scope = componentScopeFactory.create();
        let activation;
        let nested;
        let notifications = 0;
        activation = activatableFactory.create(scope, { canActivate() {
          scope.dispose();
          nested = activation.activate();
          return false;
        } });
        activation.subscribeActivation(() => { notifications += 1; });
        assert.deepEqual(activation.activate(), { status: "rejected", reason: "disposed" });
        assert.deepEqual(nested, { status: "rejected", reason: "disposed" });
        assert.equal(scope.lifecycle, componentLifecycleStates.disposed);
        assert.equal(notifications, 0);
      `);
    });

    await context.test("guard failures and invalid synchronous results throw without acceptance or retained occupation", () => {
      check(`
        for (const failure of [undefined, null, false, 0, ""]) {
          const scope = componentScopeFactory.create();
          let fail = true;
          let notifications = 0;
          const activation = activatableFactory.create(scope, { canActivate() {
            if (fail) { throw failure; }
            return true;
          } });
          activation.subscribeActivation(() => { notifications += 1; });
          let failed = false;
          try { activation.activate(); } catch { failed = true; }
          assert.equal(failed, true);
          assert.equal(notifications, 0);
          fail = false;
          assert.deepEqual(activation.activate(), { status: "activated" });
          assert.equal(notifications, 1);
          scope.dispose();
        }
        for (const invalid of [undefined, null, 0, "true", {}, Promise.resolve(true)]) {
          const scope = componentScopeFactory.create();
          let notifications = 0;
          const activation = activatableFactory.create(scope, { canActivate: () => invalid });
          activation.subscribeActivation(() => { notifications += 1; });
          let failed = false;
          try { activation.activate(); } catch { failed = true; }
          assert.equal(failed, true);
          assert.equal(notifications, 0);
          scope.dispose();
        }
      `);
    });

    await context.test("acceptance delivers synchronously before returning and stays occupied throughout notification", () => {
      check(`
        const scope = componentScopeFactory.create();
        const events = [];
        let guardCalls = 0;
        const activation = activatableFactory.create(scope, { canActivate() {
          guardCalls += 1;
          events.push("guard");
          return true;
        } });
        activation.subscribeActivation(() => {
          events.push("first");
          assert.deepEqual(activation.activate(), { status: "rejected", reason: "busy" });
        });
        activation.subscribeActivation(() => { events.push("second"); });
        const result = activation.activate();
        events.push("returned");
        assert.deepEqual(result, { status: "activated" });
        assert.deepEqual(events, ["guard", "first", "second", "returned"]);
        assert.equal(guardCalls, 1);
        scope.dispose();
      `);
    });

    await context.test("duplicates, removals and additions obey independent registration and next-delivery rules", () => {
      check(`
        const scope = componentScopeFactory.create();
        const activation = activatableFactory.create(scope);
        const calls = [];
        let first = true;
        let removeVictim;
        activation.subscribeActivation(() => {
          calls.push("mutator");
          removeVictim();
          if (first) {
            first = false;
            activation.subscribeActivation(() => { calls.push("late"); });
          }
        });
        const duplicate = () => { calls.push("duplicate"); };
        const removeFirstDuplicate = activation.subscribeActivation(duplicate);
        activation.subscribeActivation(duplicate);
        removeVictim = activation.subscribeActivation(() => { calls.push("removed before turn"); });
        assert.deepEqual(calls, []);
        activation.activate();
        assert.deepEqual(calls, ["mutator", "duplicate", "duplicate"]);
        calls.length = 0;
        removeFirstDuplicate();
        removeFirstDuplicate();
        removeVictim();
        activation.activate();
        assert.deepEqual(calls, ["mutator", "duplicate", "late"]);
        scope.dispose();
        assert.doesNotThrow(() => { removeFirstDuplicate(); removeVictim(); });
      `);
    });

    await context.test("every eligible observer is attempted after falsey failures without selecting a public error shape", () => {
      check(`
        const scope = componentScopeFactory.create();
        const activation = activatableFactory.create(scope);
        const attempted = [];
        const releases = [];
        for (const [index, failure] of [undefined, null, false, 0, ""].entries()) {
          releases.push(activation.subscribeActivation(() => { attempted.push(index); throw failure; }));
        }
        activation.subscribeActivation(() => { attempted.push("completed"); });
        let failed = false;
        try { activation.activate(); } catch { failed = true; }
        assert.equal(failed, true);
        assert.deepEqual(attempted, [0, 1, 2, 3, 4, "completed"]);
        for (const release of releases) { release(); }
        assert.deepEqual(activation.activate(), { status: "activated" });
        assert.deepEqual(attempted, [0, 1, 2, 3, 4, "completed", "completed"]);
        scope.dispose();
      `);
    });

    await context.test("observer disposal preserves accepted activation while cancelling remaining callbacks", () => {
      check(`
        const scope = componentScopeFactory.create();
        const activation = activatableFactory.create(scope);
        const calls = [];
        const unsubscribe = activation.subscribeActivation(() => {
          calls.push("started");
          scope.dispose();
          assert.deepEqual(activation.activate(), { status: "rejected", reason: "disposed" });
          calls.push("finished");
        });
        activation.subscribeActivation(() => { calls.push("cancelled"); });
        assert.deepEqual(activation.activate(), { status: "activated" });
        assert.deepEqual(calls, ["started", "finished"]);
        let refused = false;
        try { activation.subscribeActivation(() => { calls.push("late"); }); } catch { refused = true; }
        assert.equal(refused, true);
        assert.doesNotThrow(() => { unsubscribe(); unsubscribe(); });
        assert.deepEqual(activation.activate(), { status: "rejected", reason: "disposed" });
        assert.deepEqual(calls, ["started", "finished"]);
      `);
    });

    await context.test("invalid construction neither invokes guards nor disposes an otherwise active scope", () => {
      check(`
        const scope = componentScopeFactory.create();
        for (const options of [null, false, 0, "options", [], () => true, { canActivate: null }, { canActivate: false }]) {
          let failed = false;
          try { activatableFactory.create(scope, options); } catch { failed = true; }
          assert.equal(failed, true);
          assert.equal(scope.lifecycle, "active");
        }
        let guardCalls = 0;
        scope.dispose();
        let failed = false;
        try { activatableFactory.create(scope, { canActivate() { guardCalls += 1; return true; } }); }
        catch { failed = true; }
        assert.equal(failed, true);
        assert.equal(guardCalls, 0);
        const endingScope = componentScopeFactory.create();
        let published;
        failed = false;
        try { published = activatableFactory.create(endingScope, { get canActivate() { endingScope.dispose(); return () => true; } }); }
        catch { failed = true; }
        assert.equal(failed, true);
        assert.equal(published, undefined);
      `);
    });

    await context.test("failed cleanup registration invalidates only its attempt and preserves borrowed owners and existing capabilities", () => {
      check(`
        const scope = componentScopeFactory.create();
        const existing = activatableFactory.create(scope);
        let retained;
        let borrowedDisposals = 0;
        const borrowedScope = {
          get lifecycle() { return scope.lifecycle; },
          addCleanup(release) { retained = release; scope.addCleanup(release); throw undefined; },
          dispose() { borrowedDisposals += 1; },
        };
        let published;
        let failed = false;
        try { published = activatableFactory.create(borrowedScope); } catch { failed = true; }
        assert.equal(failed, true);
        assert.equal(published, undefined);
        assert.equal(scope.lifecycle, "active");
        assert.equal(borrowedDisposals, 0);
        assert.deepEqual(existing.activate(), { status: "activated" });
        assert.doesNotThrow(() => { retained(); retained(); });
        assert.doesNotThrow(() => scope.dispose());
        assert.equal(borrowedDisposals, 0);
      `);
    });

    await context.test("sharing a lifetime does not share guards, occupation or observation", () => {
      check(`
        const scope = componentScopeFactory.create();
        const independentScope = componentScopeFactory.create();
        const calls = [];
        const second = activatableFactory.create(scope);
        const independent = activatableFactory.create(independentScope);
        const first = activatableFactory.create(scope, { canActivate() {
          assert.deepEqual(second.activate(), { status: "activated" });
          return false;
        } });
        first.subscribeActivation(() => { calls.push("first"); });
        second.subscribeActivation(() => { calls.push("second"); });
        independent.subscribeActivation(() => { calls.push("independent"); });
        assert.deepEqual(first.activate(), { status: "rejected", reason: "denied" });
        assert.deepEqual(calls, ["second"]);
        scope.dispose();
        assert.deepEqual(first.activate(), { status: "rejected", reason: "disposed" });
        assert.deepEqual(second.activate(), { status: "rejected", reason: "disposed" });
        assert.deepEqual(independent.activate(), { status: "activated" });
        assert.deepEqual(calls, ["second", "independent"]);
        independentScope.dispose();
      `);
    });

    await context.test("a returned observer promise is not awaited or interpreted as business completion", () => {
      check(`
        const scope = componentScopeFactory.create();
        const activation = activatableFactory.create(scope);
        let continued = false;
        const returned = Promise.resolve();
        activation.subscribeActivation(() => returned.then(() => { continued = true; }));
        assert.deepEqual(activation.activate(), { status: "activated" });
        assert.equal(continued, false);
        await returned;
        assert.equal(continued, true);
        scope.dispose();
      `);
    });
  });
});
