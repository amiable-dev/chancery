---
tags: [flashcards, llm, prompting, reasoning, domain/llm, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Chain-of-thought prompting — Flashcards

#flashcards/llm

## Mechanism <!-- kb:card:a474b1 -->
Why does asking a model to show its reasoning before answering actually change its output, given autoregressive generation?
?
Every token is conditioned on tokens already emitted, so reasoning written into the output becomes part of the input for everything after it. The model composes its final answer from visible, already-committed intermediate steps instead of predicting it straight from the question.

## Zero-shot vs few-shot <!-- kb:card:0843a1 -->
What is the difference between zero-shot and few-shot chain-of-thought prompting?
?
Zero-shot triggers the behavior with a single instruction like "think step by step" — short prompt, minimal effort. Few-shot supplies two or three worked examples showing full reasoning, which the model imitates — longer prompt, more effort, worth it when the reasoning style itself needs demonstrating.

## When it doesn't help <!-- kb:card:bab4e6 -->
What kind of problem does chain-of-thought prompting fail to help with, and why?
?
A single-fact lookup — it has no steps to decompose into, so CoT buys nothing but extra tokens. The technique only helps where an answer decomposes into a sequence of easier sub-inferences.

## Not proof of correctness <!-- kb:card:c91043 -->
Why can't a chain-of-thought output be trusted as evidence that the final answer is correct?
?
A written chain can read as correct at every line and still reach a wrong answer — so for consequential work, the reasoning must be checked, not accepted as proof.

## Cost and trend <!-- kb:card:0c3b67 -->
What does chain-of-thought prompting cost, and how are newer reasoning models changing its role?
?
It costs extra output tokens, latency, and money on every call. Newer reasoning models are trained to produce these steps unprompted, moving the technique out of deliberate prompt engineering and into the model's default behavior.
