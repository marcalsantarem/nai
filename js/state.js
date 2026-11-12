// Estado do jogo em memória (M2). O M3 acrescenta load/save em 'nais-cafe-v1'.
import { START_COINS, LEVELS } from './data.js';

const initial = () => ({ coins: START_COINS, served: 0, count: 0 });

let state = initial();
const listeners = new Set();

function emit(type, delta) {
  const ev = { type, value: state[type], delta };
  for (const fn of [...listeners]) {
    try { fn(ev); } catch (e) { console.error(e); } // um ouvinte com erro não para os outros
  }
}

// Leitura apenas.
export function get() { return state; }

export function addCoins(n) {
  const d = Math.round(Number(n) || 0);
  if (!d) return;
  state.coins += d;
  emit('coins', d);
}

export function incServed() { state.served += 1; emit('served', 1); }
export function incCount() { state.count += 1; emit('count', 1); }

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Volta aos valores iniciais e avisa cada campo.
export function reset() {
  const old = state;
  state = initial();
  for (const k of ['coins', 'served', 'count']) emit(k, state[k] - old[k]);
}

// Nível pelos marcos de LEVELS (decisão 23): 1 + marcos atingidos.
export function levelFor(served) {
  let lv = 1;
  for (const m of LEVELS) if (served >= m) lv += 1;
  return lv;
}

export function getLevel() { return levelFor(state.served); }
