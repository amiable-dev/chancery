---
tags: [flashcards, retrieval, rag, embeddings, domain/knowledge-management, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Hypothetical document embeddings (HyDE) — Flashcards

#flashcards/retrieval

## Definition <!-- kb:card:452408 -->
What does HyDE embed at query time instead of the user's raw question?
?
A short passage an LLM generates that would answer the question in the corpus's register — that generated passage's vector, not the question's, is used to search the index. Index, embedding model, similarity metric and top-k stay unchanged.

## The geometric argument <!-- kb:card:f46143 -->
What geometric mismatch does HyDE correct for, and how?
?
Dense retrievers place semantically similar text close together but were never trained to place a question near its answer. Generating an answer-shaped passage turns the comparison into answer-vs-answer instead of question-vs-answer.

## Why hallucination is tolerable <!-- kb:card:e95a10 -->
Why doesn't factual hallucination in the hypothetical passage break HyDE?
?
The passage functions only as a retrieval representation, not as evidence — it needs the right vocabulary and register to pull the vector into the right neighbourhood, not factual correctness.

## The architectural safety boundary <!-- kb:card:a59b4a -->
What must never happen for HyDE to stay safe, and what goes wrong if it does?
?
The hypothetical passage must never enter the generation context as though it were retrieved evidence — if it leaks in, the fabrication reaches the user.

## When not to adopt it <!-- kb:card:d63a73 -->
Name two situations where HyDE is not worth adopting.
?
Any two of: latency is tight (it adds an LLM call on the read path); queries already carry strong identifiers or error codes; keyword or hybrid search already retrieves well; or there's enough labelled data to fine-tune the retriever directly.
