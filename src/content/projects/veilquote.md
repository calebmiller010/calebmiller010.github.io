---
title: "VeilQuote"
tagline: "Privacy-first insurance comparison — shop policies without exposing your data"
description: "A privacy-focused insurance shopping tool that lets users compare policies anonymously, without surrendering personal information to insurers or brokers."
url: "https://veilquote.com/"
tags: ["TypeScript", "Supabase", "Vercel", "Edge Functions"]
category: "Product"
featured: true
order: 2
heroMetric: 'Insurance quotes without the spam! Protected by infrastructure, not "policy"'
progress: 75
---

## The Problem

Insurance comparison sites are data harvesting machines. Getting a quote means handing over your name, address, phone number, and email — which are then sold to a network of agents who call you for weeks.

## The Solution

VeilQuote enables anonymous policy comparison. Users describe their coverage needs without identity disclosure. The platform surfaces relevant options without triggering data broker pipelines.

## Stack

- **Frontend:** TypeScript, deployed on Vercel edge network
- **Backend:** Supabase for auth and data layer — serverless, scalable
- **Architecture:** Vercel edge functions handle the comparison logic; no persistent user PII storage

## Known Issues & Next Steps

- **Email integration:** ForwardEmail integration needs work to correctly capture and process inbound quote request emails.
- **Vendor management:** Need a more dynamic vendor onboarding flow so users can easily add insurers and manage quote relationships within the platform.

Live early build at [veilquote.com](https://veilquote.com/). Currently in active development.
