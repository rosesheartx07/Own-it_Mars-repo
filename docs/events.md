# Events catalog

Events are **random**: each one has a chance of happening at a random moment of the game, so the player never knows when one will arrive. It can happen as soon as the player starts, or after finishing a task. The whole game is a single day. A window opens over the map with a timer and the player picks an option. Every option has a consequence, good or bad, and the game explains the real science after the choice.

How the random roll works is in [game-design.md](game-design.md#random-events). Machine-readable versions live in [`game/data/events.json`](../game/data/events.json), generated from `game/src/game/content.js`.

Chances, costs and timers are design values, not NASA data.

## Solar storm (solar panels) — 30 seconds to decide
**Player text:** Sometimes the Sun unleashes a massive explosion that sends very fast-moving particles toward Mars. We call this a solar storm. In September 2017 one reached Mars and lit up an aurora more than 25 times brighter than any seen before by NASA’s MAVEN orbiter. Radiation on the ground was twice as high as any earlier measurement.

| Option | Consequence |
|---|---|
| Disconnect everything | Energy +2, Food −2 (the food in the freezer spoils); 30% a small surge still breaks a machine (Equipment −1) |
| Stay connected | 70% a power surge burns equipment (Equipment −2, Energy −2); 30% nothing happens |
| Disconnect only the science equipment | Energy −1 and tonight's data is lost (text only: the Data meter does not change); 30% Equipment −1 |

If the timer runs out the base stays connected ("Stay connected").

**Source:** NASA / JPL-Caltech, "Large Solar Storm Sparks Global Aurora and Doubles Radiation Levels on the Martian Surface".
https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/

## Dust storm (solar panels) — 15 seconds to decide
**Player text:** A storm of tiny dust particles covered much of Mars and made NASA's Opportunity rover suspend its science work. Opportunity runs on sunlight, and the dust blocks it. NASA's Curiosity rover has a nuclear-powered battery that works day and night, so it was mostly unaffected.
Dust also settles on solar panels and reduces the sunlight they receive. Sometimes wind clears it away, but that is luck, not a plan.

| Option | Consequence |
|---|---|
| Power-saving mode | Time −1; 25% dust stays on the panels (Energy −2); otherwise the wind clears it |
| Keep working as usual | 55% the battery runs out and heating fails (Energy −2, Food −1, Health −1); otherwise the battery holds |
| Cut to essentials and choose one thing to protect | Energy −1; 35% results are lost (Data −1); 25% dust stays on the panels (Energy −1) |

If the timer runs out the base keeps working as usual.

**Sources:**
- https://science.nasa.gov/solar-system/planets/mars/10-things-massive-dust-storm-on-mars/
- https://science.nasa.gov/photojournal/solar-panel-dust-accumulation-and-cleanings/

## Adding a new event
1. Write the text in simple language; explain any science word in one short sentence.
2. Give at least two options, and make sure each one has a consequence.
3. Add an official source and list it in `CREDITS.md`.
4. Add the event to `EVENTS` in `game/src/game/content.js`, then run `npm run export-data`, `npm test` and `npm run build`.



