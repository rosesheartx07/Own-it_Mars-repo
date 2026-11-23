# Project overview

## Problem
Space-themed STEM content for kids is often too abstract (posters, loose facts) or too technical. Few young players ever see the decision-making behind a mission, where power, food, equipment and health compete with each other.

## Solution
A top-down game with a tap map of a Martian outpost. The player visits stations (habitat, solar panels, greenhouse, robot garage, expedition crater, spaceship) and uses pop-up windows to choose how to do each task. Solar storms and dust storms can arrive at random moments and give a short time to decide. **Every option has a consequence, good or bad**, and some depend on a random roll, so no two plays are the same. After each decision, the game explains the real science behind it and credits the source. At the end, a mission log shows *what you protected* and *what it cost*.

## Audience
Kids aged 7–15. It can also be used in a classroom or with family.

## What the player learns
- Energy, food, equipment and health are limited and have to be shared.
- Storms force you to choose what to protect.
- Radiation is a real risk for people working outside.
- Data is only useful when it reaches Earth.
- A good decision does not always give a good result; that is how engineers and mission planners work.

## Technology
Plain JavaScript (no frameworks, no server). The published game is a single HTML file that works offline. A Twine prototype was used first to test the rules (`game/prototype/`).

## Repository components
- `docs/`: design and documentation.
- `game/`: game code, data, assets, tests and the Twine prototype.
- `index.html`: opens the game (used by GitHub Pages).

