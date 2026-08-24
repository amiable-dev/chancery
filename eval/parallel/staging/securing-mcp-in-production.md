# Securing MCP in Production: Defense-in-Depth beyond the Gateway

**Source:** https://www.infoq.com/articles/securing-mcp-production-gateway/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> This article presents a defense-in-depth model for securing MCP in production, introducing layers to protect execution, infrastructure, outbound trust, and semantic integrity across the MCP lifecycle.

---

### Key Takeaways

-   Address MCP security as four control layers instead of one protocol feature. There needs to be an enforcement point for each of execution, management infrastructure, outbound trust, and semantic integrity.
-   Use a gateway for authentication, authorization, and audit. Do not expect it to detect semantic abuse or protect the management plane.
-   Pin tool manifests at registration in order to avoid post-approval schema drift and rug-pull behavior. Consider the diff-based review as the operational model, not a binary allow-or-deny gate.
-   Use outbound egress control and scoped tokens. The Azure MCP Server SSRF ([CVE-2026-26118](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-26118)) showed that inbound authentication alone is not enough.
-   Prioritize operationalization with CI gates, isolated tooling, diff-based manifest review, and behavioral baselines. The specification will catch up. Production cannot wait.

## Why This Article and Why Now

By the end of 2025, my team decided that MCP would be our integration layer for a production multi-agent platform. We simply asked one question: What architectural controls do we need in place so we could trust automated (tool based) execution at scale?

The short answer, and the argument of this piece, is that we need four layers: safe tool execution, an isolated management plane, a bounded outbound trust boundary, and semantic integrity, each enforced at its own point rather than at the gateway.

Those layers were not obvious when we started; the vulnerability record filled them in over the following six months. In the first sixty days of 2026, [over thirty CVEs were reported against MCP deployments](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/).

March data from [Adversa AI](https://adversa.ai/blog/top-mcp-security-resources-march-2026/) indicated that when scanning over five hundred MCP servers, thirty-eight percent had no authentication on critical endpoints and forty-three percent were vulnerable to command execution. Microsoft issued a patch to fix CVE-2026-26118, a CVSS 8.8 SSRF in the Azure MCP Server on March 10, that leaked managed identity tokens.

On March 9th, David Soria Parra, the lead maintainer, posted the [2026 MCP roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/). This document outlines enterprise readiness as a priority focus area; however, the document also indicated it will likely be the least defined of the four areas.

From April 2-3, 2026, during the MCP Dev Summit in New York City, Amazon and Uber shared their production architectures for MCP Gateway and Registry; and [Pinterest's engineering teams](https://www.infoq.com/news/2026/04/pinterest-mcp-ecosystem/) published their domain-specific MCP server ecosystem. Enterprise production MCP use occurs more quickly than the specifications for the security model mature.

Taken together, these are not isolated bugs. They cluster at a handful of distinct boundaries, which is what points to an architectural response rather than a patch-by-patch one. This article describes the architectural controls I believe every production MCP deployment needs today. Every pattern works with the current MCP specification and does not require protocol changes.

## MCP Security Is a Control-Plane Problem

In early implementations, the first instinct is to place a gateway in front of MCP traffic. That is a good instinct. A gateway is where central authentication, authorization, auditing, and policy evaluation are located. InfoQ [recently published](https://www.infoq.com/articles/building-ai-agent-gateway-mcp/) a detailed implementation of a least-privilege AI Agent Gateway using MCP, OPA, and ephemeral runners; that design is nearly ideal.

However, a gateway is one enforcement point and not the entirety of a control plane. A gateway does not ensure that a tool handler executes its parameters in a safe manner. It does not isolate the inspectors, harnesses, and management consoles that surround MCP. It does not guard against an MCP server making unsafe outbound calls with overly broad credentials. Furthermore, it does not detect when the tool definitions a team approved last week change.

I apply this question to every MCP failure mode:

_Where is the earliest trustworthy enforcement point?_

The tool handler and the CI pipeline are the answer for command injection. Management plane and network boundary for exposed inspectors. Egress policy and token scope for credential leakage through outbound requests. For tool-definition drift, it is the registration boundary where manifests may be pinned, diffed, and reviewed.

That is what a control plane looks like, not what a single gateway looks like. Distributing enforcement across these points also distributes responsibility across the teams and vendors that build, host, and run an MCP server. CoSAI’s [Shared Responsibility Framework](https://www.coalitionforsecureai.org/wp-content/uploads/2026/05/CoSAI-Shared-Responsibility-Framework.pdf) sets out the division of security responsibility across the AI stack and who answers when an agent [fails](https://www.coalitionforsecureai.org/whos-responsible-when-ai-goes-wrong-a-new-framework-aims-to-answer-that-question/). Those enforcement points are what the next section formalizes into four control layers.

## Four Control Layers

These four layers do not make a clean taxonomy. Each fails on its own: Hardening execution does nothing for a leaking egress path and pinning a manifest does not authenticate an inspector. Each layer has its own earliest enforcement point and often its own owner, which is what makes them separate boundaries rather than one problem seen four different ways.

This framing is also becoming common in both industry and academia. [Acharya and Gupta (2026)](https://arxiv.org/abs/2604.05969) present MCPShield, a formal security framework that categorizes threats into four attack surfaces. [Rostamzadeh et al. (2026)](https://arxiv.org/abs/2604.07551) present a defense-placement taxonomy and state that the existing mitigations are too concentrated at the tool layer, while the host orchestration, transport, and supply-chain layers are left under-defended. The common consensus is that MCP defense is a layered placement problem.

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/securing-mcp-production-gateway/en/resources/230figure-1-1784884299695.jpg)

**Figure 1. The four MCP control layers, their representative attacks and primary controls, and where the gateway reaches only partially. Source: created by the author.**

**Layer**

**Representative attack surface**

**Primary control**

**Secondary control**

**Cost / trade-off**

1\. Execution

Command injections, use of eval() on tool parameters (13 of 30 recent CVEs)

Arguments passed as arrays; no string manipulation to shells

CI gate flagging exec, eval, os.system, subprocess (shell=True) accessible from a tool handler

Minimal. Basic hygiene, automatable at build time.

2\. Management infrastructure

Unauthenticated inspectors and testing harnesses (CVE-2026-23744); malicious deeplinks (CVE-2026-23523)

Mandatory authentication on every management endpoint

Network isolation of development tooling; minimal filesystem access

Medium. Requires a change to developer workflow and environment defaults.

3\. Outbound trust boundary

SSRF leaking managed identity tokens (CVE-2026-26118); unbounded outbound HTTP

Egress allow-list at the network layer

Scoped identity tokens, one credential class per tool purpose

Medium. Per-server allow-list maintenance; breaks servers that need new external endpoints.

4\. Semantic integrity

Redefinition of rug-pull tool; typosquatting; abuse of cross-server context; multi-component attack chain

Manifest pinning at registration with SHA-256 canonicalization

Behavioral baselines for endpoint access, data movement, and latency patterns

High. Legitimate upgrades require re-approval. Baselines require a cooling period of two to three weeks of traffic to stabilize.

**Table 1. Four-layer control matrix.**

An overview of the layers:

-   Layer 1 is execution, the code that runs when a tool is invoked.
-   Layer 2 is management infrastructure, including inspectors, harnesses, registration surfaces, and admin consoles.
-   Layer 3 is the outbound trust boundary, what the server reaches on its own.
-   Layer 4 is semantic integrity, what the tool definitions mean over time.

Each layer has a different earliest trustworthy enforcement point, and each needs a different primary control. The gateway participates in two of the four layers, and only partially.

With the model in place, the rest of the article takes each layer in turn, with the controls and code that implement it.

## Layer 1: Safe Tool Execution

Layer 1 has a single concern: A tool handler must treat its arguments as data, never as instructions.

Among the thirty CVEs documented in the first sixty days of 2026, thirteen followed a pattern: unvalidated user-controlled input reaching a shell or a dynamic interpreter. Specifically, CVE-2026-2130 (mcp-maigret), CVE-2026-2178 (xcode-mcp-server), and CVE-2026-2131 (HarmonyOS-mcp-server) all executed parameters of the tool via exec(). CVE-2026-1977 employed eval() in Python on a parameter of a chart specification. CVE-2026-27203 manipulated environment variables via unvalidated newline characters, introducing a payload that would trigger after the next server restart.

Command injection is not a novel concept. What makes it architecturally significant in MCP is the trust model. Tool arguments are trusted as typed JSON by developers. The accompanying JSON schema explains the structure of the input. However, it is silent on the actual safety of the values with regard to shell execution.

### Code 1. Vulnerable and Fixed Shell Execution Patterns

```
// VULNERABLE: string interpolation into a shell command
const { username } = toolCall.params;
exec(`docker run maigret ${username}`);
// If username is "; rm -rf /" the shell interprets the semicolon.
 
// FIXED: array-based argument passing, no shell interpretation
const { username } = toolCall.params;
execFile('docker', ['run', 'maigret', username]);
// Semicolons and metacharacters are passed as literal values.
```

The architectural principle at play is that tool handlers are not convenience utility wrappers, but controlled input boundaries.

A CI rule is more useful than a code-review checklist. The Semgrep rule below blocks builds if a parameter from a tool handler is passed to a shell interpreter for the two languages that constitute the vast majority of MCP server implementations.

### Code 2. Semgrep Rule: Block Unsafe Execution in MCP Handlers

```
rules:
  - id: mcp-unsafe-exec-js
    languages: [javascript, typescript]
    severity: ERROR
    message: >
      MCP tool handler passes a parameter into a shell interpreter.
      Use execFile or spawn with array arguments instead.
    pattern-either:
      - pattern: exec(`...${$PARAM}...`)
      - pattern: exec($CMD + $PARAM)
      - pattern: eval($PARAM)
 
  - id: mcp-unsafe-exec-py
    languages: [python]
    severity: ERROR
    pattern-either:
      - pattern: subprocess.run(..., shell=True, ...)
      - pattern: os.system($CMD)
      - pattern: eval($PARAM)
```

Note that these rules are a starting point, not full coverage for production. They catch the common sinks; a production ruleset would extend to other interpreters, indirect sinks, and language-specific evasions.

[Huang et al. (2026)](https://arxiv.org/abs/2604.01905) built a dataset of 114 malicious MCP servers and showed that multi-component attack chains often outperform single-component attacks. This finding supports the layered defense approach, as it is unreasonable to expect any single control mechanism to catch everything. Each trust boundary needs its own defense.

## Layer 2: Secure the Management Plane

While assessing the MCP, we discovered that our testing harness was listening on an internal network with no authentication. It was a twenty minute job to shut it down. The default was open. Most teams deploying MCPs at pace won't find that exposure until someone else does.

That harness was part of the management plane: The surfaces where trust is granted and tools are registered and where a compromise hands over far more than a single tool call.

Out of thirty CVEs, six have targeted MCP development and operational infrastructure, and not the protocol. CVE-2026-23744 (MCPJam Inspector), for instance, opened an unauthenticated endpoint that resulted in the installation of arbitrary MCP servers and listened on 0.0.0.0 by default. CVE-2026-23523 (Dive MCP Host), on the other hand, used crafted deep links to install malicious configurations within the user's client app.

This layer is crucial because developmental environments usually provide much more access than production environments, such as source code, secrets, build systems, deployment credentials, etc. A management plane compromise provides the attacker access to the environment where trust is given and tools are registered, not just the single tool invocation.

The posture I want for the MCP management plane is the same posture I want for CI/CD control surfaces.

-   No anonymous access
-   No broad internal-network exposure by default
-   Minimal filesystem reach
-   Short-lived credentials where possible
-   Authenticated and logged management endpoints

Consider inspectors, harnesses, and registration surfaces to be production-adjacent, because they are.

## Layer 3: Outbound Trust, Egress, and Token Scope

Layer 3 is about what the server can reach on its own once it is running.

The Azure MCP Server SSRF (CVE-2026-26118, CVSS 8.8) shows why inbound authentication is not enough. The attack works as follows: An attacker replaces an Azure Resource Identifier with a malicious URL. The server makes an outbound call to that URL using its managed identity token. This approach allows the attacker to take control of whatever Azure resources the server accesses.

Three controls are needed in parallel:

-   Mandatory authentication on every inbound endpoint.
-   Controlled outbound access (i.e., an "egress allow list") so the server can only access the services it needs to operate.
-   Least-privilege downstream credentials so the blast radius of the token matches the blast radius of the tool.

### Code 3. NetworkPolicy Restricting MCP Server Egress

```
# Allow egress only to internal services it needs and to DNS
# All other egress traffic will be denied by default.
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: mcp-server-egress
spec:
  podSelector:
    matchLabels:
      app: mcp-server
  policyTypes:
    - Egress
  egress:
    - to:
        - ipBlock:
            cidr: 10.0.0.0/8
      ports:
        - port: 443
    - to:
        - namespaceSelector: {}
      ports:
        - port: 53
          protocol: UDP
```

In this case, two assumptions are worth stating. First, the cluster’s CNI must actually enforce NetworkPolicy (Calico, Cilium, and similar do; some default installs do not). Second, listing Egress under policyTypes for a selected pod denies any traffic that is not explicitly allowed, but pairing this with a namespace-wide default-deny policy makes the posture explicit rather than a side effect of selection.

An automated file searching tool should not hold access tokens that can control the company cloud account. If a tool needs to access a new domain or internal service, that should be an explicit change not an implicit behavior.

This is not the most interesting work, but it is the most important. Many agent-based systems protect the "front door" and then forget what the process can do once it is inside.

## Layer 4: Semantic Integrity and Manifest Pinning

Layer 4 is about meaning, not syntax, i.e., whether a tool still does what it did when you trusted it.

The most architecturally significant attacks, in my opinion, are not input-validation bugs. They are semantic. A request may be well-formed, schema-valid, authenticated, and dangerous all at the same time, because the meaning of the tool has drifted since the trust was granted.

Pillar Security ([The New AI Attack Surface: 3 AI Security Predictions for 2026](https://www.pillar.security/blog/the-new-ai-attack-surface-3-ai-security-predictions-for-2026)) described eleven types of vulnerabilities associated with MCP, as of March 2026, including supply-chain typosquatting and abuse of cross-server contextual links. [Solo.io](https://www.solo.io/blog/deep-dive-mcp-and-a2a-attack-vectors-for-ai-agents) noted "rug-pull" attacks wherein a server changes the definition of a tool post-registration, and [Maloyan and Namiot (2026)](https://arxiv.org/abs/2601.17549) identify the issue formally as "absence of capability attestation": The protocol lacks a means for a server to demonstrate, at the time of enforcement, that the tool definitions are the same as those the client trusted.

The attacks described are not prevented by input validation. The input is valid. Authentication does not stop them. The caller is authenticated. Gateway policy does not stop them. The request conforms to schema.

Manifest pinning does stop them. To clarify, this is an implementation pattern you add at the gateway, not a feature of the MCP specification itself. This control operates similarly to web Subresource Integrity. At registration time, the gateway canonicalizes the server's tool manifest. The names, descriptions, and the parameter schema are hashed, and that hash is stored as a signed baseline. After reconnecting or updating, the gateway checks the hash again. If the hash is the same, the update is allowed. If the hash is different, the update is held and routed to a diff classifier that distinguishes cosmetic from material changes.

### Code 4. Pinning Manifests During MCP Server Registration

```
import { createHash } from 'node:crypto';
 
interface ToolManifest {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}
 
const registry = new Map<string, PinnedRecord>();
const operatorQueue: Array<PendingReview> = [];
 
function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map(canonicalJson).join(',') + ']';
  }
  const obj = value as Record<string, unknown>;
  return '{' + Object.keys(obj).sort().map(k =>
    JSON.stringify(k) + ':' + canonicalJson(obj[k])
  ).join(',') + '}';
}
 
function canonicalize(tools: ToolManifest[]): string {
  const sorted = [...tools].sort((a, b) => a.name.localeCompare(b.name));
  return canonicalJson(sorted);
}
 
function pin(serverId: string, tools: ToolManifest[]): PinResult {
  const canonical = canonicalize(tools);
  const hash = createHash('sha256').update(canonical).digest('hex');
  const existing = registry.get(serverId);
 
  if (!existing) {
    registry.set(serverId, { hash, tools, signedAt: Date.now() });
    return { outcome: 'registered', hash };
  }
 
  if (existing.hash === hash) {
    return { outcome: 'unchanged', hash };
  }
 
  const diff = diffSchemas(existing.tools, tools);
  if (diff.cosmeticOnly) {
    registry.set(serverId, { hash, tools, signedAt: Date.now() });
    return { outcome: 'auto-approved-cosmetic', hash };
  }
 
  operatorQueue.push({ serverId, diff });
  return { outcome: 'pending-review', hash };
}
```

The recursive helper sorts keys at every level so identical manifests always hash the same. It is recommended that the production implementation should use an established canonical JSON format such as RFC 8785 (JCS), which also pins down number and string encoding.

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/securing-mcp-production-gateway/en/resources/173figure-2-1784884299695.jpg)

**Figure 2. Manifest pinning at registration and update shows that manifests are hashed at registration and later updates are compared against the signed baseline and routed by diff class. Source: created by the author.**

The diff classifier keeps this control operationally sustainable. Pure allow-or-deny gates generate enough false positives to train operators to rubber stamp. Distinguishing cosmetic alterations from substantive schema changes means the review queue is populated solely with items that deserve a human decision.

I recommend pairing manifest pinning with behavioral monitoring. Monitor the endpoints that each MCP server actually accesses, the data moved, and the latency patterns. Alert when a server approved as a file-search tool starts making outgoing HTTP requests to unknown domains, regardless of schema validity for each individual request. Static trust combined with behavioral verification is a more powerful control than either one on its own.

Currently, the MCP specification and 2026 MCP Roadmap are silent on manifest pinning. This is a functionality that teams will have to develop at the gateway layer.

## Where the Gateway Fits

The gateway remains essential. The goal is to place the gateway correctly among the layers and to be clear about what sits outside it.

A gateway provides the appropriate platform to authenticate clients, authorize requests against policy, maintain audit trails and request logs, provide rate limiting functionality (i.e., enforce limits based on the number of requests per unit of time), manage registration workflows, and centrally evaluate policies as they apply to incoming requests. These examples represent enforcement at the protocol layer, which is exactly what gateways were created to support.

In contrast, enforcement at safe execution of tools, isolation of the management plane, bounding of outgoing connectivity, and detection of semantic drift occur at different layers. Thus, the correct approach is to think of the gateway as one component of a multilayered security solution where enforcement occurs at each of the earliest possible trusted layers.

This approach is evident from Uber's MCP Gateway and Registry presentation during the April MCP Dev Summit and also illustrated through Pinterest's use of multiple domain-specific MCP servers with a single registry, along with a two-layer authorization system. The pattern is converging in production as quickly as it is converging in research.

## A Four-Week Rollout

The order follows the control model: mature, easy-to-verify controls first, MCP-specific controls last. There is no requirement for teams to enforce all controls at the same time. In fact, a staggered approach is often better.

**Week**

**Layer addressed**

**Concrete actions**

**Observable outcome**

1

Layer 2: management infrastructure

Require authentication on every MCP-facing endpoint. Move shadow inspectors, testing harnesses, and management consoles to isolated networks with limited filesystem access.

No MCP surface remains reachable without authentication. Shadow inspectors are located or decommissioned.

2

Layer 1: execution

Implement CI rules for shell interpolation, plus eval or subprocess (shell=True), reachable from tool handlers. Modify existing hot paths to be array-based argument passing.

No new shell-interpolation patterns are merged. Backlog of existing violations is addressed weekly.

3

Layer 3: outbound trust

Apply scope-restricted egress allow-lists at the server level. Replace broad service credentials with tool-specific scoped tokens.

All outbound MCP traffic is allow-listed. No MCP server possesses a subscription-wide token.

4+

Layer 4: semantic integrity

Enable pinning of manifests with delta-based reviews at the gateway. Begin collection of behavioral baselines per server: endpoints, data volume, and latency.

Tool schema changes require operator approval on material diffs. Anomaly alerts begin firing on servers that exceed baseline deviation.

**Table 2. Four-week rollout.**

### Week 1: Stabilize the Obvious Boundaries

Week 1 closes the boundaries that need no MCP-specific tooling. Require authentication on every MCP-facing endpoint, move inspectors, testing harnesses, and management consoles onto isolated networks, and limit filesystem access to what each process actually needs.

### Week 2: Execution Path Safety

Week 2 makes the execution path safe. Add CI rules that flag shell interpolation, along with eval or subprocess called with shell=True, wherever they are reachable from a tool handler, and convert the hot paths to array-based argument passing.

### Week 3: Trust Containment

Week 3 contains outbound trust. Apply egress allow-lists at the server level and replace broad service credentials with tool-specific scoped tokens, so that outbound HTTP becomes an ability a server is granted rather than one it holds by default.

### Week 4: Begin Semantic Control Implementation

Week 4 begins semantic control. Turn on manifest pinning with diff-based review at registration, and start collecting behavioral baselines for each MCP server, covering endpoints, data volume, and latency, over two to three weeks of production traffic before alerting on deviation.

## The Trade-offs Are Real

Every control above buys security by spending something else: latency, maintenance, or flexibility. None of these costs are accidental; each is worth naming before you commit to it.

Containerized or sandboxed execution adds latency. In our tests, ephemeral-runner isolation added fifty to two hundred milliseconds per tool call compared to local execution. Acceptable for background agent work, noticeable for interactive assistants.

Egress allow-listing breaks MCP servers that require new external endpoints. In our case, most MCP servers connect to three to five internal services and one or two external APIs, so the allow-list is manageable, but it does require per-server work.

Manifest pinning creates friction for evolving servers. Automated diff-based review mitigates the problem, but does not eliminate it.

Behavioral monitoring causes false positives until baselines stabilize, which may take time. In our deployments, most MCP servers stabilized after two to three weeks of production traffic, with low-traffic servers taking longer. I recommend treating that time as our operating experience rather than a general threshold, because the window depends on request volume and variability.

These costs are accurate. That said, it is important to note that the costs are much smaller than those attributed to credential-leak incidents or tool-redefinition exploits. In my experience, the most common case is not teams oversecuring MCP. In fact, they are much more likely to underestimate the number of different trust boundaries they have created.

## Where Standards Are Heading

Two developments are worth watching. First, from the [MCP 2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/), the most mentioned priority is "enterprise readiness", although it is the least developed, and the lead maintainer invited "anyone who is facing these challenges in production \[to\] contribute". Second, concerning [NIST's AI Agent Standards Initiative](https://www.nist.gov/news-events/news/2026/02/announcing-ai-agent-standards-initiative-interoperable-and-secure), which launched in February 2026, there is an NCCoE concept paper about agent identity and authorization. As an OASIS CoSAI and IETF AGNTCY working group participant, I can say there is no existing consensus on the identity question for MCP. In particular, whether servers should carry their own credentials or should bear delegation authority from the human user. CoSAI’s [Agentic Identity and Access Control](https://www.coalitionforsecureai.org/wp-content/uploads/2026/04/agentic-identity-and-access-control.pdf) research, released following its [RSAC 2026 sessions](https://www.oasis-open.org/2026/05/06/coalition-for-secure-ai-unveils-new-agentic-identity-and-security-research-following-high-profile-sessions-at-rsac-2026/), takes up this question directly.

Both initiatives are promising, but neither is an excuse for inaction. The controls detailed in this article are compatible with the present specification and the present infrastructure.

## Conclusion

We opened by asking what we needed before trusting tool execution at scale; these four layers are the answer. Considering MCP in production, the most important shift is to stop thinking of it as a single protocol problem and think of it as a layered control-plane problem.

The gateway is here to stay. It is necessary. It is insufficient.

Real deployments require safer tool execution at Layer 1, an isolated management plane at Layer 2, contained outbound trust at Layer 3, and semantic integrity with manifest pinning at Layer 4. Each layer has an earliest trustworthy enforcement point that is not the gateway.

The one lesson I leave teams with is to secure the boundary where trust is first granted, not just the boundary where traffic passes through.

That is how MCP becomes operationally trustworthy.

## About the Author

#### **Nik Kale**

Show moreShow less
