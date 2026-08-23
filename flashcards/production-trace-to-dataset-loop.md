---
tags: [flashcards, llmops]
sr-due: 2026-07-14
sr-interval: 1
sr-ease: 250
---

# Production Trace-to-Dataset Loop — Flashcards

#flashcards/llmops

## Definition <!-- kb:card:b20e1d -->
What is the production trace-to-dataset loop?
?
A pattern where real production traces are promoted (typically after human/SME annotation) directly into offline evaluation datasets, so real usage — not hand-curated examples — becomes the source of truth for regression testing new agent versions.

## Application <!-- kb:card:578d6c -->
When would you rely on the production trace-to-dataset loop instead of hand-writing test cases?
?
When user behaviour evolves faster than engineers can anticipate and write new test cases for — letting real production traffic continuously refresh the eval dataset avoids a stale, manually-maintained golden set.

## Relationship <!-- kb:card:4a4788 -->
How does workspace/store architecture determine whether the trace-to-dataset loop can work?
?
The loop requires production traces and dev/eval datasets to be co-located in the same store (e.g. one workspace per product spanning all environments); splitting storage by environment (one workspace per env) breaks the loop because promoting a trace into a dataset would require a manual cross-boundary export that doesn't happen at scale.

## Relationship <!-- kb:card:cacd3f -->
How does the production trace-to-dataset loop relate to the human-in-the-loop pattern?
?
It implements HITL at the dataset-curation layer: an SME annotation queue is the human checkpoint, but instead of approving/rejecting a single agent action, the human's output becomes a permanent dataset row used for all future evaluation runs.
