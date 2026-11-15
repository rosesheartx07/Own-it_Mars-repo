// Background music from assets/audio/music.mp3 (our own song) and sound effects made in code with the Web Audio API.
// Low default volume, always-visible mute button, and audio only starts after the first tap (docs/audio.md).

let ctx = null, master = null, musicGain = null, alarmTimer = null, musicNodes = [];
let muted = false;
try { muted = localStorage.getItem('mars-muted') === '1'; } catch (e) { /* storage not available */ }

export function isMuted() { return muted; }

export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return; }
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.35;
    master.connect(ctx.destination);
    startMusic();
  } catch (e) { ctx = null; }
}

export function setMuted(m) {
  muted = m;
  try { localStorage.setItem('mars-muted', m ? '1' : '0'); } catch (e) { /* ignore */ }
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.35, ctx.currentTime, 0.05);
}

function tone(freq, start, dur, type = 'sine', vol = 0.3, slideTo = null) {
  if (!ctx) return;
  const t = ctx.currentTime + start;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master);
  o.start(t); o.stop(t + dur + 0.05);
}

export const sfx = {
  tap() { tone(660, 0, 0.08, 'triangle', 0.25); tone(990, 0.05, 0.08, 'triangle', 0.18); },
  good() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.22)); },
  // Soft, friendly sound after every choice: every option has a cost, so no choice should sound like a mistake.
  chime() { tone(784, 0, 0.35, 'sine', 0.2); tone(1175, 0.12, 0.5, 'sine', 0.16); tone(1568, 0.24, 0.6, 'triangle', 0.06); },
  bad() { tone(330, 0, 0.25, 'sawtooth', 0.12, 220); tone(247, 0.2, 0.35, 'sawtooth', 0.1, 165); },
  tick() { tone(1200, 0, 0.04, 'square', 0.06); },
  launch() { tone(110, 0, 2.2, 'sawtooth', 0.12, 880); [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 1 + i * 0.12, 0.4, 'triangle', 0.18)); },
};

export function startAlarm() {
  stopAlarm();
  const beep = () => { tone(880, 0, 0.18, 'square', 0.1); tone(660, 0.22, 0.18, 'square', 0.1); };
  beep();
  alarmTimer = setInterval(beep, 1400);
}
export function stopAlarm() { if (alarmTimer) clearInterval(alarmTimer); alarmTimer = null; }

// Background music: "Alone in Space with Only Your Descriptions" (original, by the team).
// It plays in a gapless loop through Web Audio, so the mute button and the storm "quiet" mode also apply to it.
// The build (tools/build.mjs) replaces this path with the file embedded as a data URI.
export const MUSIC_SRC = 'assets/audio/music.mp3';
const MUSIC_VOLUME = 0.55; // music level under master volume; sound effects stay louder

async function loadMusic() {
  if (MUSIC_SRC.startsWith('data:')) {
    const bin = atob(MUSIC_SRC.slice(MUSIC_SRC.indexOf(',') + 1));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }
  const res = await fetch(MUSIC_SRC);
  if (!res.ok) throw new Error('music not found');
  return res.arrayBuffer();
}

function startMusic() {
  if (!ctx) return;
  musicGain = ctx.createGain();
  musicGain.gain.value = 0;
  musicGain.connect(master);
  loadMusic()
    .then(buf => ctx.decodeAudioData(buf))
    .then(buffer => {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true; // starts again from the beginning when the song ends
      src.connect(musicGain);
      src.start();
      musicGain.gain.setTargetAtTime(MUSIC_VOLUME, ctx.currentTime, 0.8); // gentle fade-in
      musicNodes.push(src);
    })
    .catch(() => startSynthMusic()); // if the file can't load, fall back to the music made in code
}

// Fallback: a soft pad with a slow, simple melody, made in code.
function startSynthMusic() {
  musicGain.gain.value = 0.08;
  const chords = [[220, 277, 330], [196, 247, 294], [175, 220, 262], [196, 247, 330]];
  const melody = [659, 587, 523, 587, 659, 784, 659, 587];
  let step = 0;
  const playBar = () => {
    const chord = chords[step % chords.length];
    const t = ctx.currentTime;
    chord.forEach(f => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.5, t + 1.2);
      g.gain.linearRampToValueAtTime(0.0001, t + 4);
      o.connect(g); g.connect(musicGain); o.start(t); o.stop(t + 4.1);
    });
    [0, 1].forEach(i => {
      const f = melody[(step * 2 + i) % melody.length];
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      const s = t + i * 1.8 + 0.4;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.linearRampToValueAtTime(0.35, s + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 1.4);
      o.connect(g); g.connect(musicGain); o.start(s); o.stop(s + 1.5);
    });
    step++;
  };
  playBar();
  setInterval(playBar, 3600);
  synthMode = true;
}
let synthMode = false;

export function musicQuiet(quiet) {
  if (!musicGain || !ctx) return;
  const normal = synthMode ? 0.08 : MUSIC_VOLUME;
  musicGain.gain.setTargetAtTime(quiet ? normal * 0.25 : normal, ctx.currentTime, 0.3);
}
