# Status and roadmap

## Design
- [x] Concept, stations and resources
- [x] Expedition, laboratory and final mission rules
- [x] Solar storm and dust storm events
- [x] Minimum food to open the Expedition (3 out of 5)
- [x] Final numbers for chances, costs and timers
- [x] Playtest with about 10 people aged 15–40 (no changes were needed)
- [ ] Playtest with children aged 7–15
- [ ] More events (new events need an official source listed in `CREDITS.md`)

## Prototype
- [x] Playable Twine prototype in `game/prototype/` (see [prototype.md](prototype.md))
- [x] Rules ported to the JavaScript game

## Game code (`game/`)
- [x] Engine: meters, rules, random events, probabilities (single day, no sols)
- [x] Tap map and stations, as in the prototype
- [x] Pop-up windows
- [x] Random event pop-ups over the map with a decision timer (solar storm, dust storm)
- [x] Food requirement for the Expedition
- [x] Dead-end detection (the lab wipes the data) with a restart offer
- [x] "Is this real?" science panel and a sources button
- [x] Launch Day mission log (*What you protected* / *What it cost*)
- [x] Music and sounds (see [audio.md](audio.md))
- [x] Automated checks (`npm test`) and single-file build (`npm run build`)

## Documentation
- [x] README, credits, design docs, audio plan and music credit
- [x] Demo slides and 30-second demo video

## Before submitting
- [x] Fill in the team and roles in `README.md`
- [x] Publish on GitHub Pages and put the link in the README


## Future ideas (not part of this version)
- Connect to live challenge data services such as DONKI, with a clear "live" label
- More sites (Moon) and more events
- Teacher guide for classrooms
