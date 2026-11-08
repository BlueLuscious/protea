import { fileURLToPath } from "node:url";
import { buildCore } from "./runtime/core-build.mjs";

await buildCore(fileURLToPath(new URL("../../", import.meta.url)));
