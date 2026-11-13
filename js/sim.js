// Simulação do ciclo do cliente (M2; lugares das mesas do layout no M3). Não desenha nem toca no DOM.
// Só avança por update(dt) e sorteia com o rng recebido (roda em Node).
import {
  RECIPES, CYCLE, ROOM, CUSTOMER_NAMES, CUSTOMER_LOOKS, BARISTA_LOOK, DECOR_ITEMS, TABLE_SEATS,
  REGULARS, REGULAR_CHANCE, SPEECH_TIME, RITUALS,
} from './data.js';
import * as stateModule from './state.js';
import { unlockedFor } from './state.js';
import sharedDecor, { createDecor } from './decor.js';

const HEART_TIME = 1.2; // s, coração subindo
const EPS = 1e-6;
const SEAT_DIR = { '+gx': 'se', '-gx': 'nw', '+gy': 'sw', '-gy': 'ne' };

// Caminho da chegada: DOOR → ENTRY → Q3 → Q2 → Q1. Índice da vaga n (0 = Q1) no caminho.
const LINE = [ROOM.door, ROOM.entry, ROOM.queue[2], ROOM.queue[1], ROOM.queue[0]];
const lineStop = (slot) => LINE.length - 1 - slot;

// ---------- Caminhos na grade (T-055) ----------
// Bloqueia o ladrilho de cada móvel (tapete não) e, na mesa, os ladrilhos dos banquinhos.
// O corredor (fila, ENTRY, EXIT, HUB) é reservado: nunca bloqueia.
const GRID = 6;
const ITEM = Object.assign(Object.create(null), Object.fromEntries(DECOR_ITEMS.map((d) => [d.id, d])));
const MARGIN = 0.01; // folga ao testar segmento x ladrilho
const tileOf = (v) => Math.min(GRID - 1, Math.max(0, Math.floor(v)));
const tkey = (c, r) => c * GRID + r;
// Balcão (reservados de r 0–1): o gato não passa por ele.
const COUNTER = ROOM.reservedTiles.filter(([, r]) => r <= 1).map(([c, r]) => tkey(c, r));

export function blockedTiles(floor) {
  const set = new Set();
  for (const it of floor) {
    const d = ITEM[it.type];
    if (!d || d.under || !Number.isInteger(it.c) || !Number.isInteger(it.r)) continue;
    set.add(tkey(it.c, it.r));
    if (d.seats) {
      for (const s of TABLE_SEATS.slice(0, d.seats)) set.add(tkey(tileOf(it.gx + s.dx), tileOf(it.gy + s.dy)));
    }
  }
  return set;
}

// Segmento a→b cruza o ladrilho (c, r)? (Liang–Barsky no quadrado com folga.)
function hitsTile(a, b, c, r) {
  const dx = b.gx - a.gx, dy = b.gy - a.gy;
  let t0 = 0, t1 = 1;
  const clip = (p, q) => {
    if (Math.abs(p) < 1e-12) return q >= 0;
    const t = q / p;
    if (p < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
    return true;
  };
  const lo = -MARGIN, hi = 1 + MARGIN;
  return clip(-dx, a.gx - (c + lo)) && clip(dx, c + hi - a.gx)
    && clip(-dy, a.gy - (r + lo)) && clip(dy, r + hi - a.gy);
}

function segmentClear(a, b, blocked, allow) {
  for (const k of blocked) {
    if (allow.has(k)) continue;
    if (hitsTile(a, b, Math.floor(k / GRID), k % GRID)) return false;
  }
  return true;
}

// Rota de a até b: [b] se a reta está livre; senão Dijkstra 8-vizinhos (diagonal só com os
// dois vizinhos livres) e corte dos cantos (fio esticado). Sem rota: reta, como no M2.
export function findRoute(a, b, blocked) {
  return searchRoute(a, b, blocked) || [{ gx: b.gx, gy: b.gy }];
}

// A mesma busca, mas sem rota devolve null (decor.js usa para não fechar a passagem; T-056).
export function searchRoute(a, b, blocked) {
  const end = { gx: b.gx, gy: b.gy };
  if (!blocked || !blocked.size) return [end];
  const sk = tkey(tileOf(a.gx), tileOf(a.gy));
  const gk = tkey(tileOf(b.gx), tileOf(b.gy));
  const allow = new Set([sk, gk]);
  if (segmentClear(a, b, blocked, allow)) return [end];
  const free = (c, r) => c >= 0 && r >= 0 && c < GRID && r < GRID && (!blocked.has(tkey(c, r)) || allow.has(tkey(c, r)));
  const dist = new Map([[sk, 0]]);
  const prev = new Map();
  const open = new Set([sk]);
  while (open.size) {
    let k = null;
    for (const o of open) if (k === null || dist.get(o) < dist.get(k)) k = o;
    open.delete(k);
    if (k === gk) break;
    const c = Math.floor(k / GRID), r = k % GRID;
    for (let dc = -1; dc <= 1; dc++) {
      for (let dr = -1; dr <= 1; dr++) {
        if (!dc && !dr) continue;
        const nc = c + dc, nr = r + dr;
        if (!free(nc, nr)) continue;
        if (dc && dr && (!free(c + dc, r) || !free(c, r + dr))) continue;
        const nk = tkey(nc, nr);
        const nd = dist.get(k) + (dc && dr ? Math.SQRT2 : 1);
        if (!dist.has(nk) || nd < dist.get(nk) - 1e-9) { dist.set(nk, nd); prev.set(nk, k); open.add(nk); }
      }
    }
  }
  if (!dist.has(gk)) return null;
  const tiles = [];
  for (let k = prev.get(gk); k !== undefined && k !== sk; k = prev.get(k)) tiles.unshift(k);
  const pts = [{ gx: a.gx, gy: a.gy },
    ...tiles.map((k) => ({ gx: Math.floor(k / GRID) + 0.5, gy: (k % GRID) + 0.5 })), end];
  const out = [];
  let i = 0;
  while (i < pts.length - 1) {
    let j = pts.length - 1;
    while (j > i + 1 && !segmentClear(pts[i], pts[j], blocked, allow)) j--;
    out.push(pts[j]);
    i = j;
  }
  return out;
}

function dirOf(dx, dy, fallback) {
  if (Math.abs(dx) < EPS && Math.abs(dy) < EPS) return fallback;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'se' : 'nw';
  return dy > 0 ? 'sw' : 'ne';
}

export function createSim({ rng = Math.random, store = stateModule, recipes, decor } = {}) {
  // Mesma decoração da tela quando usa o state do jogo; senão, uma ligada ao store injetado.
  const layout = decor || (store === stateModule ? sharedDecor : createDecor({ store }));
  // Pedidos só das receitas liberadas pelas servidas do store (T-033); `recipes` fixa o cardápio (testes).
  const menu = () => {
    if (recipes) return recipes;
    let served = 0;
    try { served = store.get().served; } catch (e) { served = 0; }
    return unlockedFor(served);
  };
  const rand = () => { const v = Number(rng()); return v >= 0 && v < 1 ? v : 0; };
  const randInt = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const randReal = (a, b) => a + rand() * (b - a);
  const pick = (list) => list[Math.floor(rand() * list.length)];

  let nextId = 1;
  let spawnTimer = CYCLE.firstArrival ?? 2;
  let openOrder = null; // id do cliente com pedido aberto
  let lastFront = null;
  const customers = []; // todos na loja
  const line = []; // fila, incluindo quem anda até ela; line[0] vai para Q1
  // Lugares das mesas (decor.seats()), id 'c,r:i'. seatTaken: id do lugar → id do cliente.
  let seatList = [];
  let seatSig = null;
  const seatById = new Map();
  const seatTaken = new Map();
  let blocked = new Set();
  let blockSig = '';
  const listeners = new Set();
  // Rituais (T-036), só em memória. Plantas regáveis por itemId 'c,r': { itemId, gx, gy, timer, thirsty }.
  const plants = new Map();
  let plantSig = null;
  let cat = null; // { gx, gy, dir, pose, walk, heart, timer, phase, path, bed }
  let bedSig = null;

  function emit(ev) {
    for (const fn of [...listeners]) {
      try { fn(ev); } catch (e) { console.error(e); }
    }
  }

  function pickName() {
    const used = new Set(customers.map((c) => c.name));
    const free = CUSTOMER_NAMES.filter((n) => !used.has(n));
    return pick(free.length ? free : CUSTOMER_NAMES);
  }

  // Cliente da casa (T-034): 45% de chance, entre os que não estão na loja e já podem vir
  // (a Bia só com o Mocha liberado). Sem candidato: cliente comum.
  function pickRegular(list) {
    if (rand() >= REGULAR_CHANCE) return null;
    const here = new Set(customers.map((c) => c.regular).filter(Boolean));
    const ok = REGULARS.filter((r) => !here.has(r.id) && (!r.requires || list.some((m) => m.id === r.requires)));
    return ok.length ? pick(ok) : null;
  }

  function spawn() {
    const L = CUSTOMER_LOOKS;
    const list = menu();
    const reg = pickRegular(list);
    // Favorita quando liberada; senão uma receita liberada.
    const recipe = (reg && list.find((m) => m.id === reg.favorite)) || pick(list);
    const c = {
      id: 'c' + nextId++,
      name: reg ? reg.name : pickName(),
      look: reg ? { ...reg.look } : {
        skin: pick(L.skins), hair: pick(L.hairs), shirt: pick(L.shirts),
        pants: pick(L.pants), hairStyle: pick(L.hairStyles), apron: false,
      },
      regular: reg ? reg.id : null, special: false, speech: null,
      recipeId: recipe.id,
      phase: 'entering',
      gx: ROOM.door.gx, gy: ROOM.door.gy,
      legs: [], // pontos de passagem a cumprir (fora da fila)
      path: [], // rota do trecho atual, até legs[0], desviando dos móveis
      wp: 1, // próximo ponto de LINE (na fila)
      dir: 'se', walk: 0, moving: true,
      cup: false, heart: null, seat: null, seatTime: 0, progress: null,
    };
    customers.push(c);
    line.push(c);
    store.incCount();
  }

  // Anda até o ponto p gastando no máximo `budget` ladrilhos; devolve o que sobrou.
  function stepTo(c, p, budget) {
    const dx = p.gx - c.gx, dy = p.gy - c.gy;
    const d = Math.hypot(dx, dy);
    c.dir = dirOf(dx, dy, c.dir);
    if (d <= budget + EPS) {
      c.gx = p.gx; c.gy = p.gy; c.walk += d;
      return budget - d;
    }
    c.gx += (dx / d) * budget; c.gy += (dy / d) * budget; c.walk += budget;
    return 0;
  }

  function moveInLine(c, slot, dt) {
    const stop = lineStop(slot);
    let budget = CYCLE.walkSpeed * dt;
    c.moving = c.wp <= stop;
    while (c.wp <= stop && budget > EPS) {
      budget = stepTo(c, LINE[c.wp], budget);
      if (Math.abs(c.gx - LINE[c.wp].gx) < EPS && Math.abs(c.gy - LINE[c.wp].gy) < EPS) c.wp += 1;
    }
    if (c.wp > stop) {
      c.moving = false;
      c.dir = 'ne'; // de frente para o balcão
      c.phase = slot === 0 ? 'waiting' : 'queued';
    } else {
      c.phase = c.wp <= 2 ? 'entering' : 'queued';
    }
  }

  function setLegs(c, legs) {
    c.legs = legs.slice();
    c.path = c.legs.length ? findRoute(c, c.legs[0], blocked) : [];
    c.moving = c.legs.length > 0;
  }

  // Percorre os trechos (cada um com sua rota); devolve true ao chegar ao fim.
  function movePath(c, dt) {
    let budget = CYCLE.walkSpeed * dt;
    while (c.legs.length && budget > EPS) {
      if (!c.path.length) c.path = findRoute(c, c.legs[0], blocked);
      const p = c.path[0];
      budget = stepTo(c, p, budget);
      if (Math.abs(c.gx - p.gx) < EPS && Math.abs(c.gy - p.gy) < EPS) {
        c.path.shift();
        if (!c.path.length) c.legs.shift();
      }
    }
    c.moving = c.legs.length > 0;
    return !c.legs.length;
  }

  // Móvel colocado, movido ou levantado: quem está andando recalcula a rota do trecho atual.
  function syncBlocked() {
    let floor;
    try { floor = layout.sceneLayout().floor || []; } catch (e) { floor = []; }
    const next = blockedTiles(floor);
    const sig = [...next].sort((x, y) => x - y).join(',');
    if (sig === blockSig) return;
    blockSig = sig;
    blocked = next;
    for (const c of customers) if (c.legs.length) c.path = findRoute(c, c.legs[0], blocked);
  }

  function startHeart(c) { c.heart = 0; }

  const freeSeat = () => seatList.find((s) => !seatTaken.has(s.id)) || null;

  function goSit(c, seat, viaHub) {
    seatTaken.set(seat.id, c.id);
    c.seat = seat.id;
    c.phase = 'toSeat';
    setLegs(c, viaHub ? [ROOM.hub, seat] : [seat]);
  }

  function leaveFromSeat(c) {
    c.seat = null;
    c.phase = 'leaving';
    setLegs(c, [ROOM.hub, ROOM.exit, ROOM.entry, ROOM.door]);
    startHeart(c);
  }

  function leaveWithCup(c) {
    c.seat = null;
    c.phase = 'leaving'; // decisão 22: sai com o copo e solta coração
    setLegs(c, [ROOM.exit, ROOM.entry, ROOM.door]);
    startHeart(c);
  }

  // Lê os lugares do layout; mesa levantada ou guardada (arquitetura, M3.4 [Proposta]):
  // quem está sentado levanta e sai com coração; quem anda até o lugar troca por outro livre
  // ou sai com o copo. As moedas já entraram; nada muda nelas.
  function syncSeats() {
    let list;
    try { list = layout.seats(); } catch (e) { list = []; }
    const sig = list.map((s) => s.id + '@' + s.gx + ',' + s.gy).join('|');
    if (sig === seatSig) return;
    seatSig = sig;
    seatList = list;
    seatById.clear();
    for (const s of list) seatById.set(s.id, s);
    for (const id of [...seatTaken.keys()]) if (!seatById.has(id)) seatTaken.delete(id);
    for (const c of customers) {
      if (c.seat === null || seatById.has(c.seat)) continue;
      if (c.phase === 'seated') leaveFromSeat(c);
      else if (c.phase === 'toSeat') {
        const viaHub = c.legs[0] === ROOM.hub;
        const s = freeSeat();
        if (s) goSit(c, s, viaHub);
        else leaveWithCup(c);
      } else c.seat = null;
    }
  }

  // ---------- Rituais (T-036) ----------
  const R = RITUALS;
  const floorNow = () => { try { return layout.sceneLayout().floor || []; } catch (e) { return []; } };

  // Plantas regáveis colocadas: cada uma ganha um tempo até a sede. Levantada ou guardada, sai;
  // colocada de novo (ou em outro ladrilho), começa outro tempo.
  function syncPlants(floor) {
    const list = floor.filter((it) => ITEM[it.type] && ITEM[it.type].waterable);
    const sig = list.map((it) => it.c + ',' + it.r + '@' + it.gx + ',' + it.gy).join('|');
    if (sig === plantSig) return;
    plantSig = sig;
    const seen = new Set();
    for (const it of list) {
      const itemId = it.c + ',' + it.r;
      seen.add(itemId);
      const p = plants.get(itemId);
      if (p) { p.gx = it.gx; p.gy = it.gy; continue; }
      plants.set(itemId, { itemId, gx: it.gx, gy: it.gy, timer: randReal(R.thirstMin, R.thirstMax), thirsty: false });
    }
    for (const id of [...plants.keys()]) if (!seen.has(id)) plants.delete(id);
  }

  function updatePlants(dt) {
    for (const p of plants.values()) {
      if (p.thirsty) continue;
      p.timer -= dt;
      if (p.timer <= 0) p.thirsty = true;
    }
  }

  function water(itemId) {
    const p = plants.get(String(itemId));
    if (!p || !p.thirsty) return { ok: false };
    p.thirsty = false;
    p.timer = randReal(R.thirstMin, R.thirstMax);
    store.addCoins(R.waterCoins);
    emit({ type: 'water', itemId: p.itemId, coins: R.waterCoins });
    return { ok: true, coins: R.waterCoins };
  }

  // Gato: só com a caminha colocada. Caminha guardada ou na mão: some. Movida: dorme na nova.
  function catHome() {
    cat.gx = cat.bed.gx; cat.gy = cat.bed.gy;
    cat.phase = 'sleep'; cat.path = []; cat.target = null;
    cat.timer = randReal(R.catSleepMin, R.catSleepMax);
  }

  function syncCat(floor) {
    const bed = floor.find((it) => it.type === 'catBed');
    const sig = bed ? bed.c + ',' + bed.r + '@' + bed.gx + ',' + bed.gy : '';
    if (sig === bedSig) return;
    bedSig = sig;
    if (!bed) { cat = null; return; }
    const heart = cat ? cat.heart : null;
    cat = { bed: { gx: bed.gx, gy: bed.gy, c: bed.c, r: bed.r }, dir: 'sw', walk: 0, heart };
    catHome();
    catSig = null;
  }

  // O gato desvia dos móveis e também do balcão. Sem rota: null (nunca atravessa móvel).
  let catBlocked = new Set();
  const catRoute = (from, to) => searchRoute(from, to, catBlocked);

  function catWalkTo(phase, point) {
    const path = catRoute(cat, point);
    if (!path) return false;
    cat.phase = phase;
    cat.target = point;
    cat.path = path;
    return true;
  }

  const catTile = () => tkey(tileOf(cat.gx), tileOf(cat.gy));
  const bedTile = () => tkey(cat.bed.c, cat.bed.r);

  // Móveis mudaram: refaz a rota. Móvel novo no ladrilho do gato (fora da caminha): ele volta
  // na hora para a caminha [Proposta]. No ladrilho do passeio: volta andando.
  let catSig = null;
  function catCheckTarget() {
    if (!cat || catSig === blockSig) return;
    catSig = blockSig;
    catBlocked = new Set([...blocked, ...COUNTER]);
    if (cat.phase === 'sleep') return;
    if (catTile() !== bedTile() && catBlocked.has(catTile())) { catHome(); return; }
    const goal = cat.phase === 'home' ? cat.bed : cat.target;
    if (cat.phase !== 'home' && catBlocked.has(tkey(tileOf(goal.gx), tileOf(goal.gy)))) {
      if (!catWalkTo('home', cat.bed)) catHome();
      return;
    }
    if (cat.phase === 'sit') return;
    const path = catRoute(cat, goal);
    if (path) cat.path = path; else catHome();
  }

  function updateCat(dt) {
    if (!cat) return;
    if (cat.heart !== null) {
      cat.heart += dt / HEART_TIME;
      if (cat.heart >= 1) cat.heart = null;
    }
    if (cat.phase === 'sleep' || cat.phase === 'sit') {
      cat.timer -= dt;
      if (cat.timer > 0) return;
      if (cat.phase === 'sit') { if (!catWalkTo('home', cat.bed)) catHome(); return; }
      // Passeio: um ladrilho livre (freeSpots) com rota; sem nenhum, dorme mais um pouco.
      let spots = [];
      try { spots = layout.freeSpots('plant') || []; } catch (e) { spots = []; }
      spots = spots.filter(([c, r]) => !catBlocked.has(tkey(c, r)));
      while (spots.length) {
        const [[c, r]] = spots.splice(Math.floor(rand() * spots.length), 1);
        if (catWalkTo('out', { gx: c + 0.5, gy: r + 0.5 })) return;
      }
      cat.timer = randReal(R.catSleepMin, R.catSleepMax);
      return;
    }
    // Andando ('out' até o ladrilho, 'home' de volta à caminha).
    let budget = R.catSpeed * dt;
    while (cat.path.length && budget > EPS) {
      const p = cat.path[0];
      budget = stepTo(cat, p, budget);
      if (Math.abs(cat.gx - p.gx) < EPS && Math.abs(cat.gy - p.gy) < EPS) cat.path.shift();
    }
    if (cat.path.length) return;
    if (cat.phase === 'out') {
      cat.phase = 'sit';
      cat.timer = randReal(R.catSitMin, R.catSitMax);
    } else {
      catHome();
    }
  }

  function petCat() {
    if (!cat) return { ok: false };
    cat.heart = 0;
    emit({ type: 'pet' });
    return { ok: true };
  }

  function syncRituals() {
    const floor = floorNow();
    syncPlants(floor);
    syncCat(floor);
  }

  function frontInfo() {
    const c = line[0];
    if (!c || c.phase !== 'waiting') return null;
    return { id: c.id, name: c.name, look: c.look, recipeId: c.recipeId, regular: c.regular, gx: c.gx, gy: c.gy };
  }

  function update(dt) {
    dt = Number(dt);
    if (!(dt > 0)) return;
    dt = Math.min(dt, 0.25); // proteção; o main já limita a 0,05 s
    syncBlocked();
    syncSeats();
    syncRituals();
    catCheckTarget();
    updatePlants(dt);
    updateCat(dt);

    // Chegadas: o tempo só corre com a fila abaixo do máximo.
    if (line.length < CYCLE.queueMax) {
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawn();
        spawnTimer = randReal(CYCLE.arrivalMin, CYCLE.arrivalMax);
      }
    }

    line.forEach((c, i) => moveInLine(c, i, dt));

    for (let i = customers.length - 1; i >= 0; i--) {
      const c = customers[i];
      if (c.heart !== null) {
        c.heart += dt / HEART_TIME;
        if (c.heart >= 1) c.heart = null;
      }
      if (c.speech) {
        c.speech.p += dt / SPEECH_TIME;
        if (c.speech.p >= 1) c.speech = null;
      }
      if (c.phase === 'toSeat') {
        if (movePath(c, dt)) {
          c.phase = 'seated';
          const s = seatById.get(c.seat);
          c.dir = (s && SEAT_DIR[s.dir]) || 'se';
        }
      } else if (c.phase === 'seated') {
        c.seatTime -= dt;
        if (c.seatTime <= 0) {
          seatTaken.delete(c.seat); // libera ao levantar
          leaveFromSeat(c);
        }
      } else if (c.phase === 'leaving') {
        if (movePath(c, dt)) customers.splice(i, 1);
      }
    }

    const f = frontInfo();
    const fid = f ? f.id : null;
    if (fid !== lastFront) {
      lastFront = fid;
      emit({ type: 'front', customer: f });
    }
  }

  function getFront() { return frontInfo(); }

  function startOrder(id) {
    const f = frontInfo();
    if (!f || f.id !== id) return null;
    const recipe = RECIPES.find((r) => r.id === f.recipeId);
    openOrder = f.id;
    return {
      customerId: f.id, customerName: f.name, recipeId: f.recipeId, price: recipe.price,
      progress: line[0].progress, // decisão 24: passos guardados ao voltar (ou null)
    };
  }

  // Decisão 24: o Preparo guarda aqui os passos feitos antes de voltar.
  function saveProgress(id, progress) {
    const c = line[0];
    if (!c || c.id !== id || c.phase !== 'waiting') return false;
    c.progress = progress ?? null;
    return true;
  }

  function deliver({ art = null } = {}) {
    const c = line[0];
    if (!openOrder || !c || c.id !== openOrder || c.phase !== 'waiting') return null;
    const recipe = RECIPES.find((r) => r.id === c.recipeId);
    const price = recipe.price;
    const tip = randInt(CYCLE.tipMin, CYCLE.tipMax);
    const bonus = art ? CYCLE.artBonus : 0;
    const total = price + tip + bonus;
    openOrder = null;
    store.addCoins(total);
    store.incServed();
    let speech = null;
    if (c.regular) speech = sayLine(c);

    line.shift();
    c.cup = true;
    c.progress = null;
    syncBlocked();
    syncSeats();
    const seat = freeSeat();
    if (seat) {
      c.seatTime = randReal(CYCLE.seatMin, CYCLE.seatMax);
      goSit(c, seat, true);
    } else {
      leaveWithCup(c);
    }

    const result = { price, tip, bonus, total, regular: c.regular, speech };
    lastFront = null;
    emit({ type: 'front', customer: null });
    emit({ type: 'paid', ...result });
    return result;
  }

  // Fala da visita: a próxima da sequência pelas visitas salvas; depois da 3ª recomeça [Proposta].
  // A visita conta ao ser servido.
  function sayLine(c) {
    const reg = REGULARS.find((r) => r.id === c.regular);
    if (!reg) return null;
    let visits = 0;
    try { visits = Number(store.get().regulars?.[reg.id]) || 0; } catch (e) { visits = 0; }
    const text = reg.lines[visits % reg.lines.length];
    try { if (typeof store.addVisit === 'function') store.addVisit(reg.id); } catch (e) { /* segue */ }
    c.speech = { text, p: 0 };
    return text;
  }

  function entities() {
    const list = [{
      id: 'barista', kind: 'barista', gx: ROOM.barista.gx, gy: ROOM.barista.gy,
      dir: 'sw', pose: 'stand', walk: 0, look: { ...BARISTA_LOOK },
      cup: false, bubble: null, heart: null,
    }];
    for (const c of customers) {
      const seated = c.phase === 'seated';
      const e = {
        id: c.id, kind: 'customer', gx: c.gx, gy: c.gy,
        dir: c.dir, pose: seated ? 'sit' : c.moving ? 'walk' : 'stand',
        walk: c.walk, look: { ...c.look }, cup: c.cup,
        bubble: c.phase === 'waiting' && line[0] === c
          ? { recipeId: c.recipeId, label: RECIPES.find((r) => r.id === c.recipeId).name }
          : null,
        heart: c.heart,
        name: c.name, regular: c.regular, special: c.special,
        speech: c.speech ? { ...c.speech } : null,
      };
      if (seated) e.depth = c.gx + c.gy + 0.01;
      list.push(e);
    }
    if (cat) {
      list.push({
        id: 'cat', kind: 'cat', gx: cat.gx, gy: cat.gy, dir: cat.dir,
        pose: cat.phase === 'sleep' ? 'sleep' : cat.phase === 'sit' ? 'sit' : 'walk',
        walk: cat.walk, heart: cat.heart, depth: cat.gx + cat.gy + 0.01,
      });
    }
    for (const p of plants.values()) {
      if (!p.thirsty) continue;
      list.push({ id: 'thirst-' + p.itemId, kind: 'thirst', gx: p.gx, gy: p.gy, itemId: p.itemId, depth: p.gx + p.gy + 0.05 });
    }
    return list;
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { update, getFront, startOrder, saveProgress, deliver, entities, subscribe, water, petCat };
}
