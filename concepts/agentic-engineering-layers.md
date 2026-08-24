---
title: Prompt, context, harness and loop layers
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, abstraction, engineering-practice, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://machinelearningmastery.com/an-introduction-to-loop-engineering/
    hash: sha256:12827ca9008a2072a0862a8e34e4579b436864264922dd498d14c36456ee2ab3
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Prompt, context, harness and loop layers

## Definition

The **agentic engineering layers** are a four-stage progression in which each discipline wraps the one before it rather than replacing it: prompt engineering optimizes the wording handed to a model, context engineering optimizes everything the model can see at the moment it answers, harness engineering optimizes the environment around the model — its tools, constraints, scaffolding and feedback paths — and loop engineering optimizes the cycle that sets all of it in motion and decides when it stops. Prompts remain an ingredient of context, context an ingredient of the harness, and the harness an ingredient of the loop, so the layers are a nesting rather than a succession of replacements.

## Explanation

The mechanism that drives the progression is that each layer's ceiling is what motivates the next. A perfectly worded prompt cannot hand the model facts it was never given, which pushed attention outward to assembling retrieved documents, conversation history and tool output into the window — Shopify's Tobi Lutke framed this as providing all the context needed for a task to be plausibly solvable, and Anthropic later formalized it as curating the optimal set of tokens available during inference. Well-curated context still fails if the model has no dependable tools or checks around it, which pushed attention outward again to the harness. And a good harness still needs someone to say which cycle runs and when it terminates, which is the loop. The practical value of the layering is diagnostic: it tells you where a failure lives, since an agent that cannot find a fact has a context problem, an agent that cannot act on it has a harness problem, and an agent that never stops has a loop problem. The framing itself comes from a practitioner explainer and is a way of organizing recent history rather than a measured result — the neat dates it assigns (prompt 2022 to 2024, context 2025, harness early 2026, loop 2026) compress layers that overlapped heavily in practice, and the boundaries are argued rather than sharp.

## Key Properties

- Each layer contains the previous one; none of them was retired by its successor
- Prompt engineering optimizes expression; its ceiling is that wording cannot supply missing facts
- Context engineering optimizes what the model sees at inference time, across history, retrieval and tool output
- Harness engineering optimizes the environment: tools, constraints, scaffolding and feedback that catch mistakes
- The layering is diagnostic — it localizes a failure to the layer whose job it was

## Relationships

- [[agent-harness]] — is the third layer stated in full, defining the harness as everything in an agent system that is not the model
- [[loop-engineering]] — is the outermost layer, and the progression is the argument for why it exists as a separate discipline rather than as more harness work
- [[memory-as-harness-capability]] — is a worked consequence of the nesting — memory cannot be bolted on from outside because it is produced by context decisions the harness layer already owns

## Applications

Locating where an agent failure actually belongs before fixing it, and deciding which layer a team should invest in next rather than reflexively rewriting prompts.

## Sources

- https://machinelearningmastery.com/an-introduction-to-loop-engineering/

## See Also

- [[agent-harness]]
- [[loop-engineering]]
- [[memory-as-harness-capability]]
