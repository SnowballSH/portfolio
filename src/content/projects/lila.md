---
title: "Lichess Game Analysis Model"
shortDescription: "An improved Win Probability model for chess based on real-world human data on lichess.org."
date: "2022-07-07" # YYYY-MM-DD format
technologies: ["Machine Learning", "Statistics", "Rust", "Python", "Chess"]
featured: true
status: "completed"
image: "/lila.webp"
imageAlt: "Lichess homepage."
githubUrl: "https://github.com/lichess-org/lila"
links:
  - label: "Lichess"
    url: "https://lichess.org/"
    type: "other"
category: "other"
priority: 3
---

# Lichess Game Analysis Model

This project is an improvement of the game analysis feature of Lichess, the world’s second-largest online chess platform through an improved Win Probability model based on real-world human data. In the game analysis feature, the server generates evaluations for each position using a chess engine and uses a mathematical model and the differences between the positions before and after a move to determine whether each move is an inaccuracy, mistake, or blunder. This mechanism powers millions of chess players around the world and allows them to learn from their mistakes. Players simply upload their chess game or choose a game they played online, and the server will use the model to generate an analysis report.

In 2022, I specifically significantly improved on the Win Percentage prediction model by creating a new model fitted on data from real-world human games. This model predicts the probability of a human player winning a game given the evaluation of a position. Then, the difference in this probability between moves is used to gauge whether the move is a mistake. Through building a more accurate model tailored to human behavior, I improved the user experience and accuracy when analyzing chess games.

## Background

Chess players from around the world analyze tens of thousands of chess games every day. Lichess, the world’s second-largest online chess platform, uses a mathematical equation to compute the probability a human player wins, given the position evaluation from the Stockfish chess engine. This probability is then used to compute the player’s accuracy, which indicates how well and accurately they played the game. Previously, the equation was modeled by humans by hand, without any rigorous proof that it is an accurate model. This means that the model does not actually accurately represent human’s win probabilities. I am the first person to discover this issue, and after communications with the lead developers of Lichess, I decided to find a way to measure the accuracy of the model using real-world data and also create a better model using Machine Learning. One year later, I re-trained the model using updated data as well as “blocked” the sample by rating groups and time controls, since stronger players are able to convert winning positions better than weaker players, and players blunder more in time trouble. Similar to my other projects, the main constraint to this project is my lack of a CUDA-enabled GPU, which forces me to train the model slowly on my CPUs.

## Technical Details

Using the open Lichess database, I downloaded all human games on lichess in 2022 June, which contains over 87 million games, a significant sample for the population of all human games on Lichess. Since the games are stored in Portable Game Notation (PGN) format, I wrote an efficient script in Rust to extract only the necessary information for each position: players’ ratings, evaluation, time control, and result. Then, because the quality of data is crucial and accuracy of game analysis is mostly only important for higher-rated players, I applied a filter on the data such that the final sample does not contain any games ending in forfeit on time or abandoned, ending in quick draws or losses, and neither player is below 2300 ELO. For the purpose of simplicity, I did not “block” my sample for the first attempt and considered all games with a time control of 8 minutes or higher. This results in a sample of 75,000 high-quality data points.

I modeled the Win Probability of a player with an evaluation of x using the equation `w(x) = 2/(exp(-kx)+1)-1`. This choice makes sense as a logistic function. Using Python with the scipy and numpy libraries to fit the model on the data prepared earlier, I found the value of k that fits the human data the most. After reporting my method and findings to the Lichess developers, my model is merged into the Lichess codebase, and it is still being used by millions of chess players to analyze their games today.
