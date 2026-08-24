# Agentic Resource Discovery Specification - AgenticResourceDiscovery.org

**Source:** https://agenticresourcediscovery.org/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> A protocol for discovering agentic resources — tools, Skills, MCP servers, APIs, workflows, and agents — for AI clients

---

ARD is an open discovery protocol for agentic resources ([GitHub](https://github.com/ards-project/ard-spec)). It allows an AI client to ask: _"What is available for this task?"_ and lets a discovery service answer with matching resources.

ARD sits entirely before invocation. It helps the client find the right resource; the resource is then invoked through its own native mechanism.

## What is an agentic resource?[¶](#what-is-an-agentic-resource "Permanent link")

An agentic resource is any external capability an AI client can call on to do a task — an agent, MCP server, Skill, Canvas, Plugin, API, or workflow — anything that can be represented as an [AI Catalog entry](https://agenticresourcediscovery.org/ai_catalog_spec/).

## What ARD is not[¶](#what-ard-is-not "Permanent link")

**It is not an execution runtime:** ARD is not MCP, A2A, Skills, AI Catalog, or an API runtime, and it does not replace them.

**It is not a central catalog:** There will be many discovery services, each indexing different resources, serving different communities, and applying its own trust, ranking, and access policies. Every enterprise can run its own — much like an intranet has its own search engine over internal content. And on the public web there will be many, some optimizing for quality and trust, others for coverage.

## Who is behind ARD?[¶](#who-is-behind-ard "Permanent link")

ARD is being developed by a working group with participants from Microsoft, Google, Hugging Face, GoDaddy, and others. This work is part of a broader effort to create an open discovery layer for resources that AIs can draw on.

To understand the motivation and design, start with the [Introduction](https://agenticresourcediscovery.org/introduction/).

![Contributors to the Agentic Resource Discovery (ARD) specification: Cisco, Databricks, GitHub, GoDaddy, Google, Hugging Face, Microsoft, Nvidia, Salesforce, ServiceNow, Snowflake](https://agenticresourcediscovery.org/assets/logo-wall.png)

## Open Source & License[¶](#open-source-license "Permanent link")

Agentic Resource Discovery (ARD) and its resources are licensed under the [Apache License 2.0](https://github.com/ards-project/docs/blob/main/LICENSE) and welcomes contributions from the community.
