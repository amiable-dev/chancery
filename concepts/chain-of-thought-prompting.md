---
title: "Chain-of-Thought (CoT) Prompting"
aliases: ["Chain-of-Thought (CoT) Prompting"]
date: 2026-07-13
domain: llm
maturity: established
source_type: research
topics: [context-engineering]
tags: [concept, llm, prompt-engineering, reasoning, fundamentals, domain/llm, maturity/established, source-type/research, topic/context-engineering]
status: draft
sources:
  - url: https://outcomeschool.com/blog/how-does-chain-of-thought-prompting-work
    hash: sha256:a1f8a13671098cdc50e22770f53c31857d1809e52fd5d92f4714335b6aa3a434
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Chain-of-Thought (CoT) Prompting

## Definition
**Chain-of-Thought (CoT) prompting** is a technique where a language model is instructed — explicitly (via a trigger phrase) or implicitly (via worked examples) — to generate its intermediate reasoning steps before producing a final answer, rather than emitting the answer directly. Each "thought" in the chain is a small reasoning step that builds on the previous one, so the final answer rests on a visible sequence of correct intermediate steps instead of being guessed in one shot.

## Explanation
LLMs generate text autoregressively: one token at a time, with each new token conditioned on everything written so far. This has a specific consequence for reasoning tasks. If a model is forced to commit to a final answer immediately (e.g., "give only the final number"), it has no mechanism to correct an early mistake — the answer is produced cold, with no intermediate scratch space. On multi-step problems this produces avoidable errors even though each individual step is easy for the model.

CoT prompting fixes this by asking the model to "think out loud": write out the reasoning steps first, then give the answer. Because those written reasoning tokens become part of the context the model reads next, the final answer is now built *on top of* visible, checkable steps rather than guessed from nothing. This is sometimes described as giving the model "paper to write on." A second, independent benefit: decomposing a hard problem into a sequence of small steps plays directly to what autoregressive models are actually good at — easy, local, single-step predictions — rather than requiring one large leap in reasoning ability. The model isn't smarter with CoT; it simply has structured room to think, and the problem has been reshaped into a form the model's underlying mechanism handles well.

**Worked example (apple problem):**
- Without CoT: `Q: A shop has 12 apples, sells 5, buys 8 more. How many now? Give only the final number.` → the model jumps straight to a number, and on harder variants this jump is often wrong.
- With CoT: append `Let's think step by step.` → the model responds: *"We start with 12 apples. After selling 5, we have 12 − 5 = 7. After buying 8 more, we have 7 + 8 = 15. So the final answer is 15."* Each thought explicitly uses the result of the prior thought — that chaining of dependent steps is why it's called a *chain* of thought.

### Zero-shot CoT vs. Few-shot CoT
| | Zero-shot CoT | Few-shot CoT |
|---|---|---|
| Examples given | None | 1–2 fully worked examples with reasoning shown |
| Trigger mechanism | A line like *"Let's think step by step"* | The model pattern-matches the step-by-step style from the examples and copies it |
| Prompt length | Short | Longer |
| Effort to write | Minimal | More — you must author solved examples |
| Best for | Quick, common problem types | Harder or unusual problems where an explicit trigger phrase alone isn't reliable |

## Key Properties
- **Autoregression-grounded** — the mechanism only makes sense because LLMs generate token-by-token, conditioning each token on prior tokens; CoT works by manipulating what's already "on the page" for the model to condition on
- **Decomposition, not augmentation** — CoT doesn't add model capability; it reshapes a hard single-leap problem into a chain of easy local steps
- **Two invocation modes** — zero-shot (trigger phrase only) and few-shot (worked examples establish the pattern)
- **Task-dependent value** — helps most on problems with several linked steps (math, logic, multi-step decisions); adds nothing for single-fact lookups ("capital of France")
- **Visible but not verified** — the reasoning trace is inspectable, but a plausible-looking chain can still land on a wrong final answer; visibility is not the same as correctness
- **Cost trade-off** — more output tokens (reasoning text) means more latency and inference cost, generally an acceptable trade for improved accuracy on multi-step tasks
- **Increasingly native in newer models** — large reasoning models are trained to emit reasoning steps by default, without requiring an explicit CoT trigger in the prompt

## Relationships
- Foundational precursor to [[llm-as-a-judge]] and eval-time reasoning: many judge prompts rely on the model producing a rationale (a CoT trace) before a verdict, so the judgment itself can be inspected
- Connects to the **[[genai-eval-envelope]]** caveat that visible reasoning still requires external checking — CoT traces "look right" but must be verified, not trusted blindly, for important tasks; this is the same "verify, don't blindly trust" principle underlying `council-verify`
- Related to [[show-dont-tell-prompting]]: both are prompt-engineering techniques for getting a model to do the *right kind* of work rather than jumping to output — show-don't-tell supplies a structural reference, CoT supplies reasoning scaffolding
- Distinguished from native reasoning in large reasoning models: those models produce CoT-like traces without needing the prompt-level trigger — CoT-the-prompting-technique is the manual precursor to CoT-as-a-trained-behaviour
- Practical basis for OpenClaw's `/reasoning` toggle: turning reasoning "on" gives the model the same step-by-step room CoT prompting manually elicits; turning it "off" is appropriate for single-fact, cost-sensitive queries where CoT would add nothing (mirrors the local-model note's finding that long reasoning chains can stall small/local coding models — reasoning isn't free and isn't always the right call)

## Applications
- **Math word problems and arithmetic chains** — where the answer depends on several sequential calculations
- **Logic puzzles** — where one wrong step invalidates the whole answer
- **Multi-step / multi-fact questions** — where the answer depends on combining several earlier facts
- **Decision-making tasks** — weighing multiple options before choosing
- **Reading comprehension** — connecting information across different parts of a passage
- **Not needed for single-fact lookups** — trivial factual questions have nothing to decompose; adding CoT is pure overhead
- **When to actually turn it on/off** — use it (or enable a reasoning toggle) for multi-step/harder problems; skip it for quick, cheap, single-fact queries

## Study
- Flashcards: [[flashcards/chain-of-thought-prompting|Practice this concept]]

## Sources
- [How does Chain-of-Thought (CoT) Prompting work?](https://outcomeschool.com/blog/how-does-chain-of-thought-prompting-work) — Amit Shekhar, Outcome School. Beginner-friendly explainer grounding CoT in autoregression, with zero-shot/few-shot comparison and worked examples.

## See Also
- [[show-dont-tell-prompting]]
- [[genai-eval-envelope]]
- [[llm-as-a-judge]]
- [[prompt-altitude]]
- [[openclaw]]
