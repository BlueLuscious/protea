# Repository Tooling Reuse

Status: **Two repository consumers observed; extraction remains conditional**

Protea reuses architectural experience from Aster while retaining its own build and package
policy. This record identifies current origins and consumers; it defines no shared library,
new repository or production dependency.

## Current references and consumers

| Responsibility | Aster reference | Protea consumer and adaptation |
| --- | --- | --- |
| Package output ownership and guarded cleanup | Aster's [package-output cleaner](https://github.com/BlueLuscious/aster/blob/master/tooling/workspace/runtime/package-output.cleaner.mjs), [cleanup policy](https://github.com/BlueLuscious/aster/blob/master/tooling/workspace/runtime/package-output-cleanup.policy.mjs) and [entrypoint](https://github.com/BlueLuscious/aster/blob/master/tooling/workspace/clean-package-output.mjs). | [Core build entrypoint](../../../tooling/workspace/build-core.mjs): staged compilation, owned output hashes, preimage/link inspection and preservation of unknown files. This is an adapted responsibility, not a literal copy of Aster's filesystem implementation. |
| Public consumers without product source | Aster SVG's [clean consumer](https://github.com/BlueLuscious/aster/blob/master/packages/svg/tests/abi/clean-consumer.test.mjs). | [Core distribution tests](../../../tests/distribution/core-package.test.mjs): fresh local archive, actual included files, offline installation and public-root runtime/type consumers. Core identity, exports and compiler cases remain Protea policy. |
| Focused source lint and configuration formatting | Aster's root scripts and ESLint/Prettier configuration. | Protea's root commands use the same seven focused rules and manifest/configuration formatting scope, with explicit targets for its actual retained sources. |

The real repository consumers are Aster and Protea. Repeated responsibilities make containment,
owned-output inspection and clean public-package consumption candidates for later reuse; they
do not prove that every implementation detail is already interchangeable. Protea's local build
helpers and tests remain development tooling owned by Protea.

## Extraction conditions

Aster's [headless repository-tooling proposal](https://github.com/BlueLuscious/aster/blob/master/docs/en/future-capabilities.md#headless-repository-tooling-extraction)
requires actual repository consumers and keeps product policy outside any portable kernel.
A future shared package would be a development dependency only after its consumer boundaries,
ownership and guarantees are accepted. Neither product's runtime would acquire that dependency.

Package identities, supported compiler/resolution modes, included files, publication scope,
output directories, cleanup policy and test scenarios stay with their product owners. Extraction
must not copy the entire verifier tree, invent automatic rule discovery or combine contributor
tooling with a user-facing multi-product CLI. Current local helpers remain in place until an
actual replacement is implemented and qualified.
