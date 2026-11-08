# Repository Tooling

Status: **Portable lifetime/capability runtime, build and public-consumer checks configured**

This guide owns contributor tools, actual commands and checking coverage. The
[project guide](../project/index.md) owns product responsibility; the
[core package tooling guide](core-package.md) owns production outputs and their filesystem boundary.

## Current verification

`pnpm run verify` runs six steps: focused lint, strict production type checking,
manifest/configuration formatting, tooling tests, runtime tests and fresh package consumers.
The tests build isolated candidates and use exactly owned system-temporary directories.
Verification therefore has filesystem effects even though lint, no-emit type checking and
format-check subcommands are read-only. The separate build command produces repository package
outputs when requested.

These checks cover declarations, bounded output production, package inclusion, public module/type
resolution and actual lifetime/opening/activation behaviour. Public runtime suites exercise the
built package through its root; they do not depend on an experimental source workspace. Type
consumers remain non-executed fixtures and prove their checked restrictions, not runtime semantics.

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
`packages/*`; their one actual member is the private core package.

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
| `pnpm run build` | Produce core JavaScript/declarations through the bounded output owner. |
| `pnpm run typecheck` | Strict no-emit checking of production contracts and runtime. |
| `pnpm run lint` | Check actual package, tooling, test and ESLint inputs with zero warnings. |
| `pnpm run format` | Format root/package manifests, Prettier configuration and ESLint configuration. |
| `pnpm run format:check` | Check that same explicit scope without writing. |
| `pnpm run test:tooling` | Exercise build ownership and failure boundaries using isolated candidates. |
| `pnpm run test:runtime` | Run `node --test tests/runtime/*.test.mjs` against freshly built public packages. |
| `pnpm run test:consumer` | Check fresh archives, inclusion, exports and clean runtime/type consumers. |
| `pnpm run verify` | Run lint, type checking, format checking, tooling tests, runtime tests and package consumers. |

The package build script invokes the same repository producer. No empty recursive gate, release
command or publication gate is advertised.

## Production type checking

The shared [strict baseline](../../../tsconfig.base.json) has explicit ES2022 libraries,
`types: []`, `skipLibCheck: false`, exact optional properties, checked indexed access,
unused-member checks and verbatim module syntax. Production configuration selects NodeNext
module/resolution rules and relative `.js` specifiers. Build configuration explicitly enables
JavaScript/declaration emission with `noEmitOnError`; checking remains a no-emit operation.
The [package guide](core-package.md) owns the producer and included files.

No automatic host ambient environment is included. Explicit imports and reference directives
still require review: library choices do not by themselves prohibit host dependencies.
Node-specific contributor tooling stays outside portable production contracts.

Public type fixtures are checked against fresh installed artefacts under NodeNext and Bundler
resolution. They cover component ownership, capability construction/options, results, vocabularies,
readonly views and unsupported operations. `@ts-expect-error` establishes that a diagnostic
occurred, not its intended cause; each retained negative case still needs review. Type
assignability cannot prove a state authority's synchrony, cleanup or semantic conformance.

## Runtime and distribution evidence

[Runtime suites](../../../tests/runtime/) exercise actual public factory results rather than
private implementation classes. The [component guide](../packages/core/component/index.md)
owns lifetime and cleanup guarantees; [capability guides](../packages/core/capabilities/index.md)
own request, authority, observation and setup rules.

Lifetime cases cover independent creation, deferred/duplicate obligations, invalid/terminal
registration, terminal-before-release observation, all attempts, opaque failure, repetition,
reentrancy, borrowing, early idempotent release and application-owned setup failure.
Opening/activation cases require both state modes, refusal/no-op distinctions, guard rechecks,
nested requests, source-driven changes, subscription mutation, callback errors, disposal during
requests/delivery, partial setup and independent or intentionally shared state.

The runtime selection includes component-scope, opening, activation and capability-composition
suites. Composition covers one lifetime with independent occupation/state, activation acceptance
versus a borrowed target's result, and terminal checks when another required release fails. These
are public workflow consumers, not concrete component-family implementations.

Each independently runnable consumer suite owns fresh build/package prerequisites and precisely
identified temporary roots. [Distribution checks](../../../tests/distribution/core-package.test.mjs)
pack actual included files, install offline and consume only the public manifest boundary.
Test-owned collaborators exercise borrowed contracts without introducing a public state store,
fake component family, framework adapter or manager.

Static, runtime, build and distribution evidence are separate. The suites establish no accessible
host interaction, rendered state, animation completion, SSR or framework compatibility.
Hosted results require exact-source readback.

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
