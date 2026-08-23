# Evidence base — 2026-08 research pass

The figures the ADRs lean on, with their sources. Entries marked *archive*
have their full citation trail in the dated pre-release assessment, which
lives in the private archive; the claim is carried here at survey strength
only (a KB017-style honest sentinel, not a verified citation).

| claim | used by | source |
|---|---|---|
| LLM-at-mutation-time inside a deterministic pipeline beats pure-deterministic bookkeeping (91.7–93.2% vs 5% on its benchmark); the study does not discriminate in-process calls from out-of-band task exchange | ADR-001 | [arXiv:2606.15903](https://arxiv.org/abs/2606.15903) |
| Correlated training data caps a panel's effective independence (~2 votes); frontier-model errors increasingly correlate | ADR-010 (as stated policy assumption) | [arXiv:2605.29800](https://arxiv.org/abs/2605.29800) |
| Agents route around MCP for capability access (~4–32× token cost vs CLI); code-execution guidance | ADR-008 | [Anthropic engineering: code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) |
| Agent Skills standard adoption (~46 clients, 2026-08 observation) | ADR-008 | [agentskills.io](https://agentskills.io) |
| Semantic search pays off as a hybrid over lexical, concentrated at 1,000+-file scale | ADR-007 | [Cursor: semantic search at scale](https://cursor.com/blog/semsearch) |
| Context rot sets in well below window limits | ADR-007 | Chroma Research, "Context Rot" (2025-07) |
| Deep-research citations resolve >94% but support their claims only 39–77% of the time; liveness checking detects unreachable citations at 6–79× | ADR-009, README | *archive* — 2026-08 deep-research audit survey |

Review trigger: each row is a dated observation (2026-08); rows are
superseded here, never edited.
