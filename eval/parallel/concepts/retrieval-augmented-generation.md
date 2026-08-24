---
title: Retrieval-Augmented Generation (RAG)
date: 2026-08-24
tags:
  - concept
  - llm
  - retrieval
  - architecture
status: draft
sources:
  - url: https://arxiv.org/abs/2005.11401
    hash: sha256:72df6adcb0769869d4e3b2acd2cdd72495e74b49ba1c61dddeb013830df5d1e2
    retrieved: 2026-08-24
    reachability: ok
---

# Retrieval-Augmented Generation (RAG)

## Definition

**Retrieval-augmented generation (RAG)** is the architecture introduced by Lewis et al. (NeurIPS 2020) that combines a pre-trained generative model's parametric memory with a non-parametric memory — a dense vector index of documents accessed through a neural retriever — so that generation conditions on retrieved evidence rather than on model weights alone.

## Explanation

Large pre-trained models store factual knowledge in their parameters, but they cannot precisely access or update it, cannot show provenance, and lag task-specific architectures on knowledge-intensive work. The original formulation treats retrieval as a differentiable part of one fine-tuned system: a pre-trained seq2seq generator conditions on passages fetched by a dense retriever over a Wikipedia index. The paper defines two variants — RAG-Sequence, which conditions the whole generated output on one retrieved set, and RAG-Token, which can draw on different passages per generated token. On open-domain QA the combined system beat both parametric-only seq2seq baselines and retrieve-and-extract pipelines, while producing more specific and more factual language. The lasting contribution is the architectural claim: externalising knowledge into a swappable index gives you provenance and updatability that parameters cannot.

## Key Properties

- Two memories: parametric (seq2seq weights) plus non-parametric (dense vector index with neural retriever)
- Two conditioning granularities: per-sequence and per-token retrieval
- Knowledge updates by swapping the index, not retraining the model
- Retrieved passages provide provenance for generated claims

## Relationships

- _No relationships recorded yet._

## Applications

Open-domain question answering over a maintained document set. Any system that must cite evidence for generated claims or refresh knowledge without retraining.

## Sources

- https://arxiv.org/abs/2005.11401

## See Also

- _None yet._
