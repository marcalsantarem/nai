// Estado do jogo em memória. Campos com os nomes do formato salvo (arquitetura, M3.6).
// load/save em 'nais-cafe-v1' entram na T-026.
import { START_COINS, LEVELS, INITIAL_DECOR } from './data.js';

const copyDecor = (d) => ({
  items: d.items.map((it) => ({ ...it })),
  wallItems: d.wallItems.map((it) => ({ ...it })),
  stock: { ...d.stock },
  wall: d.wall,
  floor: d.floor,
});

const initial = () => ({ coins: START_COINS, served: 0, count: 0, ...copyDecor(INITIAL_DECOR) });

let state = initial();
const listeners = new Set();

function send(ev) {
  for (const fn of [...listeners]) {
    try { fn(ev); } catch (e) { console.error(e); } // um ouvinte com erro não para os outros
  }
}

function emit(type, delta) { send({ type, value: state[type], delta }); }

// Leitura apenas.
export function get() { return state; }

export function addCoins(n) {
  const d = Math.round(Number(n) || 0);
  if (!d) return;
  state.coins += d;
  emit('coins', d);
}

// Desconta moedas da compra. Sem moedas suficientes: false e nada muda.
export function spend(n) {
  const d = Math.round(Number(n) || 0);
  if (d < 0 || state.coins < d) return false;
  if (!d) return true;
  state.coins -= d;
  emit('coins', -d);
  return true;
}

export function incServed() { state.served += 1; emit('served', 1); }
export function incCount() { state.count += 1; emit('count', 1); }

// Troca campos da decoração ({ items, wallItems, stock, wall, floor }); só decor.js chama.
// Evento { type: 'decor', change }.
export function setDecor(patch = {}, change = 'set') {
  let changed = false;
  for (const k of ['items', 'wallItems', 'stock', 'wall', 'floor']) {
    if (patch[k] !== undefined) { state[k] = patch[k]; changed = true; }
  }
  if (changed) send({ type: 'decor', change });
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Volta aos valores iniciais e avisa cada campo.
export function reset() {
  const old = state;
  state = initial();
  for (const k of ['coins', 'served', 'count']) emit(k, state[k] - old[k]);
  send({ type: 'decor', change: 'reset' });
}

// Nível pelos marcos de LEVELS (decisão 23): 1 + marcos atingidos.
export function levelFor(served) {
  let lv = 1;
  for (const m of LEVELS) if (served >= m) lv += 1;
  return lv;
}

export function getLevel() { return levelFor(state.served); }
