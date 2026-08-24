---
tags: [flashcards, llm, retrieval, architecture, domain/llm, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Retrieval-Augmented Generation (RAG) — Flashcards

#flashcards/llm

## Definition <!-- kb:card:5f2103 -->
What is Retrieval-Augmented Generation (RAG)?
?
An architecture (Lewis et al., NeurIPS 2020) combining a pre-trained generative model's parametric memory with a non-parametric memory — a dense vector index of documents accessed via a neural retriever — so generation conditions on retrieved evidence, not weights alone.

## Two memories <!-- kb:card:be99a9 -->
What are the two memories RAG combines?
?
Parametric memory (the seq2seq generator's trained weights) and non-parametric memory (a dense vector index of documents accessed through a neural retriever).

## RAG-Sequence vs. RAG-Token <!-- kb:card:6260b0 -->
What is the difference between RAG-Sequence and RAG-Token?
?
RAG-Sequence conditions the entire generated output on one retrieved set of passages; RAG-Token can draw on different retrieved passages for each generated token.

## Empirical result <!-- kb:card:d454d9 -->
How did RAG perform on open-domain QA compared to baselines?
?
It beat both parametric-only seq2seq baselines and retrieve-and-extract pipelines, while producing more specific and more factual language.

## Lasting architectural claim <!-- kb:card:7168eb -->
What is RAG's lasting architectural contribution, beyond the specific benchmark results?
?
Externalising knowledge into a swappable index gives provenance and updatability that model parameters cannot — knowledge updates by swapping the index, not retraining the model.
