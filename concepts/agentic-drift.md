---
title: "Agentic Drift"
date: 2026-07-08
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [context-engineering, agentic-coding]
tags: [concept, llm, ai-agents, agentic-coding, autonomy, long-running, reliability, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/context-engineering, topic/agentic-coding]
status: draft
sources:
  - url: https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns
    hash: sha256:ddab0eb45dd176c5a5d118c577770304f076a84b2d8a65d68ed5670f43f44198
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.theaimarketers.ai/guidetofable5/
    hash: sha256:4407852af47b2bd452276f789b7ad23bb1374093994e758c8bb26c73ce6c31b8
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agentic Drift

## Definition
**Agentic drift** is the progressive divergence of a long-running autonomous AI agent session from the original intent and constraints of the task — caused by accumulated context, cascading micro-decisions, in-context error propagation, and the absence of realignment checkpoints — resulting in coherent-looking but misaligned output at the end of a multi-hour or multi-day run.

## Explanation
As AI coding agents become capable enough to run autonomously for hours or days, a new failure mode emerges that has no equivalent in human-only development: the agent can make hundreds of individually reasonable decisions that collectively drift far from the original intent.

Each micro-decision is locally coherent: "I'll use this abstraction because it fits the current context," "I'll adjust this constraint because the earlier approach made it awkward." But each small accommodation shifts the coordinate system slightly. After 50 such decisions, the agent is operating from a substantially different set of premises than the one the human intended — and it has no mechanism to detect this.

**Why drift is insidious:**
- The output *looks* correct and complete at each intermediate step
- The agent is not making errors — it's making locally-reasonable decisions that compound
- The human isn't watching, so there's no realignment signal
- By the time the drift is apparent, reversing it requires understanding a long decision chain

**The core causes of drift:**
1. **Context compression:** Long contexts force the model to compress earlier instructions; later decisions are weighted toward more recent context
2. **Cascading accommodation:** Each small deviation from intent creates a new local optimum that subsequent decisions optimise for
3. **Absence of invariants:** Without explicit "these things must remain true" checkpoints, no decision is ever challenged against original intent
4. **In-context error propagation:** Errors or misinterpretations from early steps get treated as facts by later steps

**Countermeasures (from the Fable guide's autonomy management patterns):**
- **Explicit checkpoints:** Define specific points at which the agent must produce a summary of decisions made and verify alignment before continuing
- **Invariant declarations:** State upfront the things that must remain true regardless of implementation decisions
- **Bounded autonomy windows:** Rather than one long run, structure as shorter autonomous segments with human review gates
- **Decision logs:** Require the agent to log significant choices with rationale, enabling human spot-checks without full re-reading

## Key Properties
- **Gradual, not sudden** — drift is the accumulation of small deviations, not a single wrong turn
- **Coherence-preserving** — drifted output is internally self-consistent, making it harder to detect than obvious errors
- **Context-depth dependent** — longer runs in larger contexts are more susceptible
- **Reversibility-hostile** — the further drift progresses, the more expensive it is to correct (compounding dependency on drifted decisions)
- **Distinct from hallucination** — drift is directional misalignment; hallucination is factual fabrication; they can co-occur but are separate failure modes

## Relationships
- Complements [[agent-checkpoint-resume]] at the infrastructure level: checkpoint-resume handles *process* continuity; drift management handles *semantic* continuity
- The principal cause of autonomy management challenges described in the context of [[agentic-coding-loop]]
- Related to [[cognitive-debt]]: drift that goes unresolved accumulates as a form of cognitive debt in the agentic system
- [[blind-spot-pass]] mitigates drift at the start by surfacing intent more precisely; checkpoints mitigate it during
- [[agent-state]] management is the foundation on which drift detection depends — you cannot detect drift without a stable representation of original intent

## Applications
- **Long autonomous coding sessions:** Structure multi-hour runs as bounded segments with explicit checkpoint prompts ("Before continuing: summarise the three most significant decisions you've made since the last checkpoint and confirm they align with the original goal")
- **Multi-day agentic tasks:** Define invariants explicitly upfront ("The API must remain backward-compatible; all new abstractions must be reversible without touching callers")
- **Autonomous pipeline jobs:** Build realignment gates into pipeline task specifications for any job expected to run longer than 20–30 minutes
- **Code review of agentic output:** When reviewing AI-generated code from long sessions, check for the *direction* of decisions, not just correctness — look for whether the code is solving the problem that was asked

## Sources
- [A Field Guide to Claude Fable 5: Finding Your Unknowns](https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns) — original Anthropic blog post by Thariq Shihipar; discusses autonomy management patterns for hours/days-long runs
- [AI Marketers summary](https://www.theaimarketers.ai/guidetofable5/) — newsletter summary

## See Also
- [[agent-checkpoint-resume]]
- [[agentic-coding-loop]]
- [[blind-spot-pass]]
- [[agent-state]]
- [[cognitive-debt]]
- [[agentic-sdlc]]
