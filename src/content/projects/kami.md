---
title: "Kami"
shortDescription: "A hand-drawn puzzle-platformer built at HackMIT 2026: whatever you sketch becomes solid ink, and whatever you name it, it becomes."
date: "2026-09-19"
technologies: ["TypeScript", "Computer Vision", "Physics", "LLM"]
featured: true
status: "completed"
image: "/kami.webp"
imageAlt: "A Kami sandbox page: a hand-drawn tower, tree, and cars floating because a law written on the page says gravity is 0"
githubUrl: "https://github.com/SnowballSH/kami"
liveUrl: "https://kami.snowballsh.com"
category: "games"
priority: 3
---

# Kami

_Kami_ (紙) is paper; _kami_ (神) is the spirit in a thing. Kami is a puzzle-platformer on one endless whiteboard, built over a weekend at HackMIT 2026. Alice can hop but not fly, so you draw her way through: whatever you sketch becomes solid ink, and whatever you write beside it, it becomes. A bouncy mushroom bounces, a ladder climbs, a car rolls. Write a law of physics on the page, such as _make gravity 0_, and the world obeys until you erase it.

Kami, the cat who lives in the paper, watches you draw, guesses what it is before you finish, tidies your lines, and writes back in his own handwriting when you ask for help.

## How it works

- **Ink is physics.** Strokes become rigid bodies in a fixed-step simulation, a name gives a drawing one of a handful of behaviors, and a law is a small typed effect applied to the whole world's physics.
- **Kami's Eye.** A ResNet-18 trained on all 345 Quick, Draw! categories, with half of its training drawings cut short so it can guess mid-sketch: 83% top-1 and 95% top-3 on finished drawings, and 82% top-3 at only 60% of the ink. It is calibrated, so Kami names a drawing himself only when he would be right 95% of the time, and asks otherwise.
- **Laws.** An offline grammar reads common laws instantly, and a local language model compiles the rest into the same typed effect, once per law and never in the frame loop.
- **One server.** Recognition, the language model, the database, and the game server all run on the host; iPads only draw. A big screen mirrors play by replaying render data rather than streaming video, and an Arduino arcade stick can drive Alice.
- **Tested.** About 2,400 tests, including headless playthroughs of whole boards.

Play modes include a shared sandbox, puzzle rooms, a two-player boss fight, and the full Wonderland adventure.
