---
title: "Church Automation Ecosystem"
tagline: "Production AI pipeline serving 40+ subscribers — ~1 hr/month to maintain"
description: "End-to-end AI automation system that transcribes sermons, generates formatted outlines, manages content, and distributes personalized email digests — fully autonomously."
url: "https://updates.keystothebible.net/"
tags: ["Python", "AWS CDK", "n8n", "Whisper", "Lambda", "AppSmith"]
category: "AI Automation"
featured: true
order: 1
heroMetric: "A simple way for church members stay in the loop!"
progress: 100
---

## What It Does

A fully autonomous content pipeline for a 200+ member church organization. The system handles three distinct workflows without human intervention:

**Sermon Pipeline:** AWS Batch jobs run Whisper transcription over uploaded MP3 files, push the transcript through an LLM with custom formatting instructions, and generate both `.docx` and `.pdf` sermon outlines using a predefined template. These are automatically emailed to staff — what previously took hours of manual typing now requires zero effort.

**Content Distribution:** A self-hosted n8n instance on AWS Lightsail polls YouTube for new uploads, categorizes content using an LLM, generates HTML email digests, and distributes them to 40+ subscribers across segmented lists. A human-in-the-loop AppSmith approval step lets me review before any send goes out.

**YouTube Auto-Updates:** The pipeline also parses Q&A questions from Bible study recordings and automatically updates YouTube video descriptions to be standardized and searchable.

## Architecture

- **Infra-as-code:** AWS CDK (Python) for all Lambda, Batch, and S3 resources
- **Orchestration:** Self-hosted n8n on AWS Lightsail
- **AI layer:** Whisper for transcription, LLM post-processing for formatting
- **Human-in-the-loop:** AppSmith dashboard for content approval before distribution
- **Deployment:** January 2026 — running flawlessly in production

## The Result

The entire ecosystem requires approximately **one hour per month** to maintain. 40+ subscribers signed up within the first week of launch.
