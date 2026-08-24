---
title: Authorization response issuer identification
date: 2026-08-24
domain: standards
maturity: established
source_type: vendor-doc
tags: [concept, oauth, security, protocols, domain/standards, maturity/established, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.rfc-editor.org/info/rfc9207/
    hash: sha256:91a74b48d7f71f0584288b2291d2d4b79077bdd071c0bde20683be9c54bd0e37
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Authorization response issuer identification

## Definition

**Authorization response issuer identification** is the requirement that an authorization server name itself inside every authorization response it returns — successes and errors alike — so that a client trusting more than one server can establish who actually produced a credential before spending it. RFC 9207 standardises this for OAuth 2.0 as the iss response parameter, whose value is the server's issuer identifier and which the client validates by string comparison against the server it believes it sent the request to.

## Explanation

The gap it closes is structural rather than cryptographic. The OAuth 2.0 authorization response of RFC 6749 carries an authorization code or token back through the resource owner's user agent but says nothing about which server minted it, so a client holding relationships with several authorization servers cannot distinguish an honest server's response from an attacker-controlled one. That is the mix-up attack class: an attacker who controls any one authorization server the client trusts — through compromise, or simply by registering their own via dynamic client registration — steers the flow so the client receives an honest server's code and then redeems it at the attacker's token endpoint, handing over the credential. The countermeasure is deliberately small. A supporting server includes iss in every response and advertises authorization_response_iss_parameter_supported in its RFC 8414 metadata; the client form-urldecodes the value, compares it to the expected issuer identifier using simple string comparison, and on mismatch rejects the response outright and does not proceed with the grant. Two subtleties carry most of the engineering weight. In mixed deployments the client must retain per-server state about whether iss is supported, because otherwise an attacker defeats the check by simply omitting the parameter. And the parameter is intentionally not integrity-protected: the specification argues this is sufficient rather than sloppy, since an attacker able to tamper with an honest server's response already holds the authorization code and has no need to mount a mix-up attack at all. Being an IETF Standards Track document, its central claim is normative rather than advisory, and it is not merely asserted — the effectiveness of iss against mix-up attacks was formally proven in Fett, Küsters and Schmitz's comprehensive formal security analysis of OAuth 2.0.

## Key Properties

- A supporting server MUST include iss in every authorization response, error responses included
- The value is the server's RFC 8414 issuer identifier: an https URL carrying no query or fragment
- Clients compare with simple string comparison and MUST reject the response and abandon the grant on mismatch
- Clients must track iss support per server, or an attacker bypasses the check by omitting the parameter
- The parameter is deliberately not integrity-protected, because tampering implies the attacker already has the code

## Relationships

- [[mcp-authorization-hardening]] — supplies the mechanism that hardening profile only names — the profile mandates iss validation for MCP clients, while this concept carries the mix-up mechanics and the exact comparison procedure that make the mandate meaningful
- [[attested-per-agent-identity]] — per-agent attestation and issuer identification are complementary halves of mutual identity assurance in agent-to-service calls — attestation establishes which agent is calling, issuer identification establishes which authorization server actually answered.
- [[mcp-attack-surface-taxonomy]] — issuer identification supplies the concrete mix-up-attack mitigation for the MCP attack surface taxonomy's identity-verification category — a server naming itself in every response is the mechanical check that category otherwise leaves abstract.
- [[json-web-token]] — checks who answered before a client ever reaches a token — the same issuer-confirmation problem this format's own iss claim solves once a token exists, but running one protocol step earlier as an unprotected redirect parameter.
- [[mcp-confused-deputy-token-passthrough]] — stops a client from trusting the wrong authorization server's response; this concept stops a proxy sitting downstream of that same response from being tricked into acting as an unwitting go-between for a party it never validated.

## Applications

Hardening any OAuth 2.0 or OpenID Connect client that federates with more than one identity provider, including MCP clients and multi-tenant SaaS integrations. Also useful as an audit question against an authorization server: does it emit iss on both success and error paths, and does its metadata declare support so clients can enforce presence?

## Sources

- https://www.rfc-editor.org/info/rfc9207/

## See Also

- [[mcp-authorization-hardening]]
