// Estado do jogo, salvo em localStorage na chave 'nais-cafe-v1' (arquitetura, M3.6).
// Carrega ao importar o módulo; grava agrupado após cada mudança. Toda falha de leitura ou gravação é ignorada.
import {
  START_COINS, LEVELS, INITIAL_DECOR, DECOR_ITEMS, ROOM, TABLE_COLUMNS,
  WALL_SLOTS, WALL_COLORS, FLOORS, SAVE_VERSION, RECIPES, RECIPE_MILESTONES, REGULARS,
} from './data.js';

export const SAVE_KEY = 'nais-cafe-v1';
export const DEFAULT_NAME = "Nai's Cafe";
const NAME_MAX = 24; // decisão 16
const SAVE_DELAY = 250; // ms: agrupa as mudanças próximas numa gravação

const copyItem = (it) => ({ ...it });
const copyDecor = (d) => ({
  items: d.items.map(copyItem),
  wallItems: d.wallItems.map(copyItem),
  stock: { ...d.stock },
  wall: d.wall,
  floor: d.floor,
});

const initial = () => ({
  coins: START_COINS, served: 0, count: 0, name: DEFAULT_NAME,
  ...copyDecor(INITIAL_DECOR),
  regulars: {},
  settings: { music: true, rain: true },
});

// ---------- Validação do salvo ----------
const SIZE = 6;
// Sem protótipo: só os tipos do catálogo (constructor, __proto__, toString não passam; D1).
const ITEM = Object.assign(Object.create(null), Object.fromEntries(DECOR_ITEMS.map((d) => [d.id, d])));
const key = (c, r) => c + ',' + r;
const RESERVED = new Set(ROOM.reservedTiles.map(([c, r]) => key(c, r)));
const NO_STOOL = new Set((ROOM.noStoolTiles || []).map(([c, r]) => key(c, r)));
const inGrid = (c, r) => Number.isInteger(c) && Number.isInteger(r) && c >= 0 && r >= 0 && c < SIZE && r < SIZE;
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const count = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : null);
const FRAME_VARIANT = /^[a-z]{1,16}$/i;

function cleanName(v) {
  if (typeof v !== 'string') return null;
  const s = v.trim().slice(0, NAME_MAX);
  return s || null;
}

// Itens de chão e parede (mesmas regras de decor.js): tipo desconhecido é descartado;
// fora da grade, em reservado ou repetido vai para o estoque (respeitando o limit do tipo).
function cleanDecor(raw, base) {
  const stock = {};
  const owned = {};
  const keep = (type) => {
    const lim = ITEM[type].limit;
    if (lim && (owned[type] || 0) >= lim) return false;
    owned[type] = (owned[type] || 0) + 1;
    return true;
  };
  const toStock = (type) => { if (keep(type)) stock[type] = (stock[type] || 0) + 1; };

  let items = base.items;
  if (Array.isArray(raw.items)) {
    items = [];
    const solid = new Set();
    const rugs = new Set();
    const stools = new Set();
    for (const it of raw.items) {
      if (!isObj(it) || !ITEM[it.type]) continue;
      const d = ITEM[it.type];
      const { c, r } = it;
      const k = key(c, r);
      let ok = d.where === 'floor' && inGrid(c, r) && !RESERVED.has(k);
      let mine = [];
      if (ok && d.under) ok = !rugs.has(k);
      else if (ok) {
        ok = !solid.has(k) && !stools.has(k);
        if (ok && d.seats) {
          mine = [[c - 1, r], [c + 1, r]]; // banquinhos (decisão 28)
          ok = c >= TABLE_COLUMNS.min && c <= TABLE_COLUMNS.max && mine.every(([sc, sr]) => {
            const sk = key(sc, sr);
            return inGrid(sc, sr) && !NO_STOOL.has(sk) && !solid.has(sk) && !stools.has(sk);
          });
        }
      }
      if (!ok) { toStock(it.type); continue; }
      if (!keep(it.type)) continue;
      if (d.under) rugs.add(k);
      else {
        solid.add(k);
        for (const [sc, sr] of mine) stools.add(key(sc, sr));
      }
      items.push({ type: it.type, c, r });
    }
  } else {
    for (const it of items) owned[it.type] = (owned[it.type] || 0) + 1;
  }

  let wallItems = base.wallItems;
  if (Array.isArray(raw.wallItems)) {
    wallItems = [];
    const taken = new Set();
    for (const it of raw.wallItems) {
      if (!isObj(it) || !ITEM[it.type]) continue;
      const d = ITEM[it.type];
      const slots = WALL_SLOTS[d.band];
      const res = slots && slots.reserved && slots.reserved[it.wall];
      const k = d.band + ':' + it.wall + ':' + it.pos;
      const ok = d.where === 'wall' && !!slots && (it.wall === 'left' || it.wall === 'right')
        && Number.isInteger(it.pos) && it.pos >= 0 && it.pos < slots.count
        && !(res || []).includes(it.pos) && !taken.has(k);
      if (!ok) { toStock(it.type); continue; }
      if (!keep(it.type)) continue;
      taken.add(k);
      const out = { type: it.type, wall: it.wall, pos: it.pos };
      if (it.type === 'frame' && typeof it.variant === 'string' && FRAME_VARIANT.test(it.variant)) out.variant = it.variant;
      wallItems.push(out);
    }
  } else {
    for (const it of wallItems) owned[it.type] = (owned[it.type] || 0) + 1;
  }

  const rawStock = isObj(raw.stock) ? raw.stock : base.stock;
  for (const [type, n] of Object.entries(rawStock)) {
    if (!ITEM[type]) continue;
    const q = Math.min(count(n) || 0, 999);
    for (let i = 0; i < q; i++) toStock(type);
  }

  return { items, wallItems, stock };
}

// Lê campo por campo: o que for inválido fica com o padrão. Nunca lança.
export function parseSave(text) {
  const s = initial();
  let raw;
  try { raw = JSON.parse(text); } catch { return s; }
  if (!isObj(raw)) return s;
  // Versão diferente de SAVE_VERSION: lê o que ainda for válido no formato atual.
  for (const k of ['coins', 'served', 'count']) {
    const n = count(raw[k]);
    if (n !== null) s[k] = n;
  }
  s.name = cleanName(raw.name) || DEFAULT_NAME;
  if (WALL_COLORS.some((w) => w.id === raw.wall)) s.wall = raw.wall;
  if (FLOORS.some((f) => f.id === raw.floor)) s.floor = raw.floor;
  try { Object.assign(s, cleanDecor(raw, s)); } catch { Object.assign(s, copyDecor({ ...INITIAL_DECOR, wall: s.wall, floor: s.floor })); }
  if (isObj(raw.regulars)) {
    for (const { id } of REGULARS) { // só ids conhecidos (T-034)
      const q = Object.prototype.hasOwnProperty.call(raw.regulars, id) ? count(raw.regulars[id]) : null;
      if (q !== null) s.regulars[id] = q;
    }
  }
  if (isObj(raw.settings)) {
    for (const k of ['music', 'rain']) if (typeof raw.settings[k] === 'boolean') s.settings[k] = raw.settings[k];
  }
  return s;
}

export function serialize(st = state) {
  return JSON.stringify({
    v: SAVE_VERSION,
    coins: st.coins, served: st.served, count: st.count, name: st.name,
    wall: st.wall, floor: st.floor,
    items: st.items, wallItems: st.wallItems, stock: st.stock,
    regulars: st.regulars, settings: st.settings,
  });
}

// ---------- localStorage ----------
function storage() {
  try { return globalThis.localStorage || null; } catch { return null; }
}

export function load() {
  let text = null;
  try { const ls = storage(); text = ls ? ls.getItem(SAVE_KEY) : null; } catch { text = null; }
  return text == null ? initial() : parseSave(text);
}

let pending = null;

// Grava agora. Falha (sem localStorage, cota cheia) é ignorada.
export function save() {
  if (pending) { clearTimeout(pending); pending = null; }
  try { const ls = storage(); if (ls) ls.setItem(SAVE_KEY, serialize()); return true; } catch { return false; }
}

// No máximo uma gravação a cada SAVE_DELAY; a marcada lê o estado mais recente.
function scheduleSave() {
  if (pending) return;
  try { pending = setTimeout(() => { pending = null; save(); }, SAVE_DELAY); } catch { save(); }
}

// Grava o pendente agora; chamado ao esconder ou fechar a página.
export function flush() { if (pending) save(); }

let state = load();
const listeners = new Set();

try {
  if (typeof addEventListener === 'function') {
    addEventListener('pagehide', flush);
    addEventListener('visibilitychange', () => {
      if (globalThis.document && document.visibilityState === 'hidden') flush();
    });
  }
} catch { /* sem window: segue sem os ganchos */ }

function send(ev, persist = true) {
  if (persist) scheduleSave();
  for (const fn of [...listeners]) {
    try { fn(ev); } catch (e) { console.error(e); } // um ouvinte com erro não para os outros
  }
}

function emit(type, delta, persist) { send({ type, value: state[type], delta }, persist); }

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

// Ao cruzar um marco, avisa também { type: 'unlock', recipeId } (T-033).
export function incServed() {
  state.served += 1;
  emit('served', 1);
  for (const r of RECIPES) if (r.unlockAt > 0 && r.unlockAt === state.served) send({ type: 'unlock', recipeId: r.id }, false);
}
export function incCount() { state.count += 1; emit('count', 1); }

// Clientes da casa (T-034): visitas por id. Evento { type: 'regulars', id, value }.
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
export function getVisits(id) { return REGULARS.some((r) => r.id === id) && own(state.regulars, id) ? state.regulars[id] : 0; }
export function addVisit(id) {
  if (!REGULARS.some((r) => r.id === id)) return 0;
  state.regulars[id] = (own(state.regulars, id) ? state.regulars[id] : 0) + 1;
  send({ type: 'regulars', id, value: state.regulars[id] });
  return state.regulars[id];
}

// Troca campos da decoração ({ items, wallItems, stock, wall, floor }); só decor.js chama.
// Evento { type: 'decor', change }.
export function setDecor(patch = {}, change = 'set') {
  let changed = false;
  for (const k of ['items', 'wallItems', 'stock', 'wall', 'floor']) {
    if (patch[k] !== undefined) { state[k] = patch[k]; changed = true; }
  }
  if (changed) send({ type: 'decor', change });
}

// Ajustes (T-058): mescla só booleanos de music/rain. Evento { type: 'settings', value, changed }.
export function setSettings(patch = {}) {
  if (!isObj(state.settings)) state.settings = { music: true, rain: true };
  const changed = [];
  for (const k of ['music', 'rain']) {
    if (isObj(patch) && typeof patch[k] === 'boolean' && state.settings[k] !== patch[k]) {
      state.settings[k] = patch[k];
      changed.push(k);
    }
  }
  if (changed.length) send({ type: 'settings', value: { ...state.settings }, changed });
  return { ...state.settings };
}

// Nome da cafeteria (decisão 16): corta em 24; vazio = DEFAULT_NAME. Evento { type: 'name', value }.
export function setName(text) {
  const v = cleanName(text) || DEFAULT_NAME;
  if (v !== state.name) {
    state.name = v;
    emit('name', 0);
  }
  return state.name;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Apaga o salvo e volta aos valores iniciais, avisando cada campo ("Recomeçar do zero", M4).
// Não regrava: a próxima mudança grava de novo.
export function reset() {
  if (pending) { clearTimeout(pending); pending = null; }
  try { const ls = storage(); if (ls) ls.removeItem(SAVE_KEY); } catch { /* ignora */ }
  const old = state;
  state = initial();
  for (const k of ['coins', 'served', 'count']) emit(k, state[k] - old[k], false);
  send({ type: 'decor', change: 'reset' }, false);
  send({ type: 'regulars', id: null, value: 0 }, false);
}

// Nível pelos marcos de LEVELS (decisão 23): 1 + marcos atingidos.
export function levelFor(served) {
  let lv = 1;
  for (const m of LEVELS) if (served >= m) lv += 1;
  return lv;
}

export function getLevel() { return levelFor(state.served); }

// ---------- Receitas liberadas (T-033; decisões 13 e 25) ----------
const servedOf = (v) => count(v) ?? 0;

// Receitas liberadas com `served` bebidas, na ordem de RECIPES.
export function unlockedFor(served) {
  const n = servedOf(served);
  return RECIPES.filter((r) => r.unlockAt <= n);
}

export function isUnlocked(recipeId, served = state.served) {
  return unlockedFor(served).some((r) => r.id === recipeId);
}

// Avanço até a próxima receita, contado desde o marco anterior.
// { next: receita | null, left, done, span, pct }. Depois da última: next null, pct 100.
export function recipeProgressFor(served) {
  const n = servedOf(served);
  const at = RECIPE_MILESTONES.find((m) => m > n);
  if (at === undefined) return { next: null, left: 0, done: 1, span: 1, pct: 100 };
  const from = [0, ...RECIPE_MILESTONES].filter((m) => m <= n).pop();
  const span = at - from;
  const done = n - from;
  const next = RECIPES.find((r) => r.unlockAt === at) || null;
  return { next, left: at - n, done, span, pct: Math.round((done / span) * 100) };
}

export function getUnlocked() { return unlockedFor(state.served); }
export function getRecipeProgress() { return recipeProgressFor(state.served); }
