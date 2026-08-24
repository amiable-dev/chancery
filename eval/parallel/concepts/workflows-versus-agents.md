---
title: Workflows versus agents
date: 2026-08-24
domain: ai-agents
maturity: established
source_type: vendor-doc
tags: [concept, ai-agents, design-patterns, architecture, domain/ai-agents, maturity/established, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/building-effective-agents
    hash: sha256:a1f2257ff438964f64caa04bbfd0b5cc1f93f3236202a67412a5990369e3433a
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Workflows versus agents

## Definition

The **workflows-versus-agents distinction** classifies agentic systems by who controls the path through a task: in a workflow, model calls and tools are orchestrated along code paths a person wrote in advance, while in an agent the model directs its own process and tool use, deciding for itself how the task gets accomplished. The rule that follows is to find the simplest structure that works and add complexity only where it demonstrably improves outcomes — often a single model call with retrieval and in-context examples suffices — because workflows buy predictability and consistency for well-defined tasks, agents buy flexibility where the required steps cannot be known in advance, and both trade latency and cost for task performance.

## Explanation

Underneath every pattern sits one building block, the augmented model: a language model that can issue its own search queries, select its own tools, and decide what to retain. From there the named patterns form a complexity ladder. Prompt chaining decomposes a task into fixed subtasks where each call consumes the previous output, with programmatic gates between steps, trading latency for accuracy by making each individual call easier. Routing classifies an input and sends it to a specialized follow-up, which matters because optimizing one prompt for one class of input actively degrades its handling of others. Parallelization comes in two forms, sectioning independent subtasks to run concurrently and voting the same task repeatedly for diverse outputs and higher confidence. Orchestrator-workers looks topologically like parallelization but differs in the one respect that matters: the subtasks are determined at runtime by a central model rather than fixed in advance, which is what makes it the right shape when you cannot predict how many files a change will touch. Evaluator-optimizer pairs a generator with a critic applying explicit criteria in a loop, and fits precisely when criteria are clear and a human articulating feedback would measurably improve the result. Agents sit at the top of the ladder: they take a goal, plan and operate independently, take ground truth from the environment at each step, pause at checkpoints, and stop on completion or on a stopping condition such as a maximum iteration count. Their autonomy costs real money and compounds errors, which is the argument for sandboxes and guardrails rather than for avoidance. The source is an Anthropic engineering post from December 2024 distilled from customer implementations — a vendor piece, and one that now carries its own note that the tooling landscape it described has changed — but the distinction and the five patterns became the field's standard vocabulary, and its warning about frameworks has aged well: abstraction layers obscure the underlying prompts and responses, make debugging harder, and make it tempting to add complexity a simpler setup would not need.

## Key Properties

- Workflows run model calls along predefined code paths; agents let the model direct its own process and tool use
- Every pattern is built on the augmented model — one that invokes retrieval, tools and memory itself
- Five composable patterns: prompt chaining, routing, parallelization by sectioning or voting, orchestrator-workers, evaluator-optimizer
- Orchestrator-workers differs from parallelization by determining subtasks at runtime rather than fixing them in advance
- Autonomy costs token spend and compounds errors, so agents suit open-ended paths in trusted, sandboxed environments
- Frameworks speed the start but hide prompts and responses, so understanding the underlying calls stays a requirement

## Relationships

- [[loop-engineering]] — is the later and more operational treatment of what this note calls simply agents, taking the same model-using-tools-in-a-loop shape and making its termination and verification the explicit object of design
- [[agent-tool-ergonomics]] — expands this note's third principle into a full discipline, starting from its claim that the agent-computer interface deserves as much design investment as a human-computer interface
- [[premature-multi-agent-architecture]] — states the same simplicity argument as its failure mode, arriving from the opposite direction at the rule that added structure must be justified by measurement
- [[stacked-agent-loops]] — shows what evaluator-optimizer becomes in production, promoting the generator-critic pair from a pattern into a standing verification layer wrapped around the agent loop
- [[purpose-built-agent-hierarchy]] — is orchestrator-workers carried to a structural conclusion, fixing the layers of narrow agents in advance rather than letting one orchestrator improvise the decomposition each run
- [[agent-loop-patterns]] — the agent loop patterns supply the concrete menu the workflows-versus-agents split's add-complexity-only-when-justified rule chooses from once a workflow's fixed path stops fitting the task — which of the four recurring shapes to reach for next.

## Applications

Choosing the least complex structure that solves a given task — a single augmented call, one named workflow pattern, or a full agent — and reading an existing system well enough to tell which of its failures are inherent to the pattern it uses rather than to the model behind it.

## Sources

- https://www.anthropic.com/engineering/building-effective-agents

## See Also

- [[loop-engineering]]
- [[agent-tool-ergonomics]]
- [[premature-multi-agent-architecture]]
- [[stacked-agent-loops]]
- [[purpose-built-agent-hierarchy]]
