// Simulação do ciclo do cliente (M2). Não desenha nem toca no DOM.
// Só avança por update(dt) e sorteia com o rng recebido (roda em Node).
import { RECIPES, CYCLE, ROOM, CUSTOMER_NAMES, CUSTOMER_LOOKS, BARISTA_LOOK } from './data.js';
import * as stateModule from './state.js';

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

export function createSim({ rng = Math.random, store = stateModule, recipes } = {}) {
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
  const seatTaken = ROOM.seats.map(() => null);
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
      cup: false, heart: null, seat: -1, seatTime: 0, progress: null,
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

  function frontInfo() {
    const c = line[0];
    if (!c || c.phase !== 'waiting') return null;
    return { id: c.id, name: c.name, look: c.look, recipeId: c.recipeId, gx: c.gx, gy: c.gy };
  }

  function update(dt) {
    dt = Number(dt);
    if (!(dt > 0)) return;
    dt = Math.min(dt, 0.25); // proteção; o main já limita a 0,05 s

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
          c.dir = SEAT_DIR[ROOM.seats[c.seat].dir] || 'se';
        }
      } else if (c.phase === 'seated') {
        c.seatTime -= dt;
        if (c.seatTime <= 0) {
          seatTaken[c.seat] = null; // libera ao levantar
          c.seat = -1;
          c.phase = 'leaving';
          c.path = [ROOM.hub, ROOM.exit, ROOM.entry, ROOM.door];
          startHeart(c);
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
    const seat = seatTaken.indexOf(null);
    if (seat >= 0) {
      seatTaken[seat] = c.id;
      c.seat = seat;
      c.seatTime = randReal(CYCLE.seatMin, CYCLE.seatMax);
      c.phase = 'toSeat';
      c.path = [ROOM.hub, ROOM.seats[seat]];
    } else {
      c.phase = 'leaving'; // decisão 22: sai com o copo e solta coração
      c.path = [ROOM.exit, ROOM.entry, ROOM.door];
      startHeart(c);
    }
    c.moving = true;

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
