import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withCoreConsumer } from "../shared/core-candidate.mjs";

const authorityFixture = new URL("../shared/open-state-authority.mjs", import.meta.url).href;

test("opening preserves authority, observation and lifetime through the packed public API", async (context) => {
  await withCoreConsumer("protea-openable-runtime-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { componentScopeFactory, openableFactory, openableResultStatuses, capabilityRejectionReasons } from "@luscious-garden/protea-core";
        import { createOpenStateAuthority } from ${JSON.stringify(authorityFixture)};
        ${source}
      `], consumer);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("internal control captures configuration and commits before notifying", () => {
      check(`
        const scope = componentScopeFactory.create();
        const options = { control: "internal", initialOpen: true };
        const model = openableFactory.create(scope, options);
        const closed = openableFactory.create(scope, { control: "internal" });
        options.initialOpen = false;
        options.control = "external";
        const observations = [];
        model.subscribeOpenChange((change) => { observations.push({ change, value: model.isOpen }); });
        assert.equal(model.isOpen, true);
        assert.equal(closed.isOpen, false);
        assert.equal(Object.isFrozen(options), false);
        assert.deepEqual(model.open(), { status: openableResultStatuses.unchanged });
        assert.deepEqual(model.close(), { status: openableResultStatuses.changed });
        assert.deepEqual(model.close(), { status: openableResultStatuses.unchanged });
        assert.deepEqual(model.open(), { status: openableResultStatuses.changed });
        assert.deepEqual(observations, [
          { change: { previous: true, current: false }, value: false },
          { change: { previous: false, current: true }, value: true },
        ]);
        assert.equal(closed.isOpen, false);
        assert.equal("dispose" in model, false);
        scope.dispose();
      `);
    });

    await context.test("notification mutation respects independent registrations and ordered snapshots", () => {
      check(`
        const scope = componentScopeFactory.create();
        const model = openableFactory.create(scope, { control: "internal" });
        const calls = [];
        let added = false;
        let removeSecond;
        let removeDuplicate;
        model.subscribeOpenChange(() => {
          calls.push("first");
          removeSecond();
          removeDuplicate();
          if (!added) { added = true; model.subscribeOpenChange(() => { calls.push("later"); }); }
        });
        removeSecond = model.subscribeOpenChange(() => { calls.push("removed"); });
        const duplicate = () => { calls.push("duplicate"); };
        removeDuplicate = model.subscribeOpenChange(duplicate);
        const removeOtherDuplicate = model.subscribeOpenChange(duplicate);
        assert.deepEqual(calls, []);
        model.open();
        assert.deepEqual(calls, ["first", "duplicate"]);
        calls.length = 0;
        model.close();
        assert.deepEqual(calls, ["first", "duplicate", "later"]);
        removeOtherDuplicate();
        removeOtherDuplicate();
        scope.dispose();
        assert.doesNotThrow(removeSecond);
      `);
    });

    await context.test("local busy and disposed checks precede satisfaction without cancelling commitment", () => {
      check(`
        const scope = componentScopeFactory.create();
        const model = openableFactory.create(scope, { control: "internal" });
        const results = [];
        let pending = 0;
        model.subscribeOpenChange(() => {
          results.push(model.open(), model.close());
          scope.dispose();
          results.push(model.open());
        });
        model.subscribeOpenChange(() => { pending += 1; });
        assert.deepEqual(model.open(), { status: "changed" });
        assert.deepEqual(results, [
          { status: "rejected", reason: "busy" },
          { status: "rejected", reason: "busy" },
          { status: "rejected", reason: "disposed" },
        ]);
        assert.equal(pending, 0);
        assert.equal(model.isOpen, true);
        assert.deepEqual(model.close(), { status: "rejected", reason: capabilityRejectionReasons.disposed });
        assert.throws(() => model.subscribeOpenChange(() => {}));
      `);
    });

    await context.test("callback failures attempt remaining observers without rollback or a stuck busy flag", () => {
      check(`
        const scope = componentScopeFactory.create();
        const model = openableFactory.create(scope, { control: "internal" });
        const calls = [];
        const first = model.subscribeOpenChange(() => { calls.push("first"); throw undefined; });
        const second = model.subscribeOpenChange(() => { calls.push("second"); throw 0; });
        model.subscribeOpenChange(() => { calls.push("third"); });
        let failed = false;
        try { model.open(); } catch { failed = true; }
        assert.equal(failed, true);
        assert.deepEqual(calls, ["first", "second", "third"]);
        assert.equal(model.isOpen, true);
        first(); second();
        assert.deepEqual(model.close(), { status: "changed" });
        scope.dispose();
      `);
    });

    await context.test("external control distinguishes no-ops, refusals and application-driven state", () => {
      check(`
        const scope = componentScopeFactory.create();
        const hooks = { allow: () => false };
        const source = createOpenStateAuthority(false, hooks);
        const options = { control: "external", authority: source.authority };
        const model = openableFactory.create(scope, options);
        const changes = [];
        model.subscribeOpenChange((change) => { changes.push(change); });
        assert.deepEqual(model.close(), { status: "unchanged" });
        assert.deepEqual(source.stats.requests, []);
        assert.deepEqual(model.open(), { status: "rejected", reason: "denied" });
        assert.equal(model.isOpen, false);
        assert.deepEqual(changes, []);
        hooks.allow = () => true;
        options.authority = createOpenStateAuthority(true).authority;
        source.authority.requestOpen = () => { throw new Error("replaced method must not be used"); };
        assert.deepEqual(model.open(), { status: "changed" });
        assert.deepEqual(source.stats.requests, [true, true]);
        assert.deepEqual(model.open(), { status: "unchanged" });
        assert.deepEqual(source.stats.requests, [true, true]);
        source.setOpen(false);
        assert.equal(model.isOpen, false);
        assert.deepEqual(changes, [{ previous: false, current: true }, { previous: true, current: false }]);
        assert.equal(source.stats.subscriptions, 1);
        scope.dispose();
        const reads = source.stats.reads;
        source.setOpen(true);
        assert.equal(model.isOpen, false);
        assert.equal(source.stats.reads, reads);
        assert.equal(source.stats.releases, 1);
        assert.equal(source.stats.disposals, 0);
      `);
    });

    await context.test("source-driven delivery occupies only its own capability and shared source refusals stay denied", () => {
      check(`
        const firstScope = componentScopeFactory.create();
        const secondScope = componentScopeFactory.create();
        const source = createOpenStateAuthority();
        const first = openableFactory.create(firstScope, { control: "external", authority: source.authority });
        const second = openableFactory.create(secondScope, { control: "external", authority: source.authority });
        const nested = [];
        first.subscribeOpenChange(() => { nested.push(first.close(), second.close()); });
        source.setOpen(true);
        assert.deepEqual(nested, [{ status: "rejected", reason: "busy" }, { status: "rejected", reason: "denied" }]);
        assert.equal(first.isOpen, true);
        assert.equal(second.isOpen, true);
        firstScope.dispose();
        source.setOpen(false);
        assert.equal(first.isOpen, true);
        assert.equal(second.isOpen, false);
        assert.equal(secondScope.lifecycle, "active");
        secondScope.dispose();
      `);
    });

    await context.test("disposal before delegated commitment freezes projection without rolling back the source", () => {
      check(`
        const scope = componentScopeFactory.create();
        const source = createOpenStateAuthority(false, { beforeCommit: () => scope.dispose() });
        let unrelated = 0;
        source.authority.subscribeOpenChange(() => { unrelated += 1; });
        const model = openableFactory.create(scope, { control: "external", authority: source.authority });
        let notifications = 0;
        model.subscribeOpenChange(() => { notifications += 1; });
        assert.deepEqual(model.open(), { status: "rejected", reason: "disposed" });
        assert.equal(source.authority.isOpen, true);
        const reads = source.stats.reads;
        assert.equal(model.isOpen, false);
        assert.equal(source.stats.reads, reads);
        assert.equal(notifications, 0);
        assert.equal(unrelated, 1);
      `);
    });

    await context.test("a public observation before source forwarding retains changed after disposal", () => {
      check(`
        const scope = componentScopeFactory.create();
        const hooks = {};
        const source = createOpenStateAuthority(false, hooks);
        const model = openableFactory.create(scope, { control: "external", authority: source.authority });
        const observations = [];
        hooks.beforeNotify = () => { observations.push(model.isOpen); scope.dispose(); };
        let notifications = 0;
        model.subscribeOpenChange(() => { notifications += 1; });
        assert.deepEqual(model.open(), { status: "changed" });
        assert.deepEqual(observations, [true]);
        assert.equal(model.isOpen, true);
        assert.equal(notifications, 0);
        assert.equal(source.stats.releases, 1);
      `);
    });

    await context.test("external commitment remains effective when observation disposes its owner or throws", () => {
      check(`
        const scope = componentScopeFactory.create();
        const source = createOpenStateAuthority();
        const model = openableFactory.create(scope, { control: "external", authority: source.authority });
        const observed = [];
        model.subscribeOpenChange((change) => { observed.push(change); scope.dispose(); });
        model.subscribeOpenChange(() => { observed.push("cancelled observer"); });
        assert.deepEqual(model.open(), { status: "changed" });
        assert.deepEqual(observed, [{ previous: false, current: true }]);
        assert.equal(model.isOpen, true);

        const otherScope = componentScopeFactory.create();
        const otherSource = createOpenStateAuthority(false, { afterNotify: () => { throw undefined; } });
        const other = openableFactory.create(otherScope, { control: "external", authority: otherSource.authority });
        let failed = false;
        try { other.open(); } catch { failed = true; }
        assert.equal(failed, true);
        assert.equal(other.isOpen, true);
        otherScope.dispose();
      `);
    });

    await context.test("owner guards freeze state even when another release mutates the source before disconnection", () => {
      check(`
        const scope = componentScopeFactory.create();
        const source = createOpenStateAuthority();
        scope.addCleanup(() => { source.setOpen(true); });
        const model = openableFactory.create(scope, { control: "external", authority: source.authority });
        let notifications = 0;
        model.subscribeOpenChange(() => { notifications += 1; });
        scope.dispose();
        assert.equal(source.authority.isOpen, true);
        assert.equal(model.isOpen, false);
        assert.equal(notifications, 0);
      `);
    });

    await context.test("failed physical release leaves dead callbacks inert and preserves unrelated source observers", () => {
      check(`
        const scope = componentScopeFactory.create();
        const source = createOpenStateAuthority(false, { release: () => { throw 0; } });
        let unrelated = 0;
        source.authority.subscribeOpenChange(() => { unrelated += 1; });
        const model = openableFactory.create(scope, { control: "external", authority: source.authority });
        let notifications = 0;
        model.subscribeOpenChange(() => { notifications += 1; });
        let failed = false;
        try { scope.dispose(); } catch { failed = true; }
        assert.equal(failed, true);
        const reads = source.stats.reads;
        source.setOpen(true);
        assert.equal(model.isOpen, false);
        assert.equal(source.stats.reads, reads);
        assert.equal(notifications, 0);
        assert.equal(unrelated, 1);
        assert.equal(source.stats.disposals, 0);
        assert.doesNotThrow(() => scope.dispose());
      `);
    });

    await context.test("setup captures changes during subscription before exposing the capability", () => {
      check(`
        const scope = componentScopeFactory.create();
        const hooks = {};
        const source = createOpenStateAuthority(false, hooks);
        hooks.afterSubscribe = () => { source.setOpen(true); };
        const model = openableFactory.create(scope, { control: "external", authority: source.authority });
        assert.equal(model.isOpen, true);
        assert.equal(source.stats.subscriptions, 1);
        const calls = [];
        model.subscribeOpenChange((change) => { calls.push(change); });
        assert.deepEqual(calls, []);
        source.setOpen(false);
        assert.deepEqual(calls, [{ previous: true, current: false }]);
        scope.dispose();
      `);
    });

    await context.test("partial setup releases only its own connection and leaves existing capabilities live", () => {
      check(`
        const scope = componentScopeFactory.create();
        const existing = openableFactory.create(scope, { control: "internal" });
        let reads = 0;
        const source = createOpenStateAuthority(false, { onRead: () => { reads += 1; if (reads === 2) { throw undefined; } } });
        let exposed;
        let failed = false;
        try { exposed = openableFactory.create(scope, { control: "external", authority: source.authority }); }
        catch { failed = true; }
        assert.equal(failed, true);
        assert.equal(exposed, undefined);
        assert.equal(scope.lifecycle, "active");
        assert.equal(source.stats.releases, 1);
        assert.equal(source.registrationCount(), 0);
        assert.equal(source.stats.disposals, 0);
        assert.deepEqual(existing.open(), { status: "changed" });
        scope.dispose();
        assert.equal(source.stats.releases, 1);
      `);
    });

    await context.test("a subscription acquired after setup disposal is still released once", () => {
      check(`
        const scope = componentScopeFactory.create();
        const source = createOpenStateAuthority(false, { afterSubscribe: () => scope.dispose() });
        let exposed;
        let failed = false;
        try { exposed = openableFactory.create(scope, { control: "external", authority: source.authority }); }
        catch { failed = true; }
        assert.equal(failed, true);
        assert.equal(exposed, undefined);
        assert.equal(scope.lifecycle, "disposed");
        assert.equal(source.stats.releases, 1);
        assert.equal(source.registrationCount(), 0);
        assert.equal(source.stats.disposals, 0);
        assert.doesNotThrow(() => scope.dispose());
      `);
    });

    await context.test("invalid configuration and subscription inputs create no usable partial capability", () => {
      check(`
        const scope = componentScopeFactory.create();
        for (const options of [undefined, null, {}, { control: "unknown" },
          { control: "internal", initialOpen: undefined }, { control: "internal", initialOpen: 1 },
          { control: "internal", authority: undefined }, { control: "external", authority: {} },
          { control: "external", authority: createOpenStateAuthority().authority, initialOpen: false }]) {
          assert.throws(() => openableFactory.create(scope, options));
          assert.equal(scope.lifecycle, "active");
        }
        const model = openableFactory.create(scope, { control: "internal" });
        assert.throws(() => model.subscribeOpenChange(null));
        assert.deepEqual(model.open(), { status: "changed" });
        scope.dispose();
        assert.throws(() => openableFactory.create(scope, { control: "internal" }));
      `);
    });
  });
});
