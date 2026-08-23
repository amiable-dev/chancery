---
tags: [flashcards, ai-agents, product-development, user-research, feedback]
sr-due: 2026-07-04
sr-interval: 1
sr-ease: 250
---

# External Feedback Loop — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:518133 -->
What is the external feedback loop?
?
The outermost of three nested loop engineering loops. The cycle in which real users — friends, alpha testers, A/B production users — interact with a product and generate feedback that informs the developer's product vision. Operates at hour to week timescales. The loop that grounds product development in user reality rather than developer intuition alone.

## Purpose <!-- kb:card:211755 -->
What unique function does the external feedback loop perform that the two inner loops cannot?
?
It grounds product direction in actual user behaviour. The agentic coding loop can implement any spec quickly; the developer feedback loop can refine direction with good judgment — but neither can tell you whether users want what you're building. Only real users can answer "is this the right thing to build?" The external feedback loop is the product-market fit validation mechanism.

## New Role <!-- kb:card:e5ad9c -->
Why are engineers increasingly owning the external feedback loop in the agentic era?
?
Because coding agents have compressed implementation time so dramatically that the binding constraint shifts from "can we build it?" to "what should we build?" Engineers who can build fast now need to also determine what to build next — requiring skills previously owned by product managers: shaping product vision and systematically gathering user feedback.

## Tactics <!-- kb:card:67cc5e -->
What are Andrew Ng's three levels of external feedback tactics, from fastest to highest-signal?
?
1. **Ask a few friends** — fast, qualitative, cheap; catches gross mismatches early
2. **Alpha testing** — structured cohort testing; medium investment, medium signal; represents target users better than friends
3. **A/B testing in production** — controlled experiments with real users; quantitative, statistically valid; requires sufficient user volume; answers "which variant achieves metric X better"

## Failure Mode <!-- kb:card:02be3f -->
What is the failure mode of skipping the external feedback loop in agentic development?
?
Building faster and faster toward an increasingly well-specified version of the wrong product. Because agents make implementation so fast, developers can stay "almost done" indefinitely — polishing implementation quality while deferring the only signal that tells them whether they're building the right thing. Speed of execution makes deferring user validation feel safe, but it compounds the cost of discovering you built the wrong thing.
