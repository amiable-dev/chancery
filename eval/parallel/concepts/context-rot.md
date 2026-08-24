---
title: Context rot
aliases:
  - Non-uniform long-context degradation
date: 2026-08-24
domain: llm
maturity: emerging
source_type: research
tags: [concept, llm, long-context, evaluation, domain/llm, maturity/emerging, source-type/research]
status: draft
sources:
  - url: https://www.trychroma.com/research/context-rot
    hash: sha256:cd9d6d56edb0206ddd7946e8b9790771413425b7c29ded3afdffdb5b46253ecf
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Context rot

## Definition

**Context rot** is the finding that a language model's reliability falls as its input grows longer even when the task is held constant, so the ten-thousandth token is not processed as dependably as the hundredth; the decline is non-uniform rather than a smooth tax, steepening when the question matches its answer semantically rather than lexically, when topically related distractors sit nearby, and — counter to intuition — when the surrounding text is logically coherent rather than shuffled.

## Explanation

The methodological move that makes the finding trustworthy is holding task complexity fixed and varying only input length. Most long-context benchmarks confound the two: a graph-traversal task gets harder as the graph grows, so a score drop cannot be attributed to length. Here the same needle, question and judge are reused while only the volume of surrounding irrelevant text changes, which isolates length as the variable. Across eighteen models the degradation appears everywhere, but its shape varies with four factors. Lower cosine similarity between question and needle steepens the slope, so exact-keyword retrieval flatters a model that will be asked ambiguous questions in production. A single topically related distractor lowers accuracy and four compound it, with individual distractors having very unequal pull and model families failing differently — some abstain under ambiguity, others answer confidently and wrongly. Needle-haystack similarity matters but not in one direction. Most surprisingly, shuffling the haystack to destroy local coherence improved scores consistently, suggesting input structure interacts with attention in ways nobody has yet explained. Even a trivial replicate-this-text task degrades once output length scales with input. The most operationally direct result is the conversational one: the same questions answered from roughly three hundred focused tokens beat the same questions answered from the full hundred-thousand-token session, because the long version silently adds a retrieval step to a reasoning task. The report comes from Chroma, a retrieval vendor whose commercial interest points squarely at the conclusion that you should retrieve less rather than stuff more, so the framing deserves scepticism — but it publishes its replication codebase, model list, embedding measures, judge-alignment procedure and its own inconclusive results, which is more disclosure than the conclusion required.

## Key Properties

- Isolates input length from task difficulty by holding the task constant and varying only surrounding irrelevant text
- Degradation steepens as question-to-answer semantic similarity falls; lexical-match benchmarks hide it
- Distractors compound non-uniformly, and model families fail differently — abstention versus confident hallucination
- Shuffling the haystack to remove logical flow consistently improved performance across all eighteen models
- Focused inputs of a few hundred tokens beat the same questions embedded in a hundred-thousand-token history

## Relationships

- [[transformer-architecture]] — supplies the leading structural account of the effect — self-attention relates every position to every other, so the pairwise relationships a longer input creates grow quadratically while the capacity to represent them does not
- [[golden-dataset-retrieval-evals]] — justifies that eval design's token-budget checkpoints, because reliability turns out to be a function of how much context was assembled and not only of whether the right item was retrieved

## Applications

Deciding whether to retrieve a focused subset or pour a full history into a large context window; discounting long-context claims that rest on needle-in-a-haystack scores; designing evaluations that vary input length while holding task difficulty fixed.

## Sources

- https://www.trychroma.com/research/context-rot

## See Also

- [[transformer-architecture]]
- [[golden-dataset-retrieval-evals]]
