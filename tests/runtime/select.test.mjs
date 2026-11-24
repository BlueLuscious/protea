import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withComponentsConsumer } from "../shared/core-candidate.mjs";

test("Select preserves bounded selection and borrowed authority through the packed public API", async (context) => {
  await withComponentsConsumer("protea-select-runtime-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { Component } from "@luscious-garden/protea-core";
        import { Select, selectResultStatuses } from "@luscious-garden/protea-components/select";
        import { SelectDefinition } from "@luscious-garden/protea-components/definitions/select";

        function createAuthority(initialValue = "system", hooks = {}) {
          let value = initialValue;
          let busy = false;
          const listeners = new Set();
          const stats = { reads: 0, requests: [], subscriptions: 0, releases: 0, disposals: 0 };
          function setValue(next) {
            if (busy) return false;
            if (next === value) return true;
            const change = { previous: value, current: next };
            value = next;
            busy = true;
            const failures = [];
            try {
              hooks.beforeNotify?.(change);
              for (const entry of [...listeners]) {
                if (!entry.active) continue;
                try { entry.listener(change); } catch (error) { failures.push(error); }
              }
            } finally {
              busy = false;
            }
            if (failures.length) throw new AggregateError(failures, "Selection source observers failed.");
            return true;
          }
          const authority = {
            get selectedValue() {
              assert.equal(this, authority);
              stats.reads++;
              hooks.onRead?.(value);
              return value;
            },
            requestSelection(next) {
              assert.equal(this, authority);
              stats.requests.push(next);
              if (hooks.request) return hooks.request(next);
              if (busy || (hooks.allow && !hooks.allow(next))) return false;
              hooks.beforeCommit?.(next);
              return setValue(next);
            },
            subscribeSelectionChange(listener) {
              assert.equal(this, authority);
              stats.subscriptions++;
              const entry = { listener, active: true };
              listeners.add(entry);
              hooks.onSubscribe?.(listener);
              return () => {
                if (!entry.active) return;
                entry.active = false;
                listeners.delete(entry);
                stats.releases++;
                hooks.onRelease?.(listener);
              };
            },
            dispose() { stats.disposals++; },
          };
          return {
            authority, stats, setValue,
            setRaw(next) { value = next; },
            emit(change) { for (const entry of [...listeners]) if (entry.active) entry.listener(change); },
            registrationCount() { return listeners.size; },
          };
        }

        const options = [{ value: "light" }, { value: "dark" }, { value: "system" }];
        const changed = { status: selectResultStatuses.changed };
        const unchanged = { status: selectResultStatuses.unchanged };
        const rejected = (reason) => ({ status: selectResultStatuses.rejected, reason });
        ${source}
      `], consumer);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("captures frozen options without adopting caller data and distinguishes disabled requests from state", () => {
      check(`
        const source = createAuthority();
        const authored = [{ value: "light" }, { value: "dark", disabled: true }, { value: "system" }];
        const config = { options: authored, authority: source.authority };
        const select = Select.create(config);
        assert.equal(select.definition, SelectDefinition);
        assert.equal(select.definition, Select.definition);
        assert.equal(select.selectedValue, "system");
        assert.equal(Object.isFrozen(select.options), true);
        for (const option of select.options) assert.equal(Object.isFrozen(option), true);
        assert.notEqual(select.options, authored);
        assert.notEqual(select.options[0], authored[0]);
        assert.equal(Object.isFrozen(authored), false);
        assert.equal(Object.isFrozen(authored[0]), false);
        authored[0].value = "changed";
        authored[1].disabled = false;
        authored.push({ value: "extra" });
        config.options = [];
        config.authority = {};
        assert.deepEqual(select.options.map((option) => option.value), ["light", "dark", "system"]);
        assert.equal(select.options[1].disabled, true);
        const changes = [];
        select.subscribeSelectionChange((change) => {
          assert.equal(Object.isFrozen(change), true);
          assert.equal(select.selectedValue, change.current);
          changes.push(change);
        });
        assert.deepEqual(changes, []);
        assert.deepEqual(select.requestSelection("system"), unchanged);
        assert.deepEqual(select.requestSelection("dark"), rejected("denied"));
        assert.deepEqual(source.stats.requests, []);
        assert.equal(source.setValue("dark"), true);
        assert.equal(select.selectedValue, "dark");
        assert.deepEqual(select.requestSelection("dark"), unchanged);
        assert.deepEqual(select.requestSelection("light"), changed);
        assert.deepEqual(source.stats.requests, ["light"]);
        assert.deepEqual(changes, [
          { previous: "system", current: "dark" }, { previous: "dark", current: "light" },
        ]);
        select.dispose();
        assert.equal(select.options[0].value, "light");
      `);
    });

    await context.test("rejects malformed catalogues before observing the authority and validates request targets", () => {
      check(`
        for (const invalid of [
          undefined, null, [], {}, { options: null }, { options: [] },
          { options: [null] }, { options: ["light"] }, { options: [{ value: "" }] },
          { options: [{ value: 1 }] }, { options: [{ value: "light", disabled: "yes" }] },
          { options: [{ value: "light", disabled: undefined }] },
          { options: [{ value: "light" }, { value: "light" }] },
        ]) {
          const source = createAuthority();
          const config = invalid && !Array.isArray(invalid) ? { ...invalid, authority: source.authority } : invalid;
          assert.throws(() => Select.create(config), TypeError);
          assert.equal(source.stats.reads, 0);
          assert.equal(source.stats.subscriptions, 0);
          assert.equal(source.stats.disposals, 0);
        }
        for (const initial of [null, 1, "", "unknown"]) {
          const source = createAuthority(initial);
          assert.throws(() => Select.create({ options, authority: source.authority }));
          assert.equal(source.stats.subscriptions, 0);
          assert.equal(source.stats.disposals, 0);
        }
        for (const authority of [undefined, null, {}, { selectedValue: "system", requestSelection() { return true; } }]) {
          assert.throws(() => Select.create({ options, authority }), TypeError);
        }
        const source = createAuthority();
        const select = Select.create({ options, authority: source.authority });
        for (const value of [undefined, null, false, 1, ""]) {
          assert.throws(() => select.requestSelection(value), TypeError);
        }
        assert.throws(() => select.requestSelection("unknown"), RangeError);
        assert.deepEqual(source.stats.requests, []);
        select.dispose();
      `);
    });

    await context.test("shares an external source while keeping connections, snapshots and finalisation independent", () => {
      check(`
        const source = createAuthority();
        const first = Select.create({ options, authority: source.authority });
        const second = Component.create(SelectDefinition, { options, authority: source.authority });
        assert.notEqual(first, second);
        assert.equal(first.definition, second.definition);
        assert.equal(source.registrationCount(), 2);
        const firstChanges = [];
        const secondChanges = [];
        const release = first.subscribeSelectionChange((change) => firstChanges.push(change));
        second.subscribeSelectionChange((change) => secondChanges.push(change));
        assert.deepEqual(first.requestSelection("light"), changed);
        assert.deepEqual(source.stats.requests, ["light"]);
        assert.equal(second.selectedValue, "light");
        assert.deepEqual(firstChanges, [{ previous: "system", current: "light" }]);
        assert.deepEqual(secondChanges, firstChanges);
        source.setValue("dark");
        assert.deepEqual(source.stats.requests, ["light"]);
        first.dispose();
        assert.equal(source.registrationCount(), 1);
        source.setValue("system");
        const reads = source.stats.reads;
        assert.equal(first.selectedValue, "dark");
        assert.equal(source.stats.reads, reads);
        assert.equal(second.selectedValue, "system");
        assert.equal(firstChanges.length, 2);
        assert.equal(secondChanges.length, 3);
        assert.deepEqual(first.requestSelection(null), rejected("disposed"));
        assert.throws(() => first.subscribeSelectionChange(() => {}));
        release();
        release();
        second.dispose();
        assert.equal(source.registrationCount(), 0);
        assert.equal(source.stats.releases, 2);
        assert.equal(source.stats.disposals, 0);
      `);
    });

    await context.test("captures authority methods and preserves refusal without feedback or notification", () => {
      check(`
        const hooks = {};
        const source = createAuthority("system", hooks);
        const select = Select.create({ options, authority: source.authority });
        source.authority.requestSelection = () => { assert.fail("A replaced request was consulted."); };
        source.authority.subscribeSelectionChange = () => { assert.fail("A replaced subscription was consulted."); };
        const changes = [];
        select.subscribeSelectionChange((change) => changes.push(change));
        hooks.allow = () => false;
        assert.deepEqual(select.requestSelection("light"), rejected("denied"));
        assert.equal(select.selectedValue, "system");
        assert.deepEqual(changes, []);
        hooks.allow = undefined;
        assert.deepEqual(select.requestSelection("light"), changed);
        assert.deepEqual(changes, [{ previous: "system", current: "light" }]);
        select.dispose();
        assert.equal(source.stats.releases, 1);
      `);
    });

    await context.test("rejects reentrant requests and completes eligible observation after a callback fails", () => {
      check(`
        const hooks = {};
        const source = createAuthority("system", hooks);
        const select = Select.create({ options, authority: source.authority });
        const calls = [];
        let releaseLater;
        let releaseAdded;
        const releaseFirst = select.subscribeSelectionChange(() => {
          calls.push("first");
          assert.deepEqual(select.requestSelection(null), rejected("busy"));
          releaseLater();
          releaseAdded ??= select.subscribeSelectionChange(() => calls.push("added"));
        });
        releaseLater = select.subscribeSelectionChange(() => calls.push("released"));
        const releaseFailure = select.subscribeSelectionChange(() => { calls.push("failure"); throw new Error("observer"); });
        const duplicate = () => calls.push("duplicate");
        const releaseDuplicate = select.subscribeSelectionChange(duplicate);
        select.subscribeSelectionChange(duplicate);
        hooks.beforeCommit = () => {
          assert.deepEqual(select.requestSelection("system"), rejected("busy"));
        };
        assert.throws(() => select.requestSelection("light"));
        assert.equal(select.selectedValue, "light");
        assert.deepEqual(calls, ["first", "failure", "duplicate", "duplicate"]);
        releaseFirst();
        releaseFailure();
        releaseDuplicate();
        assert.deepEqual(select.requestSelection("system"), changed);
        assert.deepEqual(calls, ["first", "failure", "duplicate", "duplicate", "duplicate", "added"]);
        releaseAdded();
        select.dispose();
      `);
    });

    await context.test("reports malformed authority outcomes and transitions without inventing commitment", () => {
      check(`
        const hooks = {};
        const source = createAuthority("system", hooks);
        const select = Select.create({ options, authority: source.authority });
        const changes = [];
        select.subscribeSelectionChange((change) => changes.push(change));
        hooks.request = () => true;
        assert.throws(() => select.requestSelection("light"));
        assert.equal(select.selectedValue, "system");
        hooks.request = () => "accepted";
        assert.throws(() => select.requestSelection("light"), TypeError);
        hooks.request = (next) => { source.setRaw(next); return true; };
        assert.throws(() => select.requestSelection("light"));
        assert.equal(select.selectedValue, "light");
        assert.deepEqual(changes, []);
        source.setRaw("system");
        assert.equal(select.selectedValue, "system");
        assert.throws(() => source.emit({ previous: "system", current: "light" }));
        for (const change of [
          null, {}, { previous: "system", current: "system" },
          { previous: "system", current: "unknown" }, { previous: false, current: "light" },
        ]) {
          assert.throws(() => source.emit(change));
          assert.equal(select.selectedValue, "system");
        }
        hooks.request = undefined;
        assert.deepEqual(select.requestSelection("light"), changed);
        source.setRaw("unknown");
        assert.throws(() => select.selectedValue);
        source.setRaw("light");
        select.dispose();
      `);
    });

    await context.test("an earlier source observer can read commitment without consuming the Select transition", () => {
      check(`
        const source = createAuthority();
        const reads = [];
        const releaseEarlier = source.authority.subscribeSelectionChange(() => reads.push(select.selectedValue));
        const select = Select.create({ options, authority: source.authority });
        const changes = [];
        select.subscribeSelectionChange((change) => changes.push(change));
        assert.deepEqual(select.requestSelection("light"), changed);
        source.setValue("dark");
        assert.deepEqual(reads, ["light", "dark"]);
        assert.deepEqual(changes, [
          { previous: "system", current: "light" }, { previous: "light", current: "dark" },
        ]);
        releaseEarlier();
        select.dispose();
      `);
    });

    await context.test("captures registration-time changes and invalidates callbacks after failed setup", () => {
      check(`
        let retained;
        const hooks = { onSubscribe(listener) { retained = listener; source.setRaw("light"); } };
        const source = createAuthority("system", hooks);
        const select = Select.create({ options, authority: source.authority });
        assert.equal(select.selectedValue, "light");
        select.dispose();
        retained(null);

        const failureHooks = { onSubscribe(listener) { retained = listener; failedSource.setRaw("unknown"); } };
        const failedSource = createAuthority("system", failureHooks);
        assert.throws(() => Select.create({ options, authority: failedSource.authority }));
        assert.equal(failedSource.stats.releases, 1);
        assert.equal(failedSource.registrationCount(), 0);
        retained(null);

        const thrownHooks = { onSubscribe(listener) { retained = listener; throw new Error("subscription"); } };
        const thrownSource = createAuthority("system", thrownHooks);
        assert.throws(() => Select.create({ options, authority: thrownSource.authority }));
        assert.equal(thrownSource.stats.releases, 0);
        retained(null);
        assert.equal(thrownSource.stats.disposals, 0);
      `);
    });

    await context.test("releases a source registration returned after the owning scope was invalidated", () => {
      check(`
        let scope;
        let retained;
        const source = createAuthority("system", {
          onSubscribe(listener) { retained = listener; scope.dispose(); },
        });
        const instrumented = Component.define({
          identity: { name: "select-setup-probe" },
          setup(context) {
            scope = context.scope;
            return SelectDefinition.setup({ scope, options: { options, authority: source.authority } });
          },
        });
        assert.throws(() => Component.create(instrumented));
        assert.equal(scope.lifecycle, "disposed");
        assert.equal(source.stats.releases, 1);
        assert.equal(source.registrationCount(), 0);
        retained(null);
        assert.equal(source.stats.disposals, 0);
      `);
    });

    await context.test("distinguishes disposal before delegation commits from disposal after its observed transition", () => {
      check(`
        for (const committed of [false, true]) {
          const hooks = {};
          const source = createAuthority("system", hooks);
          const select = Select.create({ options, authority: source.authority });
          if (committed) {
            select.subscribeSelectionChange(() => select.dispose());
            select.subscribeSelectionChange(() => assert.fail("Disposed delivery continued."));
          } else {
            hooks.beforeCommit = () => select.dispose();
          }
          assert.deepEqual(select.requestSelection("light"), committed ? changed : rejected("disposed"));
          assert.equal(select.selectedValue, committed ? "light" : "system");
          assert.equal(source.authority.selectedValue, "light");
          assert.equal(source.stats.releases, 1);
          assert.equal(source.stats.disposals, 0);
        }
      `);
    });

    await context.test("keeps terminal reads and retained callbacks inert after a source release fails", () => {
      check(`
        let retained;
        const source = createAuthority("system", {
          onSubscribe(listener) { retained = listener; },
          onRelease() { throw new Error("release"); },
        });
        const select = Select.create({ options, authority: source.authority });
        const changes = [];
        const release = select.subscribeSelectionChange((change) => changes.push(change));
        assert.throws(() => select.dispose());
        assert.equal(select.lifecycle, "disposed");
        retained(null);
        source.setRaw("unknown");
        const reads = source.stats.reads;
        assert.equal(select.selectedValue, "system");
        assert.equal(source.stats.reads, reads);
        assert.deepEqual(select.requestSelection("light"), rejected("disposed"));
        assert.deepEqual(changes, []);
        select.dispose();
        release();
        release();
        assert.equal(source.stats.releases, 1);
        assert.equal(source.stats.disposals, 0);
      `);
    });
  });
});
