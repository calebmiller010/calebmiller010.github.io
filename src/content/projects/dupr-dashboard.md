---
title: "DUPR Dashboard"
tagline: "Personal pickleball analytics dashboard — deep match history, zero database"
description: "A full-stack analytics dashboard that syncs match history from the DUPR API, precomputes deep analytics at write time, and serves a React frontend with zero read-time computation."
url: "https://dupr-dashboard-caleb-miller.vercel.app"
tags: ["Python", "FastAPI", "React 19", "TypeScript", "Recharts", "Pydantic", "Vite"]
category: "Personal Tool"
featured: false
order: 5
heroMetric: "~50ms analytics over hundreds of matches. No database"
progress: 100
---

## What It Does

DUPR (Dynamic Universal Pickleball Rating) is the official rating system for competitive pickleball. Their official platform shows you a rating and a match list. That's it.

This DUPR Dashboard is what should exist — a full analytics dashboard that surfaces the insights buried in your match history: win/loss streaks, partner and opponent breakdowns, clutch scoring patterns, rating trajectory, and session-level context.

## Architecture Philosophy

**Zero database. All analytics precomputed at write time.**

The server never computes on read. Every sync triggers a full analytics recompute that runs in ~50ms — then the frontend just GETs a single JSON payload and filters entirely client-side. No query latency. No ORM overhead. No database to manage.

## Stack

**Backend:** Python 3.11+, FastAPI, Pydantic v2, httpx, uvicorn

**Frontend:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Recharts

## Key Engineering Decisions

**File-based storage over a database** — for a single-user personal tool with append-only match data, JSON files with a precompute-on-write pattern outperform any database setup in simplicity and read speed. Two data files. No migrations. No schema drift.

**Two-phase sync with import wizard** — Phase 1 fetches matches and returns session previews for user annotation (location, format, tournament context). Phase 2 saves annotations and triggers a full recompute. Users can cancel between phases with a clean rollback.

**Chain-sort for match ordering** — DUPR timestamps can be unreliable. The transformer chain-sorts matches by rating delta values to determine true play order — a non-obvious solution that makes the rating trajectory accurate.

**Pydantic models mirrored in TypeScript** — `pipeline/models.py` Pydantic models are manually mirrored in `ui/src/types.ts`. This enforces a contract between the Python analytics layer and the React frontend without a code generation step.

## Analytics Computed

- Win/loss record, streaks, rating trajectory over time
- Partner and opponent leaderboard (win rate, games played, rating impact)
- Context splits: indoor/outdoor, tournament vs. recreational, format
- Clutch scoring patterns and scoring margin distributions
- Session-level metadata and performance by organizer/location