---
tags: [flashcards, ai-agents, architecture, anti-patterns, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Premature multi-agent architecture — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:e445a8 -->
What is premature multi-agent architecture?
?
Designing toward hierarchical orchestrators or peer-to-peer agent collaboration before anyone has measured where a single well-scoped agent actually breaks down — paying coordination overhead in tokens, latency, and debugging difficulty for capability nobody has shown is needed.

## The mirror-image failure <!-- kb:card:21622c -->
What is the mirror-image failure to premature multi-agent architecture?
?
The overloaded single agent: one configuration carrying many tools, sprawling instructions, and responsibility for unrelated task types — it underperforms on all of them because optimizing for one kind of input degrades the others.

## The decision procedure <!-- kb:card:cf028c -->
What decision procedure resolves whether to split a single agent into multiple agents?
?
Narrow-before-split: first reduce a single agent's responsibility until it does one kind of task with a matched tool set. Only if that well-scoped single agent still fails do you have a real case for adding another agent — narrowing is cheap and reversible, splitting is neither.

## Cascading errors across agents <!-- kb:card:707bd6 -->
What failure mode does multi-agent coordination introduce that doesn't exist in a single-agent loop?
?
One agent's bad output can cascade through several downstream agents before producing any visible symptom, which makes attribution back to the original failure genuinely hard.

## Three questions before splitting <!-- kb:card:c295d6 -->
What three questions should be answered before splitting a single agent into multiple agents?
?
Whether a single agent with better tools already solves the problem; where the single-agent approach was actually measured to break; and whether the business value covers the added token cost and complexity.

## Routing as the alternative <!-- kb:card:e038bb -->
What alternative to splitting into coordinating agents often captures the same benefit without the coordination cost?
?
Routing — sending each class of input to a differently specialized configuration — buys separation of concerns without paying for inter-agent coordination.
