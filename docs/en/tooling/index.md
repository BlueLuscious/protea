# Repository Tooling

Status: **Contributor baseline and private design checks configured; component runtime not implemented**

This guide owns Protea's contributor toolchain and checking boundaries.
The [project guide](../project/index.md) owns product responsibility and shared-rule adoption;
the [documentation index](../index.md) identifies the current authorities.

## Current verification

`pnpm run verify` runs lint, private design type checking and formatting checks in that order.
They inspect actual repository inputs without formatting, emitting or regenerating them. These
checks do not validate links, fragments, component behaviour or complete shared-rule conformance.

Documentary review still covers links and fragments, terminology, authority boundaries, present
versus proposed behaviour, whitespace and the complete retained change. The component foundation
has type declarations and non-executed consumption examples, but no runtime suite or product
build command. [Repository automation](automation/index.md)
orchestrates the same gate in CI and owns notification configuration. Successful local checks
establish neither hosted CI evidence nor notification delivery or publication.

## Selected toolchain

| Authority                     | Selection                                                       |
| ----------------------------- | --------------------------------------------------------------- |
| Node.js                       | `24.22.2`, recorded in [.node-version](../../../.node-version). |
| Compatible repository runtime | `engines.node: ">=24.22.2 <25"`.                                |
| Package manager               | `packageManager: "pnpm@10.28.1"`.                               |
| TypeScript                    | `5.9.3`.                                                        |
| ESLint                        | `10.11.0`.                                                      |
| typescript-eslint             | `8.70.1`.                                                       |
| Prettier                      | `3.9.8`.                                                        |

The root [package.json](../../../package.json) is private, named `protea`, and uses ESM contributor
configuration. It owns the compatible engine range, package-manager pin, commands and four exact
development dependencies. pnpm owns generated resolution in [pnpm-lock.yaml](../../../pnpm-lock.yaml).

Workspace membership and `pnpm-workspace.yaml` wait for a real package; a private design directory
need not be a package. Installed tools are development dependencies. There is no product runtime,
framework, Aster or Lilium dependency. Node ambient types, `tsx`, suites, cleaners and build
tooling wait for actual consumers. Node's runner with `tsx` is the selected starting point for
executable TypeScript tests.

These versions describe contributor infrastructure. They do not select future product package
names, exports, browser support, runtime requirements or distribution targets.

## Installation and commands

Use the exact Node runtime in `.node-version` and the pnpm executable pinned by `packageManager`.
From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run verify
```

| Command                     | Responsibility                                                                   |
| --------------------------- | -------------------------------------------------------------------------------- |
| `pnpm run lint`             | Check the ESLint configuration and design TypeScript with zero warnings allowed. |
| `pnpm run typecheck:design` | Check the explicit private design inputs strictly without emitting JavaScript.   |
| `pnpm run format`           | Format the explicitly owned files below.                                         |
| `pnpm run format:check`     | Check the same formatting scope without writing.                                 |
| `pnpm run verify`           | Run lint, design type checking, then the read-only formatting check.             |

## Private authoring boundary

[tsconfig.base.json](../../../tsconfig.base.json) provides strict static checking with explicit ES2022 `target`
and `lib`, `module: "ESNext"`, `moduleResolution: "Bundler"`, `moduleDetection: "force"`,
`types: []`, `noEmit: true` and `skipLibCheck: false`. It also enables exact optional properties,
unchecked-index protection, consistent casing, unused-local and parameter rejection, switch
fallthrough rejection, explicit overrides, native class fields and verbatim module syntax.

This is the selected private-authoring baseline; ES2022 ESM here is not a product distribution promise.
The private design configuration supplies real declarations and positive/negative examples;
declaration checking remains enabled. Empty compiler inputs provide no product conformance evidence.

Node-specific tooling receives separate configuration and ambient types when its inputs exist.
An explicit library list and `types: []` avoid automatic host-global inclusion; they do not forbid
explicit host imports or prove host independence. Those imports retain their own review boundary.

## Design authoring

The private [design workspace](../../../design/README.md) contains the first component prototype.
The [foundation design guide](../design/index.md) owns scope; the
[component foundation](../design/component-foundation.md) owns the retained lifetime semantics.
There is no public package or executable component implementation.

The authoring root is `design/`. The component's real responsibilities justify its feature-local
`contracts/`, `types/` and type-only `api/` entrypoint. Non-executed consumption examples live under
`design/examples/`. These paths do not establish packages or a future distribution layout.

[design/tsconfig.json](../../../design/tsconfig.json) extends the shared baseline and explicitly
lists four inputs: the component contract, lifecycle type, type-only entrypoint and component
foundation examples. Its empty `include` list prevents implicit input discovery. The inherited
`noEmit: true`, `skipLibCheck: false`, `types: []` and ES2022 library keep declaration checking
enabled and automatic host globals absent. Review explicit imports and reference directives
independently; these settings alone do not prohibit host dependencies.

`pnpm run typecheck:design` invokes `tsc --project design/tsconfig.json`. The root `verify` gate
includes it, so the existing Ubuntu and Windows CI sources invoke the same check. New hosted
results still need exact-source readback. Lint and formatting cover the actual design files.
No JavaScript, declaration output or product artefact is generated by verification.

The examples use declaration-only collaborators and must not be executed. Simple and interactive
fixture shapes independently provide the minimum lifetime members; assigning them to the root
contract checks that neither needs unrelated universal members. The fixture-local action is not
a product activation API. Positive cases check structural consumption and the selected lifecycle
values. Negative cases use narrowly explained `@ts-expect-error` directives for readonly writes,
unsupported members, invalid lifetime values, missing disposal and implicit host globals. A
directive fails when its line unexpectedly succeeds; checking the intended diagnostic still
requires review. Neither passing examples nor `void` method types prove synchronous disposal,
resource ownership, cleanup, idempotence or runtime immutability.

Reconciliation with later implementation-generated declarations remains a separate responsibility;
there must eventually be one current signature authority.

## Quality coverage

The lint command targets [eslint.config.mjs](../../../eslint.config.mjs) and `design/**/*.ts` with `--max-warnings 0`,
checking semicolons, double-quoted strings,
braced control flow, strict equality and selected unsafe constructs. Parser configuration
does not enforce every shared TypeScript rule.

Formatting and its read-only check use the same explicit scope: `README.md`, authored Markdown
under `docs/en/`, Markdown/TypeScript/JSON under `design/`, `package.json`, `tsconfig.base.json`, `eslint.config.mjs`, `.prettierrc.json` and
`.github/workflows/*.yaml`. The explicit targets and [.prettierignore](../../../.prettierignore)
keep dependency installations, contributor-local records, the manager-owned lockfile and legal
notice bytes outside formatting. Review unsupported
plain-text hygiene files separately; generated output needs its own boundary if introduced.

Further architecture, link, build and runtime-test commands require real responsibilities and
inputs. None is advertised as an empty recursive gate or disabled suite.

Naming, complete JSDoc/comment policy, British English, semantic architecture, external validation
and prose truth require review. Automated checks prove only their stated coverage.

## Text and dependency hygiene

Owned text uses UTF-8, LF and a final newline. [Git attributes](../../../.gitattributes) select
`* text=auto eol=lf`, preserving binary detection. [Ignore configuration](../../../.gitignore)
owns dependency-installation and local delivery exclusions. No generated or cache exclusions
are needed yet.

[.prettierrc.json](../../../.prettierrc.json) sets `semi: true`, `singleQuote: false`, `tabWidth: 2`,
`trailingComma: "all"` and `endOfLine: "lf"`.

## Repository automation

The [automation guide](automation/index.md) owns CI orchestration, Discord configuration and
execution/readback boundaries. Workflow files own exact event filters, action references and
payloads. Source verification, hosted CI, operational configuration and live receipt remain
separate evidence; a skipped notification send proves no receipt.
