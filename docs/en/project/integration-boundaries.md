# Integration Boundaries

Status: **Local web example and prospective integration boundaries**

This guide owns Protea's optional integration responsibilities. The portable
[core package](../packages/core/index.md) currently supplies component contracts;
[component direction](component-direction.md) owns future family questions. The
[local web example](../../../examples/web/README.md) connects Button, Modal and Sidebar through their
public contracts. Its behaviour is scoped to the example page.

## Models, applications and hosts

Portable models own their selected logical lifetime, requests, state authority and observations.
Applications own their supplied collaborators, purpose and composition policy. A future adapter
maps actual public model contracts to a host's public contracts and concrete representation.
DOM, rendering, focus, scheduling, events and framework hooks stay with that integration.

An integration for the native DOM can attach to elements supplied by the application. A
framework adapter can use the same public model contracts through the framework's rendering
and lifetime mechanisms. It connects public observations to framework tracking where needed.
The current native bindings live in the web example. Consider a DOM package when an independent
consumer needs to install those bindings through a public API and can verify the native
interaction and connection lifetime.

Core and Components stay independent of concrete host runtimes, styles, icon providers and
motion engines. Each integration documents its supported environments and provides host
evidence for its claims, including accessibility, browser interaction, server rendering and
hydration where applicable.

## Lifetime and connection ownership

Host mounting, logical closing, animation completion and model finalisation are separate events.
Unmounting a representation does not authorise disposing a borrowed model. An adapter owns the
connections it acquires and only owns a model's lifetime when its construction or an explicit
transfer gives it that authority. Supplied controls and state authorities retain their own owners.

Adapters primarily consume live instances. An adapter that accepts a definition and creates its
own instance takes responsibility for disposing that instance.

Bindings must be logically invalidated before failed setup or teardown can leave retained
callbacks able to perform work. Required cleanup attempts must continue after another release
fails. Physical release failure cannot revive an invalidated binding. The concrete integration
must define its teardown and error handling without inferring a universal lifecycle publisher
from a readonly lifecycle property.

A source owns registration storage while the subscribing consumer owns the acquired release
obligation. An unrelated target's disposal does not remove that consumer's registration from a
different source. This distinction also applies to borrowed models and partially established
connections.

## Requests and observations

The [capability guides](../packages/components/capabilities/index.md) own the current synchronous
request, result and observation protocols. An adapter preserves their meaning at each step.

| Step | Responsibility |
| --- | --- |
| Request and authorisation | The selected model or application policy decides whether to act on a logical request. |
| Effective change or accepted activation | The model reports the committed change or accepted activation through its public results and observations. |
| Application or host effect | The effect's owner exposes any completion its consumers need, such as saving data, updating a view or finishing an animation. |

External opening control requires synchronous authorisation, commitment and change delivery
through the selected authority. Qualify that protocol with the actual source. A host scheduler
can defer projection while the logical state stays with that authority. When a request depends
on asynchronous application work, the application waits for the result and makes a fresh
logical request only if the model and the intent are still current.

A future asynchronous model operation needs an explicit contract for pending work, commitment,
cancellation, concurrent requests, failures and finalisation.

## Presentation and motion

Protea may supply optional design tokens, styles and default templates. Each host selects
its representation, including caller-supplied elements or a compatible default template.
Templates use their host's rendering mechanism. Tokens and styles can be shared where
integrations agree on the roles and structure they target.

An integration may use an optional [motion provider](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#other-optional-integrations).
The effective model state determines the visual target. The host owns motion execution and
visual completion, and cancels or invalidates outstanding transitions when the target changes
or the host detaches.

## Product boundaries

A future Lilium adapter belongs with Protea and consumes public contracts of both products under
[Garden's Lilium boundary](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#lilium-integration).
Core must not import Lilium internals and Lilium must not depend on Protea. Actual upstream public
APIs and supported versions require inspection when an adapter is designed; no imaginary hook,
reactive primitive or lifecycle signature is declared here. Other frameworks follow the same
public-boundary principle.

A future Protea Icon component may own UI semantics, accessible meaning and composition with
controls. Optional Aster support may consume public definitions or an appropriate provider
capability under the [Aster boundary](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#aster-integration).
It must not duplicate Aster's geometry/catalogue responsibilities, make Aster mandatory for basic
components or create a reverse dependency from Aster. No Icon API, provider package or Aster
support range exists yet.

Package extraction, adapter names and provider distribution must follow their real responsibilities
and dependencies. These boundaries do not allocate empty packages or advertise unimplemented
integrations.
