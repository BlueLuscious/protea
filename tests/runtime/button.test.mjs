import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withComponentsConsumer } from "../shared/core-candidate.mjs";

test("Button composes owned lifetime, observable availability and activation through the packed public API", async (context) => {
  await withComponentsConsumer("protea-button-runtime-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { Scope } from "@luscious-garden/protea-core";
        import { Button, Opening } from "@luscious-garden/protea-components";
        function mustFail(operation) {
          let failed = false;
          try { operation(); } catch { failed = true; }
          assert.equal(failed, true);
        }
        ${source}
      `], consumer);
      assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("creation captures configuration and keeps independent private lifetimes", () => {
      check(`
        assert.equal(Object.isFrozen(Button), true);
        const defaults = [Button.create(), Button.create(undefined),
          Button.create({}), Button.create({ initialDisabled: undefined })];
        for (const button of defaults) {
          assert.equal(button.lifecycle, "active");
          assert.equal(button.isDisabled, false);
          for (const name of ["scope", "activation", "addCleanup", "click", "canActivate"]) {
            assert.equal(name in button, false);
          }
        }
        assert.equal(new Set(defaults).size, defaults.length);
        const options = { initialDisabled: true };
        const disabled = Button.create(options);
        options.initialDisabled = false;
        assert.equal(disabled.isDisabled, true);
        assert.equal(Object.isFrozen(options), false);
        let reads = 0;
        let initial = true;
        const captured = Button.create({ get initialDisabled() {
          reads += 1;
          return initial;
        } });
        initial = false;
        assert.equal(captured.isDisabled, true);
        captured.setDisabled(false);
        assert.equal(reads, 1);
        defaults[0].setDisabled(true);
        assert.equal(defaults[1].isDisabled, false);
        defaults[0].dispose();
        assert.equal(defaults[0].lifecycle, "disposed");
        assert.equal(defaults[1].lifecycle, "active");

        let notifications = 0;
        defaults[1].subscribeActivation(() => { notifications += 1; });
        for (const invalid of [null, [], false, 0, "options", () => {}]) {
          mustFail(() => Button.create(invalid));
        }
        for (const invalid of [null, 0, "false", {}, [], () => {}]) {
          mustFail(() => Button.create({ initialDisabled: invalid }));
        }
        for (const failure of [undefined, null, false, 0, ""]) {
          let reads = 0;
          mustFail(() => Button.create({ get initialDisabled() {
            reads += 1;
            throw failure;
          } }));
          assert.equal(reads, 1);
        }
        assert.equal(notifications, 0);
        assert.equal(defaults[1].lifecycle, "active");
        assert.deepEqual(defaults[1].activate(), { status: "activated" });
        assert.equal(notifications, 1);
        for (const button of [...defaults, disabled, captured]) { button.dispose(); }
      `);
    });

    await context.test("activation checks occupation before disabled authorisation and preserves observer failures", () => {
      check(`
        const button = Button.create();
        const delivered = [];
        let nested;
        const release = button.subscribeActivation(() => {
          delivered.push("first");
          button.setDisabled(true);
          nested = button.activate();
          throw undefined;
        });
        button.subscribeActivation(() => { delivered.push("second"); });
        mustFail(() => button.activate());
        assert.deepEqual(delivered, ["first", "second"]);
        assert.deepEqual(nested, { status: "rejected", reason: "busy" });
        assert.equal(button.isDisabled, true);
        assert.deepEqual(button.activate(), { status: "rejected", reason: "denied" });
        assert.deepEqual(delivered, ["first", "second"]);
        release();
        button.setDisabled(false);
        assert.deepEqual(button.activate(), { status: "activated" });
        assert.deepEqual(delivered, ["first", "second", "second"]);
        button.dispose();
        assert.deepEqual(button.activate(), { status: "rejected", reason: "disposed" });
      `);
    });

    await context.test("availability commits frozen opposite-direction snapshots and ignores idle repeats", () => {
      check(`
        const button = Button.create();
        const changes = [];
        button.subscribeDisabledChange((change) => {
          assert.equal(button.isDisabled, change.current);
          assert.equal(Object.isFrozen(change), true);
          mustFail(() => { change.current = change.previous; });
          changes.push(change);
        });
        assert.deepEqual(changes, []);
        assert.equal(button.setDisabled(false), undefined);
        assert.equal(button.setDisabled(true), undefined);
        assert.equal(button.setDisabled(true), undefined);
        assert.equal(button.setDisabled(false), undefined);
        assert.deepEqual(changes, [
          { previous: false, current: true },
          { previous: true, current: false },
        ]);
        for (const invalid of [undefined, null, 0, "true", {}, []]) {
          mustFail(() => button.setDisabled(invalid));
        }
        for (const invalid of [undefined, null, false, "listener", {}]) {
          mustFail(() => button.subscribeDisabledChange(invalid));
        }
        assert.equal(button.isDisabled, false);
        assert.equal(changes.length, 2);
        button.dispose();
        assert.equal(changes.length, 2);
      `);
    });

    await context.test("availability registrations retain independent duplicates and ordered mutation", () => {
      check(`
        const button = Button.create();
        const delivered = [];
        let mutate = true;
        let releaseSkipped;
        button.subscribeDisabledChange(() => {
          delivered.push("first");
          if (mutate) {
            mutate = false;
            releaseSkipped();
            button.subscribeDisabledChange(() => { delivered.push("late"); });
          }
        });
        const duplicate = () => { delivered.push("duplicate"); };
        const releaseDuplicate = button.subscribeDisabledChange(duplicate);
        button.subscribeDisabledChange(duplicate);
        releaseSkipped = button.subscribeDisabledChange(() => { delivered.push("removed"); });
        button.setDisabled(true);
        assert.deepEqual(delivered, ["first", "duplicate", "duplicate"]);
        releaseDuplicate();
        releaseDuplicate();
        delivered.length = 0;
        button.setDisabled(false);
        assert.deepEqual(delivered, ["first", "duplicate", "late"]);
        button.dispose();
        releaseDuplicate();
        releaseSkipped();
      `);
    });

    await context.test("availability delivery rejects every nested write while allowing idle activation", () => {
      check(`
        const button = Button.create({ initialDisabled: true });
        const delivered = [];
        button.subscribeActivation(() => {
          delivered.push("activation");
          mustFail(() => button.setDisabled(false));
          mustFail(() => button.setDisabled(true));
        });
        button.subscribeDisabledChange((change) => {
          delivered.push("availability");
          mustFail(() => button.setDisabled(change.current));
          mustFail(() => button.setDisabled(change.previous));
          assert.equal(button.isDisabled, change.current);
          if (!change.current) {
            assert.deepEqual(button.activate(), { status: "activated" });
          }
        });
        assert.equal(button.setDisabled(false), undefined);
        assert.deepEqual(delivered, ["availability", "activation"]);
        assert.equal(button.isDisabled, false);
        assert.equal(button.setDisabled(true), undefined);
        assert.deepEqual(delivered, ["availability", "activation", "availability"]);
        assert.deepEqual(button.activate(), { status: "rejected", reason: "denied" });
        button.dispose();
      `);
    });

    await context.test("falsey availability failures do not undo commitment or cancel eligible observers", () => {
      check(`
        for (const failure of [undefined, null, false, 0, ""]) {
          const button = Button.create();
          const delivered = [];
          const release = button.subscribeDisabledChange(() => {
            delivered.push("failure");
            throw failure;
          });
          button.subscribeDisabledChange((change) => {
            delivered.push([change.current, button.isDisabled]);
          });
          mustFail(() => button.setDisabled(true));
          assert.equal(button.isDisabled, true);
          assert.deepEqual(delivered, ["failure", [true, true]]);
          assert.equal(button.setDisabled(true), undefined);
          assert.deepEqual(delivered, ["failure", [true, true]]);
          release();
          assert.equal(button.setDisabled(false), undefined);
          assert.deepEqual(delivered, ["failure", [true, true], [false, false]]);
          button.dispose();
        }
      `);
    });

    await context.test("finalisation cancels pending delivery and retains terminal state without synthetic changes", () => {
      check(`
        const button = Button.create();
        const delivered = [];
        let terminalObservation;
        const releaseFailure = button.subscribeDisabledChange(() => {
          delivered.push("failure");
          throw 0;
        });
        button.subscribeDisabledChange(() => {
          delivered.push("dispose");
          button.dispose();
          terminalObservation = [button.lifecycle, button.isDisabled, button.activate()];
        });
        const releaseSkipped = button.subscribeDisabledChange(() => { delivered.push("skipped"); });
        mustFail(() => button.setDisabled(true));
        assert.deepEqual(delivered, ["failure", "dispose"]);
        assert.deepEqual(terminalObservation, ["disposed", true, { status: "rejected", reason: "disposed" }]);
        assert.equal(button.isDisabled, true);
        mustFail(() => button.setDisabled(true));
        mustFail(() => button.setDisabled(false));
        mustFail(() => button.subscribeDisabledChange(() => {}));
        mustFail(() => button.subscribeActivation(() => {}));
        releaseFailure();
        releaseFailure();
        releaseSkipped();
        button.dispose();
        assert.deepEqual(delivered, ["failure", "dispose"]);

        const accepting = Button.create();
        let changes = 0;
        let skipped = 0;
        accepting.subscribeDisabledChange(() => { changes += 1; });
        const releaseActivation = accepting.subscribeActivation(() => { accepting.dispose(); });
        accepting.subscribeActivation(() => { skipped += 1; });
        assert.deepEqual(accepting.activate(), { status: "activated" });
        assert.equal(accepting.lifecycle, "disposed");
        assert.equal(accepting.isDisabled, false);
        assert.equal(changes, 0);
        assert.equal(skipped, 0);
        releaseActivation();
        releaseActivation();
        accepting.dispose();
      `);
    });

    await context.test("application-owned connections preserve independent target and Button lifetimes", () => {
      check(`
        const trigger = Button.create();
        const targetScope = Scope.create();
        const target = Opening.create(targetScope, { control: "internal" });
        const outcomes = [];
        const disconnect = trigger.subscribeActivation(() => { outcomes.push(target.open()); });
        assert.deepEqual(trigger.activate(), { status: "activated" });
        assert.deepEqual(outcomes, [{ status: "changed" }]);
        targetScope.dispose();
        assert.equal(trigger.lifecycle, "active");
        assert.deepEqual(trigger.activate(), { status: "activated" });
        assert.deepEqual(outcomes, [{ status: "changed" }, { status: "rejected", reason: "disposed" }]);
        disconnect();
        assert.deepEqual(trigger.activate(), { status: "activated" });
        assert.equal(outcomes.length, 2);
        trigger.dispose();

        const otherTrigger = Button.create();
        const borrowedScope = Scope.create();
        const borrowed = Opening.create(borrowedScope, { control: "internal" });
        let requests = 0;
        const release = otherTrigger.subscribeActivation(() => { requests += 1; borrowed.open(); });
        otherTrigger.dispose();
        assert.equal(borrowedScope.lifecycle, "active");
        assert.equal(borrowed.isOpen, false);
        assert.equal(requests, 0);
        release();
        release();
        assert.deepEqual(borrowed.open(), { status: "changed" });
        borrowedScope.dispose();
      `);
    });
  });
});
