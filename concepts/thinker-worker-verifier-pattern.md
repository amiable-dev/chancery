---
title: "Thinker-Worker-Verifier Pattern"
date: 2026-06-25
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [multi-agent, orchestration, patterns]
tags: [concept, ai-agents, architecture, patterns, multi-agent, coordination, quality-control, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/multi-agent, topic/orchestration, topic/patterns]
status: draft
sources:
  - url: https://arxiv.org/abs/2512.04695
    hash: sha256:cc8d59184e820e3a0c0924eb0dec3762b452fa565c57039da1179887f1fd002b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://sakana.ai/fugu-release/
    hash: sha256:f862841a63c87fc89dbadf5d0f8e55231b6975674636da3941343f8952f31a2a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://theplanettools.ai/blog/sakana-ai-fugu-multi-llm-orchestration-routes-around-export-controls-2026
    hash: sha256:2f7dcd689493377bb0099809fb4fb4222f55fa4b9ea509699eaae7a7fd8bb560
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Thinker-Worker-Verifier Pattern

## Definition
The **Thinker-Worker-Verifier (TWV) pattern** is a multi-agent role decomposition in which a coordinator delegates a task to three specialised roles: a **Thinker** that plans and reasons about approach, a **Worker** that executes the plan (writing code, retrieving information, performing computation), and a **Verifier** that independently checks correctness and flags errors — enabling systematic quality control without a single agent doing all three.

## Explanation
Complex tasks typically require three distinct cognitive modes that conflict when done by one agent in a single pass:
- **Strategic reasoning** (what *should* we do and why?) pulls toward deliberate, exploratory thinking
- **Execution** (actually doing the thing) pulls toward efficient, concrete action
- **Verification** (is this right?) requires adversarial skepticism, which is hard to maintain when you just produced the thing you're judging

The TWV pattern separates these into distinct agents — each optimised for its role — and coordinates them via a lightweight orchestrator (the "coordinator" in TRINITY's terminology).

**Role definitions:**

| Role | Responsibility | Optimal model characteristic |
|------|---------------|------------------------------|
| **Thinker** | Decomposes the goal; produces a reasoning chain, plan, or intermediate representation | High reasoning depth; chain-of-thought strength |
| **Worker** | Executes against the plan; writes code, calls tools, retrieves data | Domain expertise; fast, accurate execution |
| **Verifier** | Independently assesses the Worker's output against the Thinker's plan; flags errors, requests correction | Skeptical, adversarial; good at finding failure modes |

**Coordination flow:**
```
Coordinator → Thinker: "Here is the task. Produce a plan."
Thinker → Coordinator: [plan]
Coordinator → Worker: "Here is the task and plan. Execute."
Worker → Coordinator: [output]
Coordinator → Verifier: "Here is the task, plan, and output. Is the output correct?"
Verifier → Coordinator: [pass/fail + feedback]
  if fail: loop back to Worker or Thinker
  if pass: Coordinator synthesises final answer
```

**Why separate Thinker from Worker?**
A single model asked to "think then do" in one context window tends to abbreviate thinking once it starts executing, especially under token pressure. Separate Thinker and Worker agents allow each to use their full context window for their specific cognitive task, and allows the coordinator to assign *different* models to each role based on their strength.

**TRINITY (Sakana AI, ICLR 2026):**
TRINITY is the research instantiation of TWV. Rather than hand-engineering the coordinator, TRINITY *evolves* a lightweight coordinator LM that learns which model to assign to each role for each task type. Performance is demonstrated across coding, mathematics, reasoning, and knowledge tasks. The coordinator assigns roles dynamically based on the task — not all tasks need all three roles.

**Relationship to multi-agent revalidation:**
[[multi-agent-revalidation]] is a related concept: re-running a result through a second agent for validation. TWV is more structured — the Verifier role is planned from the start, sees the Thinker's intent, and checks against a known plan rather than just re-judging output in isolation.

## Key Properties
- **Separation of cognitive modes** — each role operates in its optimal mode without context contamination from the others
- **Independent verification** — the Verifier has no prior commitment to the Worker's output (avoiding self-review bias)
- **Role specialisation** — different models can be assigned to Thinker vs Worker vs Verifier based on their strengths
- **Loop-capable** — failed verification triggers correction cycles; the coordinator mediates retries
- **Scalable** — multiple Workers can run in parallel on different sub-tasks, all verified by the same Verifier
- **Coordinator-mediated** — the lightweight coordinator handles assignment, sequencing, and result aggregation

## Relationships
- Implemented by [[orchestration-model]]: TRINITY's TWV structure is one coordination strategy an orchestration model can learn
- Selects from [[agent-pool]]: Thinker, Worker, and Verifier are typically different pool members chosen for their strengths
- Extends [[supervisor-agent-pattern]]: TWV adds explicit verification as a first-class role to the supervisor pattern
- Complements [[multi-agent-revalidation]]: both involve a second-pass check; TWV's Verifier has intent context (the plan), making verification more precise
- Related to [[multi-agent-systems]]: TWV is one specific coordination topology within the broader multi-agent pattern space

## Applications
**Best suited for:**
- Tasks with objectively verifiable outputs: code (runs or doesn't), maths (answer is correct or not), structured data extraction (schema-valid or not)
- Long-horizon reasoning where planning drift is a risk
- Any task where self-review bias is a concern (letting the model that produced output also verify it)

**Concrete examples:**
- **Code generation pipeline:** Thinker produces algorithm design → Worker writes code → Verifier runs tests + reviews logic
- **Scientific claim verification:** Thinker identifies claims + evidence needed → Worker retrieves papers → Verifier cross-references and flags unsupported claims
- **Financial modelling:** Thinker structures the model → Worker implements calculations → Verifier checks formula logic + edge cases

**When NOT to use TWV:**
- Simple, single-turn questions where planning overhead exceeds benefit
- Tasks where "verification" is subjective (creative writing, style preferences) — a Verifier adds little value
- Latency-sensitive interactive workflows where 3× LLM calls is unacceptable

## Study
- Flashcards: [[flashcards/thinker-worker-verifier-pattern|Practice this concept]]

## Sources
- [TRINITY: An Evolved LLM Coordinator](https://arxiv.org/abs/2512.04695) — Xu, Sun, Schwendeman, Nielsen, Cetin, Tang; ICLR 2026; the paper that introduces and validates the TWV structure
- [Sakana Fugu Release Announcement](https://sakana.ai/fugu-release/) — deployment context of TRINITY in Fugu
- [ThePlanetTools: Sakana Fugu Analysis](https://theplanettools.ai/blog/sakana-ai-fugu-multi-llm-orchestration-routes-around-export-controls-2026) — TRINITY role decomposition description

## See Also
- [[orchestration-model]]
- [[agent-pool]]
- [[supervisor-agent-pattern]]
- [[multi-agent-revalidation]]
- [[multi-agent-systems]]
