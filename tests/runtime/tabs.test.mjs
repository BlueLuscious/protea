import assert from "node:assert/strict";
import test from "node:test";
import { runNode, withComponentsConsumer } from "../shared/core-candidate.mjs";

test("Tabs preserves local selection and panel association through the packed public API", async (context) => {
  await withComponentsConsumer("protea-tabs-runtime-test", async ({ consumer }) => {
    function check(source) {
      const result = runNode(["--input-type=module", "--eval", `
        import assert from "node:assert/strict";
        import { Component } from "@luscious-garden/protea-core";
        import { Tabs, tabsResultStatuses } from "@luscious-garden/protea-components/tabs";
        import { TabsDefinition } from "@luscious-garden/protea-components/definitions/tabs";

        const options = {
          tabs: [
            { key: "Preview", panelKey: "history" },
            { key: "history", panelKey: "note-history", disabled: false },
            { key: " blocked ", panelKey: " archived-panel ", disabled: true },
          ],
          initialTabKey: "Preview",
        };
        const changed = { status: tabsResultStatuses.changed };
        const unchanged = { status: tabsResultStatuses.unchanged };
        const rejected = (reason) => ({ status: tabsResultStatuses.rejected, reason });
        ${source}
      `], consumer);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(result.stdout, "");
      assert.equal(result.stderr, "");
    }

    await context.test("captures ordered records and keeps independent selections across both creation routes", () => {
      check(`
        const authored = options.tabs;
        const first = Tabs.create(options);
        const second = Component.create(TabsDefinition, options);
        const [preview, history, blocked] = first.tabs;
        assert.notEqual(first, second);
        assert.equal(first.definition, TabsDefinition);
        assert.equal(second.definition, Tabs.definition);
        assert.notEqual(first.tabs, authored);
        assert.notEqual(first.tabs, second.tabs);
        assert.notEqual(preview, authored[0]);
        assert.equal(Object.isFrozen(first.tabs), true);
        assert.equal(first.tabs.every(Object.isFrozen), true);

        authored[0].key = "replaced";
        authored[1].panelKey = "replacement-panel";
        authored[2].disabled = false;
        authored.reverse();
        options.initialTabKey = "history";
        assert.deepEqual(first.tabs.map((tab) => tab.key), ["Preview", "history", " blocked "]);
        assert.equal(blocked.panelKey, " archived-panel ");
        assert.equal(first.activeTab, preview);
        assert.equal(preview.panelKey, "history");

        const observations = [];
        first.subscribeSelectionChange((change) => {
          assert.equal(Object.isFrozen(change), true);
          assert.equal(change.previous, preview);
          assert.equal(change.current, history);
          assert.equal(first.activeTab, change.current);
          assert.equal(first.activeTab.panelKey, "note-history");
          observations.push(change);
        });
        assert.deepEqual(first.requestSelection("Preview"), unchanged);
        assert.deepEqual(first.requestSelection(" blocked "), rejected("denied"));
        assert.deepEqual(observations, []);
        assert.deepEqual(first.requestSelection("history"), changed);
        assert.equal(observations.length, 1);
        first.dispose();
        assert.equal(observations.length, 1);
        assert.equal(first.activeTab, history);
        assert.equal(first.tabs[0], preview);
        assert.equal(second.lifecycle, "active");
        assert.equal(second.activeTab.key, "Preview");
        second.dispose();
      `);
    });

    await context.test("distinguishes malformed configuration and requests from unknown or disabled initial keys", () => {
      check(`
        for (const invalid of [
          undefined, null, [], {}, { tabs: options.tabs },
          { ...options, initialTabKey: "" },
          { ...options, initialTabKey: 0 },
          { ...options, tabs: null },
          { ...options, tabs: [] },
          { ...options, tabs: new Array(1) },
          { ...options, tabs: [null] },
          { ...options, tabs: [{ key: "Preview" }] },
          { ...options, tabs: [{ key: "Preview", panelKey: "" }] },
          { ...options, tabs: [{ key: "", panelKey: "note-preview" }] },
          { ...options, tabs: [{ key: "Preview", panelKey: "note-preview", disabled: undefined }] },
          { ...options, tabs: [{ key: "Preview", panelKey: "note-preview", disabled: 1 }] },
          { ...options, tabs: [...options.tabs, { key: "Preview", panelKey: "other" }] },
          { ...options, tabs: [...options.tabs, { key: "other", panelKey: "history" }] },
        ]) {
          assert.throws(() => Tabs.create(invalid), TypeError);
        }
        for (const initialTabKey of ["missing", " blocked "]) {
          assert.throws(() => Component.create(TabsDefinition, { ...options, initialTabKey }), RangeError);
        }

        const model = Tabs.create(options);
        for (const malformed of [undefined, null, 1, ""]) {
          assert.throws(() => model.requestSelection(malformed), TypeError);
        }
        assert.throws(() => model.requestSelection("preview"), RangeError);
        assert.throws(() => model.requestSelection("blocked"), RangeError);
        assert.throws(() => model.subscribeSelectionChange(null), TypeError);
        assert.equal(model.activeTab.key, "Preview");
        model.dispose();
      `);
    });

    await context.test("attempts eligible observations after failure and clears request occupation", () => {
      check(`
        const model = Tabs.create(options);
        const calls = [];
        const nested = [];
        const first = model.subscribeSelectionChange(() => {
          calls.push("first");
          nested.push(model.requestSelection(null), model.requestSelection("history"));
          throw new Error("Observer failed.");
        });
        const observer = ({ current }) => { calls.push(current.key); };
        const duplicate = model.subscribeSelectionChange(observer);
        model.subscribeSelectionChange(observer);
        assert.throws(() => model.requestSelection("history"));
        assert.deepEqual(calls, ["first", "history", "history"]);
        assert.deepEqual(nested, [rejected("busy"), rejected("busy")]);
        assert.equal(model.activeTab, model.tabs[1]);
        first();
        duplicate();
        duplicate();
        assert.deepEqual(model.requestSelection("Preview"), changed);
        assert.deepEqual(calls, ["first", "history", "history", "Preview"]);
        model.dispose();
      `);
    });

    await context.test("preserves a committed selection when disposal stops pending delivery", () => {
      check(`
        const model = Tabs.create(options);
        const calls = [];
        const release = model.subscribeSelectionChange(({ current }) => {
          calls.push(current.key);
          model.dispose();
          assert.deepEqual(model.requestSelection(null), rejected("disposed"));
        });
        model.subscribeSelectionChange(() => { calls.push("unexpected"); });
        assert.deepEqual(model.requestSelection("history"), changed);
        assert.deepEqual(calls, ["history"]);
        assert.equal(model.lifecycle, "disposed");
        assert.equal(model.activeTab, model.tabs[1]);
        assert.equal(model.activeTab.panelKey, "note-history");
        assert.deepEqual(model.requestSelection("missing"), rejected("disposed"));
        assert.throws(() => model.subscribeSelectionChange(() => {}));
        release();
        release();
        model.dispose();
      `);
    });
  });
});
