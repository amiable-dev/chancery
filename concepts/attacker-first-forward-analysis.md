---
title: "Attacker-First Forward Analysis"
date: 2026-07-21
domain: security
maturity: emerging
source_type: practitioner
topics: [static-analysis]
tags: [concept, security, static-analysis, sast, ai-agents, vulnerability-scanning, domain/security, maturity/emerging, source-type/practitioner, topic/static-analysis]
status: draft
sources:
  - url: https://github.com/capitalone/VulnHunter
    hash: sha256:95e44d08c95b4e9ae22bf5359c159cc862f52840f161457be6dac26c935f9b54
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Attacker-First Forward Analysis

## Definition
Attacker-first forward analysis is a vulnerability-discovery strategy that begins at attacker-accessible entry points — APIs, network messages, file uploads, any boundary where untrusted input enters a system — and reasons *forward* through the code to determine whether an attacker can actually reach and exploit a dangerous operation. It is the inverse of the conventional "sink-first" (backward) analysis strategy used by most static analysis tools.

## Explanation
Traditional SAST tools are sink-first: they pattern-match on dangerous operations (a raw SQL query, an `eval()` call, an unchecked file write) and then search *backward* through the call graph for a plausible attacker-controlled source that could reach it. This is computationally convenient — sinks are a small, enumerable set of dangerous APIs — but it inverts the actual causal direction of an attack, and it produces a well-known failure mode: the backward search finds a *hypothetical* path to a sink without confirming the path is actually attacker-reachable in practice (auth checks, input sanitisation, or business logic along the way may block it). The result is the false-positive flood that makes traditional SAST tools unpopular with development teams.

Attacker-first forward analysis flips the direction. The analysis starts from the actual entry surface of the running system — everywhere untrusted data can get in — and walks *forward* through the code as an attacker would experience it: "if I send this payload here, what happens to it next, and next, and next?" This produces findings that are grounded in a concrete, traceable journey from input to impact, rather than a backward-inferred hypothesis.

**Forward vs. backward, concretely:**

| | Sink-first (backward) | Attacker-first (forward) |
|---|---|---|
| Starting point | A dangerous API call in the code | An attacker-accessible entry point (API route, upload handler, message consumer) |
| Direction of reasoning | From sink, search backward for a source | From source, reason forward toward possible impact |
| What it answers | "Could some caller of this dangerous function be attacker-controlled?" | "If an attacker sends X here, where does it actually end up, and is that dangerous?" |
| Typical failure mode | False positives — plausible-looking paths that are actually blocked by controls the backward search didn't model | Requires enumerating entry points correctly; misses vulnerabilities in code with no discoverable external entry point |
| Confidence character | Pattern-matched, hypothesis-shaped | Evidence-shaped — the analysis has to actually trace the concrete forward path |

This is precisely the framing VulnHunter (Capital One's open-source agentic security tool) uses to describe its approach: "From pattern-matching to provability." Because a reasoning agent — not a fixed rule engine — is doing the forward walk, it can hold context across many files and functions, recognise where a control actually neutralises an otherwise-dangerous path, and stop pursuing dead ends the way a human security reviewer would.

**Why this needs agent-grade reasoning, not just a different graph algorithm:**
Forward analysis from an entry point requires understanding *semantics*, not just syntax: does this input-validation function actually block the dangerous characters, or does it have a bypass? Does this authorization check run before or after the sensitive operation? A deterministic taint-tracking engine can trace the mechanical data flow, but distinguishing "reaches the sink" from "reaches the sink *and can actually cause harm*" is where reasoning — and thus agent-powered analysis — adds value over rule-based dataflow tracking alone.

## Key Properties
- **Direction-inverted from convention:** starts at attacker-controlled input, not at a dangerous API pattern
- **Entry-point enumeration is the critical first step:** the analysis is only as complete as the entry-point inventory (APIs, uploads, message queues, CLI args, config files)
- **Evidence-shaped, not hypothesis-shaped:** a finding is a traced journey from input to impact, not an inferred possibility
- **Reasoning-dependent:** distinguishing "path exists" from "path is actually exploitable" requires semantic understanding of intervening controls, which favours agent-based over purely mechanical analysis
- **Complementary blind spot:** vulnerabilities in code with no reachable external entry point (e.g., a dangerous internal-only admin function with no exposed route) can be under-weighted relative to sink-first scanning, which would still flag the dangerous pattern regardless of reachability

## Relationships
- Contrasts with the conventional sink-first model that most legacy SAST tools use — this concept exists specifically to name and critique that default
- Feeds [[adversarial-self-falsification]]: a forward-traced candidate path is the input the falsification step then tries to disprove
- Shares motivation with [[reachability-aware-vulnerability-scanning]]: both filter for actual attacker/runtime reachability rather than raw pattern presence, but reachability-aware scanning operates at the coarser package-import level while attacker-first forward analysis operates at the fine-grained code-path level
- Implemented within [[agent-powered-sast]]: forward analysis is the reasoning strategy an agent-powered SAST pipeline can apply during its investigate phase, in place of or alongside sink-first pattern matching
- Related to [[ast-based-code-analysis]]: forward tracing still requires parsing and following code structure, even though the search direction and the semantic judgment differ from classic AST pattern matching
- Related to [[ai-assisted-penetration-testing]]: pentest agents reason forward from an entry point by construction (they attack from outside in); attacker-first forward analysis brings the same directional logic to static source review

## Applications
- **Agentic SAST pipelines:** Use forward analysis from an enumerated entry-point inventory as the primary hunt strategy, rather than defaulting to sink pattern matching, to reduce false positives on codebases with strong internal controls
- **API security review:** Especially suited to API-heavy codebases where the entry surface (routes, handlers) is well-defined and enumerable, making the "start here" step tractable
- **Legacy codebase triage:** On a large, unfamiliar codebase, building an entry-point inventory first gives a security agent a bounded, prioritised starting set rather than scanning every dangerous-looking pattern indiscriminately
- **CI security gates:** Pair forward analysis with a diff-aware trigger — re-run the forward trace only for entry points whose code path changed in a given PR

## Study
- Flashcards: [[flashcards/attacker-first-forward-analysis|Practice this concept]]

## Sources
- [capitalone/VulnHunter (GitHub)](https://github.com/capitalone/VulnHunter) — primary source; describes the attacker-first forward model as the core inversion of sink-first analysis, tagline "from pattern-matching to provability"

## See Also
- [[adversarial-self-falsification]]
- [[reachability-aware-vulnerability-scanning]]
- [[agent-powered-sast]]
- [[ast-based-code-analysis]]
- [[ai-assisted-penetration-testing]]
- [[offensive-defensive-symmetry]]
