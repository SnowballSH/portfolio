---
title: "Avalanche"
shortDescription: "The first competitive chess engine written in Zig. Version 4.0.0 is rated 3597 on CCRL Blitz and 3492 on CCRL 40/15, and played in TCEC Season 30."
date: "2022-02-01"
updated: "2026-09-26"
technologies: ["Zig", "NNUE", "SIMD", "Search"]
featured: true
status: "completed"
image: "/avalanche.webp"
imageAlt: "Avalanche logo: a black elephant and a white horse clashing amid shattering ice"
githubUrl: "https://github.com/SnowballSH/Avalanche"
links:
  - label: "Download v4.0.0"
    url: "https://github.com/SnowballSH/Avalanche/releases/tag/v4.0.0"
    type: "other"
  - label: "CCRL"
    url: "https://computerchess.org.uk/ccrl/4040/cgi/engine_details.cgi?match_length=30&each_game=0&print=Details&each_game=0&eng=Avalanche%204.0.0%2064-bit"
    type: "other"
  - label: "Lichess"
    url: "https://lichess.org/@/IceBurnEngine"
    type: "other"
category: "games"
priority: 1
---

# Avalanche

Avalanche is an open-source chess engine and the first competitive one written in Zig. It speaks the Universal Chess Interface (UCI), so it plugs into any popular chess GUI, and runs on every major platform.

## Results

- **CCRL Blitz:** 3597 for version 4.0.0, up from 3417 for 3.0.0.
- **CCRL 40/15:** 3492 for version 4.0.0, up from 3343 for 3.0.0.
- **TCEC:** among the top 32 engines at TCEC Swiss 6 in 2024, and back for TCEC Season 30 in 2026 with version 4.0.0.
- In testing, 4.0.0 beats Stockfish 11 by 88 Elo.

## How it works

- **Evaluation.** Avalanche evaluates positions with an Efficiently Updatable Neural Network (NNUE). A move changes at most four squares, so only those inputs are recomputed instead of the whole board, and inference is vectorized with SIMD. The networks are trained purely on self-play data, hundreds of millions of positions of it. Version 3.0.0 introduced the Jihan (极寒) network family, and 4.0.0 redesigned the architecture.
- **Search.** A heavily pruned alpha-beta search. There are about 30 legal moves in a typical position, but futility pruning, static exchange evaluation, and other heuristics cut the effective branching factor to about 4.
- **Board.** A bitboard-mailbox hybrid: each piece type is a 64-bit integer with one bit per square, which makes move generation fast.
- **Endgames.** Syzygy tablebase support for perfect play once few pieces remain.

## Testing

Every change has to prove itself before it ships. A candidate plays thousands of games against the current version from random openings until a Sequential Probability Ratio Test (SPRT) says it is stronger. Search parameters are tuned with [Storming Tune](https://github.com/SnowballSH/storming_tune), my Gaussian-distributed parameter tuner.

I learned this the hard way. Version 1.3.0 shipped a "countermove heuristic" that looked 66 Elo stronger after 28 games, and CCRL then measured it as weaker. The sample was far too small, and the feature had a bug: an array that was never zeroed, so the heuristic was adding noise. Since then, nothing merges without SPRT.
