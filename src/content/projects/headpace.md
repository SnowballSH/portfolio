---
title: "Headpace"
shortDescription: "1st place at HSHacks 2024: a natural-language calendar assistant that finds free time and resolves conflicts with GPT-4 function calling."
date: "2024-04-24"
technologies: ["React", "TypeScript", "Firebase", "LLM"]
featured: false
status: "completed"
image: "/headpace.webp"
imageAlt: "A green timer and the text 'Headpace'"
githubUrl: "https://github.com/szhen0340/headpace"
links:
  - label: "Devpost"
    url: "https://devpost.com/software/headpace"
    type: "docs"
category: "hackathons"
priority: 2
---

# Headpace

Headpace is a natural-language calendar assistant that finds time for groups and resolves scheduling conflicts. It won **1st place** at the 2024 HSHacks 12-hour hackathon.

## Why

Getting people who don't plan ahead to join a group scheduling session is hard, and tools like When2meet or LettuceMeet ask a lot of every participant. We wanted scheduling to be a conversation instead.

## How it works

Users sign in with Google and see an overview of their upcoming events. They can ask the built-in assistant, by text or voice, when they are free or to schedule something with other people. The assistant answers with text-to-speech, so it feels like talking to a real person.

Under the hood, GPT-4's function calling lets the model call our backend algorithms that detect conflicts and find open slots, instead of guessing at times itself. The frontend uses React with shadcn/ui, and Firestore stores the data.
