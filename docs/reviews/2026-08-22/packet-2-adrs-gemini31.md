### FILE: adrs/004-rubric-shape.md

**Verdict:** APPROVE-WITH-CHANGES

**Findings:**
1. **[BLOCKER]** Contradictory logic in knockout handling. Section Decision states: "Knockout disqualifiers — any YES discards" but Stage 3 claims "The default route is queue — never silent discard." If a knockout skips the routing table entirely, it risks becoming the exact silent discard Stage 3 prohibits.
2. **[SHOULD-FIX]** Unclear mechanism for exemplar injection. Section Decision states ordinals are "each anchored to exemplar notes committed in the repo". Since the CLI is model-free (Invariant 1), the CLI cannot read exemplars and perform the evaluation itself. The ADR fails to explain how the CLI passes these exemplars to the pluggable judgment supplier during the emission phase. 
3. **[NIT]** Section Context lists "future audit verdicts" as needing repeatable conversion, which implies an entirely separate command lifecycle not defined in the scope (only promotion and card-refresh are mentioned).

**MISSING:** The schema definition mapping the arbitrary JSON output of a pluggable supplier to the strict ordinal tuple required by the routing table.

---

### FILE: adrs/005-proposal-queue.md

**Verdict:** REJECT

**Findings:**
1. **[BLOCKER]** Violates Invariant 8 ("writes go through the gate") and Invariant 3 ("files are canon"). Section Decision dictates "the write proceeds provisionally" into the note while the proposal sits in `.kb/queue/*.jsonl`. If a human later rejects the proposal, the provisional value remains hardcoded in the canonical markdown file until a subsequent automated fix—which the context explicitly bans. 
2. **[BLOCKER]** Build-breaking blast radius. Section Decision states: "Ageing has teeth: `kb verify` fails on proposals left unreviewed past the threshold (KB011)." Because `kb verify` in CI is the contract, failing CI over an aged queue proposal will block unrelated commits and freeze the entire repository's deployment. 
3. **[SHOULD-FIX]** Vague threshold conditions. Section Decision introduces "trigger T6" and "R1b" ("The curator budget outranks the queue") without defining the numerical budget or how the CLI measures "adjudication demand" to trigger these simpler gates.

**MISSING:** The deterministic rollback mechanism: how the CLI actually reverts a "provisional write" in the canonical markdown file once a human curator explicitly rejects the queue proposal.

---

### FILE: adrs/006-two-tier-facets.md

**Verdict:** REJECT

**Findings:**
1. **[BLOCKER]** Violates Invariant 5 ("live notes stay lean... the consumer is a model reading the file"). Section Decision 2 requires that "Every value is emitted twice... as a mirrored nested tag... because in Obsidian, nested tags are facets." Deliberately bloating the canonical file with redundant tags solely for a human GUI contradicts the invariant that notes are optimized for models.
2. **[BLOCKER]** Impossible authoring loop. Section Decision 2 dictates "hand-editing either form is a lint failure." If a human cannot author the value, and the CLI never calls a model to generate the value (Invariant 1), there is no entry point for a facet to be assigned to a new note before it hits the gate.
3. **[SHOULD-FIX]** Flawed "min_uses: 3" logic. Section Decision 1 allows an open `topics` list where "a tag used once is a proposal, not a classification". If `kb verify` runs at the single-note lifecycle granularity (Invariant 4), it cannot accurately compute global `min_uses` across the corpus concurrently without locking or complex derived-state orchestration not mentioned here.

**MISSING:** A clear definition of how the "worked-exemplar calibration handed to every parallel classifier" (Section Decision 4) is serialized into the CLI's task JSON during the first phase of the judgment protocol.

---

### FILE: adrs/007-retrieval-posture.md

**Verdict:** REJECT

**Findings:**
1. **[BLOCKER]** Direct violation of Invariant 1 ("model-free CLI... NEVER calls a model"). Section Decision 3 dictates "rung 3 = local embeddings". Embedding computation requires executing a neural network model. Even if run locally and serverless, embedding logic inside the CLI strips it of its "model-free" invariant.
2. **[BLOCKER]** System overreach. Section Decision 4 states: "Grounding is checked deterministically: a query answer citing a concept that was not retrieved is rejected." `kb` is scoped as a "knowledge base for AI agents, maintained by a deterministic Node CLI". Intercepting and evaluating an external agent's "query answer" shifts the system from a storage layer into a runtime RAG gateway, violating the architectural scope.
3. **[SHOULD-FIX]** Unverifiable eval constraints. Section Decision 2 requires a "~30-query eval set, run monthly in CI". Calculating `recall@10` requires executing semantic/lexical queries. If `kb verify` in CI is the contract (and never touches the network per Invariant 2), the CLI must ship with a self-contained search engine just to grade its own tests.

**MISSING:** The specific deterministic algorithm or schema mapping used by the CLI to extract and attach the "hand-curated typed relationship graph" (Section Decision 1) to lexical hits without relying on a graph-traversing query language.

---

### Cross-Document Contradictions

*   **ADR-005 vs ADR-006 (Enum Validation vs Provisional Writes):** ADR-006 (Section Decision 1) dictates that closed axes are strictly "enum-validated, extended only via accepted queue proposals". Conversely, ADR-005 (Section Decision) states that for a novel value "the write proceeds provisionally". The system cannot strictly validate an enum if provisional (unaccepted) values are allowed to pass through the write gate.