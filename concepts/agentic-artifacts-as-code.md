---
title: Agentic artifacts as code
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: practitioner
tags: [concept, agents, operations, versioning, domain/software-engineering, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/
    hash: sha256:7380d808df58d13eab6825b0abb44ce95b2e7e379a8882cd80acaee96625d7be
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Agentic artifacts as code

## Definition

**Treating agentic artifacts as code** is the practice of placing every input that shapes an agent's behaviour — system prompts and prompt templates, tool manifests, policy configuration, memory schemas, evaluation datasets and model settings — under the version control, semantic diffing, review and formal change-approval discipline normally reserved for application source, on the grounds that these artifacts are production dependencies whose uncontrolled edits are a leading cause of agent failure.

## Explanation

In a conventional service the deployable surface is code plus configuration. In an agentic service that surface expands to a set of text and JSON/YAML artifacts that are trivially editable, frequently live in a vendor console outside the repository, and have no compiler or type checker to catch a regression. A tool manifest behaves like a package dependency: adding or altering a tool changes what the model can decide to do, and because a tool's output is appended to the next prompt, the change propagates into subsequent reasoning steps rather than staying local. Prompt edits interact unpredictably with model upgrades and data changes; the source names prompt drift as the dominant production failure mode and attributes the majority of production agent failures to uncontrolled prompt modification. The resulting discipline is concrete — store the artifacts in Git, require formal approval to change them, ship changes through progressive delivery such as A/B testing a prompt revision, and wire automatic rollback to behavioural metrics rather than to error rates, because a drifted agent generally does not throw. Runtime prompt-control platforms are compatible with the discipline only insofar as they still record and pin versions. The source is an InfoQ practitioner article and its failure-rate attributions cite vendor blog posts rather than controlled studies, so read the practice as accumulated operational experience.

## Key Properties

- Behaviour-determining surface: prompts, tool manifests, policies, memory schemas, eval sets, model configuration
- Tool manifests act as dependencies — a change alters capability and propagates into later reasoning through returned output
- Prompt drift is claimed as the dominant production failure mode for agentic systems
- Rollback triggers must watch behavioural metrics, since drift raises no error
- Runtime prompt control is compatible with the discipline only if versions remain pinned and recorded

## Relationships

- [[golden-trajectory-regression]] — supplies the behavioural baseline that makes rollback of these versioned artifacts decidable, since a drifted prompt raises no error to trigger on
- [[agent-harness]] — names the same surface from the architecture side — the harness is precisely what these versioned artifacts configure

## Applications

Bringing prompts and tool manifests out of a vendor console into the repository with review gates before an agent goes to production; adding semantic diffs and approval to prompt changes so a behavioural regression is attributable to a specific commit.

## Sources

- https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/

## See Also

- [[golden-trajectory-regression]]
- [[agent-harness]]
