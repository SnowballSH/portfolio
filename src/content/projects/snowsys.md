---
title: "SnowSys"
shortDescription: "The infrastructure I run on AWS: one hardened host serving this site, my blog, Kami, and an LLM gateway, with merge-first deploys, single sign-on, and restore-tested backups."
date: "2026-07-01"
technologies: ["OpenTofu", "Podman", "Caddy", "Go"]
featured: true
status: "completed"
image: "/snowsys.svg"
imageAlt: "SnowSys architecture: internet and a private mesh with single sign-on enter through one Caddy ingress to rootless containers, with encrypted backups to S3"
links:
  - label: "snowdeploy"
    url: "https://github.com/SnowballSH/snowdeploy"
    type: "github"
  - label: "modelgate"
    url: "https://github.com/SnowballSH/modelgate"
    type: "github"
  - label: "snowsys-monitor"
    url: "https://github.com/SnowballSH/snowsys-monitor"
    type: "github"
category: "systems"
priority: 4
---

# SnowSys

SnowSys is the personal infrastructure behind everything I host: this portfolio, [blogs.snowballsh.com](https://blogs.snowballsh.com) and its admin tools, [Kami](https://kami.snowballsh.com), an LLM gateway, and the deploy and monitoring tooling around them. It is a single AWS host, run like production.

## Design

- **Everything is reviewed code.** OpenTofu manages the cloud resources. Every host change ships as a reviewed, checksum-verified revision that is applied once and recorded in an append-only ledger. CI verifies changes but holds no host or deploy credentials.
- **One front door.** Caddy is the only public ingress and terminates TLS for every hostname. Services run as rootless Podman containers under systemd Quadlets, bound to loopback.
- **Private by default.** Admin surfaces require both membership in a WireGuard mesh and single sign-on with two-factor authentication, and secrets live in a dedicated secret store.
- **Backups that are tested.** Encrypted, append-only backups go to S3 with object lock, and restores are rehearsed off-host. The whole stack has been rebuilt on new infrastructure from its change history and backups with nothing lost.
- **Observed from inside and out.** Prometheus and Grafana on the host, plus scheduled black-box checks of every public endpoint from outside.

## Components I built for it

- [**snowdeploy**](https://github.com/SnowballSH/snowdeploy): merge-first deploys in Go. A deploy is a pull request that merges behind required checks, then a unit render, restart, and health probe, with automatic rollback and a revert pull request if the probe fails.
- [**modelgate**](https://github.com/SnowballSH/modelgate): a single-binary, OpenAI-compatible gateway in front of Anthropic and OpenAI, with revocable per-client keys and hard monthly spend ceilings.
- [**snowsys-monitor**](https://github.com/SnowballSH/snowsys-monitor): scheduled black-box monitoring of every public surface.
- [**SnowBlog**](/projects/snowblog): the Typst blog service.
