import { fileURLToPath } from "node:url";
import { buildComponents, buildCore } from "./runtime/package-build.mjs";

/** @description Workspace root containing the linked Core and Components packages. */
const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));

await buildCore(repositoryRoot);
await buildComponents(repositoryRoot);
