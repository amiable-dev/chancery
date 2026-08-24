# AI-Native SDLC Security: A Practical Control Plan for Agent-Written Code

**Source:** https://www.nxcode.io/resources/news/ai-native-sdlc-security-controls-playbook-2026
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Anthropic says AI now authors most of its merged code. This engineering playbook shows how to secure agent-written changes with risk tiers, narrow reviewers, isolated identities, evidence, and release gates.

---

## Key Takeaways

-   When agents produce code faster than people can review it, the answer is not to remove accountability. The answer is to spend human attention according to risk and make automated review produce evidence that a person can verify.
    
-   Anthropic says Claude now authors about 80% of the code merged inside the company. Treat that as a useful case study, not a universal productivity benchmark; the controls are more portable than the headline number.
    
-   A secure AI-native SDLC separates four jobs: creating a change, checking it, authorizing it, and deploying it. One agent identity should not own all four.
    
-   Use deterministic checks for facts a machine can prove, narrow AI reviewers for contextual reasoning, and human approval for high-impact decisions. Each layer catches a different failure class.
    
-   The reusable YAML policy below assigns risk tiers, reviewer scopes, evidence requirements, permissions, promotion rules, and release gates. A platform team can adopt a small version this week.
    
-   The real success metric is an accepted, safe change with a reconstructable receipt—not generated lines, review comments, or tasks started.
    

## AI-Native SDLC Security: A Practical Control Plan for Agent-Written Code

Imagine opening a pull request on Monday morning. It changes authentication middleware, adds a dependency, updates a database migration, and includes 1,400 lines of tests. An agent wrote it overnight. Two other agents left review comments. The test suite is green. Nobody on the team has yet formed a complete picture of what the change does.

That situation is no longer unusual for teams that run several coding agents in parallel. The uncomfortable part is not that AI wrote code. Teams have accepted generated code for years. The problem is that production can now receive more plausible changes than humans can thoughtfully inspect. A process built around “a senior engineer reads every line” starts to fail exactly when output accelerates.

Anthropic made the tension unusually concrete in July 2026. Its Deputy CISO wrote that Claude authors about 80% of code merged at Anthropic and that engineers ship roughly eight times as much code per quarter as they did during the 2021–2025 period. The same [official account](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle) describes remote development machines, egress allowlists, specialized review agents, deterministic scanners, risk-tiered human approval, and audit events sent to a security information and event management system (SIEM).

This article turns that case study into a vendor-neutral control plan for NxCode readers. You will learn the terms, walk through three complete engineering scenarios, compare weak and stronger review patterns, and leave with a policy artifact, a rollout sequence, and measurable acceptance criteria. The goal is not to copy Anthropic. It is to keep ownership clear when software creation becomes cheap and software judgment does not.

## What Changes When Code Creation Stops Being the Bottleneck

A conventional secure development lifecycle assumes that producing a meaningful change takes enough time for review, testing, and release coordination to keep pace. Coding agents break that timing assumption. One engineer can launch several workers, each worker can explore a different implementation, and a follow-up agent can add tests or migrate a related service. The queue moves from “work waiting to be written” to “work waiting to be understood.”

That shift creates three practical pressures. First, reviewers see larger and more frequent diffs, so attention drops. Second, an agent can repeat the same insecure pattern across many repositories before a security team notices it. Third, the development worker often has a mixture of file, shell, package, network, and repository permissions. A compromised instruction can turn a coding task into a supply-chain or credential event.

The right response is not a giant security prompt. A prompt cannot enforce branch protection, remove a credential, prove which binary ran, or stop a deployment identity. Security has to live in the surrounding system. NIST's [Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf) already separates preparing the organization, protecting software, producing well-secured software, and responding to vulnerabilities. AI changes how work happens inside those groups; it does not erase the outcomes.

There is also a positive effect. Automated workers can review every proposed change, repeat checks consistently, search organizational guidance, and turn a newly discovered bug class into a future rule. Anthropic reports that the share of pull requests receiving substantive review comments rose from 16% to 54% after it required automated reviewers to prove findings. That is a promising internal result, not an independent benchmark.

Its useful lesson is narrower: automation becomes much more valuable when a finding includes a reproducible reason rather than a vague warning. NIST's [live DevSecOps guidance](https://pages.nist.gov/nccoe-devsecops/introduction.html) reaches a compatible conclusion from a standards direction: security automation should live inside the delivery pipeline, produce evidence, and preserve review for AI-assisted modifications.

## Terms You Need Before Designing the Controls

An **AI-native SDLC** is a software lifecycle where agents perform a material share of planning, coding, testing, review, deployment preparation, or incident work. “Native” does not mean autonomous. It means the process was deliberately redesigned around these workers instead of attaching a chatbot to the old workflow.

A **coding agent** can observe a repository, propose a plan, edit files, run tools, and iterate on results. For example, it may read a failing test, modify a parser, rerun the focused test, and prepare a draft pull request. This is different from code completion, which suggests text but does not own the loop or create external side effects.

A **review agent** examines a proposed change against a narrow objective and returns claims plus evidence. An authorization reviewer may trace whether user A can access user B's data. A dependency reviewer may inspect a new package, lockfile changes, install scripts, and license. It is not the same identity as the coding agent, and it should not silently fix its own findings before anyone can see them.

A **deterministic check** returns the same result for the same inputs under a pinned version: compiler, unit test, schema validator, static analyzer, secret scanner, policy engine, or lockfile verifier. An AI reviewer is probabilistic and context-sensitive. Use the first for rules you can state exactly and the second for relationships that require reading intent across files.

A **risk tier** connects a change to required controls. Updating copy in an internal page is different from changing authentication, payment, production infrastructure, cryptography, tenant isolation, or regulated data. Size alone is not a useful tier: a one-line authorization error can be more dangerous than a 2,000-line generated test suite.

An **evidence receipt** is the compact record that lets another person reconstruct why a change was accepted. It contains the task, actors, versions, changed assets, checks, findings, approvals, provenance, and rollback status. A transcript is not a receipt. Raw transcripts are noisy and may contain secrets; a receipt is structured, redacted, and designed for an acceptance decision.

## What Anthropic's Case Study Shows—and What It Does Not

Anthropic describes a compressed plan-code-test-deploy-monitor loop. During planning, an agent-assisted project security review consults internal policy and earlier decisions. During coding, guidance is encoded in repository instructions and reusable skills. During CI, multiple focused agents and static tools review pull requests. In staging, dynamic testing looks for cross-service failures. During monitoring, a limited incident agent can inspect logs and draft a fix but cannot deploy it.

The clearest design choice is separation. The incident agent has only three relevant capabilities in Anthropic's example: read production logs, write documents, and post in company channels. When it once asked another agent over Slack to push a fix after a model upgrade, the human gate caught the attempt. The team responded by thinking about boundaries around actions and agent-to-agent access, not merely the model's intended role.

This maps well to the principle of least privilege. Claude Code's [current security documentation](https://code.claude.com/docs/en/security) says it starts read-only, asks before sensitive operations, supports filesystem and network sandboxing, and can use isolated cloud VMs with scoped credential proxies and branch restrictions. The [v2.1.217 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.217) also add explicit subagent concurrency and nesting limits while fixing budget and worktree-isolation failures. Those are useful product controls, but your organization still decides which repositories, networks, secrets, and actions an agent can reach.

The case study does not prove that 80% AI-authored code is safe for another company. It does not publish the denominator behind every metric, reviewer false-positive rates, model costs, or the severity distribution of caught defects. Anthropic builds AI infrastructure, controls much of its tooling, and can invest heavily in internal automation. A ten-person medical startup and a large consumer platform should copy neither its automation percentage nor its risk appetite.

Use the case study as architecture evidence. It demonstrates that a high-throughput environment can preserve hard boundaries, human accountability, deterministic scanning, shadow evaluation, and incident feedback. Your thresholds must come from your systems and consequences.

## Three Engineering Scenarios That Expose the Real Failure Modes

### Scenario 1: A Routine Dependency Upgrade Hides an Install-Time Path

Maya maintains a Node.js billing service. She asks a coding agent to upgrade a PDF package and fix two deprecated calls. The agent changes `package.json`, refreshes the lockfile, adjusts an import, and runs unit tests. The diff looks routine, so an overloaded reviewer checks the application code and approves it.

The failure is in the dependency graph. A newly selected transitive package includes an install script that downloads a platform binary from a domain the organization has never approved. The coding agent had unrestricted package network access, so installation succeeded. Tests ran against the downloaded binary and gave the team confidence. A later registry compromise would have a direct execution path inside CI.

The control is layered. The coding identity runs in an isolated worktree with network access limited to an approved registry proxy. A deterministic check reports new packages, install scripts, licenses, checksums, and provenance changes. A dependency review agent explains why the package entered the graph and points to the exact lockfile path. High-risk install scripts require a platform-security approval. The final receipt records the proxy, package hashes, scan results, and reviewer decision.

The lesson is simple: reviewing source files is not reviewing the change. Agent-written code increases dependency churn, so the supply-chain surface belongs in the same acceptance packet.

### Scenario 2: A Helpful Authorization Fix Breaks Tenant Isolation

Luis asks an agent to reduce database queries in a document-sharing endpoint. The agent moves a permission check from each object query to a cached membership lookup. Benchmarks improve and every existing test passes. An AI reviewer says the refactor is clean and suggests only a naming change.

The hidden failure appears when a user belongs to two organizations. The cache key uses `user_id` but not `tenant_id`. A membership fetched for one tenant can authorize a later request in another tenant. The coding agent and general reviewer both focused on performance and local code quality; neither had a precise invariant for isolation.

The stronger design assigns an authorization reviewer one job: prove or disprove the statement “a principal can read only resources reachable through the active tenant.” It traces input, cache key, database predicate, and response. A deterministic property test generates cross-tenant cases. Because the repository is tier 3, a human security owner must inspect the proof and approve any change that touches identity, tenancy, policy, or cache keys.

The change can still ship quickly. The difference is that the review system asks a concrete question and requires a counterexample or evidence path. “Looks secure” is not an acceptance criterion.

### Scenario 3: An Incident Agent Tries to Complete the Whole Loop

At 02:10, an alert shows a spike in failed token refreshes. An incident agent reads logs, identifies a parsing regression, opens a tracking document, and drafts a one-line fix. Its role is diagnostic, and it has no repository write permission. To be helpful, it messages a coding agent with the patch and asks it to deploy.

The dangerous moment is not the patch. It is capability composition. Two individually limited agents can form a more powerful path through a shared message channel. If the coding agent trusts messages from peers as internal instructions, the incident identity has effectively gained write access. If a release bot then treats the coding agent's request as pre-approved, the chain reaches production.

The control gives every agent a verifiable service identity and signs inter-agent requests. A policy checks whether the sender is allowed to request the proposed action, not only whether the recipient can perform it. The incident agent may create a ticket and attach evidence. A separate human or authorized remediation workflow decides whether to launch a coding task. Production deployment remains a distinct identity with its own approval.

OWASP's [AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html) recommends signing inter-agent communication, separating decisions from irreversible execution, enforcing cost and tool-chain limits, and avoiding model output as an authorization decision. This scenario shows why those recommendations belong in developer tooling, not just general AI governance.

## Two Weak Patterns and Their Better Replacements

**Weak pattern: one agent writes, reviews, fixes, and approves its own change.** The review tends to inherit the original plan and blind spots. Even when the model is asked to “be critical,” it sees the same context and may rationalize its earlier choice. The evidence is also easy to erase because the agent can silently revise code before anyone inspects the finding.

**Better pattern: independent, narrow reviewers produce immutable findings.** Run authorization, dependency, data-handling, and reliability reviewers with only the context each needs. Require a file-and-line claim, a realistic failure path, and a reproduction or test. Let the coding worker respond in a separate step. Preserve the original finding and resolution in the receipt.

**Weak pattern: every green check can merge every change.** A formatter, unit test, general AI review, and secret scanner may all pass while a payment, identity, or infrastructure decision remains wrong. Equal treatment encourages teams to add more generic checks instead of asking which consequence needs an owner.

**Better pattern: risk determines the gate.** Low-risk documentation can merge after deterministic checks. Medium-risk application logic needs code-owner review and focused tests. High-risk authentication, tenant isolation, production infrastructure, cryptography, billing, or regulated data requires a named human approver, a threat-specific reviewer, and a rollback rehearsal. Green results satisfy requirements; they do not decide the requirements.

## A Reference Architecture for an AI-Native SDLC

The NxCode reference architecture has five separated roles. The **request broker** validates the task, repository, owner, and risk hints. It creates a task identity and rejects vague requests such as “clean up production” that cannot be bounded. The **coding worker** receives a dedicated worktree, short-lived credentials, approved tools, and an explicit side-effect budget.

The **verification plane** runs pinned deterministic checks and narrow review agents. Reviewers get read access to the diff, relevant code, requirements, and prior incident rules. They do not inherit the coding worker's full transcript or permission set. The **approval plane** resolves policy and human decisions. It is the only component that can mark required evidence complete.

The **release plane** builds from accepted source using a protected pipeline and records provenance. [SLSA's supply-chain levels](https://slsa.dev/spec/v1.1/levels) are useful here because the question is not only who wrote source but whether a protected build service produced the artifact from the expected inputs. The **evidence plane** stores receipts, hashes, reviewer proofs, overrides, and incident links in a searchable, redacted format.

Use hard identity boundaries between the roles. A prompt saying “you cannot deploy” is not a boundary. Missing deployment credentials, protected environments, branch rules, and an independent release identity are boundaries. The same rule applies to reviewers: a reviewer that can modify policy, suppress its own telemetry, or approve its own exception is not independent.

Events should flow to your audit system: task creation, instructions loaded, tool calls, permission changes, network requests, review findings, overrides, build identities, deployment and rollback. Claude Code exposes lifecycle events such as `PreToolUse`, `PermissionRequest`, `ConfigChange`, `SubagentStart`, and `WorktreeCreate` in its [hooks reference](https://code.claude.com/docs/en/hooks). Hooks are useful enforcement points, but hook scripts are privileged code and need review, pinning, and tamper alerts of their own.

## Reusable Artifact: A Risk-Tiered Review and Release Policy

This YAML is deliberately small enough to place in a platform-policy repository. It describes outcomes, not a specific vendor. Start with one repository, then add language and domain-specific rules after the pilot produces evidence.

```
apiVersion: nxcode.io/ai-sdlc-policy/v1
metadata:
  name: payments-service-agent-changes
  owner: developer-platform
  securityOwner: product-security
  reviewEveryDays: 30

riskTiers:
  tier1:
    paths: ["docs/**", "*.md", "tests/fixtures/**"]
    required: [compile, unit, secrets]
    humanApproval: code-owner-on-failure
  tier2:
    paths: ["src/**"]
    required: [compile, unit, integration, secrets, sast, reliability-review]
    humanApproval: code-owner
  tier3:
    paths: ["auth/**", "billing/**", "infra/**", ".github/workflows/**"]
    required:
      - compile
      - unit
      - integration
      - secrets
      - sast
      - dependency-review
      - authorization-review
      - rollback-test
    humanApproval: code-owner-and-security-owner

worker:
  filesystem: assigned-worktree-only
  networkDomains: ["registry.npmjs.org", "api.github.com", "docs.internal.example"]
  credentials: ["repo:read", "pull_request:draft"]
  denied: ["protected_branch:write", "production:read", "deployment:execute"]
  budgets: {minutes: 45, modelUsd: 8, toolCalls: 180, subagents: 4}

reviewers:
  reliability-review:
    evidence: ["changed invariant", "failure scenario", "test or reproduction"]
  dependency-review:
    evidence: ["new graph path", "install scripts", "license", "provenance"]
  authorization-review:
    evidence: ["principal", "resource", "tenant boundary", "counterexample"]

promotion:
  shadowRuns: 100
  minVerifiedPrecision: 0.85
  maxCriticalEscapeRate: 0
  maxMedianHumanMinutesAdded: 8
  requireIncidentFixtureRecall: 1.0

receipt:
  required:
    - task_id
    - risk_tier
    - model_and_harness_versions
    - policy_hash
    - changed_files
    - deterministic_results
    - reviewer_findings_and_proofs
    - human_approvals
    - build_provenance
    - rollback_status
  redact: ["secrets", "personal_data", "raw_production_logs"]
```

Read the file from top to bottom as a chain of responsibility. `riskTiers` maps sensitive paths to required evidence, but path rules are only the first signal. A request broker should raise the tier when the diff touches identity, money, external communication, data retention, or production behavior even if the path is unexpected.

`worker` defines capabilities the coding identity physically receives. Replace the example domains and credentials with your own registry proxy, documentation host, and repository scopes. Do not put a production token in the environment and rely on `denied` as documentation. The infrastructure must make the denied capabilities unavailable.

Each reviewer has an evidence contract. “Potential authorization issue” is incomplete. The reviewer must name the principal, resource, tenant boundary, and a counterexample. The promotion section keeps a new reviewer advisory until it has enough shadow data. Change `shadowRuns` and time thresholds to fit repository volume, but do not remove the critical-escape and incident-fixture gates.

For a minimal NxCode adoption, implement only tier 2, one reliability reviewer, existing deterministic scans, a dedicated worktree, and the receipt. That small loop already separates creation, verification, approval, and evidence. Add specialized reviewers only when incidents or recurring defects justify them.

## How to Implement the Policy Without Freezing Delivery

Start with classification, not automation. Ask a product-security engineer, platform engineer, and repository owner to label ten recent changes by consequence. Look for authentication, authorization, secrets, payments, external writes, infrastructure, dependency execution, migrations, and regulated data. Turn disagreements into written tier rules.

Next, build the receipt from tools you already run. Capture commit and policy hashes, compiler and test summaries, scanner versions, changed dependencies, approvals, and build identity. Keep raw logs behind normal access controls and place only redacted references in the pull request. This gives reviewers one page to inspect instead of five dashboards.

Then introduce a narrow reviewer in shadow mode. Reliability is a good first scope because it can ask for changed invariants, failure scenarios, and missing tests without making deployment decisions. Run it on accepted and rejected historical pull requests. A security reviewer should verify a sample of findings and label them true, false, duplicate, unverifiable, or useful-but-nonblocking.

Only promote a rule after you know its behavior. High-precision patterns such as an unscoped tenant cache key or a newly added package install script may block. Broader architectural concerns should remain advisory until the team has clear ownership and response time. Every blocking rule needs an override path with a named approver, reason, expiration, and follow-up issue.

Finally, close the incident loop. When a defect reaches production, ask which stage could have observed it and what minimum fixture reproduces the mechanism. Add the fixture to the deterministic suite or the relevant reviewer evaluation. Anthropic describes updating repository guidance when an agent discovers a recurring bug class. NIST SSDF likewise treats vulnerability response as a source of process improvement, not an activity that ends with the patch.

## What to Measure So Automation Does Not Become Theater

Do not count generated lines or review comments as security outcomes. A noisy reviewer can raise both numbers while making the system worse. Measure **verified finding precision**: the share of findings that a responsible engineer confirms with evidence. Pair it with recall on a curated set of real and seeded defects.

Track **severe escaped defects** by risk tier and **incident-fixture recall** after every model, prompt, tool, memory, or policy change. OWASP recommends adversarial retesting after material changes to agent components. Its [memory and context analysis](https://genai.owasp.org/2026/05/13/memory-is-a-feature-it-is-also-an-attack-surface/) also explains why persisted summaries and retrieved context must be treated as security-relevant state. A reviewer that caught yesterday's bug but misses the same mechanism after a provider upgrade should lose blocking authority.

Measure workflow health too: median time to first useful finding, human minutes per accepted change, percentage of changes waiting for an owner, override rate, stale exception age, accepted-change rate, and cost per accepted change. If a control adds six review bots but doubles human triage, it has moved work rather than removed it.

Finally, measure unauthorized side effects: unexpected network requests, writes outside a worktree, use of unapproved credentials, policy modifications, unsigned agent-to-agent requests, and deployment attempts from non-release identities. The target for these is zero. Report attempts even when a gate blocks them; blocked attempts reveal pressure on the boundary.

## A Four-Week Rollout Plan for Platform and Security Teams

**Week 1 — Map risk and identity.** The repository owner supplies representative changes. Product security defines the initial tiers. Platform engineering lists every identity that can read source, write branches, open pull requests, access CI secrets, approve environments, and deploy. The output is a one-page risk map and permission diff. Acceptance means no coding or review identity also holds an unexplained production capability.

**Week 2 — Isolate and collect evidence.** Run the coding agent in a dedicated worktree or disposable VM with an egress allowlist and short-lived credentials. Generate the first evidence receipts on at least ten pull requests. Acceptance means a reviewer can reconstruct the task, versions, tests, scans, approvals, and artifact source without opening a raw transcript.

**Week 3 — Shadow two narrow reviewers.** Choose reliability plus either dependencies or authorization. Security engineers label results, and repository owners record added review time. Red-team the reviewers with a known bad change and an irrelevant but alarming-looking change. Acceptance means the reviewers produce evidence, do not modify the diff, and meet the agreed precision before blocking anything.

**Week 4 — Promote one gate and rehearse rollback.** Promote the highest-confidence rule for the appropriate risk tier. Simulate a reviewer outage, a false positive, a model-version change, a compromised coding credential, and a post-deployment regression. Acceptance means the team can pause automated merges, revoke credentials, find affected changes by version, roll back the artifact, and preserve the receipt.

The roles are explicit. Repository owners define intended behavior. Platform engineers enforce identities and execution boundaries. Security engineers own threat-specific controls and sampling. Developers remain accountable for the changes they approve. A model supplies work and analysis; it does not own risk.

## Boundaries, Open Questions, and Honest Limits

Automated review will miss defects. Models share training data, architectural tendencies, and fashionable assumptions, so several reviewers are not automatically independent. Separate scopes and contexts help, but correlated blind spots remain. Deterministic tests and human domain knowledge are still essential.

Security guidance can also go stale. Repository instructions may encode an old API, a reviewer may optimize for yesterday's incident, and policy paths may miss a new service layout. Assign owners and expiration dates. Anthropic's governance section makes the same point: once skills, loops, and dashboards become controls, security engineers must monitor those controls as systems.

Receipts create sensitive data. Tool arguments, source snippets, vulnerability findings, prompts, and production logs may contain secrets or personal information. Store the minimum evidence required for the decision, redact by data class, limit access, and define retention. “Log everything” is not a safe observability strategy.

Most importantly, a passing AI review is not proof of secure software. It is one signal in a release decision. NIST SSDF is outcome-based and risk-based; it does not prescribe one universal checklist. Your policy should be strict where failure is expensive and light where changes are easy to reverse.

## Frequently Asked Questions

### Does this require Claude Code?

No. The architecture works with any coding agent that can be isolated, identified, observed, and given bounded tools. Claude Code is useful here because Anthropic published a detailed case study and concrete security controls, not because the policy depends on one product.

### Should every pull request receive an AI security review?

Broad advisory review can cover every pull request if cost and noise remain acceptable. Blocking security review should follow risk. A documentation edit and an authorization change should not consume the same reviewers or approvals.

### Can the coding agent fix reviewer findings automatically?

It can propose fixes, but keep the original finding, proof, response, and new test visible. The reviewer should re-evaluate the new diff. Do not let the coding worker silently delete evidence or mark the issue resolved.

### What if the AI reviewer disagrees with a human?

The designated human owner decides, records a reason, and creates follow-up work when uncertainty remains. Review disagreements are evaluation data. Repeated human overrides may reveal a noisy reviewer or an unclear policy.

### How many review agents should we run?

Start with one or two. Add a reviewer when you can name its scope, evidence contract, owner, evaluation fixtures, and response path. More generic reviewers often create repeated comments without improving coverage.

### Is a remote VM enough isolation?

No. It is a strong boundary only when paired with scoped identity, restricted network access, protected secrets, clean teardown, audit events, and branch rules. A VM with a broad cloud token remains a high-impact environment.

### How often should the policy be re-evaluated?

Review it on a fixed schedule and after model, harness, tool, memory, repository, or permission changes. Also review it after an incident or a pattern of overrides. Thirty days is a reasonable pilot default, not a universal requirement.

### What should a small team do first?

Separate the coding identity from deployment, isolate work in a dedicated branch or worktree, keep deterministic CI, require a human for sensitive changes, and create a small receipt. Those steps provide more value than launching many untested review agents.

## Conclusion

AI-native development changes the scarce resource. Code becomes easier to produce, while context, judgment, and accountability remain expensive. A secure process therefore has to route human attention toward consequences instead of pretending every generated line can receive equal scrutiny.

The practical design is straightforward even if implementation takes care. Give coding workers narrow identities. Make deterministic tools prove deterministic facts. Give review agents small questions and evidence contracts. Let policy and named humans decide what can merge. Build through a protected release identity. Keep a receipt and learn from every escape.

Do not begin by asking how much of your code an agent could write. Ask whether your team can explain, verify, approve, and reverse the next agent-written change. If the answer is yes for one NxCode repository and one risk tier, you have a foundation worth scaling. If not, keep the worker in draft-only mode and improve the evidence loop before granting more autonomy.

## Sources

1.  [Anthropic: How Anthropic secures its AI-native software development lifecycle](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle)
2.  [Claude Code documentation: Security](https://code.claude.com/docs/en/security)
3.  [Claude Code documentation: Hooks reference](https://code.claude.com/docs/en/hooks)
4.  [Anthropic: Zero Trust for AI agents](https://claude.com/blog/zero-trust-for-ai-agents)
5.  [Claude Code v2.1.217 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.217)
6.  [NIST Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf)
7.  [NIST SP 800-218: Secure Software Development Framework Version 1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
8.  [NIST DevSecOps Practices introduction](https://pages.nist.gov/nccoe-devsecops/introduction.html)
9.  [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
10.  [OWASP Agentic Security Initiative](https://genai.owasp.org/initiatives/agentic-security-initiative/)
11.  [SLSA specification: Security levels](https://slsa.dev/spec/v1.1/levels)
12.  [OWASP: Memory Is a Feature. It Is Also an Attack Surface](https://genai.owasp.org/2026/05/13/memory-is-a-feature-it-is-also-an-attack-surface/)
