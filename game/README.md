# Game

All game code, data and assets live here.

```
index.html  the game for development (loads the modules in src/)
src/
  engine/   engine.js: meters, rules, random events (no graphics, tested with Node)
  game/     content.js: stations, options, texts and sources. SOURCE OF TRUTH for the content
  ui/       ui.js (map, pop-up windows, meters bar, event pop-ups), art.js (SVG drawings), audio.js (music and sounds), style.css
data/       events.json, stations.json: GENERATED from content.js (do not edit by hand)
test/       test.js: automated checks (npm test)
tools/      build.mjs (builds dist/), export-data.mjs (writes data/*.json)
dist/       built single-file game: mars-outpost.html
prototype/  raw Twine version (Mission Trainer.twee) used to test the rules
assets/     audio/music.mp3 (our song). sprites, tilemaps and ui are empty: the art is SVG and the sound effects are made in code
```

## Play it
- **Easiest:** open `dist/mars-outpost.html` in a browser (double-click works, no server needed).
- **While developing:** `index.html` uses ES modules, so it needs a local server, for example `npx serve .` or `python3 -m http.server`, then open `http://localhost:8000`.

## Commands (Node 18+)
```
npm test              # engine checks, data/content sync check and 2000 random playthroughs
npm run build         # rebuilds dist/mars-outpost.html
npm run export-data   # regenerates data/events.json and data/stations.json
```

## Where to change things
- Probabilities, costs, timers and texts: `src/game/content.js`. Then run `npm run export-data` and `npm run build`. `npm test` fails if `data/*.json` are out of date.
- Starting meters, minimum food for the Expedition and launch rules: `METERS` and `RULES` in `src/engine/engine.js`.
- Music: replace `assets/audio/music.mp3` and run `npm run build` (see `../docs/audio.md`).

## Notes
- The page loads the font Baloo 2 from Google Fonts when the player is online. Offline, the browser uses a system font and everything else still works.
- The game stores only one thing in the browser: whether sound is muted.
- It makes no network calls, uses no accounts and collects no data.

