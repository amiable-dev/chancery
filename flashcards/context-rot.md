---
tags: [flashcards, context-rot, ai-agents, llm]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Context Rot — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:9b6929 -->
What is context rot?
?
The phenomenon where a language model's ability to accurately recall and reason over information in its context window degrades as total token count increases. It is a performance gradient (not a hard cliff) — models remain capable at longer contexts but show measurably reduced precision for retrieval and long-range reasoning.

## Cause <!-- kb:card:b494f2 -->
What is the architectural root cause of context rot?
?
Transformer self-attention scales as n² — every token attends to every other token, creating n² pairwise relationships. As context grows, the model's fixed attention capacity spreads across exponentially more relationships. Trained attention patterns also developed on shorter sequences, giving the model less specialised capability for very long contexts.

## Universality <!-- kb:card:0ad654 -->
Is context rot specific to certain models?
?
No — it affects all transformer-based LLMs regardless of context window size. Some models degrade more gracefully than others, but none are immune. Techniques like position encoding interpolation partially address it but introduce their own trade-offs.

## Mitigation <!-- kb:card:44368e -->
What are the primary practical mitigations for context rot?
?
1. Tool result clearing — drop raw tool outputs from deep history once their value is extracted (lowest overhead)
2. Context compaction — summarise and restart the context window before rot significantly impacts performance
3. Just-in-time context — load data only when needed, keeping the context window lean
4. Progressive disclosure — let agents explore incrementally rather than loading everything upfront

## Application <!-- kb:card:84d04f -->
When debugging unexpected agent behaviour, what context rot factor should you check?
?
Whether the relevant context was present *and recent enough* to be reliably attended to. A fact loaded many turns ago may have effectively "rotted" out of the model's active attention — even if it's technically still in context.
