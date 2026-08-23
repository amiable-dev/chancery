---
tags: [flashcards, network-layer-ai-security, security, mcp, prompt-injection, waf]
sr-due: 2026-04-18
sr-interval: 1
sr-ease: 250
---

# Network-Layer AI Security — Flashcards

#flashcards/security

## Definition <!-- kb:card:c71350 -->
What is Network-Layer AI Security?
?
The application of WAF rules and dedicated AI threat detection at the HTTP boundary in front of publicly-accessible AI endpoints (LLM APIs, MCP servers, agent interfaces). It detects and blocks prompt injection, data leakage, jailbreak attempts, and topic-classification abuse before requests reach the application layer — treating AI-specific attacks as first-class network threats.

## Two layers <!-- kb:card:3fefbd -->
What are the two complementary layers in Network-Layer AI Security?
?
1. **Standard WAF layer** — rate limiting, IP reputation, request size limits, geo-blocking (structural HTTP controls)
2. **AI Security / semantic inspection layer** — prompt injection classification, DLP on LLM responses, topic enforcement, jailbreak pattern detection (content-level controls)

## Why WAF alone is insufficient <!-- kb:card:cf72f1 -->
Why can't a conventional WAF alone protect LLM endpoints?
?
Conventional WAF rules detect patterns in HTTP *structure* (headers, URIs, form fields). AI attacks are *semantic* — they appear syntactically valid HTTP but exploit the model's instruction-following behaviour. A prompt injection like "ignore previous instructions" passes all structural WAF checks.

## Response inspection <!-- kb:card:e5f37a -->
What uniquely happens at the response level in AI security that traditional WAFs don't do?
?
AI security inspects LLM *responses* for PII, secrets, or sensitive content before returning them to callers — traditional WAFs only inspect inbound requests. This enables data leakage prevention even if malicious prompts reach the model.

## Key limitation <!-- kb:card:45197d -->
What is the key limitation of network-layer AI security for multi-turn attacks?
?
It evaluates each request in isolation (stateless per-request) and cannot track multi-turn conversation state. Sophisticated attacks that split malicious intent across multiple individually-benign-looking requests evade request-level detection.

## Internal vs public <!-- kb:card:2746bb -->
When is network-layer AI security most important, and when is the MCP Server Portal sufficient?
?
For *public-facing* MCP/LLM endpoints (accessible to the internet), network-layer AI security is the primary protection — anonymous users can't be given Zero Trust access controls. For *internal* MCP servers (behind Cloudflare Access + Portal), the portal's DLP and per-group access controls address the threat model instead.

## Defence-in-depth position <!-- kb:card:9a82b9 -->
What does "defence-in-depth" mean for AI endpoint security?
?
Network-layer AI security is one layer in a stack — it reduces attack surface and catches automated/common attacks at the boundary, but cannot be the only safety control. Application-layer measures (system prompt hardening, output validation, content moderation inside the model) are still required. No single layer is sufficient.
