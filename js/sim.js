// Simulação do ciclo do cliente (M2; lugares das mesas do layout no M3). Não desenha nem toca no DOM.
// Só avança por update(dt) e sorteia com o rng recebido (roda em Node).
import { RECIPES, CYCLE, ROOM, CUSTOMER_NAMES, CUSTOMER_LOOKS, BARISTA_LOOK } from './data.js';
import * as stateModule from './state.js';
import sharedDecor, { createDecor } from './decor.js';

const HEART_TIME = 1.2; // s, coração subindo
const EPS = 1e-6;
const SEAT_DIR = { '+gx': 'se', '-gx': 'nw', '+gy': 'sw', '-gy': 'ne' };

// Caminho da chegada: DOOR → ENTRY → Q3 → Q2 → Q1. Índice da vaga n (0 = Q1) no caminho.
const LINE = [ROOM.door, ROOM.entry, ROOM.queue[2], ROOM.queue[1], ROOM.queue[0]];
const lineStop = (slot) => LINE.length - 1 - slot;

function dirOf(dx, dy, fallback) {
  if (Math.abs(dx) < EPS && Math.abs(dy) < EPS) return fallback;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'se' : 'nw';
  return dy > 0 ? 'sw' : 'ne';
}

export function createSim({ rng = Math.random, store = stateModule, recipes, decor } = {}) {
  // Mesma decoração da tela quando usa o state do jogo; senão, uma ligada ao store injetado.
  const layout = decor || (store === stateModule ? sharedDecor : createDecor({ store }));
  // M2: só as receitas iniciais (decisão 20). A liberação por nível entra no M4.
  const menu = recipes || RECIPES.filter((r) => r.unlockAt === 0);
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
  const listeners = new Set();

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

  function spawn() {
    const L = CUSTOMER_LOOKS;
    const recipe = pick(menu);
    const c = {
      id: 'c' + nextId++,
      name: pickName(),
      look: {
        skin: pick(L.skins), hair: pick(L.hairs), shirt: pick(L.shirts),
        pants: pick(L.pants), hairStyle: pick(L.hairStyles), apron: false,
      },
      recipeId: recipe.id,
      phase: 'entering',
      gx: ROOM.door.gx, gy: ROOM.door.gy,
      path: [], // pontos a percorrer (fora da fila)
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

  // Percorre c.path; devolve true ao chegar ao fim.
  function movePath(c, dt) {
    let budget = CYCLE.walkSpeed * dt;
    while (c.path.length && budget > EPS) {
      const p = c.path[0];
      budget = stepTo(c, p, budget);
      if (Math.abs(c.gx - p.gx) < EPS && Math.abs(c.gy - p.gy) < EPS) c.path.shift();
    }
    c.moving = c.path.length > 0;
    return !c.path.length;
  }

  function startHeart(c) { c.heart = 0; }

  const freeSeat = () => seatList.find((s) => !seatTaken.has(s.id)) || null;

  function goSit(c, seat, viaHub) {
    seatTaken.set(seat.id, c.id);
    c.seat = seat.id;
    c.phase = 'toSeat';
    c.path = viaHub ? [ROOM.hub, seat] : [seat];
    c.moving = true;
  }

  function leaveFromSeat(c) {
    c.seat = null;
    c.phase = 'leaving';
    c.path = [ROOM.hub, ROOM.exit, ROOM.entry, ROOM.door];
    c.moving = true;
    startHeart(c);
  }

  function leaveWithCup(c) {
    c.seat = null;
    c.phase = 'leaving'; // decisão 22: sai com o copo e solta coração
    c.path = [ROOM.exit, ROOM.entry, ROOM.door];
    c.moving = true;
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
        const viaHub = c.path[0] === ROOM.hub;
        const s = freeSeat();
        if (s) goSit(c, s, viaHub);
        else leaveWithCup(c);
      } else c.seat = null;
    }
  }

  function frontInfo() {
    const c = line[0];
    if (!c || c.phase !== 'waiting') return null;
    return { id: c.id, name: c.name, look: c.look, recipeId: c.recipeId, gx: c.gx, gy: c.gy };
  }

  function update(dt) {
    dt = Number(dt);
    if (!(dt > 0)) return;
    dt = Math.min(dt, 0.25); // proteção; o main já limita a 0,05 s
    syncSeats();

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

    line.shift();
    c.cup = true;
    c.progress = null;
    syncSeats();
    const seat = freeSeat();
    if (seat) {
      c.seatTime = randReal(CYCLE.seatMin, CYCLE.seatMax);
      goSit(c, seat, true);
    } else {
      leaveWithCup(c);
    }

    const result = { price, tip, bonus, total };
    lastFront = null;
    emit({ type: 'front', customer: null });
    emit({ type: 'paid', ...result });
    return result;
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
      };
      if (seated) e.depth = c.gx + c.gy + 0.01;
      list.push(e);
    }
    return list;
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { update, getFront, startOrder, saveProgress, deliver, entities, subscribe };
}
