# Own It: Mars

> **Survive Mars with real science.**

An educational top-down game for kids aged 7–12. The player runs a Martian outpost: keep your health, food and energy up, and decide what to protect when solar storms and dust storms arrive. Every decision has a consequence, and after each decision the game shows the real science behind it.

Built for the Space Apps PV Virtual challenge: *let kids experience the real trade-offs of running a lunar or Martian outpost.*

## Play
- **Online:**  [https://rosesheartx07.github.io/Own-it_Mars-repo/](https://rosesheartx07.github.io/Own-it_Mars-repo/)
- **On your computer:** open `game/dist/mars-outpost.html` in a browser (double-click; no server, account or install needed).
- **Demo video:** [Watch the demo](https://rosesheartx07.github.io/mars-outpost-game/demo.mp4)

## How to run it (for judges and players)
**Option 1 — Online (recommended, nothing to install).** Open the link in the *Play* section above. It works on a phone, a tablet or a computer with a modern browser (Chrome, Edge, Firefox or Safari). No account, no download, no sign-up.

**Option 2 — From the repository (works offline).**
1. On GitHub click **Code → Download ZIP** and unzip it.
2. Double-click `game/dist/mars-outpost.html`. It is a single file: the music, drawings and code are all inside.

> Do not click the HTML file inside GitHub's file viewer: it only shows the code. Use the online link, or download the ZIP.

**Option 3 — Run the source code (developers).** See *For developers* below.

### How to play in one minute
1. Press **Start my mission**.
2. **Tap a place** on the map to open it. Do each of the five base tasks once: Habitat, Greenhouse, Solar panels, Robot garage and Expedition. A ✅ shows what is done.
3. At each place, read the short story and **choose an option**. Every option has a consequence, good or bad, and some depend on a random roll. The meters bar at the top (Energy, Food, Equipment, Health, Time, Data) changes after each choice.
4. **Storms can arrive at any moment.** A pop-up appears with a countdown: choose before time runs out.
5. The Expedition needs enough Food, and food only grows in the Greenhouse.
6. When the five tasks are done and no key meter is empty, go to the **Spaceship** and launch.
7. Press **🔭 Is this real?** inside any place or event, or the **📚** button, to see the real NASA or CSA science and its source.
8. If your Health reaches 0 the mission is over. Press the button to try again: each game is different.

More detail, including a short tour for judges: [docs/how-to-play.md](docs/how-to-play.md).

## The idea in one minute
Every decision has a consequence. Protecting the equipment can leave the base dark and cold, collecting more data on an expedition can cost radiation exposure, and a fast analysis in the lab can lose the data. The player learns that astronauts and mission planners decide under risk every day.

## Stations
| Station | What the player does |
|---|---|
| Habitat | Maintenance work; if skipped, systems can fail |
| Solar panels | Maintenance and decisions during solar and dust storms |
| Greenhouse | Keep temperature, humidity and light under control to grow food (the only source of food) |
| Robot garage | See how a robotic operation is planned |
| Expedition | Collect data, with a radiation risk (needs enough food, which only the Greenhouse gives) |
| Laboratory | Analyze data and send it to Earth (opens only after an expedition) |
| Spaceship | Final mission: get all the data and send it to Earth |

## Science sources
All science content comes from official sources: NASA / JPL pages and resources of the Canadian Space Agency (CSA) provided by the challenge. Nothing is invented as science. See [docs/nasa-data-sources.md](docs/nasa-data-sources.md) and [CREDITS.md](CREDITS.md).

## Repository layout
```
index.html   Opens the game (used by GitHub Pages)
docs/        Design, events, data sources, limitations, roadmap
game/        Game code, data, assets and the Twine prototype (game/prototype/)
```

## For developers (Node 18+)
```
cd game
npm test            # 11 checks + 2000 random playthroughs
npm run build       # rebuilds game/dist/mars-outpost.html (single file, works offline)
npm run export-data # regenerates game/data/*.json from game/src/game/content.js
```
Details in [game/README.md](game/README.md).

## Publish on GitHub Pages
1. In the repository go to **Settings → Pages**.
2. Under *Build and deployment*, choose **Deploy from a branch**, branch `main`, folder `/ (root)`. (The repository must be **public**: GitHub Pages is free for public repositories.)
3. After a minute the game opens at `https://<user>.github.io/<repository>/` (the root `index.html` redirects to the game). Put that link in the **Play** section above.

## Documentation
Start with [docs/README.md](docs/README.md). Prototype rules: [docs/prototype.md](docs/prototype.md).

## Team
| Name | Rol |
|---|---|
| Nahomi Tlapanco Vélez | Business Model and Pitch |
| Natalia Urban Castillo | Prototype development |
| Valeria de la Rosa Alejandro | Data and source verification; Video game development in JavaScript |

## License
- Music (`game/assets/audio/music.mp3`): original song by the team. 

