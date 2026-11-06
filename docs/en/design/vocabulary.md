# Design Vocabulary

Status: **Conceptual design baseline; API signatures and runtime behaviour not implemented**

This vocabulary distinguishes the responsibilities used in Protea's [design](index.md).
The [responsibility map](responsibilities.md) assigns their boundaries and permitted dependency
directions. Terms describe concepts; they do not establish exported symbols, classes or packages.

## Component concepts

| Term          | Meaning                                                                                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component     | An individual UI model with a defined purpose and observable contract. Its required identity, lifecycle and owned resources remain subjects of contract design.                                                                     |
| Family        | A set of related component purposes and constraints, such as a sidebar family. A family relationship does not prescribe an implementation class or inheritance relationship.                                                        |
| Variant       | A behavioural or structural distinction within a family. The distinction must explain a real difference in obligations or composition; visual treatment alone does not establish one.                                               |
| Capability    | A narrow reusable behavioural contract used where an instance needs it. Sharing the contract does not require a common base class or shared mutable state.                                                                          |
| Behaviour     | The observable meaning promised by a contract: what an operation, result, state observation or notification means where that contract provides it. Behaviour is a semantic responsibility, not a selected implementation mechanism. |
| Controller    | A possible future mechanism for implementing a justified responsibility. No separate controller abstraction is accepted merely because the design describes behaviour.                                                              |
| Manager       | An optional scoped responsibility for membership or lookup when real consumers need it. Its membership authority does not make it the owner of a managed component's behavioural state.                                             |
| Part          | A role within a component's composition. Whether it is represented by another component, a value or a borrowed collaborator, and who owns it, remain design decisions.                                                              |
| Configuration | Inputs describing how a supported component or collaborator is to be created or used. Configuration is distinct from current state; mutability, retention and validation rules require their own contract.                          |
| State         | The authoritative condition relevant to a particular behaviour at a given point. Its owner, representation and observation rules must be specified; the term creates no universal state object or field.                            |
| Presentation  | An optional visual expression of a component's semantics, including appropriate styles or templates. Presentation does not determine the component's entire behavioural identity.                                                   |

Family, variant and presentation describe different reasons for a design to vary. The conceptual
progression from a shared foundation through families and variants to presentation does not select
a class hierarchy. A component consumes only the capabilities its own purpose needs.

Behaviour and controller are not two parallel abstractions to implement by default. Behaviour
names the promised semantics. A future controller would need its own concrete responsibility and
consumers before becoming a justified mechanism under Garden's
[architecture rules](https://github.com/BlueLuscious/garden/blob/master/docs/en/project-rules.md#responsibilities-layers-and-dependencies).

## Contracts and operations

| Term              | Meaning                                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contract          | The obligations and limits a consumer may rely on, including relevant inputs, outcomes, state authority, lifecycle and observations. A type signature alone does not specify those semantics. |
| API               | The consumable names, types and operation surface through which a contract is expressed. Its concrete symbols, signatures and module boundaries have not been selected here.                  |
| Operation request | An attempt to ask the responsible owner for an action or change. A request is not itself evidence that a change was authorised or took effect.                                                |
| Effective change  | An actual logical change permitted by the owning contract and state authority. Its meaning is distinct from a request and from any subsequent visual or motion effect.                        |

These distinctions let later contracts state who requests an operation, who authorises state,
what changes and what may be observed. They do not select a request method, control model,
notification sequence, synchronous or asynchronous result, or rejection mechanism.

Semantic documentation will own the meaning of accepted contracts; declaration prototypes will
own their signatures when introduced. Static type checking will establish only its checked type
relationships. Actual transitions, ordering, resource cleanup and accessible interaction require
separate runtime and host evidence.

## Decision boundary

The conceptual distinctions above are the vocabulary baseline. Public symbol names, a shared
component abstraction, retained capabilities, class relationships, state authority, part ownership
and cleanup protocols remain for their owning contract work. No API or implementation is created
by using these terms.
