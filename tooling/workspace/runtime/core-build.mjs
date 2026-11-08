import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { copyFile, lstat, mkdir, readFile, readdir, rmdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { withTemporaryDirectory } from "../../shared/runtime/temporary-directory.mjs";

/** @description Exact package identity accepted by this repository-owned producer. */
const packageName = "@luscious-garden/protea-core";

/** @description Canonical repository command recorded in generated ownership metadata. */
const producerCommand = "node tooling/workspace/build-core.mjs";

/**
 * @description Reads a filesystem entry without following its target, allowing absence only.
 * @param {string} path - Exact entry to inspect.
 * @returns {Promise<import("node:fs").Stats | undefined>} Existing entry information.
 */
async function inspect(path) {
  try {
    return await lstat(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      return undefined;
    }

    throw error;
  }
}

/**
 * @description Rejects symbolic or non-directory boundaries before filesystem mutation.
 * @param {string} path - Exact directory boundary.
 * @param {boolean} optional - Whether absence is permitted.
 * @returns {Promise<void>} Completion after the boundary is accepted.
 */
async function checkDirectory(path, optional = false) {
  const information = await inspect(path);

  if (information === undefined && optional) {
    return;
  }

  if (information === undefined || information.isSymbolicLink() || !information.isDirectory()) {
    throw new Error(`Refusing an unsafe directory boundary: ${path}`);
  }
}

/**
 * @description Lists regular output entries without traversing symbolic links or junctions.
 * @param {string} root - Accepted output root.
 * @param {string} directory - Current directory inside that root.
 * @returns {Promise<{files: string[], directories: string[]}>} Relative slash-separated entries.
 */
async function listEntries(root, directory = root) {
  const files = [];
  const directories = [];

  for (const entry of await readdir(directory)) {
    const target = join(directory, entry);
    const information = await lstat(target);
    const name = relative(root, target).split(sep).join("/");

    if (information.isSymbolicLink()) {
      throw new Error(`Refusing a symbolic output entry: ${target}`);
    }

    if (information.isDirectory()) {
      directories.push(name);
      const nested = await listEntries(root, target);
      files.push(...nested.files);
      directories.push(...nested.directories);
    } else if (information.isFile()) {
      files.push(name);
    } else {
      throw new Error(`Refusing an unsupported output entry: ${target}`);
    }
  }

  return { files: files.sort(), directories: directories.sort() };
}

/**
 * @description Computes the producer's immutable preimage identifier for one output.
 * @param {string} path - Regular file previously inspected without following links.
 * @returns {Promise<string>} Lowercase SHA-256 digest.
 */
async function digest(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

/**
 * @description Validates one producer-relative path before resolving an output or deleting it.
 * @param {string} path - Candidate slash-separated output name.
 * @returns {boolean} Whether the path is a supported relative emitted file.
 */
function isOutputPath(path) {
  return typeof path === "string" && !path.includes("\\") &&
    path.split("/").every((part) => part !== "" && part !== "." && part !== ".." && !part.includes(":")) &&
    (path.endsWith(".js") || path.endsWith(".d.ts"));
}

/**
 * @description Reads and validates previously generated output ownership.
 * @param {string} manifestPath - Exact producer metadata path.
 * @returns {Promise<{path: string, sha256: string}[]>} Previously owned files, or no initial ownership.
 */
async function readOwnership(manifestPath) {
  const information = await inspect(manifestPath);

  if (information === undefined) {
    return [];
  }

  if (!information.isFile() || information.isSymbolicLink()) {
    throw new Error("Refusing an unsafe output ownership manifest");
  }

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  if (manifest.version !== 1 || manifest.package !== packageName || manifest.producer !== producerCommand || !Array.isArray(manifest.files) ||
    manifest.files.some((entry) => !isOutputPath(entry.path) || !/^[a-f0-9]{64}$/.test(entry.sha256)) ||
    new Set(manifest.files.map((entry) => entry.path)).size !== manifest.files.length) {
    throw new Error("Refusing invalid output ownership metadata");
  }

  return manifest.files;
}

/**
 * @description Verifies that existing output contains only unchanged producer-owned entries.
 * @param {string} output - Exact direct package output directory.
 * @param {{path: string, sha256: string}[]} ownership - Previous producer preimages.
 * @returns {Promise<void>} Completion without modifying any retained file.
 */
async function checkPreimages(output, ownership) {
  if (await inspect(output) === undefined) {
    return;
  }

  await checkDirectory(output);
  const entries = await listEntries(output);
  const owned = new Map(ownership.map((entry) => [entry.path, entry.sha256]));

  for (const name of entries.directories) {
    if (!ownership.some((entry) => entry.path.startsWith(`${name}/`))) {
      throw new Error(`Refusing an unknown output directory: ${name}`);
    }
  }

  for (const name of entries.files) {
    if (!owned.has(name)) {
      throw new Error(`Refusing an unknown output file: ${name}`);
    }

    if (await digest(join(output, name)) !== owned.get(name)) {
      throw new Error(`Refusing a modified generated output: ${name}`);
    }
  }
}

/**
 * @description Builds the one accepted core package through staged emission and guarded replacement.
 * @remarks Unknown, modified or linked output is preserved by refusal. The metadata owns only its
 * listed files; output replacement is not a cross-file transaction or protection from hostile races.
 * @param {string} repositoryRoot - Explicit repository or isolated candidate root containing core.
 * @returns {Promise<void>} Completion after fresh outputs and their ownership record are written.
 */
export async function buildCore(repositoryRoot) {
  const root = resolve(repositoryRoot);
  const packageRoot = join(root, "packages", "core");
  const output = join(packageRoot, "dist");
  const metadata = join(packageRoot, ".build");
  const manifestPath = join(metadata, "core-output.json");

  for (const boundary of [root, join(root, "packages"), packageRoot]) {
    await checkDirectory(boundary);
  }

  await checkDirectory(metadata, true);
  await checkDirectory(output, true);

  const packageManifest = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));

  if (packageManifest.name !== packageName) {
    throw new Error("Refusing to build an unexpected package identity");
  }

  const ownership = await readOwnership(manifestPath);
  await checkPreimages(output, ownership);

  await withTemporaryDirectory("protea-core-build", async (temporaryRoot) => {
    const staged = join(temporaryRoot, "dist");
    const compiler = createRequire(import.meta.url).resolve("typescript/bin/tsc");
    const result = spawnSync(process.execPath, [compiler, "--project", join(packageRoot, "tsconfig.build.json"),
      "--outDir", staged, "--pretty", "false"], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });

    if (result.error !== undefined || result.status !== 0) {
      throw new Error(`Core compilation failed:\n${result.error?.message ?? ""}${result.stdout}${result.stderr}`);
    }

    await checkDirectory(staged);
    const emitted = await listEntries(staged);

    if (!emitted.files.includes("index.js") || !emitted.files.includes("index.d.ts") ||
      emitted.files.some((name) => !isOutputPath(name))) {
      throw new Error("Core emission must contain real JavaScript and declaration entrypoints only");
    }

    const files = await Promise.all(emitted.files.map(async (path) => ({ path, sha256: await digest(join(staged, path)) })));
    await checkDirectory(metadata, true);
    await checkPreimages(output, ownership);
    await mkdir(output, { recursive: true });

    for (const entry of ownership) {
      if (await inspect(join(output, entry.path)) !== undefined) {
        await unlink(join(output, entry.path));
      }
    }

    const previousDirectories = new Set(ownership.flatMap((entry) => {
      const parts = entry.path.split("/");
      return parts.slice(1).map((_, index) => parts.slice(0, index + 1).join("/"));
    }));

    for (const directory of [...previousDirectories].sort((left, right) => right.length - left.length)) {
      if (await inspect(join(output, directory)) !== undefined) {
        await rmdir(join(output, directory));
      }
    }

    for (const entry of files) {
      await mkdir(dirname(join(output, entry.path)), { recursive: true });
      await copyFile(join(staged, entry.path), join(output, entry.path));
    }

    await mkdir(metadata, { recursive: true });
    await writeFile(manifestPath, `${JSON.stringify({ version: 1, package: packageName, producer: producerCommand, files }, null, 2)}\n`);
  });
}
