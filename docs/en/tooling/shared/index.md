# Shared Tooling

Status: **Temporary directory ownership implemented**

Shared tooling supplies private repository capabilities used by the workspace build and
its tests. The consumers choose what to create in each temporary directory.

## Temporary directories

| Function | Responsibility | Consumers |
| --- | --- | --- |
| `withTemporaryDirectory(prefix, operation)` | Creates one fresh directory under the resolved system temporary parent, runs the operation and releases the owned directory in `finally`. | [Workspace build](../../../../tooling/workspace/runtime/core-build.mjs), [build tests](../../../../tests/tooling/core-build.test.mjs) and [fresh package consumers](../../../../tests/shared/core-candidate.mjs). |

The [helper](../../../../tooling/shared/runtime/temporary-directory.mjs) accepts a semantic
lowercase prefix. The callback owns the directory and all entries it creates. Cleanup checks
the exact root's parent and refuses a symbolic link in place of the root. Within the root it
unlinks files and links, traverses ordinary directories and refuses unsupported entries.
Inspecting links bounds the cleanup under exclusive ownership. An external process mutating the
tree concurrently could invalidate those checks.

The [workspace guide](../workspace/index.md) owns policy for persistent package output.
