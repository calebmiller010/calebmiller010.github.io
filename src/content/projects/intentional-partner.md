---
title: "Intentional Partner"
tagline: "A relationship-habit web app with a grounded AI coach — built, shipped, and dogfooded in production"
description: "Next.js monorepo on Supabase with a structured-output Gemini extraction pipeline, a cron-driven nudge engine, and a rituals system — 150+ tests, live on Vercel."
url: "https://intentional-partner.vercel.app"
tags: ["Next.js", "TypeScript", "Supabase", "Gemini", "Vercel", "Postgres RLS"]
category: "Full-Stack + AI"
featured: false
order: 1.5
heroMetric: "Chat → structured extraction → one-tap save · daily nudge cron"
progress: 100
---

## What it is

A privacy-first app that helps one partner turn caring into consistent action: capture the
things your partner mentions, get concrete AI-drafted nudges at the right moments, log what
you did, and learn what lands. Live in production and used daily.

## Engineering highlights

- **Universal extraction pipeline.** Every chat turn makes one structured Gemini call that
  returns `{reply, suggestions}` — typed suggestion cards (facts, ideas, occasions, past
  gestures) that save through the exact same actions as manual forms. One pure pipeline
  (normalize → validation rule → dedupe) keeps AI-sourced and human-sourced data identical
  downstream.
- **Grounded AI, by contract.** Chat replies draw only from saved facts about the partner —
  the model is never allowed to guess. Per-chat grounding preferences let the user hide or
  override sections without affecting the nudge engine.
- **Nudge engine on a daily cron** with rule-based prioritization (occasion proximity,
  ritual triggers, staleness), capped at one nudge a day — designed to be helpful, not noisy.
- **Rituals model.** A generic cadence engine (give-day/prep-day scheduling,
  advance-on-completion, anti-repetition windows) powering a weekly "Memory Mondays" ritual.
- **Production discipline:** 150+ unit/integration tests, Supabase RLS on every table,
  multi-region performance pass (functions co-located with the database), and a same-day
  chat-first IA refactor shipped behind redirects.

## Stack

Next.js (App Router) monorepo on Vercel · Supabase (Postgres + Auth + RLS) · Gemini
structured outputs · Resend email · daily cron via Vercel.
