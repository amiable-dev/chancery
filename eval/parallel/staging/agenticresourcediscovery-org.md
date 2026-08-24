# How to publish - AgenticResourceDiscovery.org

**Source:** https://agenticresourcediscovery.org/how_to_publish/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> A protocol for discovering agentic resources — tools, Skills, MCP servers, APIs, workflows, and agents — for AI clients

---

Exposing your agentic resources (MCP servers, Skills, ACP agents, APIs) to ARD discovery services is a simple three-step procedure.

This guide is about publishing on the public internet so that public discovery services can crawl and index your resources. Publishing makes you discoverable — it does not guarantee that any particular ARD-implementing service will find or index you; each service decides for itself what it includes. Inside an enterprise, agentic resources are often collected through other workflows entirely — an internal registry, a curated inventory, or a vendor feed — rather than open web crawling, so check how your organization gathers them.

* * *

## Step 1: Create the manifest (`ai-catalog.json`)[¶](#step-1-create-the-manifest-ai-catalogjson "Permanent link")

Create a static `ai-catalog.json` manifest listing your agentic resources. Below is a copy-pasteable template:

`[](#__codelineno-0-1){   [](#__codelineno-0-2)  "specVersion": "1.0",  [](#__codelineno-0-3)  "host": {    [](#__codelineno-0-4)    "displayName": "Acme Dev Tools",    [](#__codelineno-0-5)    "identifier": "did:web:acme.com"  [](#__codelineno-0-6)  },  [](#__codelineno-0-7)  "entries": [    [](#__codelineno-0-8)    {      [](#__codelineno-0-9)      "identifier": "urn:air:acme.com:server:weather",      [](#__codelineno-0-10)      "displayName": "Acme Weather Telemetry Server",      [](#__codelineno-0-11)      "type": "application/mcp-server+json",      [](#__codelineno-0-12)      "url": "https://api.acme.com/mcp/weather.json",      [](#__codelineno-0-13)      "capabilities": ["WeatherTool", "ForecastTool"],      [](#__codelineno-0-14)      "description": "An enterprise weather MCP server providing live telemetry.",      [](#__codelineno-0-15)      "representativeQueries": [        [](#__codelineno-0-16)        "what is the current wind speed in Chicago",        [](#__codelineno-0-17)        "get the 5-day forecast for Seattle"      [](#__codelineno-0-18)      ]    [](#__codelineno-0-19)    }  [](#__codelineno-0-20)  ] [](#__codelineno-0-21)}`

-   **`identifier`**: Naming must follow the domain-anchored URN standard: `urn:air:<your-domain>:<namespace>:<agent-name>`.
-   **`representativeQueries`**: Provide **2–5 natural language queries** to enable high-fidelity semantic vector search.

* * *

## Step 2: Host the manifest[¶](#step-2-host-the-manifest "Permanent link")

Upload the manifest to your domain:

`[](#__codelineno-1-1)https://<your-domain>/.well-known/ai-catalog.json`

Ensure your web server serves it with:

-   **HTTPS**: Secure connection only.
-   **Content-Type**: `application/json`
-   **CORS header**: `Access-Control-Allow-Origin: *` (crucial for crawlers to fetch it).

* * *

## Step 3: Set up DNS discovery (optional)[¶](#step-3-set-up-dns-discovery-optional "Permanent link")

If you cannot host at the standard `.well-known` path, publish a DNS `TXT` record pointing directly to your raw JSON location (e.g., S3 or GitHub Pages):

Name / Host

Type

Value

`_catalog._agents.yourdomain.com`

`TXT`

`"url=https://custom-bucket.s3.amazonaws.com/ai-catalog.json"`

For dynamic discovery services (`POST /search`), publish an `SRV` record:

Name / Service

Type

Port

Target

`_search._agents.yourdomain.com`

`SRV`

`443`

`search.yourdomain.com`
