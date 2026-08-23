---
title: "Retention Decay (Knowledge Lifecycle)"
aliases: ["Retention Decay (Knowledge Lifecycle)"]
date: 2026-04-14
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [pkm, memory]
tags: [concept, knowledge-management, ai-agents, pkm, memory, cognitive-science, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/pkm, topic/memory]
status: draft

sources:
  - url: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
    hash: sha256:9cec05f1dcdf4fc0162cfd801b68c448df9b7ee1fa4ee94c17c5c607909ab3ff
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://en.wikipedia.org/wiki/Forgetting_curve
    hash: sha256:4909f49875e6dd6c3e8b72580e74292e0cc52ecfcffee7741f5f6036da97a6fe
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Retention Decay (Knowledge Lifecycle)

## Definition
The deliberate application of an exponential forgetting model — based on Ebbinghaus's forgetting curve — to facts stored in an LLM knowledge base. Facts that aren't accessed or reinforced over time are progressively deprioritised (not deleted), mimicking how biological memory fades without reinforcement.

## Explanation
A wiki that never forgets becomes noisy. Over time it accumulates outdated bugs, superseded decisions, and transient observations that crowd out current, relevant facts. Retention Decay is the solution: facts have a *retention score* that decays exponentially with time and resets (partially or fully) each time the fact is accessed or confirmed.

**The Ebbinghaus model:**  
Retention ≈ e^(−t/S), where `t` is elapsed time and `S` is the stability of the memory (higher for well-established facts, lower for one-off observations). Each reinforcement event increases `S`, making the memory more durable.

**Decay rates by knowledge type:**
| Knowledge Type | Decay Rate |
|----------------|-----------|
| Procedural (workflows, patterns) | Very slow (months–years) |
| Architecture decisions | Slow (months) |
| Semantic facts (library versions, configs) | Medium (weeks–months) |
| Episodic observations (session notes) | Fast (days–weeks) |
| Working memory (raw observations) | Very fast (hours–days) |

**What "fade" means in practice:**  
A faded fact is *not deleted* — it's deprioritised: lower [[knowledge-confidence-scoring|confidence score]], excluded from default context injection, and flagged for human review. It "moves to the bottom drawer" rather than being thrown away.

## Key Properties
- Decay is exponential (Ebbinghaus curve), not linear or sudden.
- Reinforcement (re-access, new corroborating source) resets the decay curve.
- Different decay rates per knowledge tier (see [[knowledge-consolidation-tiers]]).
- Faded knowledge is deprioritised, not deleted — full provenance preserved.
- Ties directly to [[knowledge-confidence-scoring]]: confidence is the operational expression of retention.

## Relationships
- Closely coupled with [[knowledge-confidence-scoring]]: confidence score is the working proxy for retention level.
- Decay rates map to [[knowledge-consolidation-tiers]]: each tier has its own decay constant.
- [[knowledge-supersession]] can accelerate decay for explicitly replaced claims.
- The [[agent-knowledge-schema]] defines decay schedules and review thresholds.
- [[fsrs-scheduling]] — describes the decay that FSRS models explicitly as difficulty, stability and retrievability

## Applications
- **Context quality:** Decay prevents the LLM's injected context from being diluted by months-old, unverified observations.
- **Scheduled review:** Facts below a retention threshold trigger a periodic review prompt: "This was last confirmed 90 days ago — is it still true?"
- **Trust calibration:** Long-stable facts (confirmed many times, slow decay) receive higher trust than recently added ones.
- **PoC path:** Tag all MEMORY.md entries with `last-accessed` and `stability: [high/medium/low]`. During heartbeat maintenance, flag entries not accessed in 60+ days with `status: stale-candidate` for human review. Measure whether pruning stale entries improves or hurts context quality over 30 days.

## Sources
- [LLM Wiki v2 — Rohit Ghumare](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) — forgetting curve mechanics, retention decay design
- [Ebbinghaus Forgetting Curve (Wikipedia)](https://en.wikipedia.org/wiki/Forgetting_curve) — original cognitive science model

## See Also
- [[knowledge-confidence-scoring]]
- [[knowledge-consolidation-tiers]]
- [[knowledge-supersession]]
- [[cognitive-offloading]]
