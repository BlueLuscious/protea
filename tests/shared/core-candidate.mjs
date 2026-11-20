import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFile, cp, mkdir, symlink, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { withTemporaryDirectory } from "../../tooling/shared/runtime/temporary-directory.mjs";
import { buildComponents, buildCore } from "../../tooling/workspace/runtime/package-build.mjs";

export const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));

async function copyPackage(root, name) {
  const source = join(repositoryRoot, "packages", name);
  const target = join(root, "packages", name);
  await mkdir(target, { recursive: true });

  for (const file of ["package.json", "tsconfig.json", "tsconfig.build.json", "README.md", "LICENSE"]) {
    await copyFile(join(source, file), join(target, file));
  }

  await cp(join(source, "src"), join(target, "src"), { recursive: true });
  return target;
}

export async function prepareCoreCandidate(root) {
  await copyFile(join(repositoryRoot, "tsconfig.base.json"), join(root, "tsconfig.base.json"));
  return copyPackage(root, "core");
}

export async function prepareComponentsCandidate(root) {
  for (const file of ["package.json", "pnpm-workspace.yaml"]) {
    await copyFile(join(repositoryRoot, file), join(root, file));
  }

  return copyPackage(root, "components");
}

export async function linkCoreCandidate(root) {
  const workspaceScope = join(root, "packages", "components", "node_modules", "@luscious-garden");
  await mkdir(workspaceScope, { recursive: true });
  await symlink(join(root, "packages", "core"), join(workspaceScope, "protea-core"), "junction");
}

export function runNode(arguments_, cwd, environment = {}) {
  const result = spawnSync(process.execPath, arguments_, {
    cwd,
    env: { ...process.env, ...environment },
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  assert.equal(result.error, undefined);
  return result;
}

export function runPnpm(arguments_, cwd, temporaryRoot) {
  assert.ok(process.env.npm_execpath, "Run this suite through the pinned pnpm script");
  const result = runNode([process.env.npm_execpath, ...arguments_], cwd, {
    XDG_CACHE_HOME: join(temporaryRoot, "cache"),
    XDG_STATE_HOME: join(temporaryRoot, "state"),
    npm_config_cache: join(temporaryRoot, "npm-cache"),
    npm_config_update_notifier: "false",
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return result;
}

function packCandidate(root, packageRoot, archives) {
  const packed = runPnpm(["--dir", packageRoot, "pack", "--pack-destination", archives, "--json"], root, root);
  return JSON.parse(packed.stdout).filename;
}

async function installConsumer(consumer, temporaryRoot, packageArchives, overriddenDependency) {
  await mkdir(consumer);
  const dependencies = Object.fromEntries(
    Object.entries(packageArchives).map(([name, archive]) => [name, `file:../archives/${basename(archive)}`]),
  );
  const manifest = {
    name: "protea-packed-consumer",
    private: true,
    type: "module",
    dependencies,
  };

  if (overriddenDependency !== undefined) {
    manifest.pnpm = { overrides: { [overriddenDependency]: dependencies[overriddenDependency] } };
  }

  await writeFile(join(consumer, "package.json"), JSON.stringify(manifest));
  runPnpm([
    "--dir", consumer, "install", "--offline", "--ignore-scripts", "--frozen-lockfile=false",
    "--store-dir", join(temporaryRoot, "store"),
  ], temporaryRoot, temporaryRoot);
}

export async function withCoreConsumer(prefix, operation) {
  return withTemporaryDirectory(prefix, async (root) => {
    const packageRoot = await prepareCoreCandidate(root);
    await buildCore(root);
    const archives = join(root, "archives");
    await mkdir(archives);
    const archive = packCandidate(root, packageRoot, archives);
    const consumer = join(root, "consumer");
    await installConsumer(consumer, root, { "@luscious-garden/protea-core": archive });
    const installed = join(consumer, "node_modules", "@luscious-garden", "protea-core");
    return operation({ root, packageRoot, consumer, installed });
  });
}

export async function withComponentsConsumer(prefix, operation) {
  return withTemporaryDirectory(prefix, async (root) => {
    const candidate = join(root, "candidate");
    await mkdir(candidate);
    const coreRoot = await prepareCoreCandidate(candidate);
    const packageRoot = await prepareComponentsCandidate(candidate);
    await buildCore(candidate);

    await linkCoreCandidate(candidate);
    await buildComponents(candidate);

    const archives = join(root, "archives");
    await mkdir(archives);
    const coreArchive = packCandidate(root, coreRoot, archives);
    const componentsArchive = packCandidate(root, packageRoot, archives);
    const consumer = join(root, "consumer");
    await installConsumer(consumer, root, {
      "@luscious-garden/protea-core": coreArchive,
      "@luscious-garden/protea-components": componentsArchive,
    }, "@luscious-garden/protea-core");

    const installedScope = join(consumer, "node_modules", "@luscious-garden");
    return operation({
      root,
      packageRoot,
      consumer,
      installed: join(installedScope, "protea-components"),
      installedCore: join(installedScope, "protea-core"),
    });
  });
}
