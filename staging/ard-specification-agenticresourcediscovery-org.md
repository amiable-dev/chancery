# ARD Specification - AgenticResourceDiscovery.org

**Source:** https://agenticresourcediscovery.org/spec/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> A protocol for discovering agentic resources — tools, Skills, MCP servers, APIs, workflows, and agents — for AI clients

---

## Agentic Resource Discovery Specification[¶](#agentic-resource-discovery-specification "Permanent link")

**Federated Discovery and Search for Agentic Resources**

**Version**: v0.9 (Draft)  
**Status**: Proposal  
**Date**: May 28, 2026

**Authors**:

-   Junjie Bu — Google
-   R.V.Guha — Microsoft
-   Shaun Smith — Hugging Face

## 1\. Overview[¶](#1-overview "Permanent link")

LLMs increasingly rely on external capabilities — MCP tools, A2A agents, skills, and other callable services — to extend their functionality. In this document, we refer to these generically as agentic resources.

The **Agentic Resource Discovery Specification (ARD)** defines how AI artifacts are cataloged, discovered, and searched across federated networks.

This version (v0.9) aligns the discovery framework with the broader ai-catalog standard, shifting towards a media-type-driven approach and mandating standard web protocols (REST) for discovery interfaces to ensure maximum interoperability.

## 2\. Motivation[¶](#2-motivation "Permanent link")

The prevailing model requires users or developers to explicitly “install” or hardcode each agent before use. As the ecosystem scales to thousands or millions of agents, we need a model where LLMs can discover and invoke agents dynamically, similar to how search engines discover web pages.

Agent descriptions tend to be generic, and most LLMs currently select tools by including all descriptions in the context window — which does not scale. ARD addresses this by moving discovery outside the LLM into a dedicated search service, where richer signals (representative queries, publisher identity, compliance metadata, usage patterns) can be leveraged without consuming context window tokens.

## 3\. Core Design Principles[¶](#3-core-design-principles "Permanent link")

ARD is guided by the following core design principles to ensure scalability, interoperability, and ease of adoption:

### 3.1 Search-First Discovery[¶](#31-search-first-discovery "Permanent link")

Rather than requiring users or systems to pre-install agents (analogous to the mobile app store paradigm), ARD promotes a model where agents are discovered dynamically through search. Registries maintain a shared, continuously updated index, making capabilities discoverable the moment they are published.

### 3.2 Scalability Beyond Context Windows[¶](#32-scalability-beyond-context-windows "Permanent link")

Traditional tool selection relies on injecting all descriptions into the LLM's context window, which does not scale. ARD moves the selection problem outside the LLM into a dedicated search service, leveraging information retrieval techniques to scale to thousands or millions of capabilities without consuming context window tokens.

### 3.3 Artifact Agnostic Envelope[¶](#33-artifact-agnostic-envelope "Permanent link")

The specification does not define or constrain the internal schema of specific agent types (MCP, A2A, etc.). Instead, it acts as a clean envelope that uses a `type` field (formatted as an IANA Media Type) to identify what an artifact is, delegating the definition of artifact-specific metadata to the respective protocol specifications.

\[!NOTE\] **IANA Registration Status**: The types application/a2a-agent-card+json and application/mcp-server-card+json used in this specification are de-facto community standards tracking towards formal registration. Implementers should note that while well-known path directories (like /.well-known/agent-card.json) are officially registered permanent entries, full type registrations are pending working group joint submission and the format may change. In the meantime, omit strict verification of these types by intermediaries.

### 3.4 Strict Value-or-Reference[¶](#34-strict-value-or-reference "Permanent link")

To ensure safe parsing and predictable behavior in enterprise environments, a catalog entry must contain exactly one of two mutually exclusive keys for its content delivery:

-   **url**: A remote reference to the artifact document.
-   **data**: An embedded JSON object containing the full artifact document.

### 3.5 Universal Baseline for Federation[¶](#35-universal-baseline-for-federation "Permanent link")

To guarantee that any system can participate in discovery regardless of its execution stack, an Agent Registry **MUST** expose a standard HTTP REST search interface. While specialized protocols may be used for execution, discovery requires a universal baseline that any HTTP client can access.

### 3.6 Separation of Concerns[¶](#36-separation-of-concerns "Permanent link")

To maintain a clean and implementable standard, the protocol delegates operational details:

-   **Authentication is Delegated**: Agent authentication is handled by the specific artifact protocol, not the discovery layer.
-   **Distribution is Infrastructure**: Mechanisms for physical delivery (OCI, npm, etc.) are left to backend implementation and are not part of the discovery record.

## 4\. The Data Model[¶](#4-the-data-model "Permanent link")

The capability manifest (the file publishers host to advertise their agents) is the central data model. This manifest structure builds upon and extends the schema defined by the [ai-catalog](https://github.com/Agent-Card/ai-catalog) specification, introducing specialized discovery attributes (such as domain-anchored URN identifiers, root-level capabilities, and representative queries) to ensure high-performance search and compatibility across the broader agent ecosystem.

### 4.1 The Capability Manifest (ai-catalog.json)[¶](#41-the-capability-manifest-ai-catalogjson "Permanent link")

A manifest file hosted at /.well-known/ai-catalog.json lists the available artifacts.

`[](#__codelineno-0-1){   [](#__codelineno-0-2)  "specVersion": "1.0",  [](#__codelineno-0-3)  "host": {    [](#__codelineno-0-4)    "displayName": "Acme Enterprise AI",    [](#__codelineno-0-5)    "identifier": "did:web:acme.com"  [](#__codelineno-0-6)  },  [](#__codelineno-0-7)  "entries": [    [](#__codelineno-0-8)    {      [](#__codelineno-0-9)      "identifier": "urn:air:acme.com:agent:assistant",      [](#__codelineno-0-10)      "displayName": "Corporate Assistant (A2A)",      [](#__codelineno-0-11)      "type": "application/a2a-agent-card+json",      [](#__codelineno-0-12)      "url": "https://api.acme.com/agents/assistant.json",      [](#__codelineno-0-13)      "description": "General-purpose corporate A2A assistant.",      [](#__codelineno-0-14)      "representativeQueries": [        [](#__codelineno-0-15)        "help me draft an email to the security working group",        [](#__codelineno-0-16)        "summarize my unread messages from Todd"      [](#__codelineno-0-17)      ]    [](#__codelineno-0-18)    },    [](#__codelineno-0-19)    {      [](#__codelineno-0-20)      "identifier": "urn:air:acme.com:server:weather",      [](#__codelineno-0-21)      "displayName": "Weather Data Node",      [](#__codelineno-0-22)      "type": "application/mcp-server-card+json",      [](#__codelineno-0-23)      "url": "https://api.acme.com/mcp/weather.json",      [](#__codelineno-0-24)      "capabilities": ["WeatherTool", "ForecastTool"],      [](#__codelineno-0-25)      "description": "Enterprise weather MCP server for live telemetry.",      [](#__codelineno-0-26)      "representativeQueries": [        [](#__codelineno-0-27)        "what is the current wind speed in Chicago",        [](#__codelineno-0-28)        "get the 5-day forecast for Seattle"      [](#__codelineno-0-29)      ]    [](#__codelineno-0-30)    },    [](#__codelineno-0-31)    {      [](#__codelineno-0-32)      "identifier": "urn:air:acme.com:plugin:finance-suite",      [](#__codelineno-0-33)      "displayName": "Finance Tool Bundle",      [](#__codelineno-0-34)      "type": "application/ai-catalog+json",      [](#__codelineno-0-35)      "description": "A static nested bundle containing an A2A agent and its required market dataset.",      [](#__codelineno-0-36)      "tags": ["finance", "bundle"],      [](#__codelineno-0-37)      "data": {        [](#__codelineno-0-38)        "specVersion": "1.0",        [](#__codelineno-0-39)        "entries": [          [](#__codelineno-0-40)          {            [](#__codelineno-0-41)            "identifier": "urn:air:acme.com:finance:a2a",            [](#__codelineno-0-42)            "displayName": "Finance Trading Agent",            [](#__codelineno-0-43)            "type": "application/a2a-agent-card+json",            [](#__codelineno-0-44)            "url": "https://api.acme.com/agents/finance-trader.json"          [](#__codelineno-0-45)          },          [](#__codelineno-0-46)          {            [](#__codelineno-0-47)            "identifier": "urn:air:acme.com:market:2026",            [](#__codelineno-0-48)            "displayName": "Market Dataset 2026",            [](#__codelineno-0-49)            "type": "application/parquet",            [](#__codelineno-0-50)            "url": "https://data.acme.com/market-2026.parquet"          [](#__codelineno-0-51)          }        [](#__codelineno-0-52)        ]      [](#__codelineno-0-53)      }    [](#__codelineno-0-54)    },    [](#__codelineno-0-55)    {      [](#__codelineno-0-56)      "identifier": "urn:air:acme.com:registry:global",      [](#__codelineno-0-57)      "displayName": "Acme Global Agent Registry",      [](#__codelineno-0-58)      "type": "application/ai-registry+json",      [](#__codelineno-0-59)      "url": "https://registry.acme.com/api/v1/",      [](#__codelineno-0-60)      "description": "Dynamic REST API search interface to discover all approved enterprise agents.",      [](#__codelineno-0-61)      "tags": ["registry", "search", "dynamic"],      [](#__codelineno-0-62)      "trustManifest": {        [](#__codelineno-0-63)        "identity": "spiffe://acme.com/registry/global",        [](#__codelineno-0-64)        "identityType": "spiffe",        [](#__codelineno-0-65)        "attestations": [          [](#__codelineno-0-66)          {            [](#__codelineno-0-67)            "type": "SPIFFE-X509",            [](#__codelineno-0-68)            "uri": "https://acme.com/.well-known/spiffe/jwks"          [](#__codelineno-0-69)          },          [](#__codelineno-0-70)          {            [](#__codelineno-0-71)            "type": "SOC2-Type2",            [](#__codelineno-0-72)            "uri": "https://trust.acme.com/reports/soc2.pdf"          [](#__codelineno-0-73)          }        [](#__codelineno-0-74)        ]      [](#__codelineno-0-75)      }    [](#__codelineno-0-76)    },    [](#__codelineno-0-77)    {      [](#__codelineno-0-78)      "identifier": "urn:air:acme.com:catalog:engineering",      [](#__codelineno-0-79)      "displayName": "Engineering Department Catalogs",      [](#__codelineno-0-80)      "type": "application/ai-catalog+json",      [](#__codelineno-0-81)      "url": "https://acme.com/catalogs/engineering.json",      [](#__codelineno-0-82)      "description": "Sub-catalogs containing CI/CD and internal deployment agents."    [](#__codelineno-0-83)    }  [](#__codelineno-0-84)  ] [](#__codelineno-0-85)}`

### 4.2 Catalog Entry Object[¶](#42-catalog-entry-object "Permanent link")

Each object in the entries array MUST contain:

Field

Type

Description

identifier

String

Globally unique logical identifier for discovery. MUST use a domain-anchored URN namespace format (`urn:air:<publisher>:<namespace>:<agent-name>`) where `<publisher>` is a verifiable domain name. This guarantees cross-network uniqueness, nomenclature stability, and decentralized trust binding. See [§4.2.1](#421-agent-identifier-identifier-format-and-rationale) for detailed format specifications and architectural rationale.

displayName

String

Human-readable name.

type

String

Type of the AI artifact.

Exactly one of the following MUST be present:

Field

Type

Description

url

String

URL to retrieve the full artifact.

data

Object

The complete artifact document inline.

Optional fields:

Field

Type

Description

description

String

Short description.

tags

Array

Keywords for filtering.

capabilities

Array

Strings representing specific skills or tools (e.g., \["WeatherTool"\]) to enable fast discovery database filtering without full artifact lookup.

representativeQueries

Array

Sample natural-language queries (e.g., \["find me a flight booking agent"\]). Used by registries to build semantic vector embeddings for search ranking. SHOULD contain 2–5 examples.

version

String

Version of the artifact.

updatedAt

String

ISO 8601 timestamp.

metadata

Map

Custom metadata key-value pairs.

trustManifest

Object

Verifiable identity and trust metadata.

### 4.2.1 Agent Identifier (identifier) Format and Rationale[¶](#421-agent-identifier-identifier-format-and-rationale "Permanent link")

The identifier field serves as the primary logical handle for an agent or capability across federated discovery networks. It MUST follow a standardized, domain-anchored URN format complying with IETF RFC 8141:

`[](#__codelineno-1-1)urn:air:<publisher>:<namespace>:<agent-name>`

#### Format Structure[¶](#format-structure "Permanent link")

-   **urn**: Mandatory prefix indicating a Uniform Resource Name.
-   **air**: The Namespace Identifier (NID), designating the AI artifact and agent discovery ecosystem.
-   **`<publisher>`**: The Namespace Specific String (NSS) root. MUST be a fully qualified domain name (FQDN) representing the publisher or host organization (e.g., acme.com, github.com). This domain acts as the organizational trust anchor and MUST be verifiable against the cryptographic workload identity in the trustManifest.
-   **`<namespace>`**: Optional hierarchical segments separated by : (e.g., finance:trading, weather:telemetry). Allows publishers to categorize capabilities by department, team, or product line without altering infrastructure routing.
-   **`<agent-name>`**: Mandatory terminal segment representing the specific, logical short name of the agent or tool (e.g., assistant, pptx-creator).

#### Please see more details at [Architectural Rationale for URN Restriction](#appendix-c:-agent-naming-urn-format)[¶](#please-see-more-details-at-architectural-rationale-for-urn-restriction "Permanent link")

### 4.3 Host Info Object[¶](#43-host-info-object "Permanent link")

Describes the operator of the catalog.

Field

Type

Description

displayName

String

Human-readable name of the host.

identifier

String

Optional. Verifiable identifier (DID or domain).

documentationUrl

String

Optional. URL to documentation.

logoUrl

String

Optional. URL to logo.

trustManifest

Object

Optional. Trust metadata for the host.

### 4.4 Examples[¶](#44-examples "Permanent link")

#### The Solo Developer Path[¶](#the-solo-developer-path "Permanent link")

No complex identity ceremony or cloud account required.

An agent hosted on Hugging Face Spaces (MCP), published in a manifest:

`[](#__codelineno-2-1){   [](#__codelineno-2-2)  "specVersion": "1.0",  [](#__codelineno-2-3)  "host": { "displayName": "Alice's AI Tools" },  [](#__codelineno-2-4)  "entries": [    [](#__codelineno-2-5)    {      [](#__codelineno-2-6)      "identifier": "urn:air:hf.co:alice-dev:weather-agent",      [](#__codelineno-2-7)      "displayName": "Weather Agent",      [](#__codelineno-2-8)      "type": "application/mcp-server-card+json",      [](#__codelineno-2-9)      "data": {        [](#__codelineno-2-10)        "name": "Weather Agent",        [](#__codelineno-2-11)        "description": "Simple weather lookup using open data",        [](#__codelineno-2-12)        "tools": [          [](#__codelineno-2-13)          {            [](#__codelineno-2-14)            "name": "get_weather",            [](#__codelineno-2-15)            "description": "Get current weather for a city",            [](#__codelineno-2-16)            "inputSchema": {              [](#__codelineno-2-17)              "type": "object",              [](#__codelineno-2-18)              "properties": { "city": { "type": "string" } },              [](#__codelineno-2-19)              "required": ["city"]            [](#__codelineno-2-20)            }          [](#__codelineno-2-21)          }        [](#__codelineno-2-22)        ]      [](#__codelineno-2-23)      }    [](#__codelineno-2-24)    }  [](#__codelineno-2-25)  ] [](#__codelineno-2-26)}`

A skill hosted on GitHub, published in a manifest:

`[](#__codelineno-3-1){   [](#__codelineno-3-2)  "specVersion": "1.0",  [](#__codelineno-3-3)  "host": { "displayName": "Alice's AI Tools" },  [](#__codelineno-3-4)  "entries": [    [](#__codelineno-3-5)    {      [](#__codelineno-3-6)      "identifier": "urn:air:github.com:alice-dev:pptx-creator",      [](#__codelineno-3-7)      "displayName": "pptx-creator",      [](#__codelineno-3-8)      "type": "application/ai-skill",      [](#__codelineno-3-9)      "url": "https://github.com/alice-dev/pptx-creator",      [](#__codelineno-3-10)      "description": "Create professional PowerPoint presentations following brand guidelines."    [](#__codelineno-3-11)    }  [](#__codelineno-3-12)  ] [](#__codelineno-3-13)}`

Discovery via GitHub Pages (combining the above):

`[](#__codelineno-4-1){   [](#__codelineno-4-2)  "specVersion": "1.0",  [](#__codelineno-4-3)  "host": { "displayName": "Alice's AI Tools" },  [](#__codelineno-4-4)  "entries": [    [](#__codelineno-4-5)    {      [](#__codelineno-4-6)      "identifier": "urn:air:hf.co:alice-dev:weather-agent",      [](#__codelineno-4-7)      "displayName": "Weather Agent",      [](#__codelineno-4-8)      "type": "application/mcp-server-card+json",      [](#__codelineno-4-9)      "url": "https://alice-dev.github.io/weather-agent/entry.json"    [](#__codelineno-4-10)    },    [](#__codelineno-4-11)    {      [](#__codelineno-4-12)      "identifier": "urn:air:github.com:alice-dev:pptx-creator",      [](#__codelineno-4-13)      "displayName": "pptx-creator",      [](#__codelineno-4-14)      "type": "application/ai-skill+md",      [](#__codelineno-4-15)      "url": "https://github.com/alice-dev/pptx-creator"    [](#__codelineno-4-16)    }  [](#__codelineno-4-17)  ] [](#__codelineno-4-18)}`

#### Enterprise Example[¶](#enterprise-example "Permanent link")

Using trustManifest for compliance, published in a manifest.

`[](#__codelineno-5-1){   [](#__codelineno-5-2)  "specVersion": "1.0",  [](#__codelineno-5-3)  "host": {    [](#__codelineno-5-4)    "displayName": "Acme Enterprise AI",    [](#__codelineno-5-5)    "identifier": "did:web:acme.com"  [](#__codelineno-5-6)  },  [](#__codelineno-5-7)  "entries": [    [](#__codelineno-5-8)    {      [](#__codelineno-5-9)      "identifier": "urn:air:acme.com:travel:concierge",      [](#__codelineno-5-10)      "displayName": "Travel Concierge",      [](#__codelineno-5-11)      "type": "application/a2a-agent-card+json",      [](#__codelineno-5-12)      "url": "https://api.acme.com/travel/concierge.json",      [](#__codelineno-5-13)      "description": "AI-powered travel planning",      [](#__codelineno-5-14)      "trustManifest": {        [](#__codelineno-5-15)        "identity": "spiffe://acme.com/travel/concierge",        [](#__codelineno-5-16)        "identityType": "spiffe",        [](#__codelineno-5-17)        "attestations": [          [](#__codelineno-5-18)          {            [](#__codelineno-5-19)            "type": "SPIFFE-X509",            [](#__codelineno-5-20)            "uri": "https://acme.com/.well-known/spiffe/jwks"          [](#__codelineno-5-21)          },          [](#__codelineno-5-22)          {            [](#__codelineno-5-23)            "type": "SOC2-Type2",            [](#__codelineno-5-24)            "uri": "https://trust.acme.com/reports/soc2.pdf"          [](#__codelineno-5-25)          },          [](#__codelineno-5-26)          {            [](#__codelineno-5-27)            "type": "GDPR",            [](#__codelineno-5-28)            "uri": "https://trust.acme.com/compliance/gdpr"          [](#__codelineno-5-29)          }        [](#__codelineno-5-30)        ]      [](#__codelineno-5-31)      }    [](#__codelineno-5-32)    }  [](#__codelineno-5-33)  ] [](#__codelineno-5-34)}`

### 4.5 Description Vocabulary[¶](#45-description-vocabulary "Permanent link")

Catalog entries MAY use Schema.org vocabulary (or comparable structured schemas) in their descriptive fields. Any Schema.org-based markup used to describe the agent can be leveraged as filter dimensions in the Search API. This allows domain-specific structured metadata (pricing, geographic coverage, supported languages, certifications) to be attached to records and queried against.

## 5\. Identity and Trust[¶](#5-identity-and-trust "Permanent link")

Identity binding, compliance attestations, provenance, and cryptographic signatures are consolidated into the optional trustManifest object, as defined in the ai-catalog specification. This keeps the core entry lightweight for simple use cases while providing a robust hook for enterprise compliance, entirely separate from the artifact's native operational metadata.

### 5.1 The Trust Manifest Object[¶](#51-the-trust-manifest-object "Permanent link")

The trustManifest object sits alongside the artifact content in a catalog entry and contains the following key members:

Field

Type

Description

identity

String

**Required**. Globally unique cryptographic workload identifier (e.g., a SPIFFE ID, DID, or HTTPS FQDN URI). Decoupled from the entry's discovery identifier. The cryptographic trust domain inside this identity MUST align with the authority domain root embedded in the discovery identifier namespace.

identityType

String

Optional. Type hint for the identity URI (e.g., "did", "spiffe", "https").

attestations

Array

Optional. List of Attestation objects providing verifiable claims.

provenance

Array

Optional. List of Provenance Link objects recording lineage.

signature

String

Optional. Detached JWS signature computed over the Trust Manifest content.

### 5.2 Attestation Object[¶](#52-attestation-object "Permanent link")

Provides verifiable proof of a claim (e.g., compliance certifications).

Field

Type

Description

type

String

**Required**. Attestation type (e.g., "SOC2-Type2", "HIPAA-Audit").

uri

String

**Required**. Location of the attestation document.

digest

String

Optional. Cryptographic hash for integrity verification.

### 5.3 Provenance Link Object[¶](#53-provenance-link-object "Permanent link")

Records lineage and source information.

Field

Type

Description

relation

String

**Required**. Relationship type (e.g., "derivedFrom", "publishedFrom").

sourceId

String

**Required**. Identifier of the source artifact or data.

sourceDigest

String

Optional. Digest of the source for verification.

For full verification procedures (signature checking, key resolution), refer to the core ai-catalog specification.

## 6\. Discovery[¶](#6-discovery "Permanent link")

The discovery specification supports two operational layers:

1.  **Static Discovery**: A decentralized publishing mechanism where developers and enterprises host static JSON manifests.
2.  **Dynamic Discovery**: Active, searchable services (Registries) that index static catalogs and expose dynamic search endpoints.

### 6.1 Discovery Mechanisms[¶](#61-discovery-mechanisms "Permanent link")

Publishers advertise their capability manifests via the following mechanisms:

-   **Well-Known URI**: Hosting the manifest at https://{domain}/.well-known/ai-catalog.json.
-   **Agentmap Directive**: Adding an entry in robots.txt (e.g., Agentmap: https://example.com/catalog.json).
-   **HTML Link Tag**: Including \\<link rel="ai-catalog" href="..."> in the \\<head> of a document.
-   **DNS**: Publishing Service Binding (SVCB) records, with an optional fallback to Text (TXT) records, in the DNS that point directly to either a static capability manifest (e.g., `{agent-name}.example.com IN SVCB . well-known=/not-well-known/ai-catalog.json` or a dynamic Agent Registry search endpoint (e.g., `_index._agents.example.com 3600 IN SVCB 1 agent-search.example.com`). For more details, follow [DNS-AID](https://datatracker.ietf.org/doc/html/draft-mozleywilliams-dnsop-dnsaid)

### 6.2 Ingestion Pipelines[¶](#62-ingestion-pipelines "Permanent link")

Agent Registry instances populate their indexes through ingestion pipelines:

-   **Web Ingestion (Required)**: Crawling ai-catalog.json files from discovered URIs. All ARD implementations MUST support this.
-   **Additional Pipelines (Optional)**: Registries may support scanning git repositories, npm registries, or OCI registries as indicated by their configuration.

## 7\. The ARD API[¶](#7-the-ard-api "Permanent link")

An Agent Registry **MUST** expose a standard HTTP REST search interface to guarantee universal federation. The operational base URL for these endpoints is discovered dynamically by identifying catalog entries within the static ai-catalog.json manifest that carry the application/ai-registry+json media type, as defined in §4.1.

### 7.1 The Query Model[¶](#71-the-query-model "Permanent link")

The `POST /search` and `POST /explore` endpoints accept a common `query` object with two members, `text` and `filter`. Each endpoint defines its own additional parameters alongside `query` (see §7.2 and §7.3) and its own presence requirements for `text` and `filter`.

`[](#__codelineno-6-1){   [](#__codelineno-6-2)  "query": {    [](#__codelineno-6-3)    "text": "find me a flight booking agent",    [](#__codelineno-6-4)    "filter": {      [](#__codelineno-6-5)      "type": ["application/a2a-agent-card+json"],      [](#__codelineno-6-6)      "tags": ["finance"],      [](#__codelineno-6-7)      "trustManifest.attestations.type": ["SOC2-Type2"]    [](#__codelineno-6-8)    }  [](#__codelineno-6-9)  } [](#__codelineno-6-10)}`

Field

Type

Description

text

String

Natural-language description of the need. Narrows the result set by semantic relevance.

filter

Object

Structured constraints. Keys are field paths into the catalog entry; values are arrays (a bare scalar is accepted as a single-element array).

`text` and `filter` compose: an entry is in the matched set if it satisfies the relevance criteria for `text` (when present) AND every constraint in `filter` (when present).

**Filter Semantics**: Field paths are dot-separated to address nested fields (e.g. `trustManifest.attestations.type`). When the value at a path is an array, a constraint matches if any element satisfies it. Within a single key, values are combined with OR; across keys, with AND.

**Extensibility**: Any attribute present in a catalog entry MAY be used as a filter key — standard fields (type, tags, capabilities, publisher, version, …), nested fields under `trustManifest` or `host`, custom `metadata.*` fields, and `Schema.org`\-vocabulary fields (§4.5). New attributes become filterable without changes to this specification.

The `publisher` key is derived from the `<publisher>` segment of an entry's URN identifier (§4.2.1), not a stored field; registries extract it from the identifier.

**Registry Support**: Registries SHOULD support filtering on common standard fields; support for `metadata.*` and other extension fields is registry-defined. A registry MAY reject a filter that references an unsupported field path with a 400 error.

### 7.2 Search (POST /search)[¶](#72-search-post-search "Permanent link")

Accepts a `query` (§7.1) and returns catalog entries ranked by relevance. For Search, `text` is required; `filter` is optional.

**Request Schema:**

`[](#__codelineno-7-1){   [](#__codelineno-7-2)  "query": {    [](#__codelineno-7-3)    "text": "find me a flight booking agent",    [](#__codelineno-7-4)    "filter": {      [](#__codelineno-7-5)      "type": ["application/a2a-agent-card+json"]    [](#__codelineno-7-6)    }  [](#__codelineno-7-7)  },  [](#__codelineno-7-8)  "federation": "referrals",  [](#__codelineno-7-9)  "pageSize": 5 [](#__codelineno-7-10)}`

In addition to the `query` object (§7.1), Search accepts:

Field

Type

Description

federation

String

Optional. auto (default), referrals, or none.

pageSize

Integer

Optional (root-level). Max results to return per page (default: 10, max: 100).

pageToken

String

Optional (root-level). Pagination token to retrieve the next page.

**Response Schema:**

The response returns standard catalog entries with additional relevance scores, plus optional referrals. The score parameter denotes **semantic relevance ranking** (0-100) computed by the search registry, indicating how well the entry satisfies the natural language query criteria. It is strictly an informational relevance metric and MUST NOT be interpreted by orchestrators as a cryptographic trust, compliance, or safety rating. Trust evaluation is fully decoupled and handled independently via the verification procedures in the trustManifest layer.

`[](#__codelineno-8-1){   [](#__codelineno-8-2)  "results": [    [](#__codelineno-8-3)    {      [](#__codelineno-8-4)      "identifier": "urn:air:acme.com:agent:assistant",      [](#__codelineno-8-5)      "displayName": "Corporate Assistant (A2A)",      [](#__codelineno-8-6)      "type": "application/a2a-agent-card+json",      [](#__codelineno-8-7)      "url": "https://api.acme.com/agents/assistant.json",      [](#__codelineno-8-8)      "score": 95,      [](#__codelineno-8-9)      "source": "https://registry.acme.com/api/v1/"    [](#__codelineno-8-10)    },    [](#__codelineno-8-11)    {      [](#__codelineno-8-12)      "identifier": "urn:air:example.com:weather-server",      [](#__codelineno-8-13)      "displayName": "Global Weather Service",      [](#__codelineno-8-14)      "type": "application/mcp-server-card+json",      [](#__codelineno-8-15)      "url": "https://weather.example.com/mcp",      [](#__codelineno-8-16)      "capabilities": ["WeatherTool"],      [](#__codelineno-8-17)      "score": 88,      [](#__codelineno-8-18)      "source": "https://finder.external.org/api/"    [](#__codelineno-8-19)    }  [](#__codelineno-8-20)  ],  [](#__codelineno-8-21)  "referrals": [    [](#__codelineno-8-22)    {      [](#__codelineno-8-23)      "identifier": "urn:air:nlweb.ai:registry:public",      [](#__codelineno-8-24)      "displayName": "Public Agent Finder",      [](#__codelineno-8-25)      "type": "application/ai-registry+json",      [](#__codelineno-8-26)      "url": "https://finder.nlweb.ai/search"    [](#__codelineno-8-27)    }  [](#__codelineno-8-28)  ],  [](#__codelineno-8-29)  "pageToken": "eyJwYWdlIjogMn0=" [](#__codelineno-8-30)}`

### 7.2.1 Query Processing and Resolution (Informative)[¶](#721-query-processing-and-resolution-informative "Permanent link")

While this specification mandates the REST interface for interoperability, implementations may employ advanced techniques to resolve natural language queries to specific agent endpoints. An example flow, drawing from research on Agent Naming Services (ANS) and Federated Registries, involves the following steps:

1.  **Semantic Translation & Embedding**:
2.  **LLM Query Interpretation**: The Registry uses an LLM to extract specific multi-dimensional requirements from the natural language text field, translating it into structured capability attributes (e.g., domain: travel, skill: flight\_booking, constraints: meal\_preference).
3.  **Vector Embeddings**: The Registry may also convert the query description into a dense vector embedding to understand semantic meaning (e.g., matching "foreign exchange" to "forex" or "international money transfer").
4.  **Global Discovery via Federated Routing**:
5.  Advanced implementations may execute this query against a federated network. For example, using semantic attributes or embedding vectors to perform a search across a Distributed Hash Table (DHT) (e.g., an extended IPFS Kademlia DHT) or by leveraging **DNS-AID** to discover authoritative registries for specific domains.
6.  This maps the semantic capabilities to cryptographic digests or endpoints of agents that possess those skills across the federated network.

### 7.3 Explore (POST /explore) — Optional[¶](#73-explore-post-explore-optional "Permanent link")

Accepts a `query` (§7.1) and returns an aggregation over the matched set rather than ranked entries. Explore lets clients introspect a registry — for example, "which media types are available?" — and obtain facet breakdowns narrowed by the same `text` and `filter` as Search. For Explore, `text` and `filter` are both optional; when both are absent, the aggregation covers the entire registry.

**Request Schema:**

`[](#__codelineno-9-1){   [](#__codelineno-9-2)  "query": {    [](#__codelineno-9-3)    "text": "currency conversion",    [](#__codelineno-9-4)    "filter": {      [](#__codelineno-9-5)      "trustManifest.attestations.type": ["SOC2-Type2"]    [](#__codelineno-9-6)    }  [](#__codelineno-9-7)  },  [](#__codelineno-9-8)  "resultType": {    [](#__codelineno-9-9)    "facets": [      [](#__codelineno-9-10)      { "field": "type" },      [](#__codelineno-9-11)      { "field": "publisher", "limit": 50 }    [](#__codelineno-9-12)    ]  [](#__codelineno-9-13)  } [](#__codelineno-9-14)}`

In addition to the `query` object (§7.1), Explore accepts:

Field

Type

Description

resultType

Object

Required. The shape of result to compute. The only defined shape is facets (below); future shapes such as counts or sample extend this field without protocol changes.

Each element of `resultType.facets`:

Field

Type

Description

field

String

Required. Field path to aggregate (same syntax as filter keys, §7.1).

limit

Integer

Optional. Maximum number of buckets returned. Default: 20.

minCount

Integer

Optional. Suppress buckets with counts below this threshold.

**Response Schema:**

`[](#__codelineno-10-1){   [](#__codelineno-10-2)  "resultType": "facets",  [](#__codelineno-10-3)  "facets": {    [](#__codelineno-10-4)    "type": {      [](#__codelineno-10-5)      "buckets": [        [](#__codelineno-10-6)        { "value": "application/mcp-server-card+json", "count": 1247 },        [](#__codelineno-10-7)        { "value": "application/a2a-agent-card+json", "count": 389 }      [](#__codelineno-10-8)      ],      [](#__codelineno-10-9)      "otherCount": 23    [](#__codelineno-10-10)    },    [](#__codelineno-10-11)    "publisher": {      [](#__codelineno-10-12)      "buckets": [        [](#__codelineno-10-13)        { "value": "acme.com", "count": 412 }      [](#__codelineno-10-14)      ]    [](#__codelineno-10-15)    }  [](#__codelineno-10-16)  } [](#__codelineno-10-17)}`

Each bucket carries `value` and SHOULD carry `count` (the number of matching entries; a registry MAY omit it where counts cannot be computed efficiently). `otherCount` reports the number of matching entries in buckets beyond `limit`.

Facets are computed over the full matched set, not a single page. For semantic text queries, the registry applies a relevance cutoff: entries whose relevance falls below the cutoff are excluded from the matched set. The cutoff is registry-defined, but within a single registry the same cutoff governs both Search results and Explore facets. The cutoff and the relevance score (§7.2) reflect relevance only and MUST NOT be interpreted as a trust, compliance, or safety judgment.

Explore does not federate; it is scoped to the registry queried. Federated discovery is the role of Search (§8). A registry that does not implement Explore returns a `501 Not Implemented` HTTP status code.

### 7.4 List (GET /agents) — Optional[¶](#74-list-get-agents-optional "Permanent link")

Deterministic browsing, designed for developer portals. Highly cacheable, relies on strict database filtering, and does not support relevance-based sorting.

**Parameters:**

Parameter

Type

Description

filter

String

EBNF filter expression.

orderBy

String

Sorting fields (e.g., name, created\_at DESC).

pageSize

Integer

Max results (default: 20, max: 100).

pageToken

String

Pagination token.

### 7.5 Protocol Wrappers (Optional)[¶](#75-protocol-wrappers-optional "Permanent link")

While the REST API is mandated as the floor for interoperability, a Registry **MAY** additionally expose its search capability natively via an MCP Tool or an A2A Skill to preserve native orchestrator flows.

The return response from these protocol-specific wrappers **MUST** follow the same catalog entry format as defined in this specification. However, the request format for these wrappers may differ slightly to accommodate protocol-specific conventions and is pending further definition.

## 8\. Federation[¶](#8-federation "Permanent link")

Because the REST API is mandated, Registry-to-Registry routing (federation) becomes a simple HTTP operation. The client controls federation through the federation query parameter:

-   **auto**: The Registry queries upstream registries automatically, merges their results with its own, and returns a unified response. The client gets a single merged result set.
-   **referrals**: The Registry returns its results plus catalog entries for other Registries the client may query. The client decides which to follow.
-   **none**: The Registry searches only its own index.

This gives the client full control over the federation topology without requiring complex protocol translation layers.

### Example: Referrals Mode[¶](#example-referrals-mode "Permanent link")

**Request:**

`[](#__codelineno-11-1){   [](#__codelineno-11-2)  "query": {    [](#__codelineno-11-3)    "text": "find me a flight booking agent"  [](#__codelineno-11-4)  },  [](#__codelineno-11-5)  "federation": "referrals" [](#__codelineno-11-6)}`

**Response:**

`[](#__codelineno-12-1){   [](#__codelineno-12-2)  "results": [    [](#__codelineno-12-3)    {      [](#__codelineno-12-4)      "identifier": "urn:air:acme.com:agent:expense",      [](#__codelineno-12-5)      "displayName": "Corporate Expenses",      [](#__codelineno-12-6)      "type": "application/a2a-agent-card+json",      [](#__codelineno-12-7)      "url": "https://internal.corp/agents/expense.json",      [](#__codelineno-12-8)      "score": 97,      [](#__codelineno-12-9)      "source": "https://finder.internal.corp"    [](#__codelineno-12-10)    }  [](#__codelineno-12-11)  ],  [](#__codelineno-12-12)  "referrals": [    [](#__codelineno-12-13)    {      [](#__codelineno-12-14)      "identifier": "urn:air:nlweb.ai:registry:public",      [](#__codelineno-12-15)      "displayName": "Public Agent Finder",      [](#__codelineno-12-16)      "type": "application/ai-registry",      [](#__codelineno-12-17)      "url": "https://finder.nlweb.ai/search"    [](#__codelineno-12-18)    },    [](#__codelineno-12-19)    {      [](#__codelineno-12-20)      "identifier": "urn:air:example.com:registry:travel",      [](#__codelineno-12-21)      "displayName": "Travel Agent Finder",      [](#__codelineno-12-22)      "type": "application/ai-registry",      [](#__codelineno-12-23)      "url": "https://travel.finder.example/search"    [](#__codelineno-12-24)    }  [](#__codelineno-12-25)  ] [](#__codelineno-12-26)}`

## 9\. Integration Example[¶](#9-integration-example "Permanent link")

A user asks an orchestrator: “Book me a flight to Tokyo and file the travel expense report.”

1.  The orchestrator queries the enterprise Agent Registry with federation: "referrals".
2.  The Registry returns an internal expense agent, plus referrals to other Registries.
3.  The orchestrator follows a referral to a public Agent Registry and queries it for flight booking agents.
4.  The orchestrator now has both capabilities and can proceed to invoke them using their respective protocols (e.g., A2A for booking, MCP for expense filing).

* * *

## Appendix A: Filter Expression Syntax[¶](#appendix-a-filter-expression-syntax "Permanent link")

The filter parameter in the List API (GET /agents) uses a simple EBNF-like format for structured constraints.

Filter Field

Type

Description

displayName

String

Case-insensitive name filter.

type

String

Comma-separated media types (OR logic).

publisherId

String

Comma-separated publisher IDs (OR logic).

createdAfter

String

ISO 8601 timestamp.

updatedAfter

String

ISO 8601 timestamp.

Logical AND is used across different parameters; OR is used within a single parameter with multiple values (comma-separated).

## Appendix B: Standard Error Codes[¶](#appendix-b-standard-error-codes "Permanent link")

HTTP Code

Error Code

Description

400

INVALID\_ARGUMENT

Malformed query or invalid filter syntax.

401

UNAUTHENTICATED

Invalid or missing credentials.

404

NOT\_FOUND

Non-existent agent or registry.

429

RATE\_LIMIT\_EXCEEDED

Too many requests.

500

INTERNAL\_ERROR

Internal server failure.

## Appendix C: Agent Naming URN format[¶](#appendix-c:-agent-naming-urn-format "Permanent link")

Restricting the discovery identifier to this specific URN format, rather than allowing arbitrary URIs (such as https://... or spiffe://...), provides fundamental architectural benefits for federated agent discovery:

1.  **Nomenclature Stability (Immutable Noun vs. Mutable Location)**: Arbitrary URIs, particularly HTTP URLs, conflate the _logical identity_ of a capability with its _physical network location_. If an enterprise migrates workloads across cloud providers, restructures its API gateway, or alters its deployment clusters, an HTTP URL breaks. The urn:air: identifier acts as an abstract, permanent contract (the "noun"). Physical distribution and transport bindings are decoupled into the url or data fields, allowing underlying infrastructure to evolve without breaking client discovery, indexing, or orchestration code.
2.  **Strict Separation of Concerns**: Federated search registries require a clean, stable primary key to index capabilities efficiently across global networks. Conversely, zero-trust execution runtimes require dynamic, verifiable cryptographic tokens (SPIFFE IDs, DIDs, X.509 certificates) to authenticate workloads. Forcing a single URI to serve both roles creates an architectural bottleneck. The urn:air: format cleanly decouples the searchable discovery handle from the security principal, allowing the discovery index and the security mesh to operate independently.
3.  **Decentralized Trust and Authority Binding**: In a globally federated open discovery network, search registries must prevent malicious actors from claiming namespaces they do not own (e.g., an untrusted publisher claiming urn:air:google.com:tax-agent). Mandating that `<publisher>` be a valid FQDN establishes an immediate, verifiable authority anchor. Registries and orchestrators programmatically extract the domain from the URN (google.com) and cross-reference it with the cryptographic claim in trustManifest.identity. If the workload cannot produce a valid cryptographic attestation (e.g., mTLS certificate or SPIFFE SVID) issued by google.com, the capability is rejected. This ensures decentralized, zero-trust verification without requiring a centralized naming committee.
4.  **Search and Discovery Ergonomics (The @ Resolution Pattern)**: Users and LLMs require intuitive, semantic handles for capabilities (e.g., Assistant@Acme). The structured hierarchy of `urn:air:<publisher>:<namespace>:<agent-name>` allows search engines and federated registries to parse components deterministically. Registries can easily match natural language queries to the publisher domain (Acme) and the terminal short name (Assistant), enabling high-performance semantic filtering, aggregation, and conflict resolution (e.g., displaying Assistant with a verified Acme shield).
5.  **Cross-Network Uniqueness and Federation Scalability**: Domain-anchored URNs guarantee global uniqueness across disparate federated registries without requiring centralized registration databases. Because domain names are already globally unique via the DNS root, anchoring the URN to a domain eliminates collision risks when merging catalogs from multiple upstream registries in auto or referrals federation modes.

* * *

## Appendix D: Formal Schema Definitions[¶](#appendix-d-formal-schema-definitions "Permanent link")

To support automated validation, testing, and machine-readable compliance checking, this specification defines formal schemas for both the catalog metadata manifests and the Registry REST API.

The schema specifications are provided across three distinct formats, serving different operational roles within the systems architecture: 1. **CDDL (Appendix D.1)**: The authoritative, abstract structural syntax definition. It provides an extremely concise, human-readable algebraic grammar optimized for formal IETF standards-track drafts, supporting both JSON and CBOR binary encodings natively. 2. **JSON Schema (Appendix D.2)**: The active web data validation schema, optimized for automated runtime client and server compliance checking in JSON-native development environments. 3. **OpenAPI (Appendix D.3)**: The REST endpoint specification, defining HTTP parameters, paths, status codes, and error schemas for integration with standard web gateways and client code-generators.

The core data structures for the `ai-catalog.json` manifest, `CatalogEntry` models, zero-trust `trustManifest` security envelope, and Search Registry API payloads are formally specified using **Concise Data Definition Language (CDDL - RFC 8610)**.

-   **Authoritative Schema File**: [`spec/schemas/ard.cddl`](https://github.com/ards-project/ard-spec/blob/main/spec/schemas/ard.cddl)

### D.2 The `ai-catalog.json` Manifest Schema (JSON Schema)[¶](#d2-the-ai-catalogjson-manifest-schema-json-schema "Permanent link")

The JSON representation of the capability manifest hosted at `/.well-known/ai-catalog.json` and individual catalog entries are formally defined using the **JSON Schema (Draft 2020-12)** standard.

-   **Authoritative Schema File**: [`spec/schemas/ai-catalog.schema.json`](https://github.com/ards-project/ard-spec/blob/main/spec/schemas/ai-catalog.schema.json)
-   **Key Validation Enforcements**:
-   Pattern matching URN compliance rules for the logical `identifier` format (`^urn:air:...`).
-   Strict Value-or-Reference exclusion logic (`oneOf` matching either `url` or `data`, preventing duplicate definitions).
-   Struct checking for SPIFFE/DID compliance in `trustManifest` and `attestations` objects.

To validate local catalog manifest JSON files on a system using AJV CLI:

`[](#__codelineno-13-1)npx ajv-cli validate -s spec/schemas/ai-catalog.schema.json -d path/to/ai-catalog.json`

### D.3 The Registry REST API Specification (OpenAPI)[¶](#d3-the-registry-rest-api-specification-openapi "Permanent link")

The HTTP query interfaces (`POST /search`, `POST /explore`, and `GET /agents`) exposed by compliant Agent Registries are formally defined using the **OpenAPI 3.1.0 Specification** in YAML.

-   **Authoritative Specification File**: [`spec/schemas/ard.openapi.yaml`](https://github.com/ards-project/ard-spec/blob/main/spec/schemas/ard.openapi.yaml)
-   **Key Integration Benefits**:
-   Integrates paths, queries, status responses, and paging logic directly.
-   References the JSON Schema `ai-catalog.schema.json` schema files to ensure search and list return types are statically bound to the specification's schema constraints.
-   Allows automated router middleware enforcement and client/server stub generation (using tools like OpenAPI Generator).

### D.4 Official Conformance Testing Tool[¶](#d4-official-conformance-testing-tool "Permanent link")

To simplify development and guarantee complete compliance, this repository provides an official, zero-dependency **Conformance Testing CLI Tool** written in Python. It allows publishers to test their manifests and registry developers to validate their REST API servers.

-   **Testing Tool Executable**: [`conformance/bin/conformance-test`](https://github.com/ards-project/ard-spec/blob/main/conformance/bin/conformance-test)

#### Features:[¶](#features "Permanent link")

-   **Manifest validation mode**: Parses JSON manifests, runs strict JSON Schema checks (using the Python `jsonschema` library if installed), and executes custom semantic checks (e.g., URN formatting rules, Value-or-Reference enforcement, `representativeQueries` sizing).
-   **Registry validation mode**: Probes live endpoints (`POST /search` and `GET /agents`), sends spec-compliant search requests, and validates status codes, pagination envelopes, search result scores, and catalog entry structures.

#### Usage Examples:[¶](#usage-examples "Permanent link")

Validate a local or remote `ai-catalog.json` manifest:

`[](#__codelineno-14-1)# Validate a local catalog file [](#__codelineno-14-2)./conformance/bin/conformance-test manifest path/to/ai-catalog.json [](#__codelineno-14-3)[](#__codelineno-14-4)# Validate a remote well-known catalog manifest [](#__codelineno-14-5)./conformance/bin/conformance-test manifest https://example.com/.well-known/ai-catalog.json`

Validate a running Agent Registry REST API:

`[](#__codelineno-15-1)./conformance/bin/conformance-test registry http://localhost:9010/api`

#### One-Click Conformance Demo[¶](#one-click-conformance-demo "Permanent link")

To instantly run a complete end-to-end verification suite utilizing a pre-bundled spec-compliant catalog manifest and a lightweight running mock Registry REST API server, run the automated demo script:

`[](#__codelineno-16-1)./conformance/bin/run-conformance-demo`

This script performs manifest schema validation, launches a mock registry server in the background, executes live search and listing queries against it using the conformance tester, and gracefully terminates the server when finished.

## Acknowledgements[¶](#acknowledgements "Permanent link")

The authors thank the following people for their contributions and feedback, in alphabetical order.

-   Amazon Web Services — Jeffrey Damick, Martin Ristov
-   Cisco — Guillaume De Saint Marc, Karen Jaworski, Luca Muscariello, Ramiz Polic, Vijoy Pandey
-   Databricks — Jonathan Keller, Vinod Marur
-   GitHub — Evan Boyle, Jeremy Moseley, Meagan Cojocar, Trent Jones
-   GoDaddy — Scott Courtney
-   Google — Alan Blount, Antonio Gulli, Ines David, John Murray, Krishna Thota, Natasha Balasubramanian, Polong Lin, Rao Surapaneni, Sam Sharaf, Sampath Kumar Maddula, Srinivas Krishnan, Todd Segal
-   Microsoft — Adam Zukor, Chelsea Carter, Dee Templeton, Jennifer Marsman, Kevin Scott, Lindsey Li, Lisa Jaloza, Miesha Baker, Ryan Nadel, Shelby Delano
-   Nvidia — Aysen Ilkhabar
-   Salesforce — Mariano Gonzales, Vijay Pandiarajan
-   Snowflake — Baris Gultekin, Vivek Raghunathan
