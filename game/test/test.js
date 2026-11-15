// Automated checks for the engine and content. Run: npm test (or node tests/test.js)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { newState, resolveOption, launchStatus, isStuck, rollEvent, METERS } from '../src/engine/engine.js';
import { STATIONS, LAB, EVENTS } from '../src/game/content.js';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('✓', name); };
const fixed = v => () => v; // rng that always returns v
const st = id => STATIONS.find(s => s.id === id);
const opt = (s, id) => s.options.find(o => o.id === id);

test('starting meters match the prototype', () => {
  const s = newState();
  assert.deepEqual(s.meters, { energy: 10, food: 5, equipment: 5, health: 5, time: 5, data: 0 });
});

test('meters never go below 0 or above max', () => {
  const s = newState();
  resolveOption(s, { id: 'x', base: { effects: { energy: 50, food: -50 } } });
  assert.equal(s.meters.energy, METERS.energy.max);
  assert.equal(s.meters.food, 0);
});

test('habitat partial: roll 1–25 network, 26–50 comms, else nothing', () => {
  const o = opt(st('habitat'), 'life_support_only');
  let s = newState(); resolveOption(s, o, fixed(0.10)); assert.ok(s.flags.network_failed);
  s = newState(); resolveOption(s, o, fixed(0.40)); assert.ok(s.flags.comms_failed);
  s = newState(); resolveOption(s, o, fixed(0.90)); assert.ok(!s.flags.network_failed && !s.flags.comms_failed);
  assert.equal(s.meters.energy, 9);
});

test('expedition without suit can end the game', () => {
  const s = newState();
  const r = resolveOption(s, opt(st('expedition'), 'no_suit'), fixed(0.2), 'expedition_done');
  assert.equal(r.gameOver, true);
  assert.equal(s.meters.health, 0);
});

test('expedition with suit gives all the data', () => {
  const s = newState();
  resolveOption(s, opt(st('expedition'), 'suit_stay_longer'), fixed(0.5), 'expedition_done');
  assert.equal(s.meters.data, 5);
  assert.equal(s.meters.health, 4);
});

test('fast lab analysis can wipe data and the game detects the dead end', () => {
  const s = newState();
  resolveOption(s, opt(st('expedition'), 'suit_stay_longer'), fixed(0.5), 'expedition_done');
  resolveOption(s, LAB.options[0], fixed(0.05));
  assert.equal(s.meters.data, 0);
  assert.equal(isStuck(s), true);
});

test('a careful full run can launch', () => {
  const s = newState();
  const safe = fixed(0.99);
  resolveOption(s, opt(st('habitat'), 'service_all'), safe, 'habitat_done');
  resolveOption(s, opt(st('greenhouse'), 'control_all'), safe, 'greenhouse_done');
  resolveOption(s, opt(st('solar_panels'), 'disconnect_all'), safe, 'storm_done');
  resolveOption(s, opt(st('robot_garage'), 'all_jobs'), safe, 'garage_done');
  resolveOption(s, opt(st('expedition'), 'suit_stay_longer'), safe, 'expedition_done');
  resolveOption(s, LAB.options[1], safe);
  assert.equal(launchStatus(s).ok, true, JSON.stringify(s.meters));
});

test('events happen at most once, and the solar storm is skipped after Solar panels', () => {
  const s = newState();
  s.flags.storm_done = true;
  const e1 = rollEvent(s, EVENTS, fixed(0));
  assert.equal(e1.id, 'dust_storm');
  assert.equal(rollEvent(s, EVENTS, fixed(0)), null);
});

test('every option has a label and every event has a valid timeout option', () => {
  for (const s of [...STATIONS, LAB]) for (const o of s.options || []) assert.ok(o.label && o.id);
  for (const e of EVENTS) assert.ok(e.options.some(o => o.id === e.timeoutOption));
});

test('data/*.json match src/game/content.js (run npm run export-data if this fails)', () => {
  const read = f => JSON.parse(readFileSync(new URL('../data/' + f, import.meta.url), 'utf8'));
  const same = (a, b) => assert.deepEqual(JSON.parse(JSON.stringify(a)), b);
  same(EVENTS, read('events.json').events);
  same(STATIONS, read('stations.json').stations);
  same(LAB, read('stations.json').laboratory);
});

test('random playthroughs never crash', () => {
  for (let n = 0; n < 2000; n++) {
    const s = newState();
    for (const station of STATIONS.filter(x => x.options)) {
      const o = station.options[Math.floor(Math.random() * station.options.length)];
      resolveOption(s, o, Math.random, station.doneFlag);
      const ev = rollEvent(s, EVENTS);
      if (ev) resolveOption(s, ev.options[Math.floor(Math.random() * ev.options.length)], Math.random, ev.doneFlag);
    }
    for (const v of Object.values(s.meters)) assert.ok(v >= 0);
    launchStatus(s); isStuck(s);
  }
});

console.log(`\n${passed} checks passed`);
