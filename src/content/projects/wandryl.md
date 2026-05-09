---
title: "Wandryl"
tagline: "Escape overtourism — AI-powered discovery of authentic destinations"
description: "A travel discovery platform that scores destinations 0–100 for overtourism risk and surfaces hidden-gem alternatives based on what you love about your favorite places."
url: "http://wandryl.com/"
tags: ["Python", "TypeScript", "Supabase", "LLM Chaining"]
category: "AI Product"
featured: false
order: 3
heroMetric: "5-7 chained LLM prompts per recommendation"
progress: 60
---

## The Idea

Mass-market travel platforms push the same 10 destinations to everyone. The result: overcrowded, inauthentic experiences that erode exactly what travelers came for.

Wandryl takes a different approach: tell it why you love a place (the vibe, not just the name), and it finds alternatives that match that essence — before the crowds do.

## How It Works

**Overtourism Scoring:** Each destination is scored 0–100 across multiple dimensions using a chain of fine-tuned LLM prompts — crowd density, cultural authenticity, seasonal variance, and more.

**Vibe Matching:** Users select what resonates about a destination they love. The LLM interprets the underlying appeal (architecture, pace, food culture, off-the-beaten-path energy) and suggests 3–5 alternatives that match it.

## Technical Architecture

- Chained prompt pipeline with 5–7 evaluation dimensions per destination
- Python backend with TypeScript frontend
- Supabase for data persistence and auth

## Known Issues & Next Steps

- **Vibe groups:** The "vibe groups" concept that drives the enrichment dataset has some frontend/backend sync issues — mainly visible on the Destinations and Discover pages.
- **Performance:** DB query performance needs improvement for destination filtering and search.
- **Frontend polish:** Tourism indexes not displaying in some views, filtering needs refinement, and various UI fixes across the board.

Live MVP at [wandryl.com](http://wandryl.com/)
