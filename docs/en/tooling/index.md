# Repository Tooling

Status: **Core and Components build and verification commands**

`tooling/` contains private contributor infrastructure for building and verifying the Protea
workspace. The [project guide](../project/index.md) owns product responsibility.

## Features

| Feature | Responsibility |
| --- | --- |
| [Shared](shared/index.md) | Provides bounded temporary directories for builds and isolated tests. |
| [Workspace](workspace/index.md) | Builds Core before Components and checks package output ownership. |

## Current verification

`pnpm run verify` runs six steps: focused lint, strict production type checking,
manifest/configuration formatting, tooling tests, runtime tests and fresh package consumers.
The tests build isolated candidates in owned system-temporary directories. Root `typecheck`
prepares Core's package output so Components can resolve its declarations, then checks both
packages without emission. Lint and format checks read source and manifests. The separate build
command also produces Components output.

The [workspace guide](workspace/index.md#tests) covers output ownership checks.
[Core quality](../packages/core/quality.md#checks) covers the Core-only consumer, and
[Components quality](../packages/components/quality.md#checks) covers consumers of both archives.

Links, fragments, terminology, semantic architecture, complete JSDoc, British English, source/text
hygiene and prose truth retain manual review. [Repository automation](automation/index.md) invokes
the same gate on its configured platforms. Local results establish neither exact-source hosted
success, live notification receipt nor registry publication.

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
`packages/*`. The two private package members are Core and Components.

There is no production Node/DOM/framework dependency. Node's built-in runner executes current
`.mjs` tooling, runtime and distribution tests; they need neither `tsx` nor Node ambient types.
Those tools require actual executable TypeScript inputs before introduction. Contributor pins
do not establish a portable package engine requirement or broader support matrix.

## Installation and commands

Use the exact Node and pnpm versions above, then from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run verify
```

| Command | Current responsibility |
| --- | --- |
| `pnpm run build` | Produce JavaScript and declarations for Core, then Components through [workspace tooling](workspace/index.md). |
| `pnpm run typecheck` | Build Core, then run strict no-emit checking for both production projects. |
| `pnpm run lint` | Check actual package, tooling, test and ESLint inputs with zero warnings. |
| `pnpm run format` | Format root/package manifests, Prettier configuration and ESLint configuration. |
| `pnpm run format:check` | Check that same explicit scope without writing. |
| `pnpm run test:tooling` | Exercise build ownership and failure boundaries using isolated candidates. |
| `pnpm run test:runtime` | Run `node --test tests/runtime/*.test.mjs` against freshly built public packages. |
| `pnpm run test:consumer` | Run the Core-only and Components-plus-Core packed consumer suites. |
| `pnpm run verify` | Run lint, type checking, format checking, tooling tests, runtime tests and package consumers. |

The Core package build script can build the foundation by itself. The Components package build
script invokes the same dependency-ordered build as the repository command.

## Production type checking

The shared [strict baseline](../../../tsconfig.base.json) has explicit ES2022 libraries,
`types: []`, `skipLibCheck: false`, exact optional properties, checked indexed access,
unused-member checks and verbatim module syntax. Production configuration selects NodeNext
module/resolution rules and relative `.js` specifiers. Build configuration explicitly enables
JavaScript and declaration emission with `noEmitOnError`. The two compiler checks run without
emission after the Core build prerequisite.
The [workspace guide](workspace/index.md) owns the producer and included files.

No automatic host ambient environment is included. Explicit imports and reference directives
still require review: library choices do not by themselves prohibit host dependencies.
Node-specific contributor tooling stays outside portable production contracts.

Public type fixtures use fresh installed artefacts under NodeNext and Bundler resolution.
Package-specific type, runtime and distribution evidence belongs to
[Core quality](../packages/core/quality.md) and [Components quality](../packages/components/quality.md).

## Lint and formatting coverage

[ESLint configuration](../../../eslint.config.mjs) applies Aster's same focused seven rules:
`curly`, `eqeqeq`, `no-debugger`, `no-eval`, `no-unsafe-finally`, `quotes` and `semi`.
The command checks actual sources under packages, tooling and tests plus the configuration.
It does not enforce all naming, architecture, JSDoc or Garden policy.

Formatting follows Aster's explicit narrow scope:
`package.json`, `packages/*/package.json`, `.prettierrc.json` and `eslint.config.mjs`.
It checks neither TypeScript sources, Markdown, workflow YAML nor compiler configuration.
[Prettier configuration](../../../.prettierrc.json) uses semicolons, double quotes, two spaces,
trailing commas and `endOfLine: "auto"`; auto preserves detected line endings instead of
enforcing LF. Files outside this scope still need review.

Owned text remains UTF-8 with LF and a final newline.
[Git attributes](../../../.gitattributes) select `* text=auto eol=lf`.
[Ignore rules](../../../.gitignore) preserve local records and dependency/generated-output
boundaries; [.prettierignore](../../../.prettierignore) preserves excluded legal, manager-owned
and contributor-local inputs. Formatting coverage is distinct from these policies.

## Reuse and automation

[Tooling reuse](reuse.md) records Aster origins, actual repository consumers and conditional
development-tool extraction. It creates no shared package or product dependency.
The [automation guide](automation/index.md) owns exact CI/Discord sources and evidence boundaries.
Workflow formatting remains outside the formatter command; hosted results and live receipt
retain their own revision-specific evidence.
