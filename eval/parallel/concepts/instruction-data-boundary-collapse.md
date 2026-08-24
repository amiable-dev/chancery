---
title: Instruction and data boundary collapse
aliases:
  - No privilege boundary in the context window
date: 2026-08-24
domain: security
maturity: emerging
source_type: practitioner
tags: [concept, security, llm, prompt-injection, domain/security, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.oreilly.com/radar/context-as-code/
    hash: sha256:36f3b757baaa836f0f6e1f54a9b603b618a1fdb5f731a93fa19abb4ddb351653
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Instruction and data boundary collapse

## Definition

**Instruction and data boundary collapse** is the observation that one of computing's oldest separations does not exist inside a model's context: system prompts, retrieved documents, user messages, tool results and fetched web content all arrive as a single undifferentiated token stream through the same weights, with no privilege level distinguishing an instruction from the data it is meant to operate on, so any text that reaches the window can influence control flow.

## Explanation

Outside the model the boundary is intact, which is exactly what makes the collapse easy to miss: permission scopes, schema contracts, sandboxes and execution policies all still hold, and the architecture diagram shows separations that quietly stop existing at the inference call. Current models resist crude overrides of the ignore-previous-instructions kind, but that resistance is learned behaviour with a probability attached rather than a structural guarantee, and indirect injections dressed as legitimate operational context — a line in a customer email, a note in a fetched page, a field in a tool response — are not processed as inert data. The consequence the essay draws is architectural rather than merely a security caveat. Natural language has become a high-level control plane for producing and running software, so an entire class of risk that compilers and type systems used to eliminate before execution has migrated into run time, and the fact that generated code executes stops being a usable proxy for whether the system is sound. Two practical corollaries follow. Any claim that a boundary held must be produced by a mechanism the token stream cannot reach, such as a static check, an enforced permission scope or a sandbox, rather than by another model reading the same context. And the defensive question becomes which representations reach the model at all, since every additional channel into the window is another path by which untrusted text acquires influence.

## Key Properties

- Inside the window there is no privilege level: prompts, documents, user text and tool output share one stream
- Outside the model the separation still exists, which hides the collapse behind an otherwise accurate diagram
- Resistance to naive injection is learned and probabilistic; indirect injection dressed as context survives it
- Risk shifts from build time to run time, so successful execution is no longer evidence of soundness
- Any assertion that a boundary held must come from a mechanism the token stream cannot influence

## Relationships

- [[non-text-channel-injection]] — is a concrete exploitation of it: an instruction hidden in a representation the review pipeline does not parse becomes indistinguishable from policy the moment the agent parses it into the same stream
- [[build-time-generation-governance]] — is the mitigation this collapse motivates, since a boundary that must survive hostile context has to be enforced by a deterministic check outside the model rather than asserted by one inside it
- [[principle-of-least-agency]] — instruction-data boundary collapse supplies the manipulation mechanism least agency's access boundary is built to contain — because attacker-supplied text can become a de facto instruction with no privilege separation, the enforceable limit has to sit at what an agent can access, not at what it was told to do.
- [[retrieval-layer-access-control]] — retrieval-layer access control supplies the retrieval-side mitigation for exactly the problem instruction-data boundary collapse describes — since no privilege level survives once retrieved text reaches the context window, the only defensible control point is upstream, filtering unauthorized chunks out first.

## Applications

Deciding which retrieved or tool-returned content an agent is allowed to see at all; arguing why an LLM reviewer cannot be the control that certifies a security boundary; explaining to a team why permission scopes belong outside the prompt.

## Sources

- https://www.oreilly.com/radar/context-as-code/

## See Also

- [[non-text-channel-injection]]
- [[build-time-generation-governance]]
