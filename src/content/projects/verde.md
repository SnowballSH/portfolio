---
title: "verde"
shortDescription: "A crowdsourced map for community-led environmental action, built in 24 hours at HackMIT 2025. I was the team's AI engineer."
date: "2025-09-14"
technologies: ["Flutter", "Supabase", "Python", "LLM Agents"]
featured: false
status: "completed"
image: "/verde.webp"
imageAlt: "The text 'verde' over a green background."
githubUrl: "https://github.com/nirpechuk/verde"
links:
  - label: "Demo video"
    url: "https://www.youtube.com/watch?v=00KMYpdCVno"
    type: "demo"
category: "hackathons"
priority: 1
---

# verde

**verde** ("green" in several Romance languages) is a real-time, interactive map for community-led environmental action. Anyone can report an issue by taking a photo, and AI agents verify reports, pull in public data, and organize events around what they find. We built it in under 24 hours at HackMIT 2025, and I was the team's AI engineer.

## Why

Cities receive hundreds of thousands of environmental complaints a year, but community action stays small, because it depends on a few large organizations to plan events. verde flips that: individuals spot problems, and the platform helps them organize the fix.

## How it works

- **Report anything.** Photograph an issue, such as an overflowing trash can, and drop an "Issue" marker on the map. A multimodal model identifies and verifies the issue in the image and writes a short description.
- **Organize whenever.** Others vote on whether a report is credible and still present. Small issues get fixed on the spot; bigger ones get an "Event" marker, such as a weekend park cleanup, that anyone can create and RSVP to.
- **Agentic enrichment.** Agents regularly pull government and NGO data, extract the most pressing local issues, cluster them by neighborhood, and create events around them.
- **Points.** Users earn points for reporting issues, running successful events, and taking part.

## Stack

The app is a single Flutter codebase for iOS, Android, and the web. Supabase provides the database and server functions for points and markers. Anthropic's Claude models handle issue verification and descriptions, which avoided training a domain-specific classifier in a 24-hour window.
