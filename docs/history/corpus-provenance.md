# Corpus provenance

The reference corpus arrived as a **one-time copy** from the maintainer's
predecessor private vault (2026-08): the software-engineering and AI/ML
domains only, with personal domains excluded at the copy. All pipeline
provenance from the previous system — source pointers, job identifiers,
card references — was stripped before first publication, and the
pre-release git history (which contained the stripped fields) is preserved
in a private archive, not in this repository's public history.

Two facts from that lineage are load-bearing and carried forward:

- **The founding incident (2026-07-26):** an automated cleanup pass in the
  predecessor vault rewrote wikilinks inside code spans and destroyed
  concept-gap records. It is why `.kb/POLICY.md` exists, why agents are
  never trusted with bookkeeping (ADR-001), and why the supplier channel is
  envelope-bounded rather than merely schema-checked.
- **Parallel invention:** the predecessor system materially predates
  Karpathy's LLM Wiki gist and took the opposite position on the
  load-bearing question — there the model maintains the wiki; here the
  model is never trusted with the bookkeeping (see the launch writeup).

The full migration archaeology stays in the private archive; this page is
deliberately the whole public story.
