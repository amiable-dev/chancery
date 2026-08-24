---
title: Independent fix verification
aliases:
  - Hunt-fix-verify loop
  - Read-only verifier agent
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, security, agents, remediation, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://github.com/capitalone/VulnHunter
    hash: sha256:95e44d08c95b4e9ae22bf5359c159cc862f52840f161457be6dac26c935f9b54
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Independent fix verification

## Definition

**Independent fix verification** closes a remediation loop with an agent that took no part in producing the fix: it reads the repository and the finding report under a tool envelope that excludes command execution, network access and writes, and emits a per-finding verdict on whether the defect is actually remediated — so a fix is established by something with no stake in the answer rather than accepted on the word of whatever produced it.

## Explanation

Three design choices carry the weight. The first is separation of identity: whatever wrote a fix has already concluded the fix is correct, so asking it to verify replays the reasoning that would have produced the error, whereas a verifier starting from the report and the code without the fixing session's context has to re-derive the judgement from artifacts alone. The second is the restricted envelope, which is what makes the verdict mean anything — with no shell the verifier cannot make a test pass by re-running it or adjusting the harness, with no write access it cannot repair the code it is grading, and with no network it cannot be steered by fetched content; read-only is the integrity property of the verification, not a safety afterthought bolted on. The third is granularity: verdicts are emitted per finding rather than as one pass or fail over a batch, so partial remediation stays legible instead of collapsing into a single misleading result. Around the verifier sits the remediation discipline that gives it something to check — demonstrate the exploit, turn the demonstration into a failing security test, implement the fix until that test passes, confirm no regressions, and open a reviewable change — where the failing-then-passing test is the artifact that outlives the agent session and keeps the defect from quietly returning. The source is the README of a bank-published open-source suite whose three phases ship as prompt-defined skills for one coding harness; the loop structure and the envelope argument transfer, while the install steps and model pinning are what date the note.

## Key Properties

- The verifier is a separate agent that did not produce the fix and does not inherit the fixing session's context
- Read-only envelope — no shell, no network, no writes — is what makes the verdict trustworthy rather than merely safe
- Verdicts are emitted per finding, so partially remediated batches stay visible
- The fix phase is test-first: exploit demonstration, failing security test, fix, regression check, reviewable change
- The failing-then-passing security test is the durable artifact that survives the agent and blocks regression

## Relationships

- [[skill-enforced-development-workflow]] — is how this loop is delivered — hunt, fix and verify ship as separate skills invoked at phase boundaries, so each phase's rules arrive as mandatory instructions rather than as guidance one long session drifts away from
- [[stacked-agent-loops]] — hardens the verification layer of that architecture — instead of a scoring step inside the same run, the check becomes a separate agent with no shared state and no ability to alter what it is grading
- [[self-falsification-filter]] — guards the other end of the same pipeline — falsification decides which findings deserve a human's attention, this decides whether the fix that followed actually held
- [[evidence-recheck-triage]] — independent fix verification applies the identical separation-of-roles principle evidence-recheck triage states for finding triage — generator and checker must be different processes — to the fix side of the same pipeline: whoever proposed the remediation cannot be who confirms it worked.
- [[deterministic-agent-verification]] — independent fix verification is the model-judgment counterpart to deterministic verification's mechanical-check preference, used exactly where a compiler or test suite cannot yet reach — confirming a fix when no test exercises it, with independence substituting for a check's lack of stake.

## Applications

Splitting agent-driven remediation so the fixer and the verifier are different processes with different permissions; choosing a deliberately read-only tool envelope whenever an agent's job is to judge rather than to change; making a failing security test the definition of done for a vulnerability fix regardless of who authored it.

## Sources

- https://github.com/capitalone/VulnHunter

## See Also

- [[skill-enforced-development-workflow]]
- [[stacked-agent-loops]]
- [[self-falsification-filter]]
