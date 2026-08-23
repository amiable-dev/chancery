---
tags: [flashcards, ai-agents]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# Rare Context — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:a144a1 -->
What is "rare context" in the context of AI agent deployment?
?
The company-specific, tacit vocabulary, examples, and operational knowledge a domain expert holds but that generic LLMs — and "zero-shot, works anywhere" agent products — cannot access without explicit training or in-context supply. It's what turns an unbriefed generalist model into a genuinely useful specialist.

## Application <!-- kb:card:1bf7de -->
An ops team asks an agent "where are the zombie nodes?" and gets a plausible but wrong answer. What concept explains this failure, and what's the fix?
?
Rare context — the agent doesn't know the company's specific meaning of "zombie node" and guesses from generic signals, like "an angry intern." The fix is two-part: constrain the agent's task/access (read-only, flat schemas, simple queries) AND explicitly supply the missing company-specific vocabulary and examples.

## Relationship <!-- kb:card:ed657e -->
How does rare context relate to Context Advantage (Andrew Ng's framing)?
?
Context Advantage is the general information-asymmetry framing of why humans remain necessary alongside AI. Rare context is the specific, company-vocabulary instance of that advantage in an enterprise/operational setting — the tacit jargon and tribal knowledge a generic model has no way to have seen.
