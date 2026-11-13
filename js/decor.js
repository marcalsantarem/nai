// Regras da decoração (M3; arquitetura, M3.2 e M3.3). Não desenha nem toca no DOM; roda em Node.
// O layout salvo fica em state; aqui ficam só o item "na mão" e o lugar escolhido (em memória).
import {
  DECOR_ITEMS, ROOM, TABLE_SEATS, TABLE_COLUMNS, WALL_SLOTS, WALL_COLORS, FLOORS,
} from './data.js';
import * as stateModule from './state.js';

const SIZE = 6;
const WALLS = ['left', 'right'];
const ITEM = Object.fromEntries(DECOR_ITEMS.map((d) => [d.id, d]));
const key = (c, r) => c + ',' + r;
const RESERVED = new Set(ROOM.reservedTiles.map(([c, r]) => key(c, r)));
const NO_STOOL = new Set((ROOM.noStoolTiles || []).map(([c, r]) => key(c, r)));
const inGrid = (c, r) => Number.isInteger(c) && Number.isInteger(r) && c >= 0 && r >= 0 && c < SIZE && r < SIZE;

// Âncora do item de chão: centro do ladrilho + offset do tipo.
export function anchorOf(type, c, r) {
  const o = (ITEM[type] && ITEM[type].offset) || [0, 0];
  return { gx: c + 0.5 + o[0], gy: r + 0.5 + o[1] };
}

// Ladrilhos dos banquinhos de uma mesa em (c, r) (decisão 28).
const stoolTiles = (c, r) => [[c - 1, r], [c + 1, r]];

export function createDecor({ store = stateModule } = {}) {
  let hand = null; // { type, from: 'shop' | 'stock' | 'move', origin, chosen }

  const S = () => store.get();
  const items = () => S().items || [];
  const wallItems = () => S().wallItems || [];
  const stock = () => S().stock || {};
  const stockOf = (type) => Math.max(0, Math.floor(Number(stock()[type]) || 0));

  const sameFloor = (it, o) => it.type === o.type && it.c === o.c && it.r === o.r;
  const sameWall = (it, o) => it.type === o.type && it.wall === o.wall && it.pos === o.pos;
  const withoutFirst = (list, match) => {
    let skipped = false;
    return list.filter((it) => {
      if (!skipped && match(it)) { skipped = true; return false; }
      return true;
    });
  };

  // Mão inválida (estado trocado por fora, ex.: reset) é descartada.
  function checkHand() {
    if (!hand) return;
    if (hand.from === 'move') {
      const o = hand.origin;
      const ok = ITEM[hand.type].where === 'floor'
        ? items().some((it) => sameFloor(it, o))
        : wallItems().some((it) => sameWall(it, o));
      if (!ok) hand = null;
    } else if (stockOf(hand.type) < 1) {
      hand = null;
    }
  }

  const moving = (where) => hand && hand.from === 'move' && ITEM[hand.type].where === where;

  // Layout visível: sem o item que está sendo movido.
  function liveItems() {
    checkHand();
    return moving('floor') ? withoutFirst(items(), (it) => sameFloor(it, hand.origin)) : items();
  }

  function liveWallItems() {
    checkHand();
    return moving('wall') ? withoutFirst(wallItems(), (it) => sameWall(it, hand.origin)) : wallItems();
  }

  // Quantos do tipo existem no jogo (colocados + estoque). A mão já está contada.
  function owned(type) {
    const list = ITEM[type].where === 'floor' ? items() : wallItems();
    return list.filter((it) => it.type === type).length + stockOf(type);
  }

  function freeSpots(type) {
    const def = ITEM[type];
    if (!def) return [];
    if (def.where === 'wall') {
      const slots = WALL_SLOTS[def.band];
      if (!slots) return [];
      const taken = new Set(liveWallItems()
        .filter((it) => ITEM[it.type] && ITEM[it.type].band === def.band)
        .map((it) => it.wall + ':' + it.pos));
      const out = [];
      for (const wall of WALLS) {
        const res = (slots.reserved && slots.reserved[wall]) || [];
        for (let pos = 0; pos < slots.count; pos++) {
          if (!res.includes(pos) && !taken.has(wall + ':' + pos)) out.push({ wall, pos });
        }
      }
      return out;
    }
    const solid = new Set(); // ladrilhos com item comum
    const rugs = new Set();
    const stools = new Set(); // ladrilhos de banquinho
    for (const it of liveItems()) {
      const d = ITEM[it.type];
      if (!d) continue;
      if (d.under) { rugs.add(key(it.c, it.r)); continue; }
      solid.add(key(it.c, it.r));
      if (d.seats) for (const [sc, sr] of stoolTiles(it.c, it.r)) stools.add(key(sc, sr));
    }
    const out = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const k = key(c, r);
        if (RESERVED.has(k)) continue;
        if (def.under) { if (!rugs.has(k)) out.push([c, r]); continue; }
        if (solid.has(k) || stools.has(k)) continue;
        if (def.seats) {
          if (c < TABLE_COLUMNS.min || c > TABLE_COLUMNS.max) continue;
          const ok = stoolTiles(c, r).every(([sc, sr]) => {
            const sk = key(sc, sr);
            return inGrid(sc, sr) && !NO_STOOL.has(sk) && !solid.has(sk) && !stools.has(sk);
          });
          if (!ok) continue;
        }
        out.push([c, r]);
      }
    }
    return out;
  }

  // Normaliza o lugar: [c, r] | { c, r } no chão; { wall, pos } na parede.
  function normSpot(type, spot) {
    if (!spot) return null;
    if (ITEM[type].where === 'floor') {
      const c = Array.isArray(spot) ? spot[0] : spot.c;
      const r = Array.isArray(spot) ? spot[1] : spot.r;
      return inGrid(c, r) ? [c, r] : null;
    }
    return WALLS.includes(spot.wall) && Number.isInteger(spot.pos) ? { wall: spot.wall, pos: spot.pos } : null;
  }
  const spotEq = (a, b) => !!a && !!b && (Array.isArray(a)
    ? a[0] === b[0] && a[1] === b[1]
    : a.wall === b.wall && a.pos === b.pos);
  const isFree = (type, s) => freeSpots(type).some((f) => spotEq(f, s));

  // Estado do botão da loja (arquitetura, M3.7): { state, n } com n = estoque fora da mão.
  function shopState(type) {
    const def = ITEM[type];
    if (!def) return { state: 'disabled', n: 0 };
    checkHand();
    const inHand = hand && hand.type === type && hand.from !== 'move' ? 1 : 0;
    const n = stockOf(type) - inHand;
    if (inHand) return { state: 'placing', n };
    if (n > 0) return { state: 'stock', n };
    if (def.limit && owned(type) >= def.limit) return { state: 'disabled', n, reason: 'limit' };
    if (S().coins < def.price) return { state: 'disabled', n, reason: 'coins' };
    return { state: 'price', n };
  }

  function buy(type) {
    const def = ITEM[type];
    if (!def) return { ok: false };
    if (def.limit && owned(type) >= def.limit) return { ok: false, reason: 'limit' };
    if (S().coins < def.price) return { ok: false, reason: 'coins' };
    if (hand) cancel();
    if (!store.spend(def.price)) return { ok: false, reason: 'coins' };
    store.setDecor({ stock: { ...stock(), [type]: stockOf(type) + 1 } }, 'buy');
    const res = startPlacing(type);
    hand.from = 'shop';
    return { ok: true, free: res.free };
  }

  // Tira 1 do estoque para a mão (o estoque salvo só muda no place). free vazio = sem lugar.
  function startPlacing(type) {
    if (!ITEM[type]) return { ok: false, free: [] };
    if (hand) cancel();
    if (stockOf(type) < 1) return { ok: false, free: [] };
    hand = { type, from: 'stock', origin: null, chosen: null };
    return { ok: true, free: freeSpots(type) };
  }

  function choose(spot) {
    checkHand();
    if (!hand) return { ok: false };
    const s = normSpot(hand.type, spot);
    if (!s) return { ok: false };
    // Movendo: tocar na origem devolve o item (arquitetura, M3.7).
    if (hand.from === 'move' && spotEq(s, normSpot(hand.type, hand.origin))) {
      cancel();
      return { ok: true, back: true };
    }
    if (!isFree(hand.type, s)) return { ok: false };
    hand.chosen = s;
    return { ok: true };
  }

  // 2º toque no lugar escolhido confirma (decisão 26).
  function place(spot) {
    checkHand();
    if (!hand) return { ok: false };
    const s = normSpot(hand.type, spot);
    if (!s || !spotEq(s, hand.chosen) || !isFree(hand.type, s)) return { ok: false };
    const { type, from, origin } = hand;
    const floor = ITEM[type].where === 'floor';
    const next = floor ? { type, c: s[0], r: s[1] } : { type, wall: s.wall, pos: s.pos };
    const patch = {};
    if (from === 'move') {
      const match = floor ? (it) => sameFloor(it, origin) : (it) => sameWall(it, origin);
      const list = floor ? items() : wallItems();
      let done = false;
      const moved = list.map((it) => {
        if (!done && match(it)) { done = true; return next; }
        return it;
      });
      if (floor) patch.items = moved; else patch.wallItems = moved;
    } else {
      const st = { ...stock() };
      st[type] = stockOf(type) - 1;
      if (st[type] <= 0) delete st[type];
      patch.stock = st;
      if (floor) patch.items = [...items(), next];
      else patch.wallItems = [...wallItems(), next];
    }
    hand = null;
    store.setDecor(patch, 'place');
    return { ok: true };
  }

  // ref: { c, r } (item comum antes do tapete) ou { wall, pos, band? }.
  function pickUp(ref) {
    if (!ref) return { ok: false };
    let found = null;
    if (ref.wall !== undefined) {
      const cands = wallItems().filter((it) => it.wall === ref.wall && it.pos === ref.pos && ITEM[it.type]);
      for (const b of ref.band ? [ref.band] : ['mid', 'high']) {
        found = cands.find((it) => ITEM[it.type].band === b);
        if (found) break;
      }
      if (!found) return { ok: false };
      cancel();
      hand = { type: found.type, from: 'move', origin: { type: found.type, wall: found.wall, pos: found.pos }, chosen: null };
      return { ok: true, type: found.type };
    }
    const here = items().filter((it) => it.c === ref.c && it.r === ref.r && ITEM[it.type]);
    found = here.find((it) => !ITEM[it.type].under) || here.find((it) => ITEM[it.type].under);
    if (!found) return { ok: false };
    cancel();
    hand = { type: found.type, from: 'move', origin: { type: found.type, c: found.c, r: found.r }, chosen: null };
    return { ok: true, type: found.type };
  }

  // Item da mão vai para o estoque.
  function storeItem() {
    checkHand();
    if (!hand) return { ok: false };
    const { type, from, origin } = hand;
    hand = null;
    if (from !== 'move') return { ok: true }; // já está no estoque
    const patch = { stock: { ...stock(), [type]: stockOf(type) + 1 } };
    if (ITEM[type].where === 'floor') patch.items = withoutFirst(items(), (it) => sameFloor(it, origin));
    else patch.wallItems = withoutFirst(wallItems(), (it) => sameWall(it, origin));
    store.setDecor(patch, 'store');
    return { ok: true };
  }

  // Movendo: volta à origem (o salvo nunca mudou). Comprado ou do estoque: fica no estoque.
  function cancel() { hand = null; }

  function setWall(id) {
    if (!WALL_COLORS.some((w) => w.id === id)) return { ok: false };
    if (S().wall !== id) store.setDecor({ wall: id }, 'wall');
    return { ok: true };
  }

  function setFloor(id) {
    if (!FLOORS.some((f) => f.id === id)) return { ok: false };
    if (S().floor !== id) store.setDecor({ floor: id }, 'floor');
    return { ok: true };
  }

  function getPlacing() {
    checkHand();
    if (!hand) return null;
    const o = hand.origin;
    return {
      type: hand.type,
      from: hand.from,
      origin: o ? (o.wall !== undefined ? { wall: o.wall, pos: o.pos } : [o.c, o.r]) : null,
      chosen: hand.chosen,
      free: freeSpots(hand.type),
    };
  }

  function sceneLayout() {
    return {
      floor: liveItems().filter((it) => ITEM[it.type])
        .map((it) => ({ type: it.type, c: it.c, r: it.r, ...anchorOf(it.type, it.c, it.r) })),
      wall: liveWallItems().filter((it) => ITEM[it.type])
        .map((it) => ({ type: it.type, wall: it.wall, pos: it.pos, band: ITEM[it.type].band })),
    };
  }

  // Lugares das mesas visíveis (arquitetura, M3.4), id 'c,r:i'. Mesa levantada não tem lugares.
  function seats() {
    const out = [];
    for (const it of liveItems()) {
      const d = ITEM[it.type];
      if (!d || !d.seats) continue;
      const a = anchorOf(it.type, it.c, it.r);
      TABLE_SEATS.slice(0, d.seats).forEach((s, i) => {
        out.push({ id: key(it.c, it.r) + ':' + i, gx: a.gx + s.dx, gy: a.gy + s.dy, dir: s.dir });
      });
    }
    return out;
  }

  return {
    shopState, buy, startPlacing, freeSpots, choose, place, pickUp, store: storeItem, cancel,
    setWall, setFloor, getPlacing, sceneLayout, seats,
  };
}

// Instância padrão, ligada ao state do jogo; é a mesma que a sim usa por padrão.
const shared = createDecor();
export default shared;
