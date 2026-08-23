---
tags: [flashcards, ai-agents, architecture]
sr-due: 2026-07-15
sr-interval: 1
sr-ease: 250
---

# Deterministic-Picker Pattern — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:e3212c -->
What is the deterministic-picker pattern?
?
An architectural discipline for LLM-as-Scorer steps: the LLM commits only to independent categorical features (booleans, bounded ints, enums), and a deterministic Python function composes those features into the actual deciding score/signal — the LLM never emits the number that drives the decision.

## Problem It Solves <!-- kb:card:645bce -->
What failure mode does the deterministic-picker pattern fix, and what does it look like in practice?
?
The "LLM-as-Scorer flat-band pathology" — when asked for a single holistic numeric score (e.g. 1–10), LLMs collapse outputs into a narrow band (e.g. repeatedly scoring 4/5) regardless of real quality differences, even with strict calibration instructions. This makes any architecture that depends on that score (beam search, MCTS, ranked retrieval) functionally arbitrary.

## Application <!-- kb:card:6d5b73 -->
When would you apply the deterministic-picker pattern?
?
Any time an agent architecture has a "picker" step — a step that ranks, scores, or selects between options. Examples: Self-Consistency's majority vote over sampled answers, LATS's node-value composition from progress/completion/loop-avoidance signals, Corrective RAG's per-document relevance routing, Constitutional AI's per-rule pass/fail check, Dry-Run's irreversibility threshold gate.

## Relationship <!-- kb:card:dcdc96 -->
How does the deterministic-picker pattern relate to LLM-as-a-Judge?
?
Standard LLM-as-a-judge setups that ask for one holistic score are exactly the pattern this technique fixes. Judge prompts that decompose the rubric into independently-scored categorical properties, aggregated deterministically in code, apply the deterministic-picker pattern to evaluation itself.

## Why It Works <!-- kb:card:e6b2af -->
Why can't an LLM flat-band five independent boolean judgments the way it flat-bands a single numeric score?
?
Committing to "yes/no, this avoids clichés" is a categorically different, more constrained cognitive operation than estimating "is this a 6/10 or 7/10." Because the composite score is built from several independent commitments, its distribution is exactly as wide as the underlying feature space allows — not bounded by the model's tendency to cluster around a comfortable middle value.
