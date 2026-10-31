# Repository Tooling

Status: **Contributor baseline configured; product suites and hosted automation not implemented**

This guide owns Protea's contributor toolchain, checking boundaries and repository automation.
The [project guide](../project/index.md) owns product responsibility and shared-rule adoption;
the [documentation index](../index.md) identifies the current authorities.

## Current verification

`pnpm run verify` runs the root lint and formatting checks in order. Both inspect actual repository
files; verification does not format or regenerate them. These checks do not validate links,
fragments, product behaviour or complete shared-rule conformance.

Documentary review still covers links and fragments, terminology, authority boundaries, present
versus proposed behaviour, whitespace and the complete retained change. There are no product
sources, type/runtime suites, build commands or CI workflows. Successful local checks establish
neither hosted CI evidence nor notification delivery or publication.

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

| Command                 | Responsibility                                                  |
| ----------------------- | --------------------------------------------------------------- |
| `pnpm run lint`         | Check the real ESLint configuration with zero warnings allowed. |
| `pnpm run format`       | Format the explicitly owned files below.                        |
| `pnpm run format:check` | Check the same formatting scope without writing.                |
| `pnpm run verify`       | Run lint, then the read-only formatting check.                  |

## Private authoring boundary

[tsconfig.base.json](../../../tsconfig.base.json) provides strict static checking with explicit ES2022 `target`
and `lib`, `module: "ESNext"`, `moduleResolution: "Bundler"`, `moduleDetection: "force"`,
`types: []`, `noEmit: true` and `skipLibCheck: false`. It also enables exact optional properties,
unchecked-index protection, consistent casing, unused-local and parameter rejection, switch
fallthrough rejection, explicit overrides, native class fields and verbatim module syntax.

This environment checks private authoring; ES2022 ESM here is not a product distribution promise.
Declaration prototypes and positive/negative examples must exist before a type gate is advertised;
their declarations remain checked. Empty compiler inputs provide no product conformance evidence.

Node-specific tooling receives separate configuration and ambient types when its inputs exist.
An explicit library list and `types: []` avoid automatic host-global inclusion; they do not forbid
explicit host imports or prove host independence. Those imports retain their own review boundary.

## Quality coverage

The lint command targets [eslint.config.mjs](../../../eslint.config.mjs) with `--max-warnings 0`,
checking semicolons, double-quoted strings,
braced control flow, strict equality and selected unsafe constructs. Parser configuration does
not establish current TypeScript inputs.

Formatting and its read-only check use the same explicit scope: `README.md`, authored Markdown
under `docs/en/`, `package.json`, `tsconfig.base.json`, `eslint.config.mjs` and `.prettierrc.json`.
Actual `.github/workflows/*.yaml` files will join that scope when implemented. The explicit targets
and [.prettierignore](../../../.prettierignore) keep dependency installations, contributor-local
records, the manager-owned lockfile and legal notice bytes outside formatting. Review unsupported
plain-text hygiene files separately; generated output needs its own boundary if introduced.

Architecture, link, build, type and test commands require real responsibilities and inputs.
None is advertised as an empty recursive gate or disabled suite.

Naming, complete JSDoc/comment policy, British English, semantic architecture, external validation
and prose truth require review. Automated checks prove only their stated coverage.

## Text and dependency hygiene

Owned text uses UTF-8, LF and a final newline. [Git attributes](../../../.gitattributes) select
`* text=auto eol=lf`, preserving binary detection. [Ignore configuration](../../../.gitignore)
owns dependency-installation and local delivery exclusions. No generated or cache exclusions
are needed yet.

[.prettierrc.json](../../../.prettierrc.json) sets `semi: true`, `singleQuote: false`, `tabWidth: 2`,
`trailingComma: "all"` and `endOfLine: "lf"`.

## Planned automation

CI will run a frozen installation and the real root gate independently on Ubuntu and Windows,
under the name `Continuous Integration`. It is not implemented or verified yet.

Discord is also pending. Reuse changes only Aster's display name to
`Protea Discord Notifications` and its secret identifier to `PROTEA_DISCORD_WEBHOOK`. Preserve
the event and branch filters, deletion notices, CI-completion trigger, payloads and existing
`Production`, `Development` and `Local` presentation labels. Those labels provide no independent
deployment evidence.

Source verification, operational configuration and live receipt remain separate. A skipped send
proves no receipt; live activation is outside the current source setup.
