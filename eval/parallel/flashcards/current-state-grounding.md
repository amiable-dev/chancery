---
tags: [flashcards, agents, retrieval, tooling, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Grounding agents in current state — Flashcards

#flashcards/agents

## Definition <!-- kb:card:ea5503 -->
What is current-state grounding?
?
Dividing what an agent needs to know into what its weights already encode (procedural competence, like how to write code) and what only a live source can supply (current facts, like a library's signature this week), then closing the second gap with a source the agent queries during the run rather than with more instruction.

## Why the failure is silent <!-- kb:card:fd7479 -->
Why is the failure current-state grounding addresses silent rather than visible at generation time?
?
A model that does not know an interface does not say so — it emits a plausible call indistinguishable in form from a correct one, and the error appears only at runtime, after it has survived review.

## Key mechanism: weights stale for facts, not procedure <!-- kb:card:65117c -->
Why do a model's weights generalize well for procedural knowledge but not for facts about external state?
?
The weights are a lossy summary of a corpus with a cutoff date. Procedural competence (language idioms, protocol shapes) generalizes past that date, but facts about fast-moving external state go stale immediately — and the model has no calibrated way to signal which kind of knowledge it is drawing on.

## The fix is architectural, not prompting <!-- kb:card:50c352 -->
Why can't prompting fix the current-state grounding gap?
?
Because the missing information is not latent in the model waiting to be elicited. The fix is architectural: attaching a source the agent can query at the moment of need.

## Three recurring shapes <!-- kb:card:3cad69 -->
What three recurring shapes does current-state grounding take, at increasing distance from the code?
?
Current documentation for a named library, pulled into context on demand; documentation generated over a specific repository, so questions are answered from that code rather than generic priors; and search designed for agent consumption, returning extracted content and summaries rather than human-facing pages.

## Economics: pay per question, not per turn <!-- kb:card:bd9a27 -->
What economic property do queried sources share that keeps an agent's standing context small?
?
A queried source costs tokens only when the question is asked, so the standing context stays small while the reachable material does not.
