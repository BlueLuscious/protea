import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withComponentsConsumer } from "../shared/core-candidate.mjs";

const authorityFixture = new URL("../shared/open-state-authority.mjs", import.meta.url).href;

test("Sidebar owns changeable logical presence through the packed public API", async (context) => {
  await withComponentsConsumer("protea-sidebar-runtime-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { Component } from "@luscious-garden/protea-core";
        import { Button, Modal, Sidebar } from "@luscious-garden/protea-components";
        import { createOpenStateAuthority } from ${JSON.stringify(authorityFixture)};
        ${source}
      `], consumer);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("both entries create independent models and the application can request opening through Button", () => {
      check(`
        const options = { control: "internal" };
        const sidebar = Sidebar.create(options);
        const explicit = Component.create(Sidebar.definition, options);
        options.initialOpen = true;

        assert.deepEqual(Sidebar.definition.identity, { namespace: "protea", name: "sidebar" });
        assert.notEqual(Sidebar.definition, Modal.definition);
        assert.notEqual(sidebar, explicit);
        for (const model of [sidebar, explicit]) {
          assert.equal(model.definition, Sidebar.definition);
          assert.equal(model.isOpen, false);
          assert.equal(model.lifecycle, "active");
          assert.deepEqual(Object.keys(model).sort(), [
            "close", "definition", "dispose", "isOpen", "lifecycle", "open", "subscribeOpenChange",
          ]);
        }
        assert.throws(() => Sidebar.create());
        assert.throws(() => Component.create(Sidebar.definition, { control: "floating" }));

        const button = Button.create();
        const changes = [];
        const release = sidebar.subscribeOpenChange((change) => { changes.push(change); });
        const outcomes = [];
        const disconnect = button.subscribeActivation(() => { outcomes.push(sidebar.open()); });
        assert.deepEqual(button.activate(), { status: "activated" });
        assert.deepEqual(outcomes, [{ status: "changed" }]);
        assert.deepEqual(changes, [{ previous: false, current: true }]);
        assert.equal(explicit.isOpen, false);

        assert.deepEqual(sidebar.close(), { status: "changed" });
        assert.equal(sidebar.lifecycle, "active");
        disconnect();
        release();
        assert.deepEqual(button.activate(), { status: "activated" });
        assert.deepEqual(outcomes, [{ status: "changed" }]);
        assert.equal(sidebar.isOpen, false);
        sidebar.dispose();
        assert.deepEqual(sidebar.open(), { status: "rejected", reason: "disposed" });
        assert.equal(button.lifecycle, "active");
        assert.equal(explicit.lifecycle, "active");
        assert.deepEqual(explicit.open(), { status: "changed" });
        assert.equal(explicit.isOpen, true);
        explicit.dispose();
        button.dispose();
      `);
    });

    await context.test("an application authority can coordinate distinct families without sharing their lifetimes", () => {
      check(`
        let permitted = false;
        const source = createOpenStateAuthority(true, { allow: () => permitted });
        const sidebar = Component.create(Sidebar.definition, { control: "external", authority: source.authority });
        const modal = Modal.create({ control: "external", authority: source.authority });
        const sidebarChanges = [];
        const modalChanges = [];
        const release = sidebar.subscribeOpenChange((change) => { sidebarChanges.push(change); });
        modal.subscribeOpenChange((change) => { modalChanges.push(change); });

        assert.deepEqual(sidebar.close(), { status: "rejected", reason: "denied" });
        assert.equal(sidebar.isOpen, true);
        assert.deepEqual(sidebarChanges, []);
        permitted = true;
        assert.deepEqual(sidebar.close(), { status: "changed" });
        assert.equal(modal.isOpen, false);
        assert.deepEqual(sidebarChanges, [{ previous: true, current: false }]);
        assert.deepEqual(modalChanges, sidebarChanges);

        sidebar.dispose();
        assert.equal(source.registrationCount(), 1);
        assert.equal(source.stats.disposals, 0);
        assert.equal(modal.lifecycle, "active");
        assert.equal(source.setOpen(true), true);
        const reads = source.stats.reads;
        assert.equal(sidebar.isOpen, false);
        assert.equal(source.stats.reads, reads);
        assert.deepEqual(modalChanges, [
          { previous: true, current: false }, { previous: false, current: true },
        ]);
        assert.equal(sidebarChanges.length, 1);
        release();
        modal.dispose();
        assert.equal(source.registrationCount(), 0);
      `);
    });

    await context.test("a failed physical release still ends requests and observations", () => {
      check(`
        const source = createOpenStateAuthority(true, { release() { throw new Error("Fixture release failed."); } });
        const sidebar = Sidebar.create({ control: "external", authority: source.authority });
        let observations = 0;
        const release = sidebar.subscribeOpenChange(() => { observations += 1; });

        assert.throws(() => sidebar.dispose());
        assert.equal(source.registrationCount(), 1);
        const reads = source.stats.reads;
        assert.equal(source.setOpen(false), true);
        assert.equal(sidebar.lifecycle, "disposed");
        assert.equal(sidebar.isOpen, true);
        assert.deepEqual(sidebar.close(), { status: "rejected", reason: "disposed" });
        assert.throws(() => sidebar.subscribeOpenChange(() => {}));
        assert.equal(source.stats.reads, reads);
        assert.deepEqual(source.stats.requests, []);
        assert.equal(observations, 0);
        release();
        release();
        assert.doesNotThrow(() => sidebar.dispose());
        assert.equal(source.stats.releases, 1);
      `);
    });
  });
});
