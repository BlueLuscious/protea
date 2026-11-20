import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { runNode, withComponentsConsumer } from "../shared/core-candidate.mjs";
import { checkConsumerTypes } from "../shared/consumer-types.mjs";

test("packed Components borrows the installed Core and exposes only the implemented values", async () => {
  await withComponentsConsumer("protea-components-consumer-test", async ({ consumer, installed, installedCore }) => {
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
    assert.deepEqual(Object.keys(manifest.exports), ["."]);
    assert.deepEqual(manifest.dependencies, { "@luscious-garden/protea-core": coreManifest.version });
    assert.equal(manifest.peerDependencies, undefined);
    assert.equal(manifest.optionalDependencies, undefined);

    const runtime = runNode(["--input-type=module", "--eval", `
      import assert from "node:assert/strict";
      import { createRequire } from "node:module";
      import { fileURLToPath } from "node:url";
      import { Component } from "@luscious-garden/protea-core";
      const components = await import("@luscious-garden/protea-components");
      const componentsEntry = import.meta.resolve("@luscious-garden/protea-components");
      const resolveComponentsDependency = createRequire(componentsEntry);
      assert.equal(
        resolveComponentsDependency.resolve("@luscious-garden/protea-core"),
        fileURLToPath(import.meta.resolve("@luscious-garden/protea-core")),
      );
      assert.deepEqual(Object.keys(components).sort(), [
        "Activation", "Button", "Opening", "activatableResultStatuses", "capabilityRejectionReasons", "openableResultStatuses",
      ]);
      assert.equal(typeof components.Activation.create, "function");
      assert.equal(typeof components.Opening.create, "function");
      assert.deepEqual(components.openableResultStatuses, { changed: "changed", unchanged: "unchanged", rejected: "rejected" });
      assert.deepEqual(components.activatableResultStatuses, { activated: "activated", rejected: "rejected" });
      assert.deepEqual(components.capabilityRejectionReasons, { disposed: "disposed", busy: "busy", denied: "denied" });
      for (const value of Object.values(components)) { assert.equal(Object.isFrozen(value), true); }

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

      for (const suffix of [
        "api", "capabilities", "capabilities/openable", "components", "components/button", "components/modal",
        "components/sidebar", "shared", "package.json", "dist/index.js", "dist/api/button.api.js",
        "dist/shared/runtime/observation-listeners.js", "dist/components/button/runtime/button.component.js",
      ]) {
        await assert.rejects(import("@luscious-garden/protea-components/" + suffix), { code: "ERR_PACKAGE_PATH_NOT_EXPORTED" });
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
