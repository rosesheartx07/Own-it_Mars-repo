// UI: tap map, pop-up windows, meters bar and random event pop-ups.
import { METERS, RULES, newState, resolveOption, launchStatus, isStuck, rollEvent } from '../engine/engine.js';
import { STATIONS, LAB, EVENTS, LAUNCH_LOG, GAME_OVER, MISSING_TEXT, SOURCES } from '../game/content.js';
import { ART, MAP_SVG } from './art.js';
import * as audio from './audio.js';

let state = newState();
let pendingRoll = false;
let eventTimer = null;

const $ = sel => document.querySelector(sel);
const app = () => $('#screen');
const station = id => STATIONS.find(s => s.id === id);

// ---------- helpers ----------
function paragraphs(items) {
  return items.map(p => typeof p === 'string' ? `<p>${p}</p>` : `<ol>${p.list.map(li => `<li>${li}</li>`).join('')}</ol>`).join('');
}
function btn(label, action, cls = '') { return `<button class="btn ${cls}" data-action="${action}">${label}</button>`; }
function sourceLink(src) {
  return `<a href="${src.url}" target="_blank" rel="noopener">${src.publisher} — “${src.title}”</a>`;
}
function scienceCard(science) {
  if (!science) return '';
  return `<details class="science" open>
    <summary>🔭 Is this real? The science behind it</summary>
    <p>${science.text}</p>
    <p class="src">Source: ${sourceLink(science.source)}${science.extraSource ? `<br>Also: ${sourceLink(science.extraSource)}` : ''}</p>
  </details>`;
}
function deltaChips(deltas) {
  const items = Object.entries(deltas).filter(([, d]) => d !== 0);
  if (!items.length) return '<p class="nochange">Your meters did not change.</p>';
  return `<div class="chips">${items.map(([k, d]) => `<span class="chip ${d > 0 ? 'up' : 'down'}">${METERS[k].icon} ${METERS[k].label} ${d > 0 ? '+' : '−'}${Math.abs(d)}</span>`).join('')}</div>`;
}

// ---------- meters ----------
function renderMeters(deltas = {}) {
  const el = $('#meters');
  el.innerHTML = Object.entries(METERS).map(([k, m]) => {
    const v = state.meters[k];
    const pct = (v / m.max) * 100;
    const low = v <= Math.ceil(m.max * 0.2) && k !== 'data';
    const d = deltas[k];
    return `<div class="meter ${low ? 'low' : ''}" title="${m.label}: ${v} of ${m.max}">
      <span class="m-icon">${m.icon}</span>
      <span class="m-body"><span class="m-label"><span class="m-name">${m.label}</span> <b>${v}/${m.max}</b></span>
      <span class="m-bar"><span class="m-fill m-${k}" style="width:${pct}%"></span></span></span>
      ${d ? `<span class="m-delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : '−'}${Math.abs(d)}</span>` : ''}
    </div>`;
  }).join('');
}

// ---------- screens ----------
function showStart() {
  $('#hud').hidden = true;
  app().innerHTML = `<section class="card start">
    <div class="start-art">${ART.ship}</div>
    <h1>🚀 Own it: Mars</h1>
    <p class="tagline">Survive Mars with real science.</p>
    <p class="lead">Welcome, Astronaut!</p>
    <p>You are living at a base on Mars. Your job is to keep the crew, the food, the power, and the equipment safe.</p>
    <p class="star">⭐ Remember: in space, every choice has a cost and you must own the consequences. There is no perfect answer. You decide what to protect, and you live with what happens next.</p>
    <p class="hint">Watch out: storms can arrive at any moment, and you will only have a few seconds to decide!</p>
    <div class="row">${btn('Start my mission', 'start', 'big')}${btn('📚 Sources', 'sources', 'ghost')}</div>
  </section>`;
}

function showMap() {
  closeWindow();
  $('#hud').hidden = false;
  renderMeters();
  const done = RULES.launchStations.filter(f => state.flags[f]).length;
  const ls = launchStatus(state);
  const places = STATIONS.map(s => {
    let badge = '';
    if (s.id === 'expedition') badge = state.flags.lab_done ? '✅' : state.flags.expedition_done ? '🔬' : '';
    else if (s.id === 'spaceship') badge = ls.ok ? '✨' : '';
    else if (state.flags[s.doneFlag]) badge = '✅';
    const ready = s.id === 'spaceship' && ls.ok ? 'ready' : '';
    return `<button class="place ${badge === '✅' ? 'done' : ''} ${ready}" data-action="open:${s.id}" style="left:${s.pos.x}%;top:${s.pos.y}%">
      <span class="place-art">${ART[s.art]}</span>
      <span class="place-label">${s.name}${badge ? ` <span class="badge">${badge}</span>` : ''}</span>
    </button>`;
  }).join('');
  const stuck = isStuck(state);
  app().innerHTML = `<section class="map-wrap">
    <div class="mars-map">${MAP_SVG}${places}</div>
    <div class="map-foot">
      <p>${ls.ok ? '🚀 The base is ready. Go to the Spaceship to launch!' : 'Tap a place on the map to explore Mars!'}</p>
      <p class="progress">Base tasks done: <b>${done}/5</b>${state.flags.expedition_done && !state.flags.lab_done && !stuck ? ' · 🔬 Your data is waiting at the lab (Expedition)' : ''}</p>
      ${stuck ? `<div class="stuck">⚠️ The ship can never launch now: ${launchStatus(state).missingMeters.map(k => METERS[k].label).join(', ')} ran out. ${btn('Try the mission again', 'restart', 'small')}</div>` : ''}
    </div>
  </section>`;
  if (pendingRoll) {
    pendingRoll = false;
    setTimeout(maybeEvent, 700);
  }
}

// ---------- pop-up windows ----------
function openWindow(html, cls = '') {
  const w = $('#window');
  w.className = `overlay ${cls}`;
  w.innerHTML = `<div class="window" role="dialog" aria-modal="true">${html}</div>`;
  w.hidden = false;
  w.querySelector('.window').scrollTop = 0;
}
function closeWindow() { const w = $('#window'); w.hidden = true; w.innerHTML = ''; }
function windowHead(art, title, closable = true) {
  return `<header class="w-head"><span class="w-art">${ART[art]}</span><h2>${title}</h2>${closable ? '<button class="x" data-action="map" aria-label="Back to map">✕</button>' : ''}</header>`;
}

function openStation(id) {
  const s = station(id);
  if (id === 'spaceship') return openShip();
  let body = paragraphs(s.intro);
  let actions = '';
  const done = state.flags[s.doneFlag];
  if (id === 'expedition') {
    if (done) {
      body += `<p class="status">${s.doneText}</p>`;
      actions = btn('Go to the lab', 'lab', 'big');
    } else if (state.meters.food < RULES.minFoodForExpedition) {
      body += `<p class="status locked">🔒 The crew needs at least ${RULES.minFoodForExpedition} food to go out on an expedition, and you have ${state.meters.food}. Food only grows in the Greenhouse.</p>`;
      actions = state.flags.greenhouse_done ? '' : btn('🌱 Go to the Greenhouse', 'open:greenhouse');
    } else actions = btn(s.startLabel, `mission:${id}`, 'big');
  } else if (done) {
    body += `<p class="status">${s.doneText}</p>`;
  } else {
    if (s.alarm) body += `<p class="alarm">🚨 ${s.alarm}</p>`;
    actions = btn(s.startLabel, `mission:${id}`, 'big');
  }
  openWindow(`${windowHead(s.art, s.title)}<div class="w-body">${body}</div><div class="w-actions">${actions}${btn('Back to map', 'map', 'ghost')}</div>`);
}

function openMission(id) {
  const s = station(id);
  const opts = s.options.map((o, i) => btn(o.label, `choose:${id}:${i}`, 'option')).join('');
  openWindow(`${windowHead(s.art, s.promptTitle || s.title)}<div class="w-body">${paragraphs(s.prompt)}</div>
    <div class="w-actions col">${opts}</div>
    <div class="w-actions">${btn('Back to map', 'map', 'ghost')}</div>`);
}

function choose(id, index) {
  const s = station(id);
  const option = s.options[index];
  const res = resolveOption(state, option, Math.random, s.doneFlag);
  pendingRoll = true;
  const extra = id === 'expedition' && !res.gameOver ? btn('Go to the lab', 'lab', 'big') : '';
  showResult(s.art, s.title, res, s.science, extra);
}

function showResult(art, title, res, science, extraButtons = '') {
  renderMeters(res.deltas);
  if (res.gameOver) audio.sfx.bad(); else audio.sfx.chime();
  const next = res.gameOver ? btn('Continue', 'gameover', 'big') : `${extraButtons}${btn('Back to map', 'map', extraButtons ? 'ghost' : 'big')}`;
  openWindow(`${windowHead(art, title, false)}<div class="w-body">
      ${res.prefix ? `<p class="alarm">${res.prefix}</p>` : ''}
      ${res.texts.map(t => `<p>${t}</p>`).join('')}
      <h3>What changed</h3>${deltaChips(res.deltas)}
      ${res.gameOver ? '' : scienceCard(science)}
    </div><div class="w-actions">${next}</div>`, 'result');
}

// ---------- laboratory ----------
function openLab() {
  let body = paragraphs(LAB.intro);
  let actions = '';
  if (state.flags.lab_done) body += '<p class="status">The data is already on its way to Earth.</p>';
  else if (state.meters.data < 1) body += `<p class="status locked">The lab stays closed. There's no data to analyze.</p>`;
  else if (state.meters.energy < 1) body += `<p class="status locked">The lab stays closed. There's no energy to run the equipment.</p>`;
  else {
    body += `<p class="status">You have <b>${state.meters.data} of 5</b> pieces of data ready. They need to be analyzed and sent to Earth. Energy left: <b>${state.meters.energy}</b>.</p>`;
    actions = LAB.options.map((o, i) => o.needsEnergy && state.meters.energy < o.needsEnergy
      ? `<button class="btn option" disabled>${o.label}<small>Not enough energy for this option. You need at least ${o.needsEnergy}.</small></button>`
      : btn(o.label, `lab-choose:${i}`, 'option')).join('');
  }
  openWindow(`${windowHead(LAB.art, LAB.title)}<div class="w-body">${body}</div>
    <div class="w-actions col">${actions}</div><div class="w-actions">${btn('Back to map', 'map', 'ghost')}</div>`);
}
function labChoose(i) {
  const res = resolveOption(state, LAB.options[i], Math.random);
  pendingRoll = true;
  showResult(LAB.art, LAB.title, res, state.flags.lab_done ? LAB.science : null);
}

// ---------- spaceship ----------
function openShip() {
  const s = station('spaceship');
  const ls = launchStatus(state);
  let body = paragraphs(s.intro);
  let actions = '';
  if (ls.ok) {
    body += '<p class="status">The base is in order, and the ship has what it needs for the trip home.</p>';
    actions = btn('🚀 Start the launch sequence', 'launch', 'big');
  } else {
    body += '<p class="status locked">The ship can\'t launch yet.</p>';
    if (ls.missingStations.length) body += `<p>Work still to do at the base:</p><ul>${ls.missingStations.map(f => `<li>${MISSING_TEXT[f]}</li>`).join('')}</ul>`;
    if (ls.missingMeters.length) body += `<p>The trip home needs at least 1 of everything, and you're missing:</p><ul>${ls.missingMeters.map(k => `<li>${MISSING_TEXT[k]}</li>`).join('')}</ul>`;
    if (isStuck(state)) { body += '<p class="status locked">There is no way to get this back now. The mission can\'t be finished.</p>'; actions = btn('Try the mission again', 'restart', 'big'); }
  }
  openWindow(`${windowHead(s.art, s.title)}<div class="w-body">${body}</div><div class="w-actions">${actions}${btn('Back to map', 'map', 'ghost')}</div>`);
}

function showLaunch() {
  closeWindow();
  audio.sfx.launch();
  const prot = LAUNCH_LOG.protected.filter(([c]) => c(state)).map(([, t]) => `<li>${t}</li>`).join('');
  const cost = LAUNCH_LOG.cost.filter(([c]) => c(state)).map(([, t]) => `<li>${t}</li>`).join('') || '<li>Nothing went wrong. Lucky!</li>';
  app().innerHTML = `<section class="card end win">
    <div class="rocket-anim">${ART.ship}</div>
    <h1>Launch Day</h1>
    <p class="lead">The engines start, and the ship lifts off from Mars. The crew is on its way home.</p>
    <h3>This is your mission log</h3>
    <div class="log"><div><h4>🛡️ What you protected</h4><ul>${prot || '<li>Not much this time…</li>'}</ul></div>
    <div><h4>💥 What it cost</h4><ul>${cost}</ul></div></div>
    <p>Every choice you made protected something and cost something else. There was no perfect answer.</p>
    <p class="star">What would you protect next time?</p>
    <div class="row">${btn('Play again', 'restart', 'big')}${btn('📚 Sources', 'sources', 'ghost')}</div>
  </section>`;
}

function showGameOver() {
  closeWindow();
  stopEventTimer();
  const text = state.flags.died_radiation ? GAME_OVER.radiation : GAME_OVER.other;
  app().innerHTML = `<section class="card end lose">
    <h1>Mission over</h1>
    ${text.map((t, i) => `<p class="${i === 0 ? 'lead' : ''}">${t}</p>`).join('')}
    ${state.flags.died_radiation ? scienceCard({ text: 'Mars has a thin atmosphere, so much more radiation reaches the ground than on Earth. During a big solar storm in 2017, radiation on the Martian surface was twice as high as any earlier measurement.', source: SOURCES.solarStorm }) : ''}
    <p class="star">What would you protect first next time?</p>
    <div class="row">${btn('Try the mission again', 'restart', 'big')}</div>
  </section>`;
}

function showSources() {
  const list = Object.values(SOURCES).map(s => `<li>${sourceLink(s)}</li>`).join('');
  openWindow(`<header class="w-head"><h2>📚 Science sources</h2><button class="x" data-action="close" aria-label="Close">✕</button></header>
    <div class="w-body">
      <p>All the science in this game comes from official sources: NASA / JPL-Caltech and the Canadian Space Agency (CSA). It is curated text, not live data.</p>
      <ul class="sources">${list}</ul>
      <p class="small">The chances and costs in the game (like “50%” or “Energy −2”) are game design values, not NASA data. Content from CSA is credited to the Canadian Space Agency. NASA does not endorse any non-U.S. Government entity and is not responsible for information contained on non-U.S. Government websites.</p>
      <p class="small">🎵 Music: “Alone in Space with Only Your Descriptions”, an original song by our team.</p>
      <p class="small">Part of the content (maintenance, greenhouse, robotics, lab science) describes the International Space Station. The game uses it to explain ideas that also apply to future missions to Mars.</p>
    </div><div class="w-actions">${btn('Close', 'close', 'big')}</div>`);
}

// ---------- random events ----------
function maybeEvent() {
  if (!$('#window').hidden) return;
  const ev = rollEvent(state, EVENTS, Math.random);
  if (ev) showEvent(ev);
}

function stopEventTimer() { if (eventTimer) clearInterval(eventTimer); eventTimer = null; audio.stopAlarm(); audio.musicQuiet(false); }

function showEvent(ev) {
  audio.startAlarm();
  audio.musicQuiet(true);
  let left = ev.decisionSeconds;
  const opts = ev.options.map((o, i) => btn(o.label, `event:${ev.id}:${i}`, 'option')).join('');
  openWindow(`<header class="w-head alert-head"><span class="w-art">${ART[ev.art]}</span><h2>${ev.icon} ${ev.name}!</h2></header>
    <div class="w-body"><p class="alarm">🚨 ${ev.alert}</p>
      <div class="timer"><div class="timer-fill" style="animation-duration:${ev.decisionSeconds}s"></div><span class="timer-num">${left}s</span></div>
    </div><div class="w-actions col">${opts}</div>`, 'event');
  eventTimer = setInterval(() => {
    left--;
    const n = document.querySelector('.timer-num');
    if (n) n.textContent = `${Math.max(left, 0)}s`;
    if (left <= 5 && left > 0) audio.sfx.tick();
    if (left <= 0) {
      const i = ev.options.findIndex(o => o.id === ev.timeoutOption);
      resolveEvent(ev, i, true);
    }
  }, 1000);
}

function resolveEvent(ev, i, timedOut = false) {
  stopEventTimer();
  const res = resolveOption(state, ev.options[i], Math.random, ev.doneFlag);
  res.prefix = timedOut ? `⏰ ${ev.timeoutText}` : `You chose: ${ev.options[i].label}`;
  showResult(ev.art, ev.name, res, ev.science);
}

// ---------- input ----------
function restart() { stopEventTimer(); state = newState(); pendingRoll = false; showStart(); }

function handle(action) {
  const [cmd, a, b] = action.split(':');
  switch (cmd) {
    case 'start': state = newState(); pendingRoll = true; showMap(); break;
    case 'map': showMap(); break;
    case 'close': closeWindow(); break;
    case 'open': openStation(a); break;
    case 'mission': openMission(a); break;
    case 'choose': choose(a, +b); break;
    case 'lab': openLab(); break;
    case 'lab-choose': labChoose(+a); break;
    case 'event': resolveEvent(EVENTS.find(e => e.id === a), +b); break;
    case 'launch': showLaunch(); break;
    case 'gameover': showGameOver(); break;
    case 'restart': restart(); break;
    case 'sources': showSources(); break;
  }
}

export function init() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    audio.unlock();
    if (!el.dataset.action.startsWith('event') && !el.dataset.action.startsWith('choose') && !el.dataset.action.startsWith('lab-choose')) audio.sfx.tap();
    handle(el.dataset.action);
  });
  const mute = $('#mute');
  const paint = () => { mute.textContent = audio.isMuted() ? '🔇' : '🔊'; mute.setAttribute('aria-label', audio.isMuted() ? 'Turn sound on' : 'Mute'); };
  mute.addEventListener('click', e => { e.stopPropagation(); audio.unlock(); audio.setMuted(!audio.isMuted()); paint(); });
  paint();
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || $('#window').hidden || document.querySelector('.overlay.event, .overlay.result')) return;
    if ($('#hud').hidden) closeWindow(); else showMap();
  });
  showStart();
}

// for tests / debugging in the browser console
window.__mars = { get state() { return state; }, showEvent: id => showEvent(EVENTS.find(e => e.id === id)) };
