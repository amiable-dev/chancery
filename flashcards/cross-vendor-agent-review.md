---
tags: [flashcards, ai-agents, code-review, multi-agent]
sr-due: 2026-06-15
sr-interval: 1
sr-ease: 250
---

# Cross-Vendor Agent Review — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:427a66 -->
What is cross-vendor agent review?
?
A multi-agent quality pattern where code produced by an agent using one LLM/harness is reviewed by an agent using a *different* LLM vendor — deliberately ensuring reviewer–author come from different model families so their systematic blind spots don't overlap.

## Core Problem <!-- kb:card:d60140 -->
Why does same-vendor review fail?
?
**Correlated failure**: if the same model family writes and reviews code, it tends to approve its own errors. Two Claude agents (or two GPT agents) have overlapping training data, alignment choices, and failure modes — they systematically miss the same classes of mistakes. Cross-vendor review ensures genuine reviewer independence.

## Polly Pattern <!-- kb:card:76db15 -->
Describe the Polly orchestrator pattern for cross-vendor review.
?
1. Polly (orchestrator) plans the task — writes no code itself
2. Sub-agents (Claude Code, Codex, Pi) work in **parallel git worktrees**
3. Each sub-agent's diff is routed to a reviewer from a **different vendor**: Claude-written code → Codex/Pi review; Codex-written code → Claude review
4. Reviewed, approved diffs are merged
The cross-vendor routing is enforced by the meta-harness, not left to human discretion.

## Model Strengths <!-- kb:card:99beac -->
What are the distinct review strengths of different model families?
?
- **Claude (Anthropic)** — subtle correctness bugs, constitutional reasoning
- **GPT (OpenAI)** — state machine analysis, edge case generation
- **Gemini (Google)** — path/key consistency, config file issues
Using two models from the same family reduces but doesn't eliminate correlated failure; cross-vendor maximises independence.

## vs LLM Council <!-- kb:card:ab6ff9 -->
How does cross-vendor agent review differ from the LLM Council pattern?
?
- **LLM Council** — parallel *deliberation* then synthesis; multiple models answer the same question simultaneously, useful for decisions and complex analysis
- **Cross-vendor review** — sequential *write-then-review*; the reviewer sees the finished artefact and responds, used for code/document quality checks
Council is for thinking together; cross-vendor review is for catching errors in completed work.

## Limitation <!-- kb:card:157c2b -->
What is the main limitation of cross-vendor agent review?
?
It requires API credentials for at least two LLM vendor families (increased cost); the reviewing model may be weaker than the author for some domains; and correlated failures can still occur for fundamental LLM limitations that neither model was trained to recognise — it reduces but does not eliminate shared blind spots.

## Application <!-- kb:card:4e489b -->
Give a concrete scenario where cross-vendor agent review catches something single-vendor review misses.
?
An OpenAI agent writes authentication middleware with a subtle token comparison bug. A same-vendor GPT reviewer — having similar training — approves it. A Claude reviewer, with different alignment and training data, flags the timing side-channel and requests constant-time comparison. The cross-vendor reviewer catches what the same-family reviewer missed.
