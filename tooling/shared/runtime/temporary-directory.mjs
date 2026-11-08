import { lstat, mkdtemp, readdir, rmdir, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

/**
 * @description Removes entries of an exactly owned temporary directory without following links.
 * @param {string} directory - Inspected directory inside the owned temporary root.
 * @returns {Promise<void>} Completion after the directory is empty.
 */
async function removeEntries(directory) {
  for (const entry of await readdir(directory)) {
    const target = join(directory, entry);
    const information = await lstat(target);

    if (information.isSymbolicLink() || information.isFile()) {
      await unlink(target);
    } else if (information.isDirectory()) {
      await removeEntries(target);
      await rmdir(target);
    } else {
      throw new Error(`Refusing to remove an unsupported temporary entry: ${target}`);
    }
  }
}

/**
 * @description Checks and releases the exact temporary root created by the owning operation.
 * @param {string} root - Exact directory returned by temporary creation.
 * @param {string} temporaryParent - Previously resolved system-temporary parent.
 * @returns {Promise<void>} Completion after the owned root is absent.
 */
async function releaseTemporaryRoot(root, temporaryParent) {
  if (dirname(resolve(root)) !== temporaryParent || (await lstat(root)).isSymbolicLink()) {
    throw new Error(`Refusing to remove an unexpected temporary root: ${root}`);
  }

  await removeEntries(root);
  await rmdir(root);
}

/**
 * @description Runs an operation in one fresh system-temporary root and releases only that root.
 * @remarks The operation owns its root exclusively. Link inspection does not establish isolation
 * from hostile concurrent filesystem mutation.
 * @param {string} prefix - Lowercase semantic prefix for identifying the operation.
 * @param {(directory: string) => Promise<unknown>} operation - Operation owning every created entry.
 * @returns {Promise<unknown>} The operation's result after bounded cleanup.
 */
export async function withTemporaryDirectory(prefix, operation) {
  if (!/^[a-z][a-z-]*$/.test(prefix)) {
    throw new Error("Temporary directory prefixes must be semantic lowercase names");
  }

  const temporaryParent = resolve(tmpdir());
  const root = await mkdtemp(join(temporaryParent, `${prefix}-`));

  try {
    return await operation(root);
  } finally {
    await releaseTemporaryRoot(root, temporaryParent);
  }
}
