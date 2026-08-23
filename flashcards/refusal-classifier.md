---
tags: [flashcards, ai-agents, architecture, robustness, safety]
sr-due: 2026-05-10
sr-interval: 1
sr-ease: 250
---

# Refusal Classifier — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:0f27c7 -->
What is a Refusal Classifier in an agent pipeline?
?
A lightweight component that detects when the primary LLM has *declined* a task rather than completing it — distinguishing a polite refusal message from a genuine (even incorrect) response. It enables the pipeline to take corrective action (retry, model-swap, escalate) rather than silently propagating a non-answer as if it were a result.

## Failure Mode <!-- kb:card:cf4395 -->
What failure mode does a Refusal Classifier prevent?
?
**Silent false negatives:** When an LLM refuses a security-sensitive or dual-use request, its output looks like a completed response but contains no actual analysis. Without a refusal classifier, this silently degrades pipeline recall — the finding is dropped without any indication of failure, and no crash or error occurs.

## Corrective Actions <!-- kb:card:416a3a -->
What can a pipeline do after a Refusal Classifier detects a refusal?
?
1. **Retry with rephrased prompt** — reframe to avoid the safety trigger  
2. **Switch to a cyber-tuned model** — use a model fine-tuned to accept security tasks  
3. **Mark candidate as unreviewed** — preserve for human review without silently dropping  
4. **Log and alert** — surface refusal rate as a pipeline health metric  

## Relationship <!-- kb:card:a491d6 -->
How does a Refusal Classifier relate to Multi-Agent Revalidation?
?
They address complementary failure modes:
- **Refusal Classifier** → detects *missing* output (the agent refused to produce anything meaningful)
- **Multi-Agent Revalidation** → filters *noisy* output (the agent produced findings but some are false positives)  
Together they bracket the quality envelope of an agent pipeline from both ends.

## Generalisation <!-- kb:card:673c34 -->
Beyond security scanning, where else is a Refusal Classifier useful?
?
Any domain where an LLM might politely decline instead of answering:
- **Legal/medical extraction:** Model refuses to quote specific case law or drug dosages
- **Content moderation:** Model refuses to evaluate borderline content — "clean" vs. "refused to check" are different outcomes
- **Prompt regression testing:** Detect when a model update changes refusal behaviour for your specific prompts
