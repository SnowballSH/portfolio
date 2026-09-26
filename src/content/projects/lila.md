---
title: "Lichess Accuracy Model"
shortDescription: "The win-probability model behind Lichess's game-analysis accuracy, fitted to real human games. In production for 4 million daily users."
date: "2022-07-07"
technologies: ["Python", "Rust", "Machine Learning", "Statistics"]
featured: true
status: "completed"
image: "/lila.webp"
imageAlt: "The Lichess homepage"
githubUrl: "https://github.com/lichess-org/lila"
links:
  - label: "How Lichess computes accuracy"
    url: "https://lichess.org/page/accuracy"
    type: "docs"
category: "games"
priority: 2
---

# Lichess Accuracy Model

When you analyze a game on [Lichess](https://lichess.org), the world's second-largest chess platform, every inaccuracy, mistake, and blunder, and your overall accuracy score, comes from a model that turns an engine evaluation into the probability that a human wins from that position. I replaced that model with one fitted to real games. It improved correlation with a win-rate benchmark by 7.9%, and it has been in production for Lichess's 4 million daily active users since 2022.

## The problem

The original curve was set by hand, with nothing checking it against how humans actually play. I found that it did not match how real players convert advantages, raised it with the Lichess developers, and set out to measure the old model and build a better one.

## Method

- **Data.** I took every game from the June 2022 Lichess open database, over 87 million games, and wrote a Rust tool to pull the ratings, evaluation, time control, and result for each position out of the PGN files.
- **Filtering.** Game analysis matters most to strong players, so I kept games where both players were rated 2300 or higher and the time control was at least 8 minutes, and dropped time forfeits, abandoned games, and quick draws. That left 75,000 high-quality positions.
- **Fit.** I modeled the win probability at evaluation _x_ as the logistic curve `w(x) = 2 / (1 + exp(-kx)) - 1` and fitted _k_ with SciPy and NumPy.
- **Refinement.** A year later I retrained on newer data, split by rating band and time control, because stronger players convert winning positions more reliably and everyone blunders more in time trouble.

After I reported the method and results, the Lichess developers merged the model, and it is still what grades every analyzed game today.
