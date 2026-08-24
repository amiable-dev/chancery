# GitHub - papercomputeco/stereOS: A Linux based operating system hardened and purpose built for AI agents

**Source:** https://github.com/papercomputeco/stereOS
**Added:** 2026-08-24
**Tags:** #unsorted

---

> A Linux based operating system hardened and purpose built for AI agents - papercomputeco/stereOS

---

A Linux based operating system hardened and purpose-built for AI agents.  
[Download](https://stereos.ai/) | [Documentation](https://stereos.ai/)

[![](https://camo.githubusercontent.com/be483c75165bbf046e0206a80e27d5c300e6cdadc8ef8a3c8d0085f7d4348612/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f7061706572636f6d70757465636f2f73746572654f53)](https://camo.githubusercontent.com/be483c75165bbf046e0206a80e27d5c300e6cdadc8ef8a3c8d0085f7d4348612/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f7061706572636f6d70757465636f2f73746572654f53)

[![](https://camo.githubusercontent.com/1f46b49c87af0ff15877b07fcff9cc5d72728f85205ddbaaf69feea52cfa37f0/68747470733a2f2f646362616467652e6c696d65732e70696e6b2f6170692f7365727665722f68747470733a2f2f646973636f72642e67672f54365934586b6d6d5635)](https://discord.gg/T6Y4XkmmV5)

## Mixtapes

[](#mixtapes)

stereOS produces machine images - called **mixtapes** - that bundle a hardened, minimal Linux system with specific AI agent harnesses.

Mixtape

Agent binary

API key

`opencode-mixtape`

`opencode`

`ANTHROPIC_API_KEY` or `OPENAI_API_KEY`

Each mixtape appends its agent package to `stereos.agent.extraPackages`, which adds the binary to the agent user's restricted PATH. The `-dev` variant of each mixtape includes `profiles/dev.nix` for local SSH key injection.

## System

[](#system)

The stereOS system is minimal in nature with several orchestration daemons handling agent lifecycle and acting as a control plane for agent operators:

-   `admin` user and group for administrative operations: `/home/admin`
-   `agent` user and group for agent to assume: `/home/agent/workspace`
-   [`stereosd`](https://github.com/papercomputeco/stereosd) - stereOS system daemon
-   [`agentd`](https://github.com/papercomputeco/agentd) - agent management daemon

## Image formats

[](#image-formats)

Format

Build attribute

Output

Use case

Raw EFI

`system.build.raw`

`stereos.img`

Canonical artifact. Apple Virt Framework bootable

QCOW2

`system.build.qcow2`

`stereos.qcow2`

Derived from raw via `qemu-img convert`. QEMU/KVM

Kernel artifacts

`system.build.kernelArtifacts`

`bzImage`, `initrd`, `cmdline`, `init`

Direct-kernel boot (bypasses UEFI/GRUB)

Lambda MicroVM source

`packages.<system>.<mixtape>-lambda-microvm-source`

Dockerfile source zip

AWS Lambda MicroVM image creation

The Lambda MicroVM source bundle is not a full stereOS VM image. It packages stereOS userspace into a Dockerfile-based rootfs bundle because AWS Lambda MicroVM images are created from Dockerfile application sources, not custom kernel or disk artifacts.

### Distribution (mkDist)

[](#distribution-mkdist)

`lib/dist.nix:mkDist` assembles all formats into a publish-ready directory with zstd-compressed variants (`-19 -T0`) and a `mixtape.toml` manifest containing SHA-256 checksums and file sizes for every artifact:

```
result/
├── stereos.img          # Raw EFI disk
├── stereos.img.zst      # Zstd-compressed raw
├── stereos.qcow2        # QCOW2 disk
├── stereos.qcow2.zst    # Zstd-compressed QCOW2
├── bzImage              # Kernel
├── initrd               # Init RAM
├── cmdline              # Kernel command line
├── init                 # NixOS stage-2 init path
└── mixtape.toml         # Build manifest with checksums
```

## NixOS options

[](#nixos-options)

stereOS declares two custom options:

Option

Type

Default

Description

`stereos.ssh.authorizedKeys`

`listOf str`

`[]`

SSH public keys for admin and agent users. Useful for development purposes.

`stereos.agent.extraPackages`

`listOf package`

`[]`

Packages added to the agent's restricted PATH

## External dependencies

[](#external-dependencies)

Flake input

Repository

Provides

`agentd`

`github:papercomputeco/agentd`

`services.agentd` NixOS module + overlay

`stereosd`

`github:papercomputeco/stereosd`

`services.stereosd` NixOS module + overlay

`nixpkgs`

`nixos-26.05`

Base packages

`dagger`

`github:dagger/nix`

CI engine
