---
title: Chain-of-thought prompting
date: 2026-08-24
domain: llm
maturity: emerging
source_type: practitioner
tags: [concept, llm, prompting, reasoning, domain/llm, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://outcomeschool.com/blog/how-does-chain-of-thought-prompting-work
    hash: sha256:a1f8a13671098cdc50e22770f53c31857d1809e52fd5d92f4714335b6aa3a434
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Chain-of-thought prompting

## Definition

**Chain-of-thought prompting** asks a model to write out its intermediate reasoning steps before stating a final answer, rather than requesting the answer alone. The mechanism follows directly from autoregressive generation: every token is conditioned on the tokens already emitted, so reasoning written into the output becomes part of the input for everything after it, and the model composes its conclusion from visible, already-committed steps instead of predicting a final answer straight from the question.

## Explanation

A language model produces one token at a time, each conditioned on the prompt plus everything it has already written. Demand only the final number and the model must commit to it in a single step, with no intermediate quantities in context to condition on and no mechanism for revising a wrong token once it is emitted — the mistake is already part of the input to whatever follows. Instructing the model to show its work changes what is present in context at the moment the answer is produced: intermediate results sit there as text, so the final step becomes a short inference from adjacent facts rather than a long one from the original question. A second effect compounds the first — decomposition turns one hard prediction into a sequence of easy ones, and models are reliable at easy steps. The model has not become more capable; it has been given room to work, the way a person doing arithmetic on paper outperforms the same person doing it in their head. Two modes exist. Zero-shot triggers the behaviour with a single instruction such as asking it to think step by step, keeping the prompt short and the effort near zero. Few-shot supplies two or three worked examples that show full reasoning, and the model imitates the demonstrated pattern — a longer prompt and real authoring effort, worth it when the reasoning style itself needs demonstrating on unusual problems. Three limits matter. The technique only helps where an answer decomposes: a single-fact lookup has no steps, so it buys nothing but tokens. A written chain is not proof — steps can read as correct at every line and still reach a wrong answer, so for consequential work the reasoning must be checked rather than trusted as evidence that the answer is right. And it costs output tokens, latency and money on every call. Newer reasoning models are trained to produce these steps unprompted, which moves the technique out of prompt engineering and into the model's default behaviour. The source is an educational blog post by a training-course founder with course promotion interleaved and no citations to the original literature; every claim in it is directly reproducible by running the prompts it supplies, so treat it as a clear tutorial rather than as evidence.

## Key Properties

- Mechanism is autoregressive conditioning — emitted reasoning becomes input for the tokens that follow it
- Zero-shot triggers the behaviour with an instruction; few-shot demonstrates it with worked examples at greater prompt length
- Helps only on problems that decompose; single-fact questions gain nothing but added tokens
- A chain that reads as correct can still reach a wrong answer, so the steps must be verified rather than trusted
- Costs output tokens, latency and money, and newer reasoning models emit the steps without being asked

## Relationships

- [[react-pattern]] — extends this technique into an environment, since a ReAct thought is a reasoning step whose successor is conditioned on an observation returned by a tool rather than only on the model's own preceding tokens
- [[agent-error-compounding]] — is the same conditioning mechanism running the wrong way — written steps shape everything after them, which helps while the steps are right and propagates the fault once an early one is wrong
- [[context-engineering]] — counts the cost this technique incurs, because intermediate reasoning consumes the same finite context budget that curation is trying to spend well
- [[hypothetical-document-embeddings]] — chain-of-thought prompting and HyDE share a generate-an-intermediate-artifact-to-improve-a-downstream-step pattern with opposite persistence choices — CoT's reasoning stays in context to condition the final answer, HyDE's hypothetical passage is discarded the moment its embedding is taken.
- [[agent-context-drift]] — chain-of-thought prompting explains the mechanism by which committed reasoning becomes durable context — exactly the durability that, unrevisited over a long task, is what context drift describes going stale.

## Applications

Math word problems, logic puzzles, multi-hop questions, decisions that weigh several options, and reading comprehension that must connect separated parts of a passage — anywhere the answer is not a single retrievable fact. Also a debugging aid, since a written chain shows which step went wrong when the answer is wrong.

## Sources

- https://outcomeschool.com/blog/how-does-chain-of-thought-prompting-work

## See Also

- [[react-pattern]]
- [[agent-error-compounding]]
- [[context-engineering]]
