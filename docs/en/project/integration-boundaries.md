# Integration Boundaries

Status: **Prospective product boundaries; no host adapter or provider integration implemented**

This guide owns Protea's optional integration responsibilities. The portable
[core package](../packages/core/index.md) currently supplies component contracts;
[component direction](component-direction.md) owns future family questions. Portable runtime
establishes no executable host integration or compatibility promise.

## Models, applications and hosts

Portable models own their selected logical lifetime, requests, state authority and observations.
Applications own their supplied collaborators, purpose and composition policy. A future adapter
maps actual public model contracts to a host's public contracts and concrete representation.
DOM, rendering, focus, scheduling, events and framework hooks stay with that integration.

The core must remain independent of concrete host runtimes, styles, icons and motion. Portable
signatures establish neither accessible interaction nor browser, hydration, SSR or framework
support. Each claim requires a supported scenario and actual host evidence.

## Lifetime and connection ownership

Host mounting, logical closing, animation completion and model finalisation are separate events.
Unmounting a representation does not authorise disposing a borrowed model. An adapter owns the
connections it acquires and only owns a model's lifetime when its construction or an explicit
transfer gives it that authority. Supplied controls and state authorities retain their own owners.

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

The [capability guides](../packages/core/capabilities/index.md) distinguish requests, effective
changes, accepted activation and rejection. An adapter must preserve those actual public results
and failure semantics. Acceptance is not
proof of application-work completion, rendering, DOM event cancellation or animation completion.

External opening control currently specifies synchronous authorisation, commitment and change
delivery. A deferred host scheduler or promise cannot be presented as synchronous commitment
without demonstrating that the actual public source meets that protocol. A future integration
must explicitly defer unsupported modes rather than add a hidden second state writer or silently
weaken ordering and authority. Readonly views establish no automatic framework tracking.

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

Motion remains [optional](https://github.com/BlueLuscious/garden/blob/master/docs/en/products/protea/index.md#other-optional-integrations).
A future integration may animate representation while keeping logical opening distinct from
visual completion. Execution, cancellation and release of animation resources need their own
owner; the core acquires no required motion engine or completion protocol.

Package extraction, adapter names and provider distribution must follow their real responsibilities
and dependencies. These boundaries do not allocate empty packages or advertise unimplemented
integrations.
