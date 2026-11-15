# Events catalog

Events are **random**: each one has a probability of happening on a given sol (day), so the player never knows when one will arrive. In the Twine prototype only the solar storm exists, as a fixed alert; the random version will be built in JavaScript.

Each event has a probability of happening on a given day, a decision timer, options with probabilistic consequences, an explanation and an official source. Machine-readable versions live in [`game/data/events.json`](../game/data/events.json).

Probabilities and timers are design values.

## Solar storm (solar panels)
**Player text:** Sometimes the Sun unleashes a massive explosion that sends very fast-moving particles toward Mars. We call this a solar storm. In September 2017 one reached Mars and lit up an aurora 25 times brighter than normal. Radiation on the ground was twice as high as any earlier measurement.

**Source:** NASA / JPL-Caltech, "Large Solar Storm Sparks Global Aurora and Doubles Radiation Levels on the Martian Surface".
https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/

## Dust storm (solar panels)
**Player text:** A storm of tiny dust particles covered much of Mars and made NASA's Opportunity rover suspend its science work. Opportunity runs on sunlight, and the dust blocks it. NASA's Curiosity rover has a nuclear-powered battery that works day and night, so it was mostly unaffected.
Dust also settles on solar panels and reduces the sunlight they receive. Sometimes wind clears a lot of it away.

**Sources:**
- https://science.nasa.gov/solar-system/planets/mars/10-things-massive-dust-storm-on-mars/
- https://science.nasa.gov/photojournal/solar-panel-dust-accumulation-and-cleanings/



