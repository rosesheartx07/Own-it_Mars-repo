// Exports the game content in src/game/content.js to data/events.json and data/stations.json.
// content.js is the single source of truth: edit it, then run `npm run export-data`.
// `npm test` fails if the JSON files are out of date. Usage: node tools/export-data.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATIONS, LAB, EVENTS } from '../src/game/content.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const note = 'Generated from src/game/content.js by tools/export-data.mjs. Do not edit by hand. '
  + 'Probabilities (p, eventProbability), costs (effects) and timers (decisionSeconds) are game design values, not NASA data.';

const write = (file, data) => writeFileSync(join(root, 'data', file), JSON.stringify({ _note: note, ...data }, null, 2) + '\n');
write('events.json', { events: EVENTS });
write('stations.json', { stations: STATIONS, laboratory: LAB });
console.log('data/events.json and data/stations.json written');
