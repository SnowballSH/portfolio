---
title: "Avalanche"
shortDescription: "A Fast, Strong, and Intelligent Chess Engine. With an ELO of 3400, Avalanche is one of the strongest chess engines and the first ever written in Zig."
date: "2024-01-13"
technologies: ["Zig", "Neural Networks", "Minimax", "Chess"]
featured: true
status: "completed"
image: "/avalanche.webp"
imageAlt: "A black elephant and a white horse"
githubUrl: "https://github.com/SnowballSH/Avalanche"
links:
  - label: "CCRL"
    url: "https://computerchess.org.uk/ccrl/4040/cgi/engine_details.cgi?match_length=30&each_game=0&print=Details&each_game=0&eng=Avalanche%202.1.0%2064-bit#Avalanche_2_1_0_64-bit"
    type: "other"
  - label: "Lichess"
    url: "https://lichess.org/@/IceBurnEngine"
    type: "other"
category: "other"
priority: 1
---

# Avalanche

Avalanche is the first chess engine (computer chess player and analyzer) written in the Zig programming language, proving Zig's ability to succeed in real-world, competitive applications. It is an open-source, standalone, and cross-platform software. As an Universal Chess Interface (UCI) program, Avalanche interacts with the user with text, but it is compatible with most popular chess software. With a rating of 3400 (600 higher than Magnus Carlsen, the strongest human grandmaster), Avalanche was among the top 32 chess engines to qualify for TCEC Swiss 6 and competed for the title of world champion in the most prestigious computer chess competition in the world.

Using UCI, the user or GUI can inform Avalanche the current board and clock situation, and it will search for the best move and decide when to stop thinking on its own.

## Features

- Avalanche uses the new **NNUE** (Efficiently Updatable Neural Network) technology for its evaluation.
- The training data is purely generated from self-play games. Currently, the latest dev network is trained on 600 million self-play positions.

## Technical Details

I represent the chess board using a unique Bitboard-Mailbox hybrid data structure. There are 8x8=64 squares on a chess board, which happens to be the same as the number of bits in a 64-bit integer. By representing each piece+color with a single integer, where a bit is 1 if the piece exists on that square, my data structure allows efficient move generations thousands of times faster than naive algorithms.

Two modules influence Avalanche's thinking: Search and Evaluation.

I use an extremely optimized version of Minimax. While on average 30 legal moves exist per position, Avalanche only has a branching factor of about 4, discarding most options quickly using many smart algorithms like Futility Pruning and Static Exchange Evaluation. This is because in chess, many moves are obviously worse than others, even considering tactical possibilities.

I evaluate leaf nodes with an Efficiently Updatable Neural Network (NNUE), and I am one of the pioneers of applying it to chess. Because each chess move changes the position by at most four squares, Avalanche only needs to recalculate its evaluation for four input neurons instead of the whole board. With Reinforcement Learning, it predicts the future much more accurately than traditional hand-crafted methods with human knowledge.

For testing, I let the new version play games against the old version from random openings until the Sequential Probability Ratio Test (SPRT) tells me there is a 95% probability the new version is stronger.

## Results

I have released 15 versions of Avalanche, each time making many improvements. Although most of the improvements consist of modified algorithms, some unfortunately introduced new bugs.
For example, in version 1.3.0, I introduced a new feature called “Countermove Heuristics,” which I concluded to be 66 elo stronger than the previous version after 28 blitz games. However, when testers at CCRL tested it, they saw a decrease in strength. After consulting a statistician, I learned that 28 was way too small of a sample size for a meaningful conclusion. Furthermore, I found a critical bug in my implementation of Countermove Heuristics, where I forgot to reset a section of the memory to zero, causing Countermove Heuristics to essentially add random noises. The chess engine community taught me how to perform the Sequential Probability Ratio Test, which requires thousands of games but gives a statistically significant result. Since then, I have been using this rigorous means of regression testing and carefully zeroing important arrays at the start of the program, never making this mistake again.
Through this project, I learned the importance of collaboration and humbly consulting experts in specific areas for advice on things I am weak in. Next time, I would design and build a rigorous development and testing workflow before starting to code to minimize the chance of committing code that contains mistakes.
