---
tags: [flashcards, ai-agents, enterprise, governance, rag]
sr-due: 2026-05-06
sr-interval: 1
sr-ease: 250
---

# Deterministic Grounding — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:8bd15f -->
What is deterministic grounding in the context of agentic AI retrieval?
?
A property where agent outputs are traceable to specific, verifiable source documents via explicit provenance metadata, and the same query against the same data reliably produces the same structured result. Contrasted with semantic similarity search, which is probabilistic and provides no structural relationship understanding.

## Three failure modes <!-- kb:card:c48141 -->
What three failure modes does deterministic grounding address?
?
1. **Non-determinism** — same task run twice returns different answers with no record of what drove each
2. **Authority blindness** — semantic similarity ranks by text similarity, not domain authority (newer incorrect doc may outrank authoritative one)
3. **Structural ignorance** — vector search finds relevant text but doesn't understand schema relationships between entities or source supersession rules

## Enterprise threshold <!-- kb:card:cdf7e6 -->
Why is deterministic grounding described as "what separates a pilot from a production deployment"?
?
Without it, compliance and audit teams cannot approve agentic AI — they cannot trace which source drove an agent decision, reproduce past results, or establish governance accountability. With it, finance and risk teams gain the audit trail needed for production sign-off.

## Mechanism <!-- kb:card:fd9e35 -->
How is deterministic grounding achieved in a compilation-stage architecture?
?
Through: (1) pre-compiled knowledge artifacts that embed structural relationships and authority rankings; (2) per-field citations tracing every output to its source; (3) conflict resolution at compile time rather than at inference; (4) knowledge graphs encoding structural entity relationships.

## Relationship to semantic search <!-- kb:card:4ffb56 -->
How does deterministic grounding differ from standard vector/semantic search?
?
Semantic search finds text similarity but has no concept of source authority, structural relationships, or reproducibility. Deterministic grounding adds structural metadata, provenance, authority ranking, and conflict resolution — transforming probabilistic retrieval into governed, auditable knowledge access.
