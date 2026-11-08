# Repository Tooling

Status: **Workspace, contract build and consumer checks configured; component runtime pending**

This guide owns contributor tools, actual commands and checking coverage. The
[project guide](../project/index.md) owns product responsibility; the
[core package tooling guide](core-package.md) owns production outputs and their filesystem boundary.

## Current verification

`pnpm run verify` runs focused lint, production type checking, remaining design type checking,
manifest/configuration formatting, tooling tests and fresh package-consumer tests. The tests build
isolated candidates and use exactly owned system-temporary directories; verification therefore
has filesystem effects even though the lint, type and format-check subcommands are read-only.
The separate build command produces repository package outputs when requested.

The current package contains contracts only. These checks exercise declaration validity,
bounded output production, package inclusion and public type/module resolution. They do not
execute component lifetime, opening or activation behaviour. Legacy examples remain non-executed.
Links, fragments, terminology, semantic architecture, complete JSDoc, British English, source/text
hygiene and prose truth retain manual review.

[Repository automation](automation/index.md) invokes this gate on its existing platforms.
A local result proves neither hosted success for the current revision, live notification receipt
nor registry publication.

## Selected contributor environment

| Authority | Selection |
| --- | --- |
| Node.js | `24.22.2`, in [.node-version](../../../.node-version). |
| Repository engine range | `>=24.22.2 <25`. |
| pnpm | `10.28.1`, pinned by `packageManager`. |
| TypeScript | `5.9.3`. |
| ESLint | `10.11.0`. |
| typescript-eslint | `8.70.1`. |
| Prettier | `3.9.8`. |

The private root [manifest](../../../package.json) owns contributor scripts and development
dependencies. [pnpm-lock.yaml](../../../pnpm-lock.yaml) owns generated resolution.
[pnpm-workspace.yaml](../../../pnpm-workspace.yaml) and root `workspaces` both select
`packages/*`; their one actual member is the private core package.

There is no production Node/DOM/framework dependency. Node runs contributor build/tests, using
its built-in test runner for current JavaScript tooling and distribution tests. `tsx` and Node
ambient types remain deferred until real executable TypeScript tests need them. Contributor
pins do not establish a portable package engine requirement or wider support matrix.

## Installation and commands

Use the exact Node and pnpm versions above, then from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run verify
```

| Command | Current responsibility |
| --- | --- |
| `pnpm run build` | Produce the core package's JavaScript/declarations through its bounded output owner. |
| `pnpm run typecheck` | Strict no-emit checking of production component contracts. |
| `pnpm run typecheck:design` | Check the 18 retained legacy capability inputs without emission or execution. |
| `pnpm run lint` | Check actual package, tooling, test, design and ESLint inputs with zero warnings. |
| `pnpm run format` | Format root/package manifests, Prettier configuration and ESLint configuration. |
| `pnpm run format:check` | Check that same explicit formatting scope without writing. |
| `pnpm run test:tooling` | Exercise real build ownership and failure boundaries using isolated candidates. |
| `pnpm run test:consumer` | Build fresh candidates and check actual package inclusion, exports and clean consumers. |
| `pnpm run verify` | Run lint, both type checks, format checking and both current test suites. |

The package build script invokes the same repository producer. No empty recursive runtime suite,
component test command, release command or publication gate is advertised.

## Production and legacy type checking

The shared [strict baseline](../../../tsconfig.base.json) has explicit ES2022 libraries,
`types: []`, `skipLibCheck: false`, exact optional properties, checked indexed access,
unused-member checks and verbatim module syntax. Actual production configuration selects
NodeNext module/resolution rules and relative `.js` specifiers. Build configuration explicitly
enables JavaScript/declaration emission with `noEmitOnError`; checking remains a no-emit operation.
The [package guide](core-package.md) owns the producer and included files.

No automatic host ambient environment is included. Explicit imports and reference directives
still require review: compiler library choices do not by themselves prohibit host dependencies.
Node-specific contributor tooling is separate from portable production contracts.

### Design authoring

The remaining [private workspace](../../../design/README.md) has 18 explicit TypeScript inputs:
17 shared/opening/activation source and entrypoint files, including two ambient vocabulary
descriptors, and one non-executed capability example. Its [configuration](../../../design/tsconfig.json)
extends the strict baseline with an explicit file list and empty `include`; it emits nothing.
The [legacy specification](../design/reusable-capabilities.md) owns retained semantics.

Foundation contracts now have one production owner. The legacy example imports the production
root source; this explicit transitional coupling adds five production files to the compiler
closure and is not a clean package-consumer check. Independent distribution tests exercise the
actual manifest instead. Concrete family declarations, ambient
family factories, the Sidebar union and three obsolete examples are retired.

Positive/negative capability examples check options, vocabulary discrimination, readonly views,
results, callbacks and structural composition. Two current negative cases protect absent runtime
vocabularies in the legacy entrypoints; they must become export evidence when real values exist.
There is no permanent negative-test-count target. `@ts-expect-error` establishes a diagnostic
occurred, not that it has the intended cause; diagnostic review remains separate.

Capabilities' production placement, construction and independent teardown/replacement remain
pending. The remaining prototypes must be retired with their implemented or deferred responsibilities,
rather than relocated into another declaration workspace.

## Lint and formatting coverage

[ESLint configuration](../../../eslint.config.mjs) applies the same focused rules as Aster:
`curly`, `eqeqeq`, `no-debugger`, `no-eval`, `no-unsafe-finally`, `quotes` and `semi`.
The root command checks actual sources under packages, tooling, tests and residual design plus
the configuration itself. These seven rules do not enforce all naming, architecture, JSDoc or
Garden policy.

Formatting deliberately follows Aster's narrow explicit scope:
`package.json`, `packages/*/package.json`, `.prettierrc.json` and `eslint.config.mjs`.
It checks neither TypeScript sources, Markdown, workflow YAML nor compiler configuration.
[Prettier configuration](../../../.prettierrc.json) uses semicolons, double quotes, two spaces,
trailing commas and `endOfLine: "auto"`; auto preserves detected line endings rather than
enforcing LF. Changes outside the command's scope still need review.

Owned text remains UTF-8 with LF and a final newline.
[Git attributes](../../../.gitattributes) select `* text=auto eol=lf`.
[Ignore rules](../../../.gitignore) preserve local records and dependency/generated-output
boundaries; [.prettierignore](../../../.prettierignore) preserves excluded legal, manager-owned
and contributor-local inputs. Formatting coverage is separate from these text policies.

## Tooling reuse

[Tooling reuse](reuse.md) records the actual Aster reference, current repository consumers and
conditions for possible future development-tool extraction. It creates no shared package or
product dependency. Each repository retains its own policy, output ownership and supported gates.

## Automation

The [automation guide](automation/index.md) owns exact CI/Discord sources and evidence boundaries.
Workflow formatting is now outside the formatter command; workflow review remains explicit.
Hosted results and live notification receipt need their own revision-specific evidence.
