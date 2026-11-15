// Game engine: meters, rules and random events. No DOM here, so it can be tested with Node.
// All numbers are game design values (see docs/game-design.md), not NASA data.

export const METERS = {
  energy:    { label: 'Energy',    icon: '⚡', start: 10, max: 10 },
  food:      { label: 'Food',      icon: '🍎', start: 5,  max: 5 },
  equipment: { label: 'Equipment', icon: '🛠️', start: 5,  max: 5 },
  health:    { label: 'Health',    icon: '👩‍🚀', start: 5,  max: 5 },
  time:      { label: 'Time',      icon: '⏳', start: 5,  max: 5 },
  data:      { label: 'Data',      icon: '📊', start: 0,  max: 5 },
};

export const RULES = {
  // Minimum food to open the Expedition. Design value, to be tuned in playtests ([X]% in game-design.md).
  minFoodForExpedition: 3,
  // Each meter the ship needs (Equipment is not required, as in the prototype).
  launchNeeds: ['energy', 'food', 'health', 'time', 'data'],
  launchStations: ['habitat_done', 'greenhouse_done', 'storm_done', 'garage_done', 'expedition_done'],
};

export function newState() {
  const state = { meters: {}, flags: {}, eventsSeen: [], log: [] };
  for (const [k, m] of Object.entries(METERS)) state.meters[k] = m.start;
  return state;
}

const clamp = (v, max) => Math.max(0, Math.min(max, v));

// Applies { effects: {meter: delta}, set: {meter: value}, flags: [name] } and returns the real deltas.
export function applyOutcome(state, outcome, deltas = {}) {
  if (!outcome) return deltas;
  for (const [k, d] of Object.entries(outcome.effects || {})) {
    const before = state.meters[k];
    state.meters[k] = clamp(before + d, METERS[k].max);
    deltas[k] = (deltas[k] || 0) + (state.meters[k] - before);
  }
  for (const [k, v] of Object.entries(outcome.set || {})) {
    const before = state.meters[k];
    state.meters[k] = clamp(v, METERS[k].max);
    deltas[k] = (deltas[k] || 0) + (state.meters[k] - before);
  }
  for (const f of outcome.flags || []) state.flags[f] = true;
  return deltas;
}

// Resolves one option. rng() returns a number in [0, 1).
// mode "exclusive" (default): one roll 1–100, branches are checked in order with cumulative upper bounds (like the Twine prototype).
// mode "independent": each branch is rolled on its own (like the consequences in events.json).
export function resolveOption(state, option, rng = Math.random, doneFlag = null) {
  const texts = [];
  const deltas = {};
  if (doneFlag) state.flags[doneFlag] = true;
  if (option.base) {
    applyOutcome(state, option.base, deltas);
    if (option.base.text) texts.push(option.base.text);
  }
  const branches = option.branches || [];
  let hit = false;
  if (option.mode === 'independent') {
    for (const b of branches) {
      if (rng() * 100 < b.p) { hit = true; applyOutcome(state, b, deltas); texts.push(b.text); }
    }
  } else if (branches.length) {
    const roll = Math.floor(rng() * 100) + 1;
    let bound = 0;
    for (const b of branches) {
      bound += b.p;
      if (roll <= bound) { hit = true; applyOutcome(state, b, deltas); texts.push(b.text); break; }
    }
  }
  if (!hit && option.otherwise) {
    applyOutcome(state, option.otherwise, deltas);
    if (option.otherwise.text) texts.push(option.otherwise.text);
  }
  const result = { texts, deltas, gameOver: state.meters.health <= 0 };
  state.log.push({ option: option.id, deltas });
  return result;
}

export function launchStatus(state) {
  const missingStations = RULES.launchStations.filter(f => !state.flags[f]);
  const missingMeters = RULES.launchNeeds.filter(k => state.meters[k] < 1);
  return { ok: !missingStations.length && !missingMeters.length, missingStations, missingMeters };
}

// True when the ship can never launch any more, so the game can offer a restart
// (fixes the prototype loose end where the lab wipes the data).
export function isStuck(state) {
  const f = state.flags, m = state.meters;
  const canGain = {
    energy: !f.storm_done,          // "Disconnect everything" gives energy back
    food: !f.greenhouse_done,       // food only comes from the Greenhouse
    data: !f.expedition_done,       // data only comes from the Expedition
    health: false,
    time: false,
  };
  return RULES.launchNeeds.some(k => m[k] < 1 && !canGain[k]);
}

// Rolls for a random event (at the start and after each task). At most one event per roll, each event once.
export function rollEvent(state, events, rng = Math.random) {
  const pool = events.filter(e => !state.eventsSeen.includes(e.id) && !(e.skipIf && state.flags[e.skipIf]));
  // shuffle so both events get the same chance of going first
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  for (const e of pool) {
    if (rng() < e.eventProbability) { state.eventsSeen.push(e.id); return e; }
  }
  return null;
}
