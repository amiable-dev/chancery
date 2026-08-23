---
tags: [flashcards, chain-of-thought-prompting, llm, prompt-engineering, reasoning]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# Chain-of-Thought (CoT) Prompting — Flashcards

#flashcards/llm

## Definition <!-- kb:card:bfc7a5 -->
What is Chain-of-Thought (CoT) prompting?
?
A technique where a language model is instructed — via a trigger phrase or worked examples — to generate its intermediate reasoning steps before giving a final answer, rather than emitting the answer directly. Each "thought" builds on the previous one so the answer rests on a visible chain of correct steps instead of a single guess.

## Why it works <!-- kb:card:9c2d88 -->
Why does Chain-of-Thought prompting improve accuracy on multi-step problems?
?
LLMs generate text autoregressively — one token at a time, each conditioned on everything written before it. Written-out reasoning steps become part of the context the model reads next, so the final answer is built on top of visible, correct intermediate steps rather than guessed cold. It also decomposes a hard problem into small steps, which plays to the model's strength at simple, local predictions rather than requiring one large reasoning leap.

## Zero-shot vs few-shot <!-- kb:card:0846ee -->
What is the difference between zero-shot CoT and few-shot CoT?
?
Zero-shot CoT gives no examples — it just appends a trigger phrase like "Let's think step by step" and the model reasons on its own; best for quick/common problems. Few-shot CoT shows 1–2 fully solved examples with reasoning included, so the model copies the step-by-step style; the prompt is longer and takes more effort to write, but works better for harder or unusual problems.

## Application <!-- kb:card:8c64d4 -->
When should you use CoT prompting versus skipping it?
?
Use it for problems needing several linked steps: math word problems, logic puzzles, multi-step questions, decision-making, and reading comprehension. Skip it for single-fact questions (e.g., "capital of France") — there is nothing to decompose, and it only adds unnecessary tokens, time, and cost.

## Caveat <!-- kb:card:1fc5e3 -->
Why can't you blindly trust a Chain-of-Thought reasoning trace?
?
The reasoning can *look* correct step-by-step while still reaching a wrong final answer. Visible reasoning is inspectable, not verified — for important tasks the steps must be checked, not trusted blindly. This is the same principle underlying the [[genai-eval-envelope]] and multi-model verification approaches like council-verify.

## Relationship <!-- kb:card:2855e4 -->
How does Chain-of-Thought prompting relate to native "reasoning" behaviour in newer models?
?
Newer large reasoning models are trained to produce CoT-like reasoning traces by default, without needing an explicit trigger phrase in the prompt. CoT-the-prompting-technique is the manual precursor to CoT-as-a-trained-behaviour — and it's the conceptual basis for reasoning on/off toggles: turn it on for multi-step problems, off for single-fact/cost-sensitive queries.
