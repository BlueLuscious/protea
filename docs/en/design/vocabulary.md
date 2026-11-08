# Design Vocabulary

Status: **Conceptual vocabulary; actual contracts remain with their owning guides**

These terms distinguish responsibilities without establishing exported symbols, packages or
implementation classes. The [responsibility map](responsibilities.md) owns dependency direction.

| Term | Meaning |
| --- | --- |
| Component | An individual model with a defined purpose and contract. The [production foundation](../packages/core/component/index.md) specifies identity and logical lifetime. |
| Family | Related component purposes and constraints; the relationship does not prescribe implementation inheritance. |
| Variant | A justified behavioural or structural distinction within a family. Visual treatment alone does not establish one. |
| Capability | A narrow reusable behaviour contract used where an instance needs it; common shape does not require shared mutable state or a base class. |
| Behaviour | The observable meaning of operations, outcomes, state readings and notifications; it is not automatically a separate implementation object. |
| Controller | A possible mechanism needing real state, responsibility and consumers before introduction. |
| Manager | A justified scoped membership/lookup owner, without implicit ownership of its members' state or lifetime. |
| Part | A composition role whose representation, borrowing, retention, replacement and cleanup require a concrete owning contract. |
| Configuration | Inputs for creation or use, distinct from current state; retention and validation need explicit contracts. |
| State | A behaviour's authoritative condition, with a specified owner and observation rules; no universal state store is implied. |
| Presentation | Optional visual expression, distinct from component behavioural identity. |
| Contract | Semantic obligations and limits, including inputs, results, authority, lifetime and observations. |
| API | The concrete consumable surface expressing a contract, owned by production source or an explicitly legacy prototype. |
| Operation request | A request to the responsible owner; making a request does not establish authorisation or effect. |
| Effective change | A logical change permitted by its state authority, distinct from request and visual completion. |

Family, variant, state and presentation describe potentially independent reasons to vary.
[Component direction](../project/component-direction.md) reopens the previous Sidebar
classification and leaves original families for later work. Behaviour and controller are not a
pair of abstractions to implement by default.

The [legacy capabilities](reusable-capabilities.md) retain candidate opening and activation
semantics. Production component/resource contracts and their generated declarations have their
own source authority. Type compatibility supplies no evidence of runtime transitions, synchrony,
cleanup, ownership or accessible host interaction.
