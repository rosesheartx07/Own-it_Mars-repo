# Prototype notes (Twine → JavaScript)

`game/prototype/Mission Trainer.twee` is the **final version of the Twine prototype**. It is where the rules were built and tested. The playable game is the JavaScript version in `game/src/`, which was ported from it. This page lists what the prototype does and the decisions taken when it was ported.

All values are design values, not NASA data.

## Meters
Energy (0–10, starts at 10), Food, Equipment, Health and Time (0–5, start at 5), and Data (0–5, starts at 0). The bar at the top shows them on every page. Option texts do not show chances or costs: the player finds out the consequence after choosing.

## Rules in the prototype
| Place | Option | Result |
|---|---|---|
| Habitat | Service everything | Energy −1, Time −1, nothing fails |
| | Only life support | Energy −1; 25% network, 25% comms fail (Equipment −1) |
| | Skip | 20% life support fails (Energy −1), 20% network, 20% comms |
| Solar panels (storm) | Disconnect everything | Energy +2, Food −2; 30% Equipment −1 |
| | Stay connected | 70% Equipment −2 and Energy −2 |
| | Only science equipment | Energy −1; 30% Equipment −1 |
| Greenhouse | Control all three | Energy −2, Food +1 |
| | Skip humidity | Energy −1; 50% mold, Food −2 |
| | Skip temperature | 50% plants stunted, Food −2 |
| Robot garage | Do all three jobs | Energy −1, Equipment +1 |
| | Skip software update | Energy −1; 40% freeze, Equipment −1 |
| | Skip coordination | Energy −1; 40% power dip, Energy −1 more |
| Expedition | Go back for the suit and stay longer | Data +5, Health −1, Energy −1, Equipment −1, Time −1 |
| | Stay without the shield | 50% Game Over; 50% Data +5, Health −4, Energy −1 |
| Laboratory | Fast analysis | Energy −1; 10% all data lost, otherwise sent to Earth |
| | Careful analysis (needs Energy ≥ 2) | Energy −2, data sent to Earth |

The laboratory is not on the map: it is reached from the Expedition, and only after an expedition (needs Data ≥ 1 and Energy ≥ 1).

## Spaceship and ending
The ship launches only when the Habitat, Greenhouse, Solar panels, Robot garage and Expedition are done **and** Energy, Food, Health, Time and Data are each at least 1. If something is missing, the ship lists what is left. The **Launch Day** screen shows a mission log with *What you protected* and *What it cost*, built from what happened during the game, and a "Play again" button.

## Game over
When Health reaches 0 the game shows a **Mission over** screen with the real science about radiation and asks "What would you protect first next time?", then the player can start again. Today only the Expedition without the suit can take Health to 0.

## What changed in the JavaScript version
- **Events are random.** The solar storm and the dust storm can arrive at a random moment of the single day (right at the start or after a task), with the chance in `events.json`, as a pop-up over the map, instead of a fixed alert at Solar panels.
- **Food requirement:** the Expedition needs a minimum amount of food, which only the Greenhouse gives (see [game-design.md](game-design.md)). The prototype does not have it.
- **The map stays as in the prototype** (see [game-design.md](game-design.md#map)).
- **Music and sounds are added** (see [audio.md](audio.md)).

## Differences between the prototype and the JavaScript game
- **Solar storm options:** both use "disconnect everything / stay connected / disconnect only science". The first design (shelter / finish maintenance / shut down then shelter) was dropped.
- **Dust storm and decision timers:** only in the JavaScript game, not in the prototype.
- **Data files:** `game/data/*.json` are now generated from the game content (`npm run export-data`), so they match the JavaScript game, not the prototype.
- **Crew:** removed from the meters. `Habitat Skip` in the prototype still changes a `$crew` value that nothing shows.

## Known loose ends in the prototype (left as they are in the prototype)
- If the fast analysis wipes the data, the player has no data and cannot do a second expedition, so the ship can never launch and there is no ending screen for it.
- "Disconnect only the science equipment" says the data is lost, but the Data meter does not change.
- The empty passages `Spaceship Mission`, `Ship Air`, `Ship Engine`, `Ship Radio`, `Launch Heavy`, `Launch Medium`, `Launch Light` and `Crater Leave` are not used.
- The map background is a hotlinked image with no confirmed author or license (see `CREDITS.md`), and the stylesheet still has a placeholder image URL and an invalid `selector` rule.
- Some typos remain ("shutt down", "austronaut").

In the JavaScript game the lab dead end is detected and the map background is drawn in SVG. **Still open in the JavaScript game:** "Disconnect only the science equipment" says tonight's data is lost, but the Data meter does not change.

## Fixed when the final version was added to the repo
Missing `Lab Full` passage (the careful analysis led nowhere), an unclosed bracket in `Stay Connected`, a truncated link label ("Stay connected. L"), and a lab with no exit (the Expedition page now also links to the lab once the expedition is done).

## Decisions taken in the JavaScript version
These were open questions. They are easy to change in `game/src/` (see `game/README.md`).
- **Event rolls:** once when the mission starts and again after every task. At most one event per roll; each event happens at most once. Chance per event: 30% (`eventProbability`).
- **Solar storm:** keeps the prototype options (disconnect everything / stay connected / only science), because they are the tested rules. The text and source come from `events.json`. It can arrive as a random pop-up; if it has not happened when the player visits Solar panels, it happens there, as in the prototype. Either way it counts as the Solar panels task.
- **Dust storm:** uses the `events.json` options. Effects: power-saving costs 1 Time (25%: dust on panels, Energy −2); keep working 55%: battery drained, Energy −2, Food −1, Health −1; cut to essentials costs 1 Energy (35%: results lost, Data −1; 25%: dust on panels, Energy −1).
- **Decision timer:** 30 s for the solar storm, 15 s for the dust storm.
- **Sounds after a choice:** always a soft, neutral chime (every option has a cost, so no choice sounds like a mistake). Only Game Over uses the sad sound.
- **Timer runs out:** the base does nothing, so solar storm = "Stay connected" and dust storm = "Keep working as usual".
- **Food requirement:** the Expedition needs Food ≥ 3.
- **Dead ends:** when the ship can never launch (for example the lab wiped the data), the map and the ship say so and offer to restart.
- **Game over:** any time Health reaches 0 (radiation on the Expedition, or cold after a dust storm).
- Meters are kept between 0 and their maximum. `$crew` and `lab_result` were dropped. Typos fixed.
- The map background is drawn in SVG, so the hotlinked image with unknown license is no longer used.

