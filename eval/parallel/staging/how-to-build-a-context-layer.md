# How to Build a Context Layer and a Company Brain

**Source:** https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> What it actually takes to turn a company's scattered knowledge into something an LLM can reliably use — and why the demo is 5% of the work.

---

Every company that adopts LLMs arrives at the same idea: “What if the model knew everything _we_ know?” The warehouse schemas, the Notion pages, the Slack threads where decisions actually get made, the tribal knowledge about which table is deprecated and which column lies. A company brain.

The demo version is a weekend project: chunk documents, embed them, retrieve top-k on cosine similarity, paste into a prompt. It works impressively well on the first ten questions — then falls apart in production, quietly. This article is about the gap, based on [a production system](https://getmodus.com/?utm_source=towardsdatascience&utm_medium=article&utm_campaign=launch_2026&utm_content=tomer_contributor) doing this across dozens of sources for many tenants.

## What a context layer actually is

Not a vector database. A vector database is one index inside it.

It’s a system that continuously maps source systems into normalized, typed context items; indexes them in multiple specialized ways; composes the right subset into a token budget at query time; learns from curation and usage; and acts on the sources it describes — all with tenancy, permissions, freshness, and cost as first-class constraints. Each verb hides a hard distributed-systems problem the demo never meets, because the demo ingests once, has one user, and is never asked “why didn’t it know about X?”

## Part 1: Continuous mapping

Ingestion is not a batch job; it’s a reconciliation loop that never terminates. Tables get dropped, channels archived, pages edited, permissions revoked. A brain that’s a week stale is worse than useless, because people trust it.

An ontology, not a pile of connectors. One sync script per source means twenty implementations of “list, fetch, paginate, handle deletes,” each with its own bugs. Instead, describe each source declaratively as a _datamap_ — a typed hierarchy of what exists there. A warehouse is connection → database → schema → table → column, with context types hanging off each level; a wiki is space → page → block. Once the hierarchy is data instead of code, one mining engine serves seven SQL warehouses without ever branching on a vendor’s name. Every mined artifact becomes a context item with identity derived from (tenant, type, path), which is what makes the system idempotent — your orchestrator _will_ retry and workers _will_ crash mid-batch.

The loop is a coverage query: given the hierarchy and what’s in the store, what’s missing and what’s stale? Each type declares its own refresh cadence, and refreshes need their own queue — share one with first-time mining and a backlog will starve a newly connected source for days. This needs a durable workflow orchestrator, not because scheduling is hard but because deduplicating triggers, capping fan-out, and surviving crashes are.

Deletion is the hardest part of sync. Things disappear through at least six channels: the source confirms removal, a parent’s manifest drops a child, a cursored record expires, a stale probe 404s, a re-walk finishes without seeing an item, a user disconnects a source. Worse, bounded collections (a table’s columns) and unbounded streams (tickets, PRs) need _opposite_ semantics — manifest-diff deletion on a cursored stream wipes all history below the watermark; full-rescan tombstoning on a bounded collection wastes enormous work. Neither throws an error. Miss one channel and the brain confidently describes a table dropped in March.

Mine behavior, not just structure. Query logs tell you which tables are alive versus abandoned and which joins analysts really use — and the best real queries, once validated, become golden queries: retrievable items worth more to a revenue question than any amount of schema metadata.

Identity resolution comes first. A private channel’s member list names chat-platform user IDs; your ACLs speak in your own principals. Resolving them before mining permission-scoped content is a correctness constraint, not an optimization — ingest a restricted item before its principals resolve and you’ve either leaked it or hidden it from its rightful readers.

Connections break, and the map freezes silently. Tokens expire and grants narrow; mining doesn’t fail loudly, it just stops while users keep trusting a fossilized map. You need one per-connection state machine, fed by probes and error classification, that the orchestrator consults and the UI surfaces.

## Part 2: Indexing

There is no single index that serves a company brain. You need a source of truth plus a fan-out of rebuildable projections:

-   Relational ground truth. Every item lives in a per-tenant Postgres schema. Writes commit here first, ACLs are enforced here last, every other index rebuilds from here. If you take one rule from this article: search indexes are caches, the database is the truth.
-   A keyword index for lexical recall. Users search for `dim_customers_v3`, and no embedding model ranks that reliably above `dim_customers_v2` on semantics alone. BM25 does.
-   A vector index — one collection for natural-language descriptions, another for code-like content such as validated SQL, with different embedding models. You only discover that split by measuring.
-   A knowledge graph for structure: containment, joins, dashboard→table lineage. “What breaks if I drop this table?” is a traversal; forcing it through similarity search is malpractice.

Embedding pipelines are ETL, not a function call. Between truth and each projection sits a watermark-based sync, and enrichment comes first: a column named `f_stat_cd` needs an LLM-generated description before it’s worth embedding. Projections lag the truth, which is fine only if every pipeline has explicit cleanup phases and a rebuild runbook you’ve rehearsed.

Multi-tenancy shapes everything. Isolation should be physical, not a WHERE clause: schema, index, collection, and graph per tenant. A forgotten filter fails open; a wrong index name fails closed. The cost is lifecycle machinery – provisioning, ordered teardown, orphan watchdogs — but that’s finite and auditable in a way “did every query remember the tenant filter?” never is. ACLs must propagate into every projection as filters, but search indexes are only permissive prefilters: the last check before content reaches a prompt must be the relational store.

## Part 3: Retrieval is an orchestration problem

“Retrieve top-k and paste” doesn’t survive heterogeneous context. A revenue question might need a warehouse schema, a validated SQL example, a wiki page defining “revenue,” and a thread about a known data issue — each at a different level of a different hierarchy in a different index.

Retrieval starts with scope, not search. The whole brain is almost never the right search space. The unit users configure is a scoped bundle — call it a skill: a slice of the map packaged with instructions for a purpose (“finance analyst,” “support triage”). That scope compiles once into an authoritative filter clause reused by every retrieval path and re-checked on the way out, because rules referencing deleted assets must match _nothing_ rather than everything, and out-of-scope items sneak in through graph traversals.

Retrieval itself is a composition engine: a dynamic graph of strategies executed in parallel, each declaring a predicate (“run when entity phrases exist and no warehouse candidates do”) and contributing candidates when it fires. Entity extraction feeds keyword and embedding search; hierarchy gates route on candidate counts; repair strategies fetch a parent when only orphaned children matched. The graph’s shape emerges per query — more machinery than a fixed pipeline, and what lets one engine serve wildly different sources without becoming an if-else forest. Logging the executed graph as a diagram on every run turns “why didn’t it know about X?” from archaeology into a five-minute trace read.

Two principles inside it. Know when _not_ to call an LLM: count thresholds route each stage, so a handful of candidates gets fetched wholesale, hundreds get an LLM relevance filter, and thousands get vector search plus a reranker first, because serializing ten thousand column names into a prompt is expensive and useless. Budget tokens at every layer, degrading detail as needed (full metadata → summary → name only). “Was the right item retrieved?” and “did it survive into the 15k tokens the model read?” are different failures needing different metrics.

## Part 4: The brain must be taught — and must learn

A purely mined brain plateaus fast, because the most valuable knowledge was never written anywhere a connector can reach. Users need first-class ways to add notes (“this table double-counts refunds before 2024”), files, and saved queries — stored as context items with the same identity, ACL, and lifecycle machinery as mined ones, attached to assets so a note surfaces whenever its table does. Curated knowledge must _outrank_ mined metadata on conflict, since a human correction is exactly the signal a generated description lacks.

Usage teaches it too. Mine real conversation traces into structured learnings (“when users ask about churn they mean `customer_events,` not `churn_raw`“), curate them on a schedule so the store doesn’t silt up with contradictions, and feed survivors back into composition as ranking tie-breakers — influence, not veto, so one bad inference can’t hijack retrieval. A brain that only reads its sources is a search engine; one that remembers how it was corrected compounds.

## Part 5: Answering means acting

A question deserves an answer, not a reading list. So the agent on top _executes_: writes SQL against the warehouse, calls the tracker’s API, fetches the dashboard. Execution credentials must be separate from mining credentials — the identity crawling metadata nightly and the one running a user’s query at 2pm have different blast radii and rate-limit budgets. And anything that writes needs interrupt-and-approve, forcing the runtime to suspend mid-graph, persist durably, and resume where it stopped for a user who answers tomorrow — hard enough that checkpoint infrastructure becomes load-bearing.

It also has to act where people already work. A context layer that only answers in its own web app loses to the one that answers in the thread where the question was asked — so chatbots, an API and SDKs, and MCP servers so _other_ AI assistants consume the same context with the same permissions. The brain’s most demanding customer turns out to be another machine, and each surface is another auth mode where ACLs must hold.

## Part 6: An LLM gateway, because providers will fail you

At thousands of LLM calls an hour across mining, enrichment, filtering, and chat, provider SDKs scattered through application code is a reliability and accounting disaster. A gateway earns its keep three ways. Route-level fallback: the unit of failure is model × provider × transport × tier, so cooldowns live in shared state and a throttled route doesn’t take down a healthy one for the same model. First-token timeouts: a provider will open a stream and never emit a token, and bounded retries turn a 120-second dead wait into transparent failover. Mandatory usage attribution: every call carries tenant, user, feature, and surface, enforced at the client constructor so anonymous calls are impossible — which makes a bill spike one query away, and is nearly impossible to retrofit.

## Part 7: Trust infrastructure

Retrieval quality degrades invisibly unless measured. No user files a ticket saying “the context was 8% worse this week.” The working setup: golden datasets of real questions with labeled ground truth (_these items are required for this question_), deterministic precision/recall against what the composer actually selected, recall@token-budget at several checkpoints, and LLM judges only for what determinism can’t settle — running nightly with regression alerting. Every change to a strategy, embedding model, or filter prompt is an experiment against this harness, not a vibe check. Standard APM won’t help: it sees your traffic but not your prompts.

Privacy leaks through your infrastructure’s durable state. A workflow orchestrator persists every activity’s inputs and outputs in its event history, so customer data lands in your orchestration vendor’s storage unless you apply a claim-check pattern: offload payloads above a tiny threshold to your own encrypted store and persist only a reference. Same for agent checkpoints and any persistent queue.

## Closing advice

Each piece above exists because its absence produced a concrete failure: ghost tables, cross-tenant near-misses, silent retrieval regressions, provider outages taking down chat, unattributable five-figure API bills. Three principles compress most of the lessons:

1.  Treat everything downstream of the relational store as a rebuildable projection. The moment an index becomes unrebuildable truth, you’ve lost the ability to fix mistakes.
2.  Make identity deterministic and every operation idempotent. Retries aren’t an edge case in this architecture; they are the architecture.
3.  Build the evaluation harness before the third retrieval strategy, not after the thirtieth. You cannot safely refactor what you don’t measure, and retrieval quality fails silently by default.

And if you’re deciding whether to build or buy: build if the context layer _is_ your product; buy if it’s a feature. The demo takes a weekend. The brain takes a platform team — the distance between them is everything in this article.

* * *

_Tomer Mesika is co-founder and CTO of [modus](https://getmodus.com/?utm_source=towardsdatascience&utm_medium=article&utm_campaign=launch_2026&utm_content=tomer_contributor). Before modus, he was Head of Architecture at Cyera, where he built enterprise data security now used across roughly 10% of the Fortune 500. At modus he leads engineering on the Context Warehouse, the layer that grounds AI agents in a company’s own data so internal teams get reliable answers about their business._

* * *

> Note: The owner of Towards Data Science, Insight Partners, also invests in modus. As a result, modus receives preference as a contributor.
