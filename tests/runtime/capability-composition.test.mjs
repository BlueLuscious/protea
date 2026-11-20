import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withComponentsConsumer } from "../shared/core-candidate.mjs";

test("capabilities compose through public operations and explicit lifetime ownership", async (context) => {
  await withComponentsConsumer("protea-components-composition-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { Scope } from "@luscious-garden/protea-core";
        import { Activation, Opening } from "@luscious-garden/protea-components";
        ${source}
      `], consumer);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("one lifetime does not share request occupation or opening state", () => {
      check(`
        const scope = Scope.create();
        const opening = Opening.create(scope, { control: "internal" });
        const otherOpening = Opening.create(scope, { control: "internal" });
        const activation = Activation.create(scope);
        const observations = [];
        opening.subscribeOpenChange(() => { observations.push(activation.activate()); });
        activation.subscribeActivation(() => { observations.push(opening.open()); });
        const result = activation.activate();
        assert.deepEqual(result, { status: "activated" });
        assert.deepEqual(observations, [
          { status: "rejected", reason: "busy" },
          { status: "changed" },
        ]);
        assert.equal(opening.isOpen, true);
        assert.equal(otherOpening.isOpen, false);
        scope.dispose();
        assert.deepEqual(opening.close(), { status: "rejected", reason: "disposed" });
        assert.deepEqual(otherOpening.open(), { status: "rejected", reason: "disposed" });
        assert.deepEqual(activation.activate(), { status: "rejected", reason: "disposed" });
      `);
    });

    await context.test("accepting a trigger remains distinct from the borrowed target outcome", () => {
      check(`
        const triggerScope = Scope.create();
        const targetScope = Scope.create();
        const activation = Activation.create(triggerScope);
        const opening = Opening.create(targetScope, { control: "internal" });
        const outcomes = [];
        const disconnect = activation.subscribeActivation(() => { outcomes.push(opening.open()); });
        assert.deepEqual(activation.activate(), { status: "activated" });
        targetScope.dispose();
        assert.equal(triggerScope.lifecycle, "active");
        assert.deepEqual(activation.activate(), { status: "activated" });
        assert.deepEqual(outcomes, [
          { status: "changed" },
          { status: "rejected", reason: "disposed" },
        ]);
        disconnect();
        assert.deepEqual(activation.activate(), { status: "activated" });
        assert.equal(outcomes.length, 2);
        triggerScope.dispose();
      `);
    });

    await context.test("terminal lifetime blocks every capability even when another release fails", () => {
      check(`
        const scope = Scope.create();
        const observed = [];
        scope.addCleanup(() => { throw undefined; });
        let opening;
        let activation;
        let notifications = 0;
        scope.addCleanup(() => {
          observed.push(opening.open(), activation.activate());
          let subscriptionFailed = false;
          try { activation.subscribeActivation(() => { notifications += 1; }); }
          catch { subscriptionFailed = true; }
          observed.push(subscriptionFailed);
        });
        opening = Opening.create(scope, { control: "internal" });
        activation = Activation.create(scope);
        opening.subscribeOpenChange(() => { notifications += 1; });
        activation.subscribeActivation(() => { notifications += 1; });
        let failed = false;
        try { scope.dispose(); } catch { failed = true; }
        assert.equal(failed, true);
        assert.deepEqual(observed, [
          { status: "rejected", reason: "disposed" },
          { status: "rejected", reason: "disposed" },
          true,
        ]);
        assert.equal(notifications, 0);
        assert.doesNotThrow(() => scope.dispose());
      `);
    });
  });
});
