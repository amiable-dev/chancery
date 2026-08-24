# Kimi AI and kvcache-ai Open Sources ‘AgentENV’: A Distributed System that Powers Agentic Reinforcement Learning (RL) Training for Kimi K3

**Source:** https://www.marktechpost.com/2026/07/27/kimi-ai-and-kvcache-ai-open-sources-agentenv/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Moonshot AI and kvcache-ai open-sourced AgentENV, a Firecracker microVM sandbox platform powering agentic RL training for Kimi K3

---

Moonshot AI’s Kimi team and [kvcache-ai](https://github.com/kvcache-ai) have open-sourced **[AgentENV (AENV)](https://github.com/kvcache-ai/AgentENV)**, a distributed platform for running agent environments at scale. AgentENV powers agentic reinforcement learning (RL) training for **Kimi K3**, Moonshot’s 2.8-trillion-parameter Mixture-of-Experts model. The code ships under an **MIT license**.

## **Why Environment Infra Holds Back Agentic RL**

Agentic RL does not just sample text. It requires the model to act inside a real computer. Every rollout needs an isolated Linux environment with a filesystem, a network stack, and live processes.

That requirement creates a hard trade-off. Containers start fast but share the host kernel, which weakens isolation for model-generated code. Full virtual machines isolate properly but boot slowly and hold memory while idle.

AgentENV targets exactly that gap. It runs [Firecracker](https://github.com/firecracker-microvm/firecracker) microVMs, then makes idle, restart, and branching cheap enough to run at training scale.

## **Inside AgentENV’s Firecracker Architecture**

Each sandbox is a Firecracker microVM with its own Linux kernel, filesystem, and network namespace. Requests hit an Axum HTTP API, which forwards to an orchestrator that manages the sandbox lifecycle.

Storage is where the design gets interesting. The rootfs is served through a **ublk** userspace block device backed by **[overlaybd](https://github.com/containerd/overlaybd)** layered images. Read-only base layers are shared across sandboxes, and each sandbox writes into its own upper layer.

Inside every guest, a daemon called **envd** handles command execution, file operations, and health reporting on port `49983`. A reverse proxy routes HTTP and WebSocket traffic from clients to services running inside the VM.

The project also lists two density mechanisms. The host page cache is shared across storage and memory-snapshot data. Memory ballooning returns reclaimable guest memory to the host, which sustains overcommit as environments diverge over time.

## **Snapshot, pause, resume, fork**

These four features are the reason the project exists. AgentENV snapshots memory and filesystem changes incrementally rather than writing a full image each time.

The reported figures are as follows. Snapshot-backed environments boot or resume in under **50 ms** and pause in under **100 ms**. Incremental snapshot capture completes in under **100 ms**, even under heavy disk modification.

Fork is the feature most specific to RL. A running sandbox can clone into **up to 16 independent child sandboxes** on the same node. The source pauses briefly during capture, then resumes. Every child inherits the source filesystem, memory, and resource configuration.

The practical effect is that expensive setup runs once. A team can install dependencies, clone a repository, and reach a task state. That exact state then branches into parallel rollouts. Snapshots persist to S3-compatible object storage or a shared distributed filesystem.

One default is worth noting. Every sandbox carries a TTL, and expiry triggers a **pause**, not a delete. Deletion requires passing `autoPause: false` on the create API.

## **On-demand loading and the snapshot repository**

Images load on demand through overlaybd. Local disk acts as a bounded cache that retains hot data and evicts cold data.

This is what makes the fleet-level story work. Nodes do not need to pre-warm every image or hold a complete copy of every snapshot. The addressable image set can therefore exceed local disk capacity while startup stays fast cluster-wide.

Snapshot state is organized in three layers. A builder staging workspace holds artifacts during a build. A committed snapshot repository is the durable source of truth. A node-local runtime cache holds launch-time derived configs.

Two repository backends are supported: `posix_fs` (default) and `oss`. The `oss` path runs through a shared S3-compatible client, so an explicit `region` is required.

An optional peer-to-peer transport based on `iroh` can advertise committed artifacts to peer nodes. It is **disabled by default**. The documentation is explicit that P2P does not change the committed snapshot model. For shared storage, the docs ask for at least 1 Gbps and strongly recommend 10 Gbps or faster.

## **E2B compatibility is the adoption lever**

AgentENV exposes an **[E2B-compatible](https://kvcache-ai.github.io/AgentENV/integration/e2b.html) HTTP API**. Point `E2B_API_URL` at your server and the official [E2B](https://github.com/e2b-dev/e2b) Python or TypeScript SDK works without code changes.

This is a deliberate distribution choice. Teams already running agents on E2B can self-host the runtime without rewriting their agent code. A native `aenv` CLI is also provided, and the docs recommend it for AgentENV-specific workflows.

## **Deployment paths**

Prerequisites are Linux kernel **6.8+** and `/dev/kvm` access; the install script additionally requires Ubuntu 24.04. The `aenv` CLI supports Linux and macOS on x86\_64 and arm64. The server itself is Linux-only, because it needs KVM.

**Five paths are documented:**

-   An install script that runs the server as a systemd service
-   A Docker image published at `ghcr.io/kvcache-ai/aenv-server`
-   A Docker Compose stack that simulates a multi-node cluster
-   Kubernetes manifests with a gateway, scheduler, and node DaemonSet
-   A build-from-source route using the Rust toolchain

Multi-node deployments add a **gateway** on `:8080` and a **scheduler** on `:9090`.

## **Key Takeaways**

-   Deployment covers install script, Docker, Docker Compose, and Kubernetes; the multi-node control plane is documented as a prototype.
-   AgentENV runs each agent environment as a Firecracker microVM, not a container, so isolation is kernel-level.
-   The project reports boot or resume under 50 ms, and pause under 100 ms, from snapshots.
-   A running sandbox can fork into up to 16 independent children on the same node.
-   The HTTP API is E2B-compatible, so existing E2B Python and TypeScript SDK code runs unchanged.

* * *

_Check out the [GitHub repository](https://github.com/kvcache-ai/AgentENV) and [documentation](https://kvcache-ai.github.io/AgentENV/). All credit for this research goes to the researchers of this project._

[![](https://www.marktechpost.com/wp-content/uploads/2019/06/Screen-Shot-2021-09-14-at-9.02.24-AM-150x150.png)](https://www.marktechpost.com/author/6flvq/)

##### [Asif Razzaq](https://www.marktechpost.com/author/6flvq/)

Asif Razzaq is the CEO of Marktechpost Media Inc.. As a visionary entrepreneur and engineer, Asif is committed to harnessing the potential of Artificial Intelligence for social good. His most recent endeavor is the launch of an Artificial Intelligence Media Platform, Marktechpost, which stands out for its in-depth coverage of machine learning and deep learning news that is both technically sound and easily understandable by a wide audience. The platform boasts of over 2 million monthly views, illustrating its popularity among audiences.
