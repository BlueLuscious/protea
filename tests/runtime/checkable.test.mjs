import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withComponentsConsumer } from "../shared/core-candidate.mjs";

const authorityFixture = new URL("../shared/open-state-authority.mjs", import.meta.url).href;

test("Checking and Switch preserve checked-state authority through the packed public API", async (context) => {
  await withComponentsConsumer("protea-checkable-runtime-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { Component, Scope } from "@luscious-garden/protea-core";
        import { Button, Checking, Switch, checkableResultStatuses } from "@luscious-garden/protea-components";
        import { createOpenStateAuthority } from ${JSON.stringify(authorityFixture)};

        function createCheckedStateAuthority(initialChecked = false, hooks = {}) {
          const source = createOpenStateAuthority(initialChecked, hooks);
          const authority = {
            get isChecked() { return source.authority.isOpen; },
            requestChecked(next) { return source.authority.requestOpen(next); },
            subscribeCheckedChange(listener) { return source.authority.subscribeOpenChange(listener); },
            dispose() { source.authority.dispose(); },
          };
          return { authority, stats: source.stats, setChecked: source.setOpen, registrationCount: source.registrationCount };
        }

        const changed = { status: checkableResultStatuses.changed };
        const unchanged = { status: checkableResultStatuses.unchanged };
        const rejected = (reason) => ({ status: checkableResultStatuses.rejected, reason });
        ${source}
      `], consumer);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("internal checking captures configuration and commits before synchronous observation", () => {
      check(`
        const scope = Scope.create();
        const options = { control: "internal", initialChecked: true };
        const checking = Checking.create(scope, options);
        const other = Checking.create(scope, { control: "internal" });
        options.initialChecked = false;
        assert.equal(checking.isChecked, true);
        assert.equal(other.isChecked, false);

        const changes = [];
        const release = checking.subscribeCheckedChange((change) => {
          assert.equal(checking.isChecked, change.current);
          assert.equal(Object.isFrozen(change), true);
          assert.deepEqual(checking.requestChecked(change.current), rejected("busy"));
          assert.deepEqual(checking.requestChecked("invalid"), rejected("busy"));
          changes.push(change);
        });
        assert.deepEqual(changes, []);
        assert.throws(() => checking.requestChecked("false"));
        assert.deepEqual(checking.requestChecked(true), unchanged);
        assert.deepEqual(checking.requestChecked(false), changed);
        assert.deepEqual(changes, [{ previous: true, current: false }]);
        assert.deepEqual(checking.requestChecked(false), unchanged);
        assert.deepEqual(other.requestChecked(true), changed);
        assert.equal(checking.isChecked, false);
        assert.equal(changes.length, 1);

        scope.dispose();
        assert.deepEqual(checking.requestChecked("invalid"), rejected("disposed"));
        assert.equal(checking.isChecked, false);
        assert.equal(other.isChecked, true);
        assert.throws(() => checking.subscribeCheckedChange(() => {}));
        release();
        release();
      `);
    });

    await context.test("duplicate subscriptions release independently and failures do not undo commitment", () => {
      check(`
        const scope = Scope.create();
        const checking = Checking.create(scope, { control: "internal" });
        const calls = [];
        const listener = ({ current }) => { calls.push(current); };
        const first = checking.subscribeCheckedChange(listener);
        const releaseFailure = checking.subscribeCheckedChange(() => { throw undefined; });
        const second = checking.subscribeCheckedChange(listener);
        assert.throws(() => checking.requestChecked(true));
        assert.deepEqual(calls, [true, true]);
        assert.equal(checking.isChecked, true);

        first();
        first();
        releaseFailure();
        assert.deepEqual(checking.requestChecked(true), unchanged);
        assert.deepEqual(checking.requestChecked(false), changed);
        assert.deepEqual(calls, [true, true, false]);
        second();
        scope.dispose();
      `);
    });

    await context.test("a live external read before its source notification preserves transition values and request occupation", () => {
      check(`
        const scope = Scope.create();
        const hooks = {};
        const source = createCheckedStateAuthority(false, hooks);
        const readsBeforeForwarding = [];
        const busyResults = [];
        const releaseEarlierSourceObserver = source.authority.subscribeCheckedChange(() => {
          readsBeforeForwarding.push(checking.isChecked);
        });
        const checking = Checking.create(scope, { control: "external", authority: source.authority });
        const changes = [];
        checking.subscribeCheckedChange((change) => {
          changes.push(change);
          busyResults.push(checking.requestChecked(change.current));
        });
        hooks.allow = (next) => next;
        hooks.onRead = (current) => {
          hooks.onRead = undefined;
          busyResults.push(checking.requestChecked(current));
        };
        hooks.beforeCommit = (next) => { busyResults.push(checking.requestChecked(next)); };

        assert.deepEqual(checking.requestChecked(false), unchanged);
        assert.deepEqual(source.stats.requests, []);
        assert.deepEqual(checking.requestChecked(true), changed);
        assert.deepEqual(checking.requestChecked(false), rejected("denied"));
        assert.equal(checking.isChecked, true);
        assert.deepEqual(readsBeforeForwarding, [true]);
        assert.deepEqual(changes, [{ previous: false, current: true }]);
        assert.deepEqual(busyResults, [rejected("busy"), rejected("busy"), rejected("busy")]);
        assert.deepEqual(source.stats.requests, [true, false]);

        hooks.allow = undefined;
        hooks.beforeCommit = undefined;
        assert.equal(source.setChecked(false), true);
        assert.deepEqual(readsBeforeForwarding, [true, false]);
        assert.deepEqual(changes, [{ previous: false, current: true }, { previous: true, current: false }]);
        assert.deepEqual(source.stats.requests, [true, false]);
        scope.dispose();
        releaseEarlierSourceObserver();
        assert.equal(source.registrationCount(), 0);
        assert.equal(source.stats.disposals, 0);
      `);
    });

    await context.test("delegation keeps the authority receiver and captured operation references", () => {
      check(`
        const scope = Scope.create();
        const source = createCheckedStateAuthority(true);
        const authority = {
          get isChecked() {
            assert.equal(this, authority);
            return source.authority.isChecked;
          },
          requestChecked(next) {
            assert.equal(this, authority);
            return source.authority.requestChecked(next);
          },
          subscribeCheckedChange(listener) {
            assert.equal(this, authority);
            return source.authority.subscribeCheckedChange(listener);
          },
        };
        const options = { control: "external", authority };
        const checking = Checking.create(scope, options);
        const replaced = () => { assert.fail("A changed operation was consulted."); };
        options.authority = {};
        authority.requestChecked = replaced;
        authority.subscribeCheckedChange = replaced;

        assert.equal(checking.isChecked, true);
        assert.deepEqual(checking.requestChecked(false), changed);
        assert.equal(checking.isChecked, false);
        assert.deepEqual(source.stats.requests, [false]);
        scope.dispose();
        assert.equal(source.stats.releases, 1);
      `);
    });

    await context.test("delegated finalisation distinguishes commitment observed before disposal", () => {
      check(`
        for (const observation of ["beforeCommit", "publicRead", "notification"]) {
          const scope = Scope.create();
          const hooks = {};
          const source = createCheckedStateAuthority(false, hooks);
          const checking = Checking.create(scope, { control: "external", authority: source.authority });
          const changes = [];
          checking.subscribeCheckedChange((change) => {
            changes.push(change);
            scope.dispose();
          });
          checking.subscribeCheckedChange(() => { assert.fail("Disposal must cancel remaining delivery."); });
          if (observation === "beforeCommit") {
            hooks.beforeCommit = () => scope.dispose();
          }
          if (observation === "publicRead") {
            hooks.beforeNotify = () => {
              assert.equal(checking.isChecked, true);
              scope.dispose();
            };
          }

          const expected = observation === "beforeCommit" ? rejected("disposed") : changed;
          assert.deepEqual(checking.requestChecked(true), expected);
          assert.deepEqual(changes, observation === "notification" ? [{ previous: false, current: true }] : []);
          assert.equal(source.authority.isChecked, true);
          const reads = source.stats.reads;
          assert.equal(checking.isChecked, observation !== "beforeCommit");
          assert.deepEqual(checking.requestChecked(false), rejected("disposed"));
          assert.equal(source.stats.reads, reads);
          assert.deepEqual(source.stats.requests, [true]);
          assert.equal(source.stats.releases, 1);
          assert.equal(source.stats.disposals, 0);
        }
      `);
    });

    await context.test("invalidated setup releases a late handle and leaves a retained callback inert", () => {
      check(`
        const scope = Scope.create();
        const source = createCheckedStateAuthority(false, {
          afterSubscribe: () => scope.dispose(),
          release() { throw new Error("The fixture retains its registration."); },
        });
        let retained;
        const authority = {
          get isChecked() { return source.authority.isChecked; },
          requestChecked(next) { return source.authority.requestChecked(next); },
          subscribeCheckedChange(listener) {
            retained = listener;
            return source.authority.subscribeCheckedChange(listener);
          },
        };
        assert.throws(() => Checking.create(scope, { control: "external", authority }));
        assert.equal(scope.lifecycle, "disposed");
        assert.equal(source.stats.releases, 1);
        assert.equal(source.registrationCount(), 1);
        assert.doesNotThrow(() => retained({ previous: false, current: false }));
        assert.equal(source.setChecked(true), true);
        assert.doesNotThrow(() => scope.dispose());
        assert.equal(source.stats.releases, 1);
        assert.equal(source.stats.disposals, 0);
      `);
    });

    await context.test("invalid inputs and authority failures expose no partial model or invalid commitment", () => {
      check(`
        const scope = Scope.create();
        const source = createCheckedStateAuthority();
        const authority = source.authority;
        for (const options of [
          undefined, null, [], { control: "shared" },
          { control: "internal", initialChecked: undefined },
          { control: "internal", initialChecked: "true" },
          { control: "internal", authority: undefined },
          { control: "external", authority, initialChecked: undefined },
          { control: "external" }, { control: "external", authority: {} },
        ]) {
          assert.throws(() => Checking.create(scope, options));
          assert.throws(() => Switch.create(options));
        }
        assert.equal(source.stats.subscriptions, 0);
        assert.equal(scope.lifecycle, "active");

        const invalidReading = {
          ...authority,
          get isChecked() { return "false"; },
        };
        assert.throws(() => Checking.create(scope, { control: "external", authority: invalidReading }));
        assert.equal(source.registrationCount(), 0);

        let notify;
        let response = true;
        const checking = Checking.create(scope, { control: "external", authority: {
          isChecked: false,
          requestChecked() { return response; },
          subscribeCheckedChange(listener) { notify = listener; return () => {}; },
        } });
        assert.throws(() => checking.subscribeCheckedChange(false));
        let observed = 0;
        checking.subscribeCheckedChange(() => { observed += 1; });
        assert.throws(() => checking.requestChecked(true));
        response = "yes";
        assert.throws(() => checking.requestChecked(true));
        assert.throws(() => notify({ previous: false, current: false }));
        assert.throws(() => notify({ previous: false, current: "true" }));
        response = false;
        assert.deepEqual(checking.requestChecked(true), rejected("denied"));
        assert.equal(checking.isChecked, false);
        assert.equal(observed, 0);
        scope.dispose();
        assert.throws(() => Checking.create(scope, { control: "internal" }));
      `);
    });

    await context.test("both Switch entry points create independent internal models with a flat surface", () => {
      check(`
        const first = Switch.create({ control: "internal", initialChecked: true });
        const second = Component.create(Switch.definition, { control: "internal" });
        assert.notEqual(first, second);
        assert.deepEqual(Switch.definition.identity, { namespace: "protea", name: "switch" });
        for (const instance of [first, second]) {
          assert.equal(instance.definition, Switch.definition);
          assert.equal(instance.lifecycle, "active");
          assert.deepEqual(Object.keys(instance).sort(), [
            "definition", "dispose", "isChecked", "lifecycle", "requestChecked", "subscribeCheckedChange",
          ]);
        }
        assert.equal(first.isChecked, true);
        assert.equal(second.isChecked, false);
        assert.deepEqual(first.requestChecked(false), changed);
        assert.deepEqual(second.requestChecked(false), unchanged);
        first.dispose();
        assert.deepEqual(first.requestChecked(true), rejected("disposed"));
        assert.deepEqual(second.requestChecked(true), changed);
        assert.equal(first.isChecked, false);
        assert.equal(second.isChecked, true);
        second.dispose();
      `);
    });

    await context.test("both external Switch entries observe a shared application authority and dispose independently", () => {
      check(`
        let permitted = false;
        const source = createCheckedStateAuthority(false, { allow: () => permitted });
        const options = { control: "external", authority: source.authority };
        const first = Switch.create(options);
        const second = Component.create(Switch.definition, options);
        const button = Button.create();
        const firstChanges = [];
        const secondChanges = [];
        const requests = [];
        first.subscribeCheckedChange(({ current }) => { firstChanges.push(current); });
        second.subscribeCheckedChange(({ current }) => { secondChanges.push(current); });
        const disconnect = button.subscribeActivation(() => {
          requests.push(source.authority.requestChecked(!source.authority.isChecked));
        });

        assert.deepEqual(first.requestChecked(true), rejected("denied"));
        assert.deepEqual(button.activate(), { status: "activated" });
        assert.deepEqual(requests, [false]);
        assert.deepEqual(firstChanges, []);
        assert.deepEqual(secondChanges, []);
        permitted = true;
        assert.deepEqual(second.requestChecked(true), changed);
        assert.deepEqual(button.activate(), { status: "activated" });
        assert.deepEqual(firstChanges, [true, false]);
        assert.deepEqual(secondChanges, [true, false]);

        first.dispose();
        assert.equal(source.registrationCount(), 1);
        assert.equal(second.lifecycle, "active");
        assert.equal(button.lifecycle, "active");
        assert.equal(source.setChecked(true), true);
        assert.deepEqual(firstChanges, [true, false]);
        assert.deepEqual(secondChanges, [true, false, true]);
        assert.equal(first.isChecked, false);
        assert.equal(second.isChecked, true);
        disconnect();
        button.dispose();
        assert.deepEqual(second.requestChecked(false), changed);
        second.dispose();
        assert.equal(source.registrationCount(), 0);
        assert.equal(source.stats.disposals, 0);
      `);
    });
  });
});
