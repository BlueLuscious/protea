import assert from "node:assert/strict";
import { access, mkdir, readFile, symlink, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { withTemporaryDirectory } from "../../tooling/shared/runtime/temporary-directory.mjs";
import { buildCore } from "../../tooling/workspace/runtime/core-build.mjs";
import { prepareCoreCandidate } from "../shared/core-candidate.mjs";

test("build replaces only unchanged owned output and removes retired emitted files", async () => {
  await withTemporaryDirectory("protea-core-output-test", async (root) => {
    const packageRoot = await prepareCoreCandidate(root);
    const retired = join(packageRoot, "src", "retired", "entry.ts");
    await mkdir(join(packageRoot, "src", "retired"));
    await writeFile(retired, "export const retiredValue = 1;\n");
    await buildCore(root);
    await access(join(packageRoot, "dist", "retired", "entry.js"));
    await unlink(retired);
    await buildCore(root);
    await assert.rejects(access(join(packageRoot, "dist", "retired")), { code: "ENOENT" });

    const manifest = join(packageRoot, ".build", "core-output.json");
    const previous = await readFile(manifest, "utf8");
    await buildCore(root);
    assert.equal(await readFile(manifest, "utf8"), previous);
    assert.equal(JSON.parse(previous).files.length, 68);
  });
});

test("unknown, modified and linked outputs are preserved by refusal", async (context) => {
  await withTemporaryDirectory("protea-core-guard-test", async (root) => {
    const packageRoot = await prepareCoreCandidate(root);
    await buildCore(root);
    const output = join(packageRoot, "dist");

    await context.test("unknown files", async () => {
      const unknown = join(output, "user-data.json");
      await writeFile(unknown, "owned by a different producer\n");
      await assert.rejects(buildCore(root), /unknown output file/u);
      assert.equal(await readFile(unknown, "utf8"), "owned by a different producer\n");
      await unlink(unknown);
    });

    await context.test("modified generated files", async () => {
      const entry = join(output, "index.js");
      const original = await readFile(entry, "utf8");
      await writeFile(entry, "maintainer modification\n");
      await assert.rejects(buildCore(root), /modified generated output/u);
      assert.equal(await readFile(entry, "utf8"), "maintainer modification\n");
      await writeFile(entry, original);
    });

    await context.test("nested links preserve their targets", async () => {
      const target = join(root, "borrowed");
      await mkdir(target);
      await writeFile(join(target, "keep.txt"), "preserve\n");
      const link = join(output, "borrowed");
      await symlink(target, link, process.platform === "win32" ? "junction" : "dir");
      await assert.rejects(buildCore(root), /symbolic output entry/u);
      assert.equal(await readFile(join(target, "keep.txt"), "utf8"), "preserve\n");
      await unlink(link);
    });

    await context.test("invalid ownership cannot escape the direct output", async () => {
      const outside = join(packageRoot, "outside.js");
      await writeFile(outside, "preserve\n");
      const manifest = join(packageRoot, ".build", "core-output.json");
      const original = await readFile(manifest, "utf8");
      const corrupted = JSON.parse(original);
      corrupted.files[0].path = "../outside.js";
      await writeFile(manifest, JSON.stringify(corrupted));
      await assert.rejects(buildCore(root), /invalid output ownership/u);
      assert.equal(await readFile(outside, "utf8"), "preserve\n");
      await writeFile(manifest, original);
    });
  });
});

test("a linked output root is never traversed", async () => {
  await withTemporaryDirectory("protea-core-root-link-test", async (root) => {
    const packageRoot = await prepareCoreCandidate(root);
    const borrowed = join(root, "borrowed");
    await mkdir(borrowed);
    await writeFile(join(borrowed, "keep.txt"), "preserve\n");
    await symlink(borrowed, join(packageRoot, "dist"), process.platform === "win32" ? "junction" : "dir");
    await assert.rejects(buildCore(root), /unsafe directory boundary/u);
    assert.equal(await readFile(join(borrowed, "keep.txt"), "utf8"), "preserve\n");
  });
});

test("failed compilation preserves the preceding output and ownership", async () => {
  await withTemporaryDirectory("protea-core-failure-test", async (root) => {
    const packageRoot = await prepareCoreCandidate(root);
    await buildCore(root);
    const output = join(packageRoot, "dist", "index.d.ts");
    const manifest = join(packageRoot, ".build", "core-output.json");
    const originalOutput = await readFile(output, "utf8");
    const originalManifest = await readFile(manifest, "utf8");
    await writeFile(join(packageRoot, "src", "invalid.ts"), "export const invalid: string = 1;\n");
    await assert.rejects(buildCore(root), /Core compilation failed/u);
    assert.equal(await readFile(output, "utf8"), originalOutput);
    assert.equal(await readFile(manifest, "utf8"), originalManifest);
  });
});
