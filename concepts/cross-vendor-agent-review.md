---
title: "Cross-Vendor Agent Review"
date: 2026-06-15
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [multi-agent, patterns, agentic-coding]
tags: [concept, ai-agents, code-review, multi-agent, architecture, quality, governance, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/multi-agent, topic/patterns, topic/agentic-coding]
status: draft
sources:
  - url: https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents
    hash: sha256:eee5c508eee013757287696ecc1d5830cbfc69f32ed34de21b9b69c7e23b614b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.marktechpost.com/2026/06/13/databricks-open-sources-omnigent-a-meta-harness-that-composes-governs-and-shares-ai-agents-across-claude-code-codex-and-pi/
    hash: sha256:5707fa676606086cf31b8ff4282f139c2bbe641871fb90d7e8ed42c43f77ae9c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://fireworks.ai/blog/open-source-agents-frontier-advisors
    hash: sha256:148a5559a58c809a52b24f443ab8cb1191ad6feba057c76fd81d7f075da93269
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Cross-Vendor Agent Review

## Definition
**Cross-vendor agent review** is a multi-agent quality pattern in which code, documents, or plans produced by an agent using one LLM/harness are routed for review to an agent using a *different* LLM vendor — deliberately avoiding reviewer–author homogeneity so that systematic blind spots of one model family are checked by a model family with independent strengths and failure modes.

## Explanation
The core problem this pattern addresses is **systematic correlated failure**: if the same model that writes code also reviews it, it tends to approve its own errors. Two Claude agents, or two GPT agents, will exhibit correlated blind spots — they were trained on similar data, rewarded for similar outputs, and often fail to catch the same classes of mistakes.

**The analogy from human teams:**
When a writer edits their own work, they read what they *intended* to write, not what's on the page. The fix is a second pair of eyes from someone outside the author's mental model. Cross-vendor review is the agentic equivalent: the reviewer has a genuinely different "mental model" because its weights, training data, and alignment choices differ.

### The Polly Pattern (Omnigent)

Omnigent ships **Polly**, a multi-agent coding orchestrator that instantiates cross-vendor review:

1. **Planning** — Polly plans the task and identifies sub-tasks (writes no code itself)
2. **Parallel execution** — Sub-agents (Claude Code, Codex, Pi) work on sub-tasks simultaneously in separate git worktrees
3. **Cross-vendor routing** — Each sub-agent's diff is automatically routed to a reviewer from a different vendor:
   - Code written by Claude → reviewed by Codex or Pi agent
   - Code written by Codex → reviewed by Claude agent
4. **Merge** — Reviewed, approved diffs are merged

The routing constraint ("different vendor than the writer") is enforced by the meta-harness, not left to human discretion.

### Why Different Vendors?

Different model families have genuinely different strengths that make cross-vendor review additive:

| Model family | Known strengths in review | Known weaknesses |
|-------------|--------------------------|-----------------|
| Anthropic (Claude) | Subtle correctness bugs, constitutional reasoning | Thread-safety false positives in single-threaded contexts |
| OpenAI (GPT) | State machine analysis, edge case generation | Can be overly permissive on ambiguous security patterns |
| Google (Gemini) | Path/key consistency, config file issues | Occasionally echoes author intent instead of challenging it |

Using two models from the same family reduces but doesn't eliminate correlated failure. Cross-vendor review maximises reviewer independence.

### Relationship to LLM Council

This pattern is the code-review-specific instantiation of the broader [[multi-agent-revalidation]] and LLM Council approaches. The difference:
- **LLM Council** — parallel deliberation then synthesis, for decisions and complex questions
- **Cross-vendor agent review** — sequential write-then-review, for code and artefact quality, where the review step must see the finished work before responding

### Limitations

- **Requires multi-vendor API access** — you need credentials for at least two LLM families; increases cost
- **Reviewer quality varies** — the weaker model reviewing the stronger model's code may miss things the author would have caught
- **Not a guarantee** — correlated failures can still occur for fundamental LLM limitations (e.g. both models miss the same security class if neither was trained to recognise it)
- **Coordination overhead** — routing logic adds latency; parallel execution in separate git worktrees has infrastructure cost

## Key Properties
- **Vendor independence** — reviewer and author use different model families, not just different models within the same family
- **Deterministic routing** — the meta-harness enforces the cross-vendor constraint; it is not optional or human-mediated
- **Parallel execution** — multiple author agents work simultaneously; review is not a bottleneck on serial writing
- **Worktree isolation** — each sub-agent works in its own git worktree; branches don't conflict before review completes
- **Additive to CI** — cross-vendor review sits *before* automated tests, not instead of them; it catches semantic and logical issues that tests may not cover

## Relationships
- Enabled by [[meta-harness-pattern]]: routing work across multiple harnesses and vendors requires a meta-harness coordination layer
- Related to [[multi-agent-revalidation]]: cross-vendor review is a specialised form of multi-agent revalidation applied to code artefacts
- Related to [[circular-hallucination]]: cross-vendor review mitigates circular hallucination risk where a model reviews its own outputs and approves its own errors
- Related to [[supervisor-agent-pattern]]: Polly is a supervisor agent that delegates to workers and routes review; cross-vendor review is a policy of the supervisor
- Related to [[human-in-the-loop-pattern]]: cross-vendor review can replace or complement human code review; humans still merge but the review itself is automated
- Related to [[agent-powered-sast]]: SAST catches syntactic/reachability bugs; cross-vendor review catches logical and semantic issues that static analysis misses

## Applications
**Agentic PR review pipeline:** Every PR produced by a coding agent is automatically reviewed by an agent from a different vendor before a human sees it. Humans focus on high-level design, not line-by-line correctness.

**Parallel spike comparison:** Two agents (Claude Code + Codex) independently implement the same feature. Each reviews the other's approach. The human chooses the better implementation with access to both reviews.

**Security-sensitive code:** Cryptographic or authentication code written by one model family is always reviewed by a second. The independence reduces the risk of a shared blind spot approving a vulnerability.

**Documentation accuracy:** Technical docs written by one agent (which may hallucinate API details) are reviewed by a second agent that checks against the actual source code — from a different vendor to avoid shared hallucinations.

**Council-review equivalent:** The Council Review workflow (used for Conductor PRs) approximates this pattern manually by running multiple models in parallel review; cross-vendor agent review automates the routing.

## Sources
- [Introducing Omnigent (Databricks Blog)](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents) — primary source; describes the Polly orchestrator and cross-vendor review routing
- [MarkTechPost overview](https://www.marktechpost.com/2026/06/13/databricks-open-sources-omnigent-a-meta-harness-that-composes-governs-and-shares-ai-agents-across-claude-code-codex-and-pi/) — Polly use-case description
- [Harvey frontier advisor pattern (Fireworks AI)](https://fireworks.ai/blog/open-source-agents-frontier-advisors) — related pattern: frontier model guiding cheaper worker model

## See Also
- [[meta-harness-pattern]]
- [[multi-agent-revalidation]]
- [[circular-hallucination]]
- [[supervisor-agent-pattern]]
- [[human-in-the-loop-pattern]]
- [[agent-powered-sast]]
- [[multi-agent-systems]]
- [[ai-sovereignty]]: cross-vendor review is simultaneously a quality pattern and a sovereignty practice — using multiple vendors reduces both correlated-failure risk and single-vendor operational dependency
- [[agent-pool]]: the pool of cross-vendor models is the resource layer that makes cross-vendor review possible
