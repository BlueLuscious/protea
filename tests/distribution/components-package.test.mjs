import assert from "node:assert/strict";
import { access, lstat, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { runNode, withComponentsConsumer } from "../shared/core-candidate.mjs";
import { checkConsumerTypes } from "../shared/consumer-types.mjs";

test("packed Components borrows the installed Core and exposes only the implemented values", async () => {
  await withComponentsConsumer("protea-components-consumer-test", async ({ packageRoot, consumer, installed, installedCore }) => {
    const entries = (await readdir(installed)).sort();
    assert.deepEqual(entries, ["LICENSE", "README.md", "dist", "package.json"]);
    await assert.rejects(access(join(installed, "src")), { code: "ENOENT" });
    assert.deepEqual((await readdir(join(installed, "dist"))).sort(), ["api", "capabilities", "components", "index.d.ts", "index.js", "shared"]);

    const manifest = JSON.parse(await readFile(join(installed, "package.json"), "utf8"));
    const coreManifest = JSON.parse(await readFile(join(installedCore, "package.json"), "utf8"));
    assert.equal(manifest.name, "@luscious-garden/protea-components");
    assert.equal(manifest.version, "0.0.0");
    assert.equal(manifest.type, "module");
    assert.equal(manifest.private, true);
    const publicEntries = {
      ".": "index",
      "./capabilities": "api/capabilities/index",
      "./capabilities/*": "api/capabilities/*.api",
      "./definitions": null,
      "./definitions/*": "components/*/definitions/*.definition",
      "./*": "api/families/*.api",
    };
    assert.deepEqual(Object.keys(manifest.exports).sort(), Object.keys(publicEntries).sort());
    for (const [entry, target] of Object.entries(publicEntries)) {
      const conditions = manifest.exports[entry];
      if (target === null) {
        assert.equal(conditions, null);
        continue;
      }
      assert.deepEqual(Object.keys(conditions), ["types", "import", "default"]);
      assert.deepEqual(conditions, {
        types: `./dist/${target}.d.ts`,
        import: `./dist/${target}.js`,
        default: `./dist/${target}.js`,
      });
    }
    await access(join(installed, manifest.exports["."].types));
    await access(join(installed, manifest.exports["."].import));
    await access(join(installed, manifest.exports["./capabilities"].types));
    await access(join(installed, manifest.exports["./capabilities"].import));

    const familiesRoot = join(packageRoot, "src", "components");
    const families = await readdir(familiesRoot, { withFileTypes: true });
    assert.ok(families.length > 0);
    for (const family of families.sort((left, right) => left.name.localeCompare(right.name))) {
      assert.equal(family.isSymbolicLink(), false);
      assert.equal(family.isDirectory(), true);
      assert.match(family.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
      const definitionDirectory = await lstat(join(familiesRoot, family.name, "definitions"));
      assert.equal(definitionDirectory.isSymbolicLink(), false);
      assert.equal(definitionDirectory.isDirectory(), true);
      const targets = [
        `api/families/${family.name}.api`,
        `components/${family.name}/definitions/${family.name}.definition`,
      ];
      for (const target of targets) {
        const source = await lstat(join(packageRoot, "src", `${target}.ts`));
        assert.equal(source.isSymbolicLink(), false);
        assert.equal(source.isFile(), true);
        await access(join(installed, "dist", `${target}.js`));
        await access(join(installed, "dist", `${target}.d.ts`));
      }
      const definitions = await readdir(join(installed, "dist", "components", family.name, "definitions"), { withFileTypes: true });
      assert.deepEqual(definitions.map((entry) => entry.name).sort(), [
        `${family.name}.definition.d.ts`, `${family.name}.definition.js`,
      ]);
      for (const definition of definitions) {
        assert.equal(definition.isSymbolicLink(), false);
        assert.equal(definition.isFile(), true);
      }
    }
    const emittedFamilies = await readdir(join(installed, "dist", "api", "families"), { withFileTypes: true });
    assert.deepEqual(emittedFamilies.map((entry) => entry.name).sort(), families.flatMap((family) => [
      `${family.name}.api.d.ts`, `${family.name}.api.js`,
    ]).sort());
    for (const entry of emittedFamilies) {
      assert.equal(entry.isSymbolicLink(), false);
      assert.equal(entry.isFile(), true);
    }
    const emittedCapabilities = await readdir(join(installed, "dist", "api", "capabilities"), { withFileTypes: true });
    assert.deepEqual(emittedCapabilities.map((entry) => entry.name).sort(), [
      "activation.api", "checking.api", "index", "opening.api",
    ].flatMap((name) => [`${name}.d.ts`, `${name}.js`]).sort());
    for (const entry of emittedCapabilities) {
      assert.equal(entry.isSymbolicLink(), false);
      assert.equal(entry.isFile(), true);
    }
    assert.deepEqual(manifest.dependencies, { "@luscious-garden/protea-core": coreManifest.version });
    assert.equal(manifest.peerDependencies, undefined);
    assert.equal(manifest.optionalDependencies, undefined);

    const runtime = runNode(["--input-type=module", "--eval", `
      import assert from "node:assert/strict";
      import { createRequire } from "node:module";
      import { fileURLToPath } from "node:url";
      import { Component, Scope } from "@luscious-garden/protea-core";
      const components = await import("@luscious-garden/protea-components");
      const componentsEntry = import.meta.resolve("@luscious-garden/protea-components");
      const resolveComponentsDependency = createRequire(componentsEntry);
      assert.equal(
        resolveComponentsDependency.resolve("@luscious-garden/protea-core"),
        fileURLToPath(import.meta.resolve("@luscious-garden/protea-core")),
      );
      assert.deepEqual(Object.keys(components).sort(), [
        "Activation", "Button", "Checking", "Modal", "Opening", "Select", "Sidebar", "Switch", "Tabs",
        "activatableResultStatuses", "capabilityRejectionReasons", "checkableResultStatuses", "openableResultStatuses",
        "selectResultStatuses", "tabsResultStatuses",
      ]);
      assert.equal(typeof components.Activation.create, "function");
      assert.equal(typeof components.Checking.create, "function");
      assert.equal(typeof components.Opening.create, "function");
      assert.equal(typeof components.Switch.create, "function");
      assert.deepEqual(components.openableResultStatuses, { changed: "changed", unchanged: "unchanged", rejected: "rejected" });
      assert.deepEqual(components.checkableResultStatuses, { changed: "changed", unchanged: "unchanged", rejected: "rejected" });
      assert.deepEqual(components.activatableResultStatuses, { activated: "activated", rejected: "rejected" });
      assert.deepEqual(components.capabilityRejectionReasons, { disposed: "disposed", busy: "busy", denied: "denied" });
      for (const value of Object.values(components)) { assert.equal(Object.isFrozen(value), true); }

      const capabilities = await import("@luscious-garden/protea-components/capabilities");
      assert.deepEqual(Object.keys(capabilities).sort(), [
        "Activation", "Checking", "Opening", "activatableResultStatuses", "capabilityRejectionReasons",
        "checkableResultStatuses", "openableResultStatuses",
      ]);
      for (const name of Object.keys(capabilities)) {
        assert.equal(capabilities[name], components[name]);
        assert.equal(Object.isFrozen(capabilities[name]), true);
      }
      const capabilityEntries = {};
      for (const [name, expected] of [
        ["activation", ["Activation", "activatableResultStatuses"]],
        ["checking", ["Checking", "checkableResultStatuses"]],
        ["opening", ["Opening", "openableResultStatuses"]],
      ]) {
        const entry = await import("@luscious-garden/protea-components/capabilities/" + name);
        assert.deepEqual(Object.keys(entry).sort(), expected);
        for (const key of expected) {
          assert.equal(entry[key], capabilities[key]);
          assert.equal(entry[key], components[key]);
        }
        capabilityEntries[name] = entry;
      }
      const capabilityScope = Scope.create();
      const activation = capabilityEntries.activation.Activation.create(capabilityScope);
      const opening = capabilityEntries.opening.Opening.create(capabilityScope, { control: "internal" });
      const checking = capabilityEntries.checking.Checking.create(capabilityScope, { control: "internal" });
      assert.deepEqual(activation.activate(), { status: "activated" });
      assert.deepEqual(opening.open(), { status: "changed" });
      assert.equal(checking.isChecked, false);
      assert.deepEqual(checking.requestChecked(true), { status: "changed" });
      assert.equal(opening.isOpen, true);
      capabilityScope.dispose();
      assert.deepEqual(activation.activate(), { status: "rejected", reason: "disposed" });
      assert.deepEqual(opening.close(), { status: "rejected", reason: "disposed" });
      assert.deepEqual(checking.requestChecked(false), { status: "rejected", reason: "disposed" });

      const button = components.Button.create({ initialDisabled: true });
      const explicit = Component.create(components.Button.definition, { initialDisabled: true });
      assert.equal(button.definition, components.Button.definition);
      assert.equal(explicit.definition, button.definition);
      assert.deepEqual(button.definition.identity, { namespace: "protea", name: "button" });
      assert.notEqual(explicit, button);
      assert.equal(Object.isSealed(button), true);
      assert.equal(Object.isSealed(explicit), true);
      assert.equal(button.lifecycle, "active");
      assert.equal(explicit.lifecycle, "active");
      assert.deepEqual(button.activate(), { status: "rejected", reason: "denied" });
      assert.deepEqual(explicit.activate(), { status: "rejected", reason: "denied" });
      button.setDisabled(false);
      assert.equal(explicit.isDisabled, true);
      assert.deepEqual(button.activate(), { status: "activated" });
      button.dispose();
      assert.deepEqual(button.activate(), { status: "rejected", reason: "disposed" });
      assert.equal(explicit.lifecycle, "active");
      explicit.setDisabled(false);
      assert.deepEqual(explicit.activate(), { status: "activated" });
      explicit.dispose();
      assert.deepEqual(explicit.activate(), { status: "rejected", reason: "disposed" });

      for (const name of ["Button", "Modal", "Sidebar", "Switch"]) {
        const family = name.toLowerCase();
        const entry = await import("@luscious-garden/protea-components/" + family);
        const definitions = await import("@luscious-garden/protea-components/definitions/" + family);
        const definitionName = name + "Definition";
        assert.deepEqual(Object.keys(entry), [name]);
        assert.deepEqual(Object.keys(definitions), [definitionName]);

        const api = entry[name];
        const definition = definitions[definitionName];
        assert.equal(api, components[name]);
        assert.equal(definition, api.definition);
        assert.equal(Object.isFrozen(api), true);
        assert.equal(Object.isFrozen(definition), true);
        assert.equal(Object.isFrozen(definition.identity), true);
        assert.deepEqual(definition.identity, { namespace: "protea", name: family });

        const options = name === "Button" ? { initialDisabled: true } : { control: "internal" };
        const convenient = api.create(options);
        const direct = Component.create(definition, options);
        assert.notEqual(convenient, direct);
        assert.equal(convenient.definition, definition);
        assert.equal(direct.definition, definition);
        assert.equal(convenient.lifecycle, "active");
        assert.equal(direct.lifecycle, "active");

        if (name === "Button") {
          convenient.setDisabled(false);
          assert.equal(direct.isDisabled, true);
          assert.deepEqual(convenient.activate(), { status: "activated" });
          convenient.dispose();
          assert.deepEqual(convenient.activate(), { status: "rejected", reason: "disposed" });
          assert.equal(direct.lifecycle, "active");
          direct.setDisabled(false);
          assert.deepEqual(direct.activate(), { status: "activated" });
        } else if (name === "Switch") {
          assert.deepEqual(convenient.requestChecked(true), { status: "changed" });
          assert.equal(direct.isChecked, false);
          convenient.dispose();
          assert.deepEqual(convenient.requestChecked(false), { status: "rejected", reason: "disposed" });
          assert.equal(direct.lifecycle, "active");
          assert.deepEqual(direct.requestChecked(true), { status: "changed" });
        } else {
          assert.deepEqual(convenient.open(), { status: "changed" });
          assert.equal(direct.isOpen, false);
          convenient.dispose();
          assert.deepEqual(convenient.close(), { status: "rejected", reason: "disposed" });
          assert.equal(direct.lifecycle, "active");
          assert.deepEqual(direct.open(), { status: "changed" });
        }

        assert.equal(convenient.lifecycle, "disposed");
        direct.dispose();
        assert.equal(direct.lifecycle, "disposed");
      }

      const selectEntry = await import("@luscious-garden/protea-components/select");
      const selectDefinitions = await import("@luscious-garden/protea-components/definitions/select");
      assert.deepEqual(Object.keys(selectEntry), ["Select", "selectResultStatuses"]);
      assert.deepEqual(Object.keys(selectDefinitions), ["SelectDefinition"]);
      assert.equal(selectEntry.Select, components.Select);
      assert.equal(selectEntry.selectResultStatuses, components.selectResultStatuses);
      assert.deepEqual(selectEntry.selectResultStatuses, { changed: "changed", unchanged: "unchanged", rejected: "rejected" });
      assert.equal(selectDefinitions.SelectDefinition, components.Select.definition);
      assert.equal(Object.isFrozen(selectDefinitions.SelectDefinition), true);
      assert.deepEqual(selectDefinitions.SelectDefinition.identity, { namespace: "protea", name: "select" });
      function selectionAuthority(initial) {
        let selectedValue = initial;
        const listeners = new Set();
        return {
          get selectedValue() { return selectedValue; },
          requestSelection(next) {
            if (selectedValue === next) return true;
            const change = { previous: selectedValue, current: next };
            selectedValue = next;
            for (const listener of listeners) listener(change);
            return true;
          },
          subscribeSelectionChange(listener) { listeners.add(listener); return () => listeners.delete(listener); },
        };
      }
      const selectOptions = [{ value: "light" }, { value: "dark" }, { value: "system" }];
      const convenientSelect = selectEntry.Select.create({ options: selectOptions, authority: selectionAuthority("system") });
      const directSelect = Component.create(selectDefinitions.SelectDefinition, { options: selectOptions, authority: selectionAuthority("light") });
      assert.equal(convenientSelect.definition, selectDefinitions.SelectDefinition);
      assert.equal(directSelect.definition, convenientSelect.definition);
      assert.notEqual(convenientSelect, directSelect);
      assert.deepEqual(convenientSelect.requestSelection("dark"), { status: "changed" });
      assert.equal(directSelect.selectedValue, "light");
      convenientSelect.dispose();
      assert.deepEqual(convenientSelect.requestSelection("light"), { status: "rejected", reason: "disposed" });
      assert.equal(directSelect.lifecycle, "active");
      assert.deepEqual(directSelect.requestSelection("system"), { status: "changed" });
      directSelect.dispose();

      const tabsEntry = await import("@luscious-garden/protea-components/tabs");
      const tabsDefinitions = await import("@luscious-garden/protea-components/definitions/tabs");
      assert.deepEqual(Object.keys(tabsEntry), ["Tabs", "tabsResultStatuses"]);
      assert.deepEqual(Object.keys(tabsDefinitions), ["TabsDefinition"]);
      assert.equal(tabsEntry.Tabs, components.Tabs);
      assert.equal(tabsEntry.tabsResultStatuses, components.tabsResultStatuses);
      assert.deepEqual(tabsEntry.tabsResultStatuses, { changed: "changed", unchanged: "unchanged", rejected: "rejected" });
      const tabsDefinition = tabsDefinitions.TabsDefinition;
      assert.equal(tabsDefinition, tabsEntry.Tabs.definition);
      assert.equal(Object.isFrozen(tabsDefinition), true);
      assert.equal(Object.isFrozen(tabsDefinition.identity), true);
      assert.deepEqual(tabsDefinition.identity, { namespace: "protea", name: "tabs" });
      const tabsOptions = {
        tabs: [{ key: "preview", panelKey: "note-preview" }, { key: "history", panelKey: "note-history" }],
        initialTabKey: "preview",
      };
      const convenientTabs = tabsEntry.Tabs.create(tabsOptions);
      const directTabs = Component.create(tabsDefinition, tabsOptions);
      assert.equal(convenientTabs.definition, tabsDefinition);
      assert.equal(directTabs.definition, tabsDefinition);
      assert.notEqual(directTabs, convenientTabs);
      assert.deepEqual(convenientTabs.requestSelection("history"), { status: "changed" });
      assert.equal(convenientTabs.activeTab.panelKey, "note-history");
      assert.equal(directTabs.activeTab.panelKey, "note-preview");
      convenientTabs.dispose();
      assert.equal(directTabs.lifecycle, "active");
      directTabs.dispose();

      await assert.rejects(import("@luscious-garden/protea-components/definitions"), { code: "ERR_PACKAGE_PATH_NOT_EXPORTED" });
      for (const suffix of [
        "api", "capabilities/openable", "components", "components/button", "components/modal",
        "components/sidebar", "components/switch", "capabilities/checkable", "shared", "package.json", "dist/index.js",
        "dist/api/button.api.js", "dist/api/checking.api.js", "dist/api/modal.api.js", "dist/api/sidebar.api.js", "dist/api/switch.api.js",
        "dist/capabilities/openable/runtime/internal/openable-surface.js",
        "dist/shared/runtime/observation-listeners.js", "dist/components/button/runtime/button.component.js",
        "definitions/unknown", "instances/button", "button/runtime", "unknown", "opening", "checking", "activation",
        "api/button.api", "components/button/definitions/button.definition",
        "api/families/button.api", "dist/api/families/button.api.js",
        "capabilities/shared", "capabilities/index", "capabilities/index.js", "capabilities/activation.api",
        "capabilities/contracts/activation-api.contract", "capabilities/activatable/runtime/activatable",
        "api/capabilities/activation.api", "dist/api/capabilities/index.js", "dist/api/capabilities/activation.api.js",
        "components/modal/definitions/modal.definition", "components/sidebar/definitions/sidebar.definition",
        "components/switch/definitions/switch.definition", "definitions/button.definition.js",
        "dist/components/button/definitions/button.definition.js", "dist/components/modal/definitions/modal.definition.js",
        "dist/components/sidebar/definitions/sidebar.definition.js", "dist/components/switch/definitions/switch.definition.js",
        "components/select", "components/select/definitions/select.definition", "api/families/select.api",
        "dist/components/select/definitions/select.definition.js", "dist/components/select/runtime/select.component.js",
        "components/tabs", "components/tabs/definitions/tabs.definition", "api/families/tabs.api",
        "dist/components/tabs/definitions/tabs.definition.js", "dist/components/tabs/runtime/tabs.component.js",
      ]) {
        await assert.rejects(import("@luscious-garden/protea-components/" + suffix), { code: "ERR_MODULE_NOT_FOUND" });
      }
    `], consumer);
    assert.equal(runtime.status, 0, `${runtime.stdout}\n${runtime.stderr}`);
    assert.equal(runtime.stdout, "");
    assert.equal(runtime.stderr, "");

    await checkConsumerTypes(consumer, {
      "capability-consumer.ts": await readFile(new URL("./capability-consumer.test.ts", import.meta.url), "utf8"),
      "family-consumer.ts": await readFile(new URL("./family-consumer.test.ts", import.meta.url), "utf8"),
    });
  });
});
