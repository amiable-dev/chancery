# AI security event logging: the SIEM gap in agentic AI governance

**Source:** https://predictionguard.com/blog/ai-security-event-logging-the-siem-gap-in-agentic-ai-governance
**Added:** 2026-08-24
**Tags:** #unsorted

---

> AI security event logging captures prompt injections, agent tool chains, and policy breaches that traditional SIEM platforms cannot see.

---

_Updated June 9, 2026_

> **TL;DR:** Traditional SIEM platforms parse network and application telemetry but have no visibility into the semantic content of AI interactions, agent tool chains, or model policy breaches. To demonstrate alignment with the NIST AI RMF framework and OWASP Agentic AI guidance, regulated enterprises benefit from self-hosted AI governance infrastructure that enforces policies at the system level and generates structured audit logs inside their own environment, giving compliance teams the evidence record they control. Data sovereignty is not optional. If your audit log lives in a vendor's infrastructure, it is not under your control.

Engineering teams in manufacturing, financial services, and defense-adjacent organizations are deploying AI agents at a pace that governance processes have not matched. Every ungoverned agent interaction is a compliance gap with no corresponding log entry in your SIEM.

If your AI governance exists in a document but is not enforced at the system level and captured inside your own infrastructure, it is a liability waiting for the next audit cycle to surface it, a security incident to expose it, or an enterprise customer to ask a question your team cannot answer.

This article is written for organizations deploying AI agents that include both self-hosted models and governed access to third-party tools and endpoints, with all governance logic and logging enforced inside their own infrastructure.

This article maps the specific AI security events your current SIEM cannot see, explains why that gap is structural rather than configurable, and shows how to build AI-native logging infrastructure that satisfies NIST AI RMF and OWASP requirements without rebuilding your existing security toolchain.

## Why traditional SIEM platforms miss AI security events

Security teams built traditional SIEM platforms for network packets, firewall events, authentication logs, and application-level telemetry. Those platforms correlate structured records against threat patterns through rule sets and behavioral baselines. That architecture is effective for what it was designed to detect, and that is precisely the problem when AI agents enter the picture.

### SIEM's blind spot: AI agent actions

AI agents operate in a loop: receive an objective, plan how to achieve it, execute actions using external tools, evaluate results, and iterate. The [OWASP Top 10 for Agentic Applications (2026)](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) identifies this multi-step, multi-tool structure as the source of agentic-specific threats that have no equivalent in traditional application security. Each step in that loop touches systems, data sources, and API endpoints your SIEM has no record of.

Your SIEM can record that an API call was made. It cannot determine whether the natural language input was a prompt injection attempt, whether the response violated your PII governance policy, or whether an agent chained tool calls into a privilege-escalation pattern. Traditional SIEM correlation engines rely on static rules, whereas agentic attack patterns (spanning multi-turn loops, tool chains, and cascading tool invocations) are better suited to detection approaches that incorporate behavioral monitoring and semantic analysis, as Prediction Guard's [agentic threats and mitigations series](https://youtube.com/watch?v=xfvMO4dcytA) covers in detail.

### Missing AI event context in logs

Tool-augmented agents rely on multi-step workflows where one tool produces data and another tool reuses it as input, creating source-to-sink dataflows that only become visible when the full chain is logged with causal links intact. Without that chain, your SIEM receives a series of individually innocuous API calls that, taken together, represent a material data exfiltration or privilege escalation event your incident response team will never connect. The [system-level security post](https://predictionguard.com/blog/security-blog) explains why this structural gap cannot be patched at the application level.

## Identifying AI-native security log sources

Prediction Guard generates structured logs inside your infrastructure for every AI security event your existing SIEM cannot see. The control plane captures AI-native events across categories including prompt injection detection, policy breach logging, agent tool call escalation, unauthorized model and route changes, uncontrolled API data access, and unauthorized agent activity, then forwards them natively to Splunk, Datadog, or syslog without your data leaving your perimeter.

-   **Prompt injection detection:** Malicious instructions embedded in user input or agent context attempt to override intended behavior. The [OWASP LLM Top Ten](https://owasp.org/www-project-top-10-for-large-language-model-applications/) catalogs this as LLM01. Prediction Guard's [OWASP implementation guidance](https://youtube.com/watch?v=aLRO9AKfCMo) covers how the control plane generates a structured log for every detected attempt, including event type, detection confidence, blocking decision, and agent identity.
-   **AI policy breach logging:** Output content violations (toxicity, PII disclosure) and structured output failures (fabricated data in required fields, ungrounded outputs) each require a log entry capturing which AI governance policy was violated, which model produced the output, what remediation occurred, and whether the output reached the end user. Prediction Guard's [OWASP implementation guidance](https://youtube.com/watch?v=aLRO9AKfCMo) covers why these records must live inside your perimeter.
-   **Agent tool call escalation:** When an agent invokes a capability with privilege levels the current workflow does not authorize, or chains tool calls into an emergent privilege escalation pattern, each invocation requires a structured log entry capturing the agent identity, the tool invoked, the authorization state at the time of invocation, and the outcome. The OWASP Top 10 for Agentic Applications identifies tool misuse and privilege abuse as distinct threat categories because the full escalation pattern only becomes visible when the complete tool chain is recorded. What specific fields and log structures your environment requires will depend on your control plane configuration and the OWASP implementation guidance applicable to your threat model. Prediction Guard's [agentic threats and mitigations series](https://youtube.com/watch?v=xfvMO4dcytA) covers how control plane integration with MCP-based tool workflows fits the broader agentic threat detection picture.
-   **Unauthorized model and route changes:** When a production AI workflow is redirected to a different model without authorization, the governance controls configured for the original model do not follow the redirect. OWASP LLM05 addresses supply chain vulnerabilities specifically. Detecting them typically involves model route change logging that captures configuration state and the source of the change. The specific fields logged will depend on your control plane configuration and what your compliance program requires as evidence. Prediction Guard's [unified AI tooling video](https://youtube.com/watch?v=xjmJaRGozB0) explains how model route visibility fits a broader governance strategy.
-   **Uncontrolled API data access:** When an agent calls an external API or data store without authorization, you need a log capturing the agent identity, endpoint called, data classification, transfer volume, and violated AI governance policy. Without it, you cannot answer the regulator's question about what data left your perimeter, when, and under what authorization, which is particularly acute for defense-adjacent organizations handling CUI under CMMC.
-   **Unauthorized agent activity and behavioral deviation:** The OWASP Top 10 for Agentic Applications frames rogue agents as the agentic equivalent of insider threats. Individual actions look legitimate in isolation. Catching them requires monitoring behavior over time across what the agent accesses, where it sends data, and which tools it invokes. Prediction Guard's [self-hosted sovereignty overview](https://youtube.com/watch?v=eUq3lIzN_YU) explains how keeping the control plane inside your perimeter makes that behavioral record available to your security team.

## Critical AI logs for NIST AI RMF and CMMC evidence

Regulated enterprises must demonstrate compliance across multiple frameworks simultaneously. This section maps the specific AI security log types required by NIST AI RMF, CMMC, and OWASP guidance, showing how structured logging satisfies each framework's evidentiary requirements.

### Audit log requirements under NIST AI RMF

The [NIST AI Risk Management Framework](https://airc.nist.gov/) defines four core functions. Each requires specific log evidence to demonstrate NIST AI RMF conformance at audit time. Without structured AI-native log types mapped to each function, a NIST audit review will find evidentiary gaps regardless of how thorough your documentation is, and your security team will have no structured evidence to investigate incidents when they occur between audit cycles.

  

**NIST AI RMF function**

**Log types that support compliance**

**What the log demonstrates**

Govern

Policy configuration events, governance role assignment records, and access logs for audit artifacts, supporting evidence that organizational AI governance controls were defined and actively maintained

Governance structures were defined, assigned, and actively reviewed

Map

AI system registration records, model route configuration logs, and data flow documentation, supporting evidence that AI systems and their operational contexts were inventoried and risk-classified

AI systems and their data access scopes were inventoried and risk-classified

Measure

Prompt injection attempt logs, policy violation detection logs, and security event metrics, supporting evidence that AI risks were actively analyzed, assessed, and monitored across model interactions

Risks were actively measured across model interactions

Manage

Enforcement event logs capturing policy violation outcomes, blocking decisions, and remediation actions taken at the control plane level, supporting evidence that identified AI risks were acted upon at the system level

Identified risks produced system-level enforcement actions that were captured and retained

Prediction Guard's post on [scaling agentic AI governance](https://predictionguard.com/blog/scaling-agentic-ai-cost-governance-and-compliance-trade-offs-at-enterprise-scale) covers how organizations map these log types to existing compliance programs at enterprise scale.

### CMMC AI logging for audit readiness

CMMC (Cybersecurity Maturity Model Certification) is the U.S. Department of Defense's compliance framework for defense contractors and suppliers handling sensitive government data. CMMC 2.0 Level 2 applies the full Audit and Accountability domain from NIST SP 800-171 to any system touching CUI (Controlled Unclassified Information, sensitive government data that requires safeguarding under federal regulation but is not classified).

For AI agents, that means every prompt, tool call, and output involving CUI must be captured, and those logs must link the agent's identity back to the specific human who authorized the workflow, not just to a service account. Certified Third-Party Assessment Organizations (C3PAOs) (the accredited assessors who conduct CMMC Level 2 audits) reject model vendor API logs as evidence because those logs authenticate API keys, not the human delegation chain the standard requires. There is no AI exemption. An agent accessing a contract database faces the same logging requirements as a cleared employee performing the same task. Beyond assessment readiness, security teams in defense-adjacent organizations need those same logs to investigate incidents in real time. It's a gap that becomes acute when an agent accesses a contract database and no structured record of the tool chain exists in the SIEM.

Vendor API log retention compounds the problem. Model API providers typically publish their own data retention schedules, under which API inputs and outputs are deleted on the provider's timeline rather than yours. NIST SP 800-171 requires audit logs to support after-the-fact investigation of security incidents for any system processing CUI, an obligation that extends to every AI agent those systems deploy. Organizations relying on vendor-provided logs are operating with a retention gap that will surface in a C3PAO assessment. Prediction Guard's [air-gapped and self-hosted deployment discussion](https://youtube.com/watch?v=WLQANRBCrcI) covers architectures that satisfy these requirements in regulated manufacturing and defense-adjacent environments.

### Mapping log types to OWASP Top 10 for Agentic Applications

The table below maps Agentic AI threat categories directly to the structured log types that support detection and forensic investigation of each item.

   

**OWASP item**

**Threat**

**Log type that addresses it**

**Related LLM Top Ten item (2025)**

ASI01

Memory poisoning

Prompt injection attempt logs and context manipulation detection records

LLM01: Prompt Injection

ASI02

Tool/plugin abuse

Tool invocation monitoring logs and privilege boundary event records. Specific log field names will depend on your control plane configuration and OWASP implementation guidance.

LLM06: Excessive Agency

ASI03

Agent trajectory manipulation

Agent behavioral deviation logs. Specific log field names will depend on your control plane configuration and OWASP implementation guidance.

LLM06: Excessive Agency

ASI04

Cascading agent failures

Tool chain causal sequence logs capturing the complete multi-step workflow

LLM06: Excessive Agency

ASI05

Rogue agents

Behavioral deviation and unauthorized agent activity logs. Specific log field names will depend on your control plane configuration and OWASP implementation guidance.

LLM06: Excessive Agency

ASI06

Resource and service abuse

Usage-based rate limiting logs and cost anomaly detection records. Specific log field names will depend on your control plane configuration and OWASP implementation guidance.

LLM10: Unbounded Consumption

ASI07

Insecure inter-agent communication

Inter-agent trust and message integrity logs. Specific log field names will depend on your control plane configuration and OWASP implementation guidance.

—

ASI08

Data and model exfiltration

Uncontrolled API data access logs and model route change event records

LLM02: Sensitive Information Disclosure; LLM03: Supply Chain

ASI09

Privilege escalation via agents

Escalation event logs and authorization boundary violation records

LLM06: Excessive Agency

ASI10

Compliance bypass

Policy enforcement event logs and governance violation records

—

_Agentic AI Top Ten item numbers reference the OWASP Top 10 for Agentic Applications (2026). LLM Top Ten item numbers reference the OWASP LLM Top Ten version 2025. The LLM Top Ten items noted above apply specifically to the non-agentic, single-model components of each threat pattern; agentic threat patterns that span multi-step tool chains or inter-agent workflows have no direct LLM Top Ten equivalent._

## How to forward AI observability data to your SIEM

Prediction Guard does not move data into your SIEM, hold its credentials, or test the connection. The control plane formats the audit log output so the events your SIEM ingests already match the field conventions that platform expects out of the box, without custom parsers or transforms on your side. Your existing ingestion pipeline (HEC endpoint, Datadog agent, syslog collector, or CrowdStrike connector) continues to handle delivery under your team's controls.

Enabling an integration follows the same pattern for every supported target:

1.  Open the Monitor page in the Prediction Guard Admin Console
2.  Click Configure under the integration you want to enable (Splunk, Datadog, CrowdStrike, or other supported SIEM)
3.  Confirm the integration to make it live
4.  The live integration signals the control plane to format audit log output using the field structure the chosen SIEM expects, such as the default fields CrowdStrike, Splunk, or Datadog parse natively

The result is an audit log stream that drops into your existing SIEM's data model with no bespoke field mapping required. Applications built on LangChain route through the control plane without code changes, and the audit events they produce inherit the same target-specific formatting automatically, as [Prediction Guard's guide](https://predictionguard.com/blog/harmonizing-your-ai-tools-the-strategic-imperative-for-it-leaders-in-a-fragmented-landscape) explains.

Across every supported target, the underlying records carry the same core fields: event\_type (event categorization), severity (severity classification), and policy\_violation\_type (policy violation identifier). These are structured to align with Elastic Common Schema and Splunk CIM conventions, supporting correlation with your existing network and identity logs alongside the SIEM-specific formatting that the live integration applies.

### Perimeter AI logs for NIST AI RMF and CMMC evidence

Prediction Guard deploys the entire control plane inside your own Kubernetes cluster, cloud VPC, or air-gapped environment. Prediction Guard generates the audit log. Your SIEM stores and retains it. That distinction matters for regulated industries because the evidence record lives in your infrastructure under your access controls, not in a vendor's infrastructure under theirs. Prediction Guard's [OWASP AIBOM sponsorship post](https://predictionguard.com/blog/securing-the-future-of-ai-why-prediction-guard-is-sponsoring-the-owasp-aibom-project) explains how this commitment extends to open standards for AI supply chain transparency.

## Creating audit-ready AI event records

AI governance log gaps commonly take three forms, and they surface in three different contexts: audit reviews, active security investigations, and customer due diligence conversations where an enterprise buyer asks to see evidence of how their data is governed inside your AI workflows. First, events that no system currently logs, such as prompt injection attempts and agent tool chains. Second, events that are partially logged but stripped of governance context, such as API calls with no policy evaluation result. Third, logs generated by model vendors that are retained outside your perimeter on the vendor's deletion schedule rather than yours. Prediction Guard's post on [harmonizing fragmented AI tool ecosystems](https://predictionguard.com/blog/harmonizing-your-ai-tools-the-strategic-imperative-for-it-leaders-in-a-fragmented-landscape) explains why point solutions stitched together cannot close these gaps at the governance level.

**System-level enforcement vs. advisory logging:** An AI governance policy enforced in the control plane generates a log entry for every model interaction whether or not an engineer remembered to follow it. A policy written in a wiki has no mechanism to produce an audit record when ignored. The NIST AI RMF Govern function requires accountability structures, and documentation alone does not satisfy that evidentiary standard.

**AI governance policy configuration:** Security teams configure AI governance policies on the Govern page of the Admin Console. Developers repoint existing OpenAI-compatible or Anthropic-compatible SDK calls at the control plane endpoint without changing their code. The control plane enforces the policies security teams defined and generates structured logs for every enforcement event.

**SIEM-native evidence:** Prediction Guard forwards AI security events directly to Splunk, Datadog, or syslog, making AI governance evidence available alongside your existing security operations data. Audit-ready means the log exists in the system your team already uses for investigation, not in a vendor portal that requires a support ticket to access. The [CycloneDX AIBOM design post](https://predictionguard.com/blog/why-we-built-aibom-export-with-cyclonedx-into-prediction-guard) covers how this design philosophy extends to AI asset inventory exports for compliance teams.

## AI logs for NIST AI RMF audit readiness

Satisfying NIST AI RMF audit requirements demands more than documentation. It requires operational systems that generate evidence across all four core functions. The following subsections detail how policy enforcement, risk mapping, observability, and forensic capabilities combine to produce audit-ready evidence.

### Enforcing AI policy with logs

The control plane evaluates every agent action, including tool invocations, model calls, output generation, against configured policies in real time. When an action falls outside policy boundaries (e.g., an agent attempting to invoke a tool it is not authorized to use, a model output containing PII, a prompt injection pattern detected in agent context), the control plane blocks or remediates that action before it completes. This runtime governance enforcement ensures that policy violations are stopped at the system level, not merely detected after the fact.

Policy enforcement at the system level produces two simultaneous outputs: the enforcement action (blocking a request, redacting PII, sanitizing a toxic output) and the log record that enforcement occurred. The action demonstrates the Manage function was operating, while the log demonstrates the Measure function captured the event. Without both, you can argue that an AI governance policy exists but not that it was active at the point any specific interaction occurred.

### AI risk mapping for audit readiness

The Map function requires organizations to identify AI systems, classify data access scope, and document operational context. Prediction Guard provides AI System registration for this inventory: every model, MCP server, and tool registered in the control plane is captured with its capabilities, data sources, and deployment context. The AIBOM export in CycloneDX format is the exportable view of that inventory, giving your compliance team a structured artifact for audit presentation. The [AIBOM build rationale post](https://predictionguard.com/blog/why-we-built-aibom-export-with-cyclonedx-into-prediction-guard) covers the technical design behind this approach.

### Audit-ready AI observability

Observability means you can answer three questions about any AI interaction: what happened, under which policy, and what did the system do about it. Most monitoring tools answer the first question at the application level but cannot answer the second and third for AI-specific events. Prediction Guard's structured logs carry policy identifiers, enforcement outcomes, and threat classifications alongside standard event metadata, making all three answers retrievable from your existing SIEM without a parallel monitoring console. The [document processing AI episode](https://youtube.com/watch?v=8Jq4xV4gjaA) covers practical examples of how this observability depth supports regulated-data workflows.

### AI event forensics and remediation

When a policy violation or agent escalation event is detected, the control plane generates a log entry capturing the incident's causal chain: the agent identity, the triggering input, the violated AI governance policy, the enforcement action, and the timestamp. That record forwards to your SIEM as a structured event, where it can trigger automated SOAR playbooks or populate an incident ticket for manual review. The NIST AI RMF Manage function requires organizations to allocate risk resources to measured risks on a regular basis, and a structured forensic record in your existing SIEM is the operational artifact that demonstrates that allocation occurred.

## Top AI security logging pitfalls to avoid

Regulated organizations building AI governance programs make four recurring mistakes that surface in the first audit cycle:

-   **Application-level logging only:** Application logs show API calls returned 200 but not that the response contained PII, a prompt injection was blocked, or an agent invoked unauthorized tools. NIST AI RMF audit reviews reject this as insufficient evidence because it cannot demonstrate Measure function activity.
-   **Vendor-hosted audit logs:** Model provider logs expire on short schedules, live in vendor infrastructure you do not control, and authenticate API keys rather than the human delegation chain CMMC requires. A vendor outage or contract dispute can make evidence unavailable precisely when you need it.
-   **Missing agentic context:** Logging single model calls leaves no record of tool call chains, multi-turn agent loops, or cascading failures (item ASI08 in the OWASP Top 10 for Agentic Applications) and insecure inter-agent communication (item ASI07 in the same framework). Each of these is a distinct threat category requiring its own logging pattern.
-   **Documented but unenforced policies:** A governance policy in a wiki with no system-level enforcement creates the worst possible audit outcome: proof your organization knew the standard but no evidence it was operating. The structural resolution is a control plane that enforces policy at every model interaction and generates a log entry for every enforcement decision.

## Start closing your AI logging gap

A regulator could ask today which AI agents are processing regulated data, under which governance policies, and where those logs are stored. If your security team needed to reconstruct an agent's tool chain from last Tuesday, or an enterprise customer asked for evidence of how their data is governed inside your AI workflows, how long would it take your team to answer accurately? Prediction Guard deploys the entire control plane inside your own infrastructure, enforces NIST AI RMF and OWASP policies at the system level, and forwards structured AI security events natively to Splunk, Datadog, or your syslog target without your developers changing a line of code.

[Book a deployment scoping call](https://predictionguard.com/get-started) to assess whether self-hosted deployment fits your infrastructure and regulatory requirements.

## FAQs

### What is AI security event logging?

AI security event logging is the structured capture of AI-specific interactions, including prompt injection attempts, governance policy violations, tool call chains, model route changes, and data access events, in a SIEM-consumable format that includes policy context, agent identity, threat classifications, and enforcement outcomes mapped to NIST AI RMF or OWASP taxonomies.

### Why can't a traditional SIEM capture agentic AI events without an AI control plane?

Traditional SIEMs parse network and application telemetry using syntactic correlation rules, but agentic AI events require semantic analysis of model inputs and outputs, behavioral baselines for multi-turn agent loops, and causal chain logging across tool call sequences. Without a control plane generating structured AI events, those interactions never produce log data that a SIEM can correlate.

### Which NIST AI RMF functions require specific AI log types?

All four NIST AI RMF core functions benefit from AI-specific log evidence: Govern benefits from policy configuration and role assignment records, Map benefits from AI System registration records and documentation of how data flows between AI system components, supporting evidence that operational context and risk scope were established, Measure benefits from records that support quantitative and qualitative assessment of AI risks, such as policy violation detection logs and risk scoring records, and Manage benefits from records that support risk treatment, incident response, and remediation activities, such as incident escalation logs and documented remediation actions. The NIST AI RMF log mapping table in the 'Critical AI logs for regulatory compliance' section above provides specific log types for each function.

### Does Prediction Guard store AI audit logs?

Prediction Guard generates structured AI security event logs inside your own infrastructure. Your SIEM, whether Splunk, Datadog, or a syslog target, receives and retains those events. Prediction Guard does not store your data or your audit records at any point in the log lifecycle.

### What log retention period applies to CMMC Level 2 AI workloads?

CMMC 2.0 Level 2 aligns with the NIST SP 800-171 Audit and Accountability domain, which requires that logs support after-the-fact investigation of security incidents. Retention requirements vary by organization and workload context, and C3PAO assessments typically expect retention periods calibrated to the time between compromise and discovery for systems processing CUI, including any AI agents those systems deploy.

### Which OWASP Agentic AI Top Ten items does tool call escalation logging address?

Tool call escalation logging is designed to support detection of tool misuse and privilege abuse threat categories identified in the [OWASP Top 10 for Agentic Applications (2026)](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/). By capturing the sequence of tool invocations with parameters and outcomes, these logs may also support investigation of cascading failure scenarios (ASI08), though the effectiveness of any forensic analysis will depend on the completeness of the tool chain record and your SIEM's correlation configuration.

## Key terms glossary

**AI security logs:** Structured records of AI-specific security events, including prompt injection attempts, policy violations, tool call chains, and model route changes, formatted for SIEM ingestion with policy context and enforcement outcomes included.

**Agentic AI observability:** The ability to reconstruct what an AI agent did, why it acted, and which governance policies were evaluated during each step of a multi-tool, multi-turn workflow, enabling after-the-fact forensic analysis.

**AI SIEM integration:** The forwarding of structured AI security events from a self-hosted control plane to an existing SIEM (Splunk, Datadog, syslog) for retention and correlation without data transiting vendor infrastructure.

**AI threat detection logging:** The structured capture of events associated with recognized AI threat categories, including prompt injection, excessive agency, tool misuse, and unauthorized model access, mapped to OWASP or NIST taxonomies for SIEM correlation.

**NIST AI RMF logging requirements:** The evidentiary obligations implied by the NIST AI Risk Management Framework's four core functions (Govern, Map, Measure, Manage), which require structured log evidence of policy configuration, system inventory, risk measurement, and incident management for every AI deployment.

**Hardware and infrastructure agnostic deployment:** The Prediction Guard control plane runs on any underlying infrastructure, including bare metal, virtual machines, cloud VPCs, and air-gapped networks, without requiring specialized hardware or a specific cloud provider.

**OpenAI/Anthropic SDK compatibility:**`base_url`

The approach for routing AI requests through the Prediction Guard control plane using existing OpenAI-compatible or Anthropic-compatible SDKs, requiring only a `base_url` change in existing code. No separate library installation is required for teams already using OpenAI or Anthropic client libraries.

**AI System composition:** The capability to define and govern multi-component AI workflows combining multiple models, tools, RAG systems, and agent orchestration layers as a single governed system under unified policies within the control plane.

**AIBOM (AI Bill of Materials):** A structured inventory of all components, versions, and dependencies in an AI system, exported in CycloneDX format by Prediction Guard as the byproduct of AI System registration, used for supply chain risk analysis and audit artifact production.

**Self-hosted deployment:** Prediction Guard's deployment model where the control plane runs entirely within the customer's own infrastructure (Kubernetes cluster, cloud VPC, or air-gapped environment), ensuring all logs, governance logic, and enforcement decisions never leave the customer's perimeter.

**AI governance policy enforcement:** Automated execution of security and governance policies aligned with NIST AI RMF and the OWASP Top Tens at the system level, covering prompt injection filtering, PII redaction, toxicity detection, and structured output validation, with a structured log entry generated for every enforcement action regardless of the developer framework used.
