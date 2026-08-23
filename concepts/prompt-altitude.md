---
title: "Prompt Altitude"
date: 2026-05-21
domain: llm
maturity: emerging
source_type: practitioner
topics: [context-engineering, patterns]
tags: [concept, ai-agents, llm, prompt-engineering, context, system-design, domain/llm, maturity/emerging, source-type/practitioner, topic/context-engineering, topic/patterns]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://machinelearningmastery.com/effective-context-engineering-for-ai-agents-a-developers-guide/
    hash: sha256:30fc2e997d5e967efa4139893703044847197b7ecb4ae74190e8459d3fcb0a7c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Prompt Altitude

## Definition
**Prompt altitude** is the level of specificity at which a system prompt operates — ranging from brittle, hardcoded if-else logic at one extreme ("too low") to vague, hand-wavy guidance at the other ("too high"). Effective system prompts find the Goldilocks zone: specific enough to guide agent behaviour reliably, yet flexible enough to let model heuristics operate across edge cases.

## Explanation
When writing system prompts for agents, engineers face a natural tension between two failure modes:

**Too low (brittle hardcoding):** The prompt tries to enumerate every possible situation and prescribe exact responses — essentially writing procedural logic in natural language. This creates fragility: any new edge case not covered causes unexpected behaviour, and maintaining the prompt becomes a constant patching exercise.

**Too high (vague hand-waving):** The prompt is so general it provides no concrete guidance — phrases like "be helpful and accurate" or "do the right thing." This falsely assumes the model shares context it doesn't have, or can reliably infer specifics from vague principles.

**The right altitude:** System prompts should convey *principles and heuristics* rather than explicit procedures. They tell the agent *how to think about the task* — the decision criteria, priorities, and expected output characteristics — without specifying every path through the decision tree. The model's reasoning capabilities fill in the gaps.

### Practical markers
- ✅ **Right altitude:** "Prefer concise summaries; expand only when the user explicitly requests detail" (principle with a heuristic)
- ❌ **Too low:** "If message length > 100 words, add 'do you want more detail?' at the end" (brittle if-else)
- ❌ **Too high:** "Be helpful" (meaningless without context)

### Starting minimal
Anthropic's recommended workflow:
1. Start with the *minimal* prompt on the best available model
2. Observe failure modes in testing
3. Add targeted instructions/examples for *demonstrated* gaps only
4. Avoid pre-emptive complexity — don't add instructions for problems you haven't seen

This is the opposite of defensive prompting (writing rules for every imagined edge case).

## Key Properties
- **Heuristic-driven, not rule-driven** — guides reasoning rather than prescribing actions
- **Failure-mode-informed** — the right altitude is discovered empirically, not designed upfront
- **Maintenance-friendly** — prompts at the right altitude evolve gracefully; low-altitude prompts require constant patching
- **Model-leverage-preserving** — leaves room for the model's own reasoning capabilities to operate

## Relationships
- Core principle within [[context-engineering]]: system prompt quality is a primary context engineering lever
- Informed by [[prompts-as-infrastructure]]: treating prompts as long-lived artefacts creates incentives to find the right altitude (avoid brittleness)
- Relates to [[minimal-viable-tool-set]]: the same Goldilocks principle applies to tool sets — neither too many nor too few, neither too specific nor too vague in their descriptions
- Affects [[attention-budget]]: low-altitude prompts (verbose if-else logic) waste tokens on brittle specificity; high-altitude prompts waste tokens on follow-up corrections

## Applications
- **Agent system prompt design:** Audit existing prompts for altitude. If you see multi-level conditionals in natural language, it's probably too low. If failure analyses keep returning "the agent didn't know what to do in X situation," it's probably too high.
- **Prompt review:** A useful prompt review heuristic — can you state the core behaviour as 3–5 principles? If not, the prompt may be at the wrong altitude.
- **Iterative refinement:** Start at high altitude (minimal prompt), observe failures, lower altitude *only for demonstrated gaps*. Avoid the temptation to pre-emptively lower altitude.
- **Documentation pattern:** Document the *why* behind altitude decisions in your prompt — future maintainers (human or AI) need to understand why a principle is stated at a given level of specificity.

## Study
- Flashcards: [[flashcards/prompt-altitude|Practice this concept]]

## Sources
- [Effective context engineering for AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — primary source; defines the brittle-to-vague spectrum and Goldilocks framing
- [Effective Context Engineering for AI Agents: A Developer's Guide — Machine Learning Mastery](https://machinelearningmastery.com/effective-context-engineering-for-ai-agents-a-developers-guide/) — developer-focused summary of the same principles

## See Also
- [[context-engineering]]
- [[prompts-as-infrastructure]]
- [[minimal-viable-tool-set]]
- [[attention-budget]]
