import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withComponentsConsumer } from "../shared/core-candidate.mjs";

const authorityFixture = new URL("../shared/open-state-authority.mjs", import.meta.url).href;

test("Modal composes logical opening and an owned lifetime through the packed public API", async (context) => {
  await withComponentsConsumer("protea-modal-runtime-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { Component } from "@luscious-garden/protea-core";
        import { Button, Modal } from "@luscious-garden/protea-components";
        import { createOpenStateAuthority } from ${JSON.stringify(authorityFixture)};
        ${source}
      `], consumer);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("both creation entries preserve the definition and allocate independent live models", () => {
      check(`
        const options = { control: "internal", initialOpen: true };
        const family = Modal.create(options);
        const explicit = Component.create(Modal.definition, options);
        options.initialOpen = false;

        assert.deepEqual(Modal.definition.identity, { namespace: "protea", name: "modal" });
        assert.notEqual(family, explicit);
        for (const model of [family, explicit]) {
          assert.equal(model.definition, Modal.definition);
          assert.equal(model.lifecycle, "active");
          assert.equal(model.isOpen, true);
          assert.equal(Object.isSealed(model), true);
          assert.deepEqual(Object.keys(model).sort(), [
            "close", "definition", "dispose", "isOpen", "lifecycle", "open", "subscribeOpenChange",
          ]);
        }
        const closed = Modal.create({ control: "internal" });
        assert.equal(closed.isOpen, false);
        closed.dispose();
        assert.throws(() => Modal.create());
        assert.throws(() => Component.create(Modal.definition, {}));

        const changes = [];
        const { close, subscribeOpenChange } = family;
        const release = subscribeOpenChange((change) => {
          assert.equal(family.isOpen, change.current);
          changes.push(change);
        });
        assert.deepEqual(close(), { status: "changed" });
        assert.deepEqual(close(), { status: "unchanged" });
        assert.deepEqual(changes, [{ previous: true, current: false }]);
        assert.equal(explicit.isOpen, true);
        family.dispose();
        assert.deepEqual(family.open(), { status: "rejected", reason: "disposed" });
        assert.throws(() => family.subscribeOpenChange(() => {}));
        assert.equal(explicit.lifecycle, "active");
        assert.deepEqual(explicit.close(), { status: "changed" });
        assert.equal(explicit.isOpen, false);
        release();
        release();
        explicit.dispose();
      `);
    });

    await context.test("a borrowed authority provides requests and observations until disposal", () => {
      check(`
        let permitted = false;
        const source = createOpenStateAuthority(true, { allow: () => permitted });
        const modal = Modal.create({ control: "external", authority: source.authority });
        const changes = [];
        modal.subscribeOpenChange((change) => { changes.push(change); });
        assert.deepEqual(changes, []);
        assert.deepEqual(modal.open(), { status: "unchanged" });
        assert.deepEqual(modal.close(), { status: "rejected", reason: "denied" });
        assert.equal(modal.isOpen, true);
        assert.deepEqual(changes, []);

        permitted = true;
        assert.equal(source.setOpen(false), true);
        assert.deepEqual(modal.open(), { status: "changed" });
        assert.deepEqual(source.stats.requests, [false, true]);
        assert.deepEqual(changes, [{ previous: true, current: false }, { previous: false, current: true }]);
        modal.dispose();
        assert.deepEqual(source.stats.requests, [false, true]);
        assert.equal(source.stats.releases, 1);
        assert.equal(source.stats.disposals, 0);
        assert.equal(source.registrationCount(), 0);
        assert.equal(source.setOpen(false), true);
        assert.equal(modal.isOpen, true);
        assert.equal(changes.length, 2);
      `);
    });

    await context.test("failed setup releases its acquired connection while preserving a live sibling", () => {
      check(`
        let failOnRead;
        const source = createOpenStateAuthority(false, { onRead() {
          if (source.stats.reads === failOnRead) {
            throw new Error("Fixture read failed after registration.");
          }
        } });
        const options = { control: "external", authority: source.authority };
        const survivor = Modal.create(options);
        failOnRead = source.stats.reads + 2;
        let exposed;

        assert.throws(() => { exposed = Component.create(Modal.definition, options); });
        assert.equal(exposed, undefined);
        assert.equal(source.stats.subscriptions, 2);
        assert.equal(source.stats.releases, 1);
        assert.equal(source.registrationCount(), 1);
        assert.equal(source.stats.disposals, 0);
        assert.equal(survivor.lifecycle, "active");
        assert.deepEqual(survivor.open(), { status: "changed" });
        survivor.dispose();
        assert.equal(source.stats.releases, 2);
      `);
    });

    await context.test("failed physical disconnection leaves the model terminal and its projection inert", () => {
      check(`
        const source = createOpenStateAuthority(true, { release() { throw new Error("Fixture release failed."); } });
        let unrelatedCalls = 0;
        source.authority.subscribeOpenChange(() => { unrelatedCalls += 1; });
        const modal = Modal.create({ control: "external", authority: source.authority });
        let modalCalls = 0;
        const release = modal.subscribeOpenChange(() => { modalCalls += 1; });

        assert.throws(() => modal.dispose());
        const reads = source.stats.reads;
        assert.equal(source.registrationCount(), 2);
        source.setOpen(false);
        assert.equal(modal.lifecycle, "disposed");
        assert.equal(modal.isOpen, true);
        assert.deepEqual(modal.close(), { status: "rejected", reason: "disposed" });
        assert.equal(source.stats.reads, reads);
        assert.deepEqual(source.stats.requests, []);
        assert.equal(source.stats.disposals, 0);
        assert.equal(modalCalls, 0);
        assert.equal(unrelatedCalls, 1);
        release();
        assert.doesNotThrow(() => modal.dispose());
        assert.equal(source.stats.releases, 1);
      `);
    });

    await context.test("the application owns Button-to-Modal registration and the outcomes remain distinct", () => {
      check(`
        let allowClose = false;
        const source = createOpenStateAuthority(true, { allow: (next) => next || allowClose });
        const modal = Modal.create({ control: "external", authority: source.authority });
        const trigger = Button.create();
        const closeResults = [];
        const disconnect = trigger.subscribeActivation(() => { closeResults.push(modal.close()); });

        assert.deepEqual(trigger.activate(), { status: "activated" });
        assert.equal(modal.isOpen, true);
        allowClose = true;
        assert.deepEqual(trigger.activate(), { status: "activated" });
        assert.equal(modal.isOpen, false);
        assert.equal(modal.lifecycle, "active");
        assert.deepEqual(trigger.activate(), { status: "activated" });
        modal.dispose();
        assert.equal(trigger.lifecycle, "active");
        assert.deepEqual(trigger.activate(), { status: "activated" });
        disconnect();
        disconnect();
        assert.deepEqual(trigger.activate(), { status: "activated" });
        assert.deepEqual(closeResults, [
          { status: "rejected", reason: "denied" },
          { status: "changed" },
          { status: "unchanged" },
          { status: "rejected", reason: "disposed" },
        ]);
        trigger.dispose();
      `);
    });

    await context.test("a connection failure or trigger disposal preserves the target's ownership", () => {
      check(`
        const modal = Modal.create({ control: "internal", initialOpen: true });
        const expired = Button.create();
        expired.dispose();
        assert.throws(() => expired.subscribeActivation(() => { modal.close(); }));
        assert.equal(modal.isOpen, true);

        const trigger = Button.create();
        modal.subscribeOpenChange(() => { throw new Error("Fixture target observer failed."); });
        const disconnect = trigger.subscribeActivation(() => { modal.close(); });
        let otherCalls = 0;
        trigger.subscribeActivation(() => { otherCalls += 1; });
        assert.throws(() => trigger.activate());
        assert.equal(otherCalls, 1);
        assert.equal(modal.isOpen, false);
        trigger.dispose();
        disconnect();
        assert.equal(modal.lifecycle, "active");
        assert.deepEqual(trigger.activate(), { status: "rejected", reason: "disposed" });
        modal.dispose();
      `);
    });
  });
});
