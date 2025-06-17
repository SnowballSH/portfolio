---
title: "Headpace"
shortDescription: "Natural-language AI-driven calendar assistant to boost your productivity and solve scheduling conflicts."
date: "2024-04-24" # YYYY-MM-DD format
technologies: ["React", "Typescript", "Firebase", "LLM"]
featured: true
status: "completed"
image: "/headpace.png"
imageAlt: "A green timer and the text 'Headpace'"
githubUrl: "https://github.com/szhen0340/headpace"
links:
  - label: "Devpost"
    url: "https://devpost.com/software/headpace"
    type: "docs"
category: "web"
priority: 2
---

# Headpace

Transform your productivity. Designed to streamline your schedule, manage appointments, and keep you on track. Experience the future of time management today!

Headpace is a natural-language AI-driven calendar assistant to boost your productivity and solve scheduling conflicts.

Headpace is the **1st place project winner** at the 2024 HSHacks 12-hour Hackathon.

## Inspiration

It's hard to get people who don't plan to join in on group planning sessions. Current solutions like lettucemeet or when2meet require a lot of work and we wanted to provide a more seamless experience.

Thus we introduce Headpace - an AI-driven all-in-one platform that allows you to work efficiently with your team. The user signs in with their Google account and in the future will sync the app with their Google Calendar. The user can see a clear overview of all upcoming events and time until it happens. The user can use our integrated AI-assistant powered by GPT-4 to ask for available time and help with scheduling. The AI can also help with scheduling events with other people when all of you are free. The AI also supports text-to-speech so you feel a real human assistant help you schedule your meetings.

## Technical Details

We used React and shadcn/ui's component library for the frontend. For backend, we used the OpenAI API for the LLM and Firestore for the database.

We utilize GPT-4's function-calling feature, which allows GPT-4 to seamlessly interact with our backend algorithms that detects conflicts and finds available time slots.
