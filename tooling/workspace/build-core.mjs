import { fileURLToPath } from "node:url";
import { buildCore } from "./runtime/package-build.mjs";

await buildCore(fileURLToPath(new URL("../../", import.meta.url)));
