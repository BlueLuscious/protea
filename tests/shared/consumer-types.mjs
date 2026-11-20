import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { runNode } from "./core-candidate.mjs";

export async function checkConsumerTypes(consumer, sources) {
  for (const [name, source] of Object.entries(sources)) {
    await writeFile(join(consumer, name), source);
  }

  const compiler = createRequire(import.meta.url).resolve("typescript/bin/tsc");
  const project = join(consumer, "tsconfig.json");

  for (const resolution of ["NodeNext", "Bundler"]) {
    const options = {
      target: "ES2022", lib: ["ES2022"], types: [], strict: true, skipLibCheck: false,
      exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true,
      noUnusedLocals: true, noUnusedParameters: true, verbatimModuleSyntax: true,
      noEmit: true, module: resolution === "NodeNext" ? "NodeNext" : "ESNext", moduleResolution: resolution,
    };
    await writeFile(project, JSON.stringify({ compilerOptions: options, files: Object.keys(sources) }));
    const checked = runNode([compiler, "--project", project, "--pretty", "false"], consumer);
    assert.equal(checked.status, 0, `${resolution}\n${checked.stdout}\n${checked.stderr}`);
  }
}
