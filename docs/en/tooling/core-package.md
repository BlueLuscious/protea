# Core Package Baseline

Status: **Selected production baseline; package, build and runtime checks not yet implemented**

This guide owns the selected tooling and distribution requirements for the first portable core.
The [core foundation guide](../project/core-foundation.md) owns product scope and construction.
The [repository tooling guide](index.md) still owns the actual commands and contributor pins;
this selection adds no executable script, dependency or support claim by itself.

## Identity and distribution

| Subject                          | Selection                                                                                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Source owner                     | `packages/core/`, organised by real component, shared-capability, opening and activation responsibilities.                                                                                 |
| Package name                     | `@luscious-garden/protea-core`; selected identity, with no claim of registry reservation or availability.                                                                                  |
| Initial version and visibility   | `0.0.0` and `private: true` while establishing the product. Publication/version release requires separate work and authority.                                                              |
| Runtime format                   | ESM only, with `type: "module"`; no CommonJS build or UMD/browser bundle.                                                                                                                  |
| Language and libraries           | ECMAScript 2022 output and standard ES2022 libraries, with no implicit Node, DOM or framework environment.                                                                                 |
| TypeScript production resolution | `module: "NodeNext"`, `moduleResolution: "NodeNext"` and explicit relative `.js` specifiers, retaining strictness and checked declarations.                                                |
| Producer and outputs             | TypeScript emission from production sources to package-owned `dist/`, producing JavaScript and `.d.ts` files. No maps or committed generated outputs initially.                            |
| Public boundary                  | One root export. Its `types` condition selects `dist/index.d.ts`; `import` and `default` select the same `dist/index.js`. No wildcard, public subpath or private runtime path is selected. |
| Package inclusion                | Current built `dist/` plus package metadata, introduction and licence; no tests, prototypes, local plans, caches or contributor installation.                                              |
| Dependencies                     | No production dependency is required by the selected scope. Compiler/test/tooling dependencies stay at their actual development owner.                                                     |

Feature-local contracts, types, runtime and API owners do not allocate public subpaths or npm
packages. The root entrypoint intentionally re-exports the selected consumer surface; it must not
advertise unavailable factories while implementation is incomplete. Stateless factory objects and
immutable vocabularies introduce no eager component instance, subscription, host effect or mutable
global runtime. Marking package imports free of side effects requires checking those actual sources.

The selected production checker retains `strict`, `skipLibCheck: false` and `types: []` with
`lib: ["ES2022"]`. Build configuration explicitly enables emission instead of inheriting the
private authoring configuration's `noEmit` setting accidentally. Separate no-emit checks from producing outputs;
enable `noEmitOnError` and exclude tests and prototypes from the distribution producer. Node-oriented resolution validates
portable ESM specifiers; it does not authorise Node APIs inside the core.

## Support and qualification boundary

The selected runtime contract is standard ES2022 JavaScript consumed as ESM. Initial concrete
execution qualification uses the repository's pinned Node 24.22.2 on its existing Ubuntu/Windows
CI platforms. Declaration consumers use TypeScript 5.9.3, checked under both NodeNext and Bundler
resolution. These are qualification targets for future tests, not results already obtained.

Do not copy the contributor's Node engine range into the portable package as an intrinsic runtime
dependency. Broader Node versions, browsers, concrete bundlers, frameworks, SSR and compatibility
ranges require their own evidence before advertising support. Having no DOM imports demonstrates
neither rendered accessibility nor execution in every web environment.

## Checks and real consumers

The following are required evidence owners to introduce when their inputs exist, not commands
that can be run in the current repository:

- Strict production and test checking, including the generated declarations and meaningful valid/
  invalid consumers. Keep Node test/tooling ambient types in their own configuration.
- A real build with bounded output ownership. Clean only the exact package output after containment
  and link inspection; never treat source, unrelated files or borrowed targets as generated.
- Runtime tests using Node's runner with `tsx` as the selected starting point. Introduce `tsx`
  and Node ambient types only with those real inputs, without a new test framework by default.
- Lifetime regressions for terminal-before-release behaviour, all cleanup attempts, failures,
  repeated/reentrant finalisation, partial setup, borrowing and independent instances.
- Capability regressions for both authority modes, refusals/no-ops, guards, callback order and
  subscription mutation, commitment/disposal interaction, cleanup failure and intentional sharing.
- Public runtime and type consumers using fresh artefacts through the actual manifest/export map.
  A local package archive/clean installation may prove file inclusion without registry publication.
  Consumers must not resolve TypeScript source aliases, private paths or inherited installations.

Keep successful type checking, semantic runtime proof, output production, distribution conformance
and hosted CI distinct. A clean consumer/build check must produce the outputs it examines or own
explicit current prerequisites; stale artefacts supply no evidence. Negative cases from the old
prototype must protect a present restriction, not forbid newly implemented runtime values.

## Root verification and documentation

During migration, root lint, type checking and formatting must cover real retained production and
remaining experimental inputs, with a working gate at each step. CI already invokes root `verify`;
it must eventually exercise the meaningful package checks rather than keep a removed design gate.
If verification builds outputs, replace its current read-only/no-emission claim with its actual
owned effects, distinguishing read-only subchecks from emission. Do not weaken coverage or invent
a platform matrix, empty suite, notification receipt or hosted pass.

Update README, documentation/project/tooling/automation indexes, affected semantic guides and
package introductions alongside each implementation. Real package guides belong under
`docs/en/packages/core/`, with feature semantics and rationale at their respective owners.
Remove root `design/`, its obsolete command/configuration/globs and every current dependency or
link to it once migrated. Filesystem, references, compiler inputs, built file sets and clean public
consumers must all agree before qualifying the completed product.
