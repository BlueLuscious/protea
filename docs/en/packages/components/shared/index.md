# Components Shared Runtime

Status: **Implemented in Components**

The shared feature owns synchronous listener registration and delivery in Components.
Each owner chooses its payload, eligibility and when to deliver or clear registrations.

## Runtime

| Class | Responsibility | Relations |
| --- | --- | --- |
| `ObservationListeners` | Registers independent listeners, attempts each eligible callback in delivery order and clears registrations on request. | Used by [Openable](../capabilities/openable/index.md), [Activatable](../capabilities/activatable/index.md), [Checkable](../capabilities/checkable/index.md), [Button availability](../components/button/index.md) and [Select](../components/select/index.md). |

Subscribing while active records one registration for future deliveries. The helper neither invokes
the listener immediately nor merges repeated subscriptions to the same function. An inactive owner
rejects new registrations.

Each delivery takes a snapshot in registration order. Registrations added during a delivery wait
for the next one. Removal before a callback's turn skips that callback. The helper checks whether
the owner remains active before each turn, so finalisation cancels pending work while letting an
already running callback finish.

A thrown callback does not cancel other callbacks still eligible for that delivery. The helper
attempts those callbacks before reporting failure. The owning feature determines what that failure
means for its state and public request. The helper remains private to Components.
