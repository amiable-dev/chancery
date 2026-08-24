---
tags: [flashcards, retrieval, language, evaluation, domain/llm, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Vocabulary mismatch — Flashcards

#flashcards/retrieval

## Furnas naming divergence <!-- kb:card:8fb80d -->
What did Furnas et al. (1987) measure about how often people choose the same name for the same object?
?
Even domain experts choose the same name for the same object only about 20% of the time — roughly 80% naming divergence.

## Zhao and Callan mismatch rate <!-- kb:card:1bcef5 -->
What did Zhao & Callan (2010) measure about how often an average query term appears in relevant documents?
?
An average query term fails to appear in 30-40% of the documents relevant to that query.

## Three layers of mismatch <!-- kb:card:ced174 -->
What are the three layers of vocabulary mismatch named in this concept?
?
Inflectional variants (addressed by stemming and lemmatization), synonymy across speakers, and terminology drift over time.

## Measured remedy gains <!-- kb:card:abe2bd -->
How much accuracy improvement did term-weight prediction and expert CNF query expansion measure over their baselines?
?
Term-weight prediction: 50-80% gains over strong keyword baselines. Expert Boolean CNF expansion: 50-300% over unexpanded queries.

## Founding motivation for LSI <!-- kb:card:ec5d93 -->
What technique did Furnas's vocabulary-mismatch result motivate, and what is its broader significance?
?
Latent semantic indexing — making vocabulary mismatch the founding problem statement for every technique that reaches beyond literal terms, from thesauri and alias tables to embeddings.
