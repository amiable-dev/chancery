---
title: Agent-led elicitation
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: vendor-doc
tags: [concept, prompting, requirements, human-ai-interaction, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns
    hash: sha256:ddab0eb45dd176c5a5d118c577770304f076a84b2d8a65d68ed5670f43f44198
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Agent-led elicitation

## Definition

**Agent-led elicitation** reverses the usual direction of instruction: instead of the person specifying a task they do not yet understand, the model interrogates the person — mapping the traps and questions they did not know to ask, or interviewing them one question at a time — so that the requirements are produced by the exchange rather than assumed to exist beforehand.

## Explanation

The mechanism rests on an asymmetry of coverage. A model has seen far more of the average domain than the person asking about it and can read a codebase or search the literature in seconds, so it can enumerate the relevant question set faster than a newcomer can discover it by trying things. Two shapes recur. The blind-spot pass is a one-shot request to name what you do not know you do not know about a specific area — historical work already done, standard pitfalls, what good even looks like — and it is most useful precisely where you have the least standing to write a good prompt. The interview is iterative and needs a prioritisation rule to be worth the turns; asking for one question at a time, ranked by which answer would most change the architecture, filters the exchange down to decisions that are expensive to revisit later. Both depend on the human declaring their starting point — what they have tried, what they already know, how much of the codebase is familiar — because the productive questions for a novice and an expert in the same task barely overlap. The cost profile is what makes this a discipline rather than a nicety: the questions are cheap now and the same discoveries arrive expensively later, as rework, if nobody asks them.

## Key Properties

- The model asks and the human answers, inverting who holds the specification
- Two shapes: a one-shot blind-spot pass, and an iterative one-question-at-a-time interview
- Interviews need a prioritisation rule — questions whose answers would change the architecture come first
- Requires the human to state their own expertise and starting point, or the questions land at the wrong level
- Works because model breadth exceeds the newcomer's, not because the model knows the specific situation

## Relationships

- [[unknowns-inventory-prompting]] — is the framing this technique serves, since it targets exactly the quadrant a person cannot query on their own
- [[disposable-artifact-specification]] — complements it by addressing criteria that are tacit rather than absent — questions surface what you never considered, artifacts surface what you could never articulate
- [[rare-context]] — agent-led elicitation is a concrete technique for surfacing exactly the tacit knowledge rare context names — interrogating the person for local vocabulary and conventions they would not think to volunteer unprompted.

## Applications

Opening work in an unfamiliar module, domain, or craft — a new auth subsystem, a discipline like colour grading — and pre-flighting a spec by having the model interview you about ambiguities until the architecture-relevant answers are settled.

## Sources

- https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns

## See Also

- [[unknowns-inventory-prompting]]
- [[disposable-artifact-specification]]
