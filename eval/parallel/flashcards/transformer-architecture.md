---
tags: [flashcards, machine-learning, neural-networks, attention, domain/llm, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Transformer architecture — Flashcards

#flashcards/machine-learning

## Transformer: definition <!-- kb:card:8b7269 -->
What is the Transformer architecture?
?
A sequence transduction architecture that dispenses with recurrence and convolution entirely, relying solely on attention: self-attention layers relate every position in a sequence to every other position directly, in an encoder-decoder configuration.

## Transformer vs recurrence: path length <!-- kb:card:809cb7 -->
How does the path length between any two tokens differ between a Transformer and a recurrent model?
?
Constant-length in a Transformer, since every layer attends over all positions at once; under recurrence it takes one step per position, since position t cannot be processed until t-1.

## Why Transformers parallelize training <!-- kb:card:4a8bce -->
Why does removing recurrence let Transformer training parallelize across sequence positions?
?
Recurrence imposes a sequential dependency (t depends on t-1) that blocks parallelization within a training example; attending over the whole sequence at once removes that dependency, so the whole sequence computes in parallel on accelerators.

## The Transformer's core trade-off <!-- kb:card:e79920 -->
What trade-off does the Transformer make in exchange for training parallelism and shorter dependency paths?
?
It pays attention's quadratic cost in sequence length — the architectural decision underneath essentially every modern large language model.

## Transformer: original benchmark evidence <!-- kb:card:3a7ec5 -->
What machine translation results did the original 2017 Transformer paper report?
?
28.4 BLEU on WMT 2014 English-to-German (over 2 BLEU past prior ensembles) and 41.8 BLEU single-model state of the art on English-to-French, trained in 3.5 days on eight GPUs.

## Transformer: generalization beyond translation <!-- kb:card:e0f77f -->
What did the original paper show beyond machine translation, and what did the architecture become?
?
Successful transfer to English constituency parsing, within the paper itself — and the architecture went on to become the substrate of modern large language models.
