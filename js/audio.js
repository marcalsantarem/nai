// Som do jogo (T-038): chuva, música ambiente e efeitos curtos, tudo por Web Audio.
// API (arquitetura M4.2): unlock(), setMusic(on), setRain(on), sfx('step' | 'coins' | 'place').
// Nada toca antes do primeiro toque (unlock). Liga/desliga parte de state.settings.
import * as state from './state.js';

const FADE = 0.6;            // entrada/saída da chuva (s)
const RAIN_VOL = 0.07;
const RAIN_HP = 700;
const RAIN_LP = 5200;
const BEAT = 0.64;           // um tempo a cada 640 ms
const MUSIC_LP = 1800;
const MUSIC_VOL = 0.12;      // volume baixo do barramento da música
const MUSIC_FADE = 0.4;
const LOOKAHEAD = 0.3;       // agenda notas até 300 ms à frente
const TICK_MS = 100;

// Acordes (MIDI): baixo no 1º tempo, notas triangulares nos tempos 2 a 4.
const CHORDS = [
  { bass: 45, notes: [60, 64, 67] }, // Am7: A | C E G
  { bass: 41, notes: [57, 60, 64] }, // Fmaj7: F | A C E
  { bass: 48, notes: [64, 67, 71] }, // Cmaj7: C | E G B
  { bass: 43, notes: [59, 62, 64] }, // G6: G | B D E
];
const BEATS_PER_CHORD = 4;

const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

let ctx = null;
let master = null;
let rainBus = null;
let rainIn = null;
let rainSrc = null;
let noise = null;
let musicBus = null;
let musicIn = null;
let timer = null;
let nextTime = 0;
let beat = 0;
let wantMusic = true;
let wantRain = true;
let rainOn = false;
let musicOn = false;

function readSettings() {
  try {
    const s = state.get().settings || {};
    wantMusic = s.music !== false;
    wantRain = s.rain !== false;
  } catch { /* sem estado: padrão ligado */ }
}

const hidden = () => typeof document !== 'undefined' && document.visibilityState === 'hidden';

// Rampa linear a partir do valor atual (sem salto).
function ramp(param, to, dur) {
  const t = ctx.currentTime;
  param.cancelScheduledValues(t);
  param.setValueAtTime(param.value, t);
  param.linearRampToValueAtTime(to, t + dur);
}

function build() {
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);

  // Chuva: ruído -> passa-alta 700 -> passa-baixa 5200 -> ganho -> saída.
  rainIn = ctx.createBiquadFilter();
  rainIn.type = 'highpass';
  rainIn.frequency.value = RAIN_HP;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = RAIN_LP;
  rainBus = ctx.createGain();
  rainBus.gain.value = 0;
  rainIn.connect(lp);
  lp.connect(rainBus);
  rainBus.connect(master);

  // Ruído branco de 2 s, reaproveitado em laço.
  const len = Math.floor(ctx.sampleRate * 2);
  noise = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  // Música: notas -> passa-baixa 1800 -> ganho baixo -> saída.
  musicIn = ctx.createBiquadFilter();
  musicIn.type = 'lowpass';
  musicIn.frequency.value = MUSIC_LP;
  musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  musicIn.connect(musicBus);
  musicBus.connect(master);

  // iOS antigo: tocar um buffer mudo no gesto destrava a saída.
  try {
    const s = ctx.createBufferSource();
    s.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    s.connect(ctx.destination);
    s.start(0);
  } catch { /* ignora */ }
  return true;
}

// ---------- Chuva ----------

function startRain() {
  if (rainOn) return;
  rainOn = true;
  if (!rainSrc) {
    rainSrc = ctx.createBufferSource();
    rainSrc.buffer = noise;
    rainSrc.loop = true;
    rainSrc.connect(rainIn);
    rainSrc.start();
  }
  ramp(rainBus.gain, RAIN_VOL, FADE);
}

function stopRain() {
  if (!rainOn) return;
  rainOn = false;
  ramp(rainBus.gain, 0, FADE);
  // Para a fonte depois da saída suave (poupa CPU).
  const src = rainSrc;
  rainSrc = null;
  try { src.stop(ctx.currentTime + FADE + 0.05); } catch { /* ignora */ }
}

// ---------- Música ----------

function note(type, midi, t, peak, dur) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq(midi);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(musicIn);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function scheduleBeat(t) {
  const chord = CHORDS[Math.floor(beat / BEATS_PER_CHORD) % CHORDS.length];
  const pos = beat % BEATS_PER_CHORD;
  if (pos === 0) note('sine', chord.bass, t, 0.5, BEAT * 2);
  else note('triangle', chord.notes[pos - 1], t, 0.28, BEAT * 1.4);
  beat = (beat + 1) % (BEATS_PER_CHORD * CHORDS.length);
}

function tick() {
  if (!ctx || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  if (nextTime < now) nextTime = now + 0.05; // voltou de pausa: não acumula notas
  while (nextTime < now + LOOKAHEAD) {
    scheduleBeat(nextTime);
    nextTime += BEAT;
  }
}

function runScheduler(on) {
  if (on && !timer) {
    nextTime = 0;
    tick();
    timer = setInterval(tick, TICK_MS);
  } else if (!on && timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startMusic() {
  if (musicOn) return;
  musicOn = true;
  beat = 0;
  ramp(musicBus.gain, MUSIC_VOL, MUSIC_FADE);
  runScheduler(!hidden());
}

function stopMusic() {
  if (!musicOn) return;
  musicOn = false;
  ramp(musicBus.gain, 0, MUSIC_FADE);
  runScheduler(false);
}

// ---------- Estado e ciclo de vida ----------

function apply() {
  if (!ctx) return;
  if (wantRain) startRain(); else stopRain();
  if (wantMusic) startMusic(); else stopMusic();
}

function resume() {
  if (!ctx || hidden()) return;
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
  runScheduler(musicOn);
}

function onVisibility() {
  if (!ctx) return;
  if (hidden()) {
    runScheduler(false);
    ctx.suspend().catch(() => {});
  } else resume();
}

let hooked = false;
function hook() {
  if (hooked) return;
  hooked = true;
  try {
    document.addEventListener('visibilitychange', onVisibility);
    addEventListener('pageshow', resume);
    addEventListener('focus', resume);
  } catch { /* sem window */ }
  // Ajustes ou "Recomeçar do zero" mudam settings: segue o estado salvo.
  try {
    state.subscribe(() => {
      const m = wantMusic, r = wantRain;
      readSettings();
      if (m !== wantMusic || r !== wantRain) apply();
    });
  } catch { /* ignora */ }
}

// Chamar em todo pointerdown: o primeiro cria o contexto; os outros retomam
// se o sistema suspendeu (ex.: interrupção no iOS). Barato quando já tocando.
export function unlock() {
  if (ctx) {
    if (ctx.state !== 'running' && !hidden()) resume();
    return;
  }
  try {
    if (!build()) return;
  } catch (e) { console.error(e); ctx = null; return; }
  readSettings();
  hook();
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
  apply();
}

export function setMusic(on) {
  wantMusic = !!on;
  apply();
}

export function setRain(on) {
  wantRain = !!on;
  apply();
}

// Efeitos curtos e suaves, direto na saída (independem de música e chuva).
export function sfx(name) {
  if (!ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime + 0.01;
  const blip = (type, f0, f1, at, peak, dur) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, at);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, at + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g);
    g.connect(master);
    o.start(at);
    o.stop(at + dur + 0.03);
  };
  if (name === 'step') blip('sine', freq(81), freq(81), t, 0.08, 0.14); // A5 curto
  else if (name === 'coins') {
    blip('triangle', freq(88), freq(88), t, 0.06, 0.12);               // E6
    blip('triangle', freq(93), freq(93), t + 0.08, 0.06, 0.2);         // A6
  } else if (name === 'place') blip('sine', 260, 170, t, 0.12, 0.18);  // toque grave
}
