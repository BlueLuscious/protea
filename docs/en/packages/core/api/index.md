# Core API

Status: **Public component and scope construction implemented**

The `src/api/` feature exposes frozen `Component` and `Scope` objects. Their public contracts
describe reusable definition preparation, independent instance creation and standalone scopes.

## Contracts and values

| Contract | Operation | Responsibility |
| --- | --- | --- |
| `ComponentApi` | `Component.define(input)` | Prepares a frozen definition from a `ComponentDefinitionInput`. |
| `ComponentApi` | `Component.create(definition, options)` | Creates an active instance with the exact prepared definition and the recipe's flat surface. |
| `ScopeApi` | `Scope.create()` | Creates an independent `ComponentScope` for cleanup ownership. |

`define` preserves the relationship between the recipe's options and its specific surface. Annotate
the setup context when the component expects options so TypeScript can infer the returned surface.
`create` requires the options argument unless its type accepts `undefined`. A recipe without options
uses the `void` default. Supplying only the options type as an explicit type argument uses the
default surface type. Inferring both parameters preserves the specific surface.

The return type combines `ComponentInstance` and the methods and properties returned by `setup`.
See the [component contracts](../component/index.md#contracts) and the
[construction runtime](../component/runtime/index.md) for validation, descriptors and failure rules.

## Usage

This definition requires a message for each creation.

```ts
import { Component, type ComponentSetupContext } from "@luscious-garden/protea-core";

const noticeDefinition = Component.define({
  identity: { namespace: "my-ui", name: "notice" },
  setup({ options }: ComponentSetupContext<{ message: string }>) {
    const message = options?.message;

    if (typeof message !== "string") {
      throw new TypeError("A notice message must be a string.");
    }

    return {
      get message() {
        return message;
      },
    };
  },
});

const notice = Component.create(noticeDefinition, { message: "Saved" });
notice.message;
notice.dispose();
```

The example captures the message per creation and leaves it readable after disposal. See the
[cleanup example](../component/index.md#construction-and-extension-boundary) for standalone scopes.

## Package exports

The public `"."` entry of `@luscious-garden/protea-core` exposes these runtime values:

- `Component`
- `Scope`
- `componentLifecycleStates`

The same entry exposes public feature contracts and types, as documented by the
[feature map](../index.md#documentation). Package feature and runtime imports are private.
The [Components API guide](../../components/api/index.md) covers the built-in Button and
capability entry points.
