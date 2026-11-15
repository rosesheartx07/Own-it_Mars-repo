# [GAME NAME]

> **Survive Mars with real science.**

An educational top-down game for kids aged 7–12. The player runs a Martian outpost: keep your health, food, water and energy up, and decide what to protect when solar storms and dust storms arrive. Every choice has a risk, and after each decision the game shows the real science behind it.

Built for the Space Apps PV Virtual challenge: *let kids experience the real trade-offs of running a lunar or Martian outpost.*

## Current status
Design and documentation phase. The game design, event content and data sources are defined; the game code is under development and will be added in `game/`.

## The idea in one minute
Every choice has consecuences. Protecting the solar panels can cost health, collecting more data on an expedition can cost radiation exposure, and a fast analysis in the lab can lose the data. The player learns that astronauts and mission planners decide under risk every day.

## Stations
| Station | What the player does |
|---|---|
| Habitat | Maintenance work; if skipped, systems can fail |
| Solar panels | Maintenance and decisions during solar and dust storms |
| Greenhouse | Keep temperature, humidity and light under control to grow food |
| Robot garage | See how a robotic operation is planned |
| Expedition | Collect data, with a radiation risk |
| Laboratory | Analyze data and send it to Earth (opens only after an expedition) |
| Spaceship | Final mission: get all the data and send it to Earth |

## Science sources
All science content comes from official sources: NASA / JPL pages and resources of the Canadian Space Agency (CSA) provided by the challenge. Nothing is invented as science. See [docs/nasa-data-sources.md](docs/nasa-data-sources.md) and [CREDITS.md](CREDITS.md).

## Team
| Name | Rol |
|---|---|
| Nahomi Tlapanco Vélez | Business Model and Pitch |
| Natalia Urban Castillo | Prototype development |
| Valeria de la Rosa Alejandro | Data and source verification; Video game development in JavaScript |
| Maria Fernanda Herrera Ramírez | Video game development in JavaScript |

## Repository layout
```
docs/   Design, events, data sources, limitations, roadmap
game/   All game code, data and assets
```



