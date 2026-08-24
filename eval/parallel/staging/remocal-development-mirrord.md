# Remocal Development | mirrord

**Source:** https://metalbear.com/mirrord/docs/use-cases/local-development
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Run your code locally while it communicates with real cloud services

---

⌘Ctrlk

-   [Documentation](https://metalbear.com/mirrord/docs)
-   [Configuration](https://metalbear.com/mirrord/docs/config)
-   [Changelog](https://metalbear.com/mirrord/docs/changelog)
-   [Guides](https://metalbear.com/mirrord/docs/guides)

1.  [Documentation](https://metalbear.com/mirrord/docs)
2.  [Use Cases](https://metalbear.com/mirrord/docs/use-cases)

OSSTeamEnterprise

## Remocal Development

Run your code locally while it communicates with real cloud services

mirrord lets developers (or AI agents) run local code in the context of their cloud environment. Your code runs on your machine, but talks to real cloud services - databases, queues, APIs - as if it were deployed in the cluster.

We call this approach "remocal" (remote + local): local execution with remote context.

### The problem[](#the-problem)

Traditionally, development happens in loops. You write and test code locally, then deploy to staging, where it meets production-like conditions for the first time. Tests fail. You fix, redeploy, repeat.

![](https://metalbear.com/mirrord/docs/~gitbook/image?url=https%3A%2F%2F2838204941-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FghNlSpMkqkYKZCZQsHRt%252Fuploads%252Fgit-blob-6ee3d30d2f11cabe8432f8b6c9dbc9a465769d0b%252Fdevloop.png%3Falt%3Dmedia&width=768&dpr=3&quality=100&sign=28fae080&sv=2)

The Traditional Dev Loop

This is slow for two reasons:

1.  **CI is a bottleneck** - Long test suites, flaky pipelines, and queued builds all add friction.
    
2.  **Staging is fragile** - Deploying unstable code to a shared environment breaks it for everyone.
    

mirrord removes deployment from the loop entirely. Instead of deploying to test in the cloud, you plug your local process directly into the cloud environment.

### How it works[](#how-it-works)

mirrord runs in two places - in the memory of your local process (`mirrord-layer`) and as a pod in the cluster (`mirrord-agent`).

![](https://metalbear.com/mirrord/docs/~gitbook/image?url=https%3A%2F%2F2838204941-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FghNlSpMkqkYKZCZQsHRt%252Fuploads%252Fgit-blob-6af7d23d51f055c5c840c576a7ac83e3e31d6329%252Farchitecture.svg%3Falt%3Dmedia&width=768&dpr=3&quality=100&sign=588013b8&sv=2)

mirrord - Basic Architecture

When you start your process with mirrord, it overrides syscalls to:

-   **Receive incoming traffic** from the remote pod (mirrored or stolen)
    
-   **Send outgoing traffic** through the remote pod, reaching cluster-internal services
    
-   **Read and write files** on the remote file system
    
-   **Import environment variables** from the remote pod
    

The agent runs in the network namespace of the target pod and handles the remote side of these operations.

### What makes mirrord different[](#what-makes-mirrord-different)

Other tools use VPNs to connect your machine to the cluster. mirrord works at the process level, overriding individual syscalls. This gives it unique advantages:

-   **Fine-grained control** - Choose exactly what happens remotely vs locally. Read some files locally, others remotely. Route some traffic through the cluster, keep other connections local.
    
-   **No root access needed** locally
    
-   **Fast startup** - 15 seconds or less
    
-   **Run multiple sessions** - Each local process can target a different remote pod simultaneously
    
-   **Cluster-agnostic** - Works regardless of network setup (service mesh, VPN, etc.) and scales to 10,000+ pod clusters
    

Last updated 1 month ago

Was this helpful?

-   [The problem](#the-problem)
-   [How it works](#how-it-works)
-   [What makes mirrord different](#what-makes-mirrord-different)

Was this helpful?
