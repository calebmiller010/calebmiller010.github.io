---
title: "Church Operations Automation"
tagline: "An event-driven content pipeline that runs itself — one engineer, ~$50/month of infrastructure, zero missed services since early 2026"
description: "Technical deep-dive: AWS event-driven sermon transcription (S3 → Lambda → Batch/Whisper → two-stage LLM post-processing → DOCX/PDF) plus a 12-workflow n8n orchestration system with a member portal — built and operated solo."
url: "https://calebautomates.com/"
tags: ["Python", "AWS CDK", "Lambda", "AWS Batch", "Whisper", "Gemini", "n8n", "Terraform", "Docker", "React", "TypeScript"]
category: "AI Automation"
featured: true
order: 1
heroMetric: "~$50/mo infra · ~1 hr/mo maintenance · 0 missed services"
progress: 100
---

A 200+ member church live-streams two weekly services to YouTube. Everything downstream of
that used to be manual: transcribing each service into a formatted outline document, updating
two WordPress sites, cleaning up video metadata, assembling announcement bulletins, and
emailing members. I designed, built, and operate the system that automates all of it — two
cooperating subsystems with a deliberate human-in-the-loop where it matters.

## System 1 — Sermon transcription pipeline (AWS, event-driven)

```text
MP3 upload → S3 event → Router Lambda ──(no transcript)──→ AWS Batch: Whisper (Docker/EC2)
                            │                                        │
                            └─(transcript exists)──→ Post-process Lambda ←┘
                                                          │
                                    Gemini stage 1: cleanup (temp 0.5)
                                    Gemini stage 2: HTML markup (temp 0.2)
                                                          │
                                          HTML → DOCX (python-docx + template)
                                                          │
                                    ┌─────────────────────┴─────────────────┐
                             async PDF Lambda                        SES email to staff
                             (headless LibreOffice)                  (DOCX attached)
```

**Event-driven from a single S3 upload.** An `ObjectCreated` event hits a router Lambda that
enforces processing rules (service-day filename match, recency window) and acquires a **lock
file in S3** for idempotency — duplicate events and re-uploads can't double-process. Tradeoff
accepted: no auto-expiring lock, in exchange for zero extra services to operate.

**Right-sized compute split.** Whisper (`small.en`, with a domain-tuned `initial_prompt`
carrying the church's theological vocabulary) needs ~8 GB of memory and ~30 minutes — the
wrong shape for Lambda. It runs as an **AWS Batch job in a Docker container on EC2 that
scales to zero** between services. Everything bursty and small stays on Lambda.

**Two-stage LLM post-processing with cached intermediates.** Stage 1 (Gemini Flash,
temp 0.5) is editorial: fix grammar, mark major sections, and replace the speaker's scripture
paraphrases with exact KJV text — under a hard "no summarization" rule so every spoken word
survives. Stage 2 (Flash Lite, temp 0.2) is mechanical HTML markup. Both intermediates are
cached in S3, so a failure at any stage resumes without re-paying earlier model calls.

**Documents, not text dumps.** The HTML converts to a styled DOCX against the church's Word
template (python-docx + BeautifulSoup, versioned outputs), with an optional async Lambda
running **headless LibreOffice** for PDF. Staff get the finished document by email (SES) the
same afternoon.

**Cost engineering.** NAT *instance* instead of NAT gateway, an S3 gateway endpoint to avoid
NAT data charges, scale-to-zero Batch compute, flash-tier models. The pipeline runs for a few
dollars a week.

**Infrastructure as code:** one AWS CDK (Python) stack — Lambdas, the Batch compute
environment/queue/job definition, ECR image assets, VPC, eventing, and log groups.
`cdk deploy` reproduces the entire system.

## System 2 — Content distribution & member portal (n8n orchestration)

Twelve n8n workflows compose into an orchestrator/worker system, self-hosted on EC2:

- **Scheduled triggers** fire after each service: pull the latest YouTube video, run a small
  LLM "metadata editor" that standardizes titles, write a tracking row (status lifecycle
  `WAITING_FOR_YOUTUBE → IN_PROGRESS → PROCESSED`), and update **two** WordPress sites via REST.
- **Transcript processing:** next-morning pollers wait for YouTube auto-captions with a
  resilient wait-and-retry loop (not a fixed sleep), pull the TTML, and hand the full
  timestamped transcript to Gemini with a structured segmentation prompt — Sunday services
  become nine named sections; Q&A nights become one section per question, quotes normalized
  to canonical scripture text. The heavy model call runs with `retryOnFail` (5 attempts).
- **An orchestrator fans out to three single-purpose workers**: one rewrites YouTube
  descriptions with timestamp chapters, one drafts a styled HTML announcement bulletin, one
  back-fills WordPress with the cleaned Q&A list.
- **Human-in-the-loop where it counts.** Outbound member email is the one step that requires
  a person: a reviewer approves the bulletin in an admin dashboard, which hits a webhook that
  sends to opted-in subscribers, rate-limited at 1/sec. Everything else is autonomous.
- **Member self-service portal** (React 19 + TypeScript + Vite + Tailwind, deployed on AWS
  Amplify): **passwordless magic-link auth**, per-service subscription modes
  (`ALL | SPECIFIC | NONE` with a 52-week date picker), urgent-alert opt-in, and one-click
  unsubscribe. The portal talks to tokenized n8n webhook APIs; announcement lists are served
  from cache-busted JSON on S3.
- **Centralized failure handling:** every workflow routes errors to a single notifier that
  emails the operator a full stack trace. Shared styling lives in one constants sheet so the
  bulletin draft and the sent email render identically.
- **Hosting:** n8n + Caddy (auto-TLS) via Docker Compose on a t3.micro, provisioned by
  **Terraform** — VPC, security groups, Elastic IP, and a separate **encrypted,
  `prevent_destroy` EBS data volume** so the instance is disposable but workflow state
  survives a destroy/re-apply. Disaster recovery is "run `terraform apply` again."

## Design decisions I'd defend

- **Batch for Whisper, Lambda for the rest** — match compute shape to job shape; pay ~$0 idle.
- **Two LLM stages at different temperatures** — editorial vs. mechanical tasks fail
  differently; cached intermediates make retries cheap.
- **S3 lock files over SQS** — one fewer service to operate for a 2-event/week system; the
  tradeoff (no auto-expiry) is documented and acceptable at this scale.
- **n8n for integration glue, real code for compute** — visual workflows and 400+ connectors
  where the work is API choreography; Python/CDK where it's compute-shaped.
- **Human approval gate on outbound email only** — autonomy everywhere except the step with
  reputational blast radius.
- **Flash-tier models over bigger ones** — structured formatting tasks at a fraction of the
  cost, quality verified on real transcripts.

## Operations profile

Two services a week, end-to-end unattended; outline documents land the same afternoon.
Maintenance is **about an hour a month** — a log glance and the occasional prompt tweak;
centralized error emails mean silence = healthy. Total cost runs **~$50/month** across both
subsystems. Built from August 2025, hardened through February 2026, and it hasn't missed a
service since. What it replaced: 1–2 hours of hands-on work per service, plus website and
metadata upkeep that previously didn't get done at all.

## What this demonstrates

End-to-end ownership: requirements from a non-technical client → architecture → IaC → LLM
prompt engineering with output contracts → document generation → deployment → months of
unattended production operation. Built for an organization with no IT department — which is
precisely why it had to be cheap, boring to operate, and impossible to break by accident.

*Client identifiers removed. The architecture, numbers, and design decisions are real. An
outcome-focused version of this case study lives at
[calebautomates.com](https://calebautomates.com/).*
