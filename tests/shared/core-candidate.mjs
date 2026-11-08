import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFile, cp, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));

export async function prepareCoreCandidate(root) {
  const target = join(root, "packages", "core");
  await mkdir(target, { recursive: true });
  await copyFile(join(repositoryRoot, "tsconfig.base.json"), join(root, "tsconfig.base.json"));

  for (const name of ["package.json", "tsconfig.json", "tsconfig.build.json", "README.md", "LICENSE"]) {
    await copyFile(join(repositoryRoot, "packages", "core", name), join(target, name));
  }

  await cp(join(repositoryRoot, "packages", "core", "src"), join(target, "src"), { recursive: true });
  return target;
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
