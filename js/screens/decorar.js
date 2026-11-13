// Tela Decorar (T-029, T-030): topo, sala reduzida com a colocação de móveis e a loja.
// Regras em decor.js (arquitetura, M3.3); fluxo da tela na M3.7; desenho em art.js (M3.5).
import { iconSvg } from '../icons.js';
import decor from '../decor.js';
import { DECOR_ITEMS, SHOP_TABS, WALL_COLORS, FLOORS, WALL_SLOTS } from '../data.js';
import { project } from '../iso.js';
import * as art from '../art.js';

const ITEM = Object.fromEntries(DECOR_ITEMS.map((d) => [d.id, d]));
const VB = art.SCENE_VIEWBOX;
const BASE_SCALE = 282 / 372; // sala de 282 × 250 a 390 de largura (mockup)
const REF_WIDTH = 390;
const BAR_H = 34;   // linha da pílula abaixo da sala
const STAGE_GAP = 4;
const MAX_DPR = 3;
const THUMB = 60;   // miniatura da loja, px CSS
const TAP_PT = 22;  // raio mínimo do toque
const NOTICE_MS = 2600;
const CAPTION = 'Toque em um móvel para mudar de lugar';

// Centro do desenho acima da âncora e meio lado, em unidades do viewBox (enquadramento das miniaturas).
const HIT = {
  plant: [18, 24], monstera: [31, 34], armchair: [21, 31], floorLamp: [41, 46], rug: [0, 27],
  catBed: [5, 27], pouf: [6, 20], flowerTable: [22, 28], recordPlayer: [12, 24], table: [12, 42],
  bookshelf: [36, 50],
};

// Espaços de parede: mesma geometria de art.js (slotX / slotRect), no plano local da parede.
const SLOT_Y = { high: [-123, -103], mid: [-103, -43] };
function slotRect(side, band, pos) {
  const sl = WALL_SLOTS[band] || WALL_SLOTS.mid;
  const at = sl.at && sl.at[side] && sl.at[side][pos];
  const u = (at != null ? at : (pos + 0.5) * sl.span) * 30;
  const cx = side === 'left' ? -u : u;
  const half = (sl.span * 30) / 2 - (band === 'high' ? 4 : 2);
  const [y0, y1] = SLOT_Y[band] || SLOT_Y.mid;
  return [cx - half, y0, cx + half, y1];
}
// Distância do toque (viewBox) ao retângulo do espaço, no plano da parede (0 = dentro).
function wallDist(vx, vy, side, band, pos) {
  const ly = side === 'left' ? vy + 0.5 * vx : vy - 0.5 * vx;
  const [x0, y0, x1, y1] = slotRect(side, band, pos);
  return Math.hypot(Math.max(x0 - vx, 0, vx - x1), Math.max(y0 - ly, 0, ly - y1));
}
// Distância ao ladrilho (c, r): 0 dentro do losango; senão, ao centro.
function tileDist(vx, vy, c, r) {
  const p = project(c + 0.5, r + 0.5);
  const dx = vx - p.x, dy = vy - p.y;
  return Math.abs(dx) / 30 + Math.abs(dy) / 15 <= 1 ? 0 : Math.hypot(dx, dy);
}

const isWall = (type) => !!ITEM[type] && ITEM[type].where === 'wall';
const spotOf = (s) => (Array.isArray(s) ? { c: s[0], r: s[1] } : s);
const sameSpot = (a, b) => !!a && !!b && (a.wall !== undefined || b.wall !== undefined
  ? a.wall === b.wall && a.pos === b.pos
  : spotOf(a).c === spotOf(b).c && spotOf(a).r === spotOf(b).r);

function nowHM() {
  const d = new Date();
  return { h: d.getHours(), m: d.getMinutes() };
}

function template() {
  return `
  <header class="decor-top">
    <button class="icon-btn" aria-label="Voltar" data-action="back">${iconSvg('back', { size: 22 })}</button>
    <div class="decor-top__info">
      <h1 class="title-prep">Decorar</h1>
      <p class="prep-top__step">${CAPTION}</p>
    </div>
    <div class="pill" data-ref="coinsPill"><span class="coin" aria-hidden="true"></span><span data-ref="coins"></span></div>
  </header>

  <div class="decor-stage" data-ref="stage">
    <canvas class="decor-stage__canvas" role="img" aria-label="Cafeteria em vista isométrica" data-ref="canvas"></canvas>
    <button class="btn btn--neutral decor-store" data-action="store" hidden>Guardar</button>
    <div class="decor-bar">
      <p class="decor-pill" role="status" data-ref="pill" hidden></p>
    </div>
  </div>

  <section class="shop" aria-label="Loja de decoração">
    <div class="shop__handle" aria-hidden="true"></div>
    <div class="shop__tabs" role="tablist">
      ${SHOP_TABS.map((t) => `<button class="shop__tab" role="tab" data-tab="${t.id}">${t.name}</button>`).join('')}
    </div>
    <ul class="shop__grid scroll" data-ref="grid"></ul>
  </section>
`;
}

let root = null;
let game = null; // { sim, state, go, params }
let refs = null;
let ctx = null;
let resizeObs = null;
let unsubs = [];
let time = 0;
let view = null; // { scale }
let tab = 'salao';
let layout = null;  // decor.sceneLayout(), refeito a cada mudança
let placing = null; // decor.getPlacing()
let notice = null;  // { text, until }
let cards = [];     // [{ kind, id, li, btn, key }]

// ---------- Sala ----------

function layoutCanvas() {
  if (!refs) return;
  const c = refs.canvas;
  const byWidth = BASE_SCALE * (root.clientWidth / REF_WIDTH);
  const byHeight = (refs.stage.clientHeight - BAR_H - STAGE_GAP) / VB.h;
  const scale = Math.max(0.1, Math.min(byWidth, byHeight));
  const cssW = VB.w * scale, cssH = VB.h * scale;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  c.style.width = `${cssW}px`;
  c.style.height = `${cssH}px`;
  c.width = Math.round(cssW * dpr);
  c.height = Math.round(cssH * dpr);
  view = { scale };
  draw();
}

function draw() {
  if (!ctx || !view) return;
  const c = refs.canvas;
  const kx = c.width / VB.w, ky = c.height / VB.h;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.setTransform(kx, 0, 0, ky, -VB.x * kx, -VB.y * ky);
  const s = game.state.get();
  art.drawScene(ctx, {
    time, entities: game.sim.entities(), layout, wall: s.wall, floor: s.floor, now: nowHM(),
    placing: placing ? { type: placing.type, free: placing.free, chosen: placing.chosen } : null,
  });
}

// Estado da colocação e do layout, refeitos após cada ação ou evento de decoração.
function refresh() {
  if (!root) return;
  layout = decor.sceneLayout();
  placing = decor.getPlacing();
  renderBar();
  renderButtons();
}

// ---------- Pílula e “Guardar” ----------

function renderBar() {
  let text = '';
  if (notice && performance.now() < notice.until) text = notice.text;
  else notice = null;
  if (placing) {
    const d = ITEM[placing.type];
    const hasSpot = placing.free.length > 0 || placing.from === 'move';
    text = hasSpot ? `Escolha um lugar livre para ${d.article} ${d.short.toLowerCase()}` : 'Não há lugar livre agora';
  }
  if (refs.pill.textContent !== text) refs.pill.textContent = text;
  refs.pill.hidden = !text;
  const moving = !!placing && placing.from === 'move';
  refs.store.hidden = !moving;
}

function showNotice(text) {
  notice = { text, until: performance.now() + NOTICE_MS };
  renderBar();
}

// ---------- Toque na sala ----------

function toViewBox(e) {
  const rect = refs.canvas.getBoundingClientRect();
  return { vx: VB.x + (e.clientX - rect.left) / view.scale, vy: VB.y + (e.clientY - rect.top) / view.scale };
}

// Lugar livre mais perto do toque (ou a origem, ao mover), dentro do raio mínimo.
function spotAt(vx, vy, radius) {
  const wall = isWall(placing.type);
  const band = wall ? ITEM[placing.type].band : null;
  const list = placing.free.slice();
  if (placing.origin) list.push(placing.origin);
  let best = null, bestD = Infinity;
  for (const s of list) {
    const d = wall ? wallDist(vx, vy, s.wall, band, s.pos) : tileDist(vx, vy, s[0], s[1]);
    if (d <= radius && d < bestD) { best = s; bestD = d; }
  }
  return best;
}

// Móvel colocado sob o toque: chão (exceto tapete) > parede > tapete.
function itemAt(vx, vy, radius) {
  let best = null, bestD = Infinity;
  const pick = (ref, d, r) => { if (d <= r && d < bestD) { best = ref; bestD = d; } };
  for (const it of layout.floor) {
    if (ITEM[it.type].under) continue;
    const [lift, half] = HIT[it.type] || [12, 24];
    const p = project(it.gx, it.gy, lift);
    pick({ c: it.c, r: it.r }, Math.hypot(vx - p.x, vy - p.y), Math.max(radius, half * 0.6));
  }
  if (best) return best;
  for (const it of layout.wall) pick({ wall: it.wall, pos: it.pos, band: it.band }, wallDist(vx, vy, it.wall, it.band, it.pos), radius);
  if (best) return best;
  for (const it of layout.floor) {
    if (!ITEM[it.type].under) continue;
    const p = project(it.gx, it.gy);
    pick({ c: it.c, r: it.r }, Math.hypot(vx - p.x, vy - p.y), Math.max(radius, HIT.rug[1]));
  }
  return best;
}

function onSceneClick(e) {
  if (!view || !layout) return;
  const { vx, vy } = toViewBox(e);
  const radius = TAP_PT / view.scale;
  notice = null;
  if (placing) {
    const spot = spotAt(vx, vy, radius);
    if (!spot) return; // fora dos livres: nada acontece
    if (placing.chosen && sameSpot(spot, placing.chosen)) decor.place(spot);
    else decor.choose(spot);
  } else {
    const ref = itemAt(vx, vy, radius);
    if (ref) decor.pickUp(ref);
  }
  refresh();
}

// ---------- Loja ----------

function thumbCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const c = document.createElement('canvas');
  c.className = 'shop-card__thumb';
  c.width = c.height = Math.round(THUMB * dpr);
  c.setAttribute('aria-hidden', 'true');
  const g = c.getContext('2d');
  g.setTransform(c.width / THUMB, 0, 0, c.height / THUMB, 0, 0);
  return { c, g };
}

function renderTab() {
  for (const b of root.querySelectorAll('[data-tab]')) {
    const on = b.dataset.tab === tab;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  }
  const entries = tab === 'cores'
    ? [...WALL_COLORS.map((w) => ({ kind: 'wall', id: w.id, name: w.name, obj: w })),
      ...FLOORS.map((f) => ({ kind: 'floor', id: f.id, name: f.name, obj: f }))]
    : DECOR_ITEMS.filter((d) => d.tab === tab).map((d) => ({ kind: 'item', id: d.id, name: d.short }));
  cards = entries.map((en) => {
    const li = document.createElement('li');
    li.className = 'shop-card';
    const { c, g } = thumbCanvas();
    if (en.kind === 'item') art.drawItemThumb(g, en.id, THUMB);
    else if (en.kind === 'wall') art.drawWallThumb(g, en.obj, THUMB);
    else art.drawFloorThumb(g, en.obj, THUMB);
    const name = document.createElement('span');
    name.className = 'shop-card__name';
    name.textContent = en.name;
    const btn = document.createElement('button');
    btn.className = 'shop-btn';
    li.append(c, name, btn);
    return { ...en, li, btn, key: '' };
  });
  cards.forEach((card, i) => { card.btn.dataset.card = String(i); });
  refs.grid.replaceChildren(...cards.map((c) => c.li));
  refs.grid.scrollTop = 0;
  renderButtons();
}

// Botão de cada cartão (arquitetura, M3.7). Só mexe no DOM quando o estado muda.
function renderButtons() {
  if (!cards.length) return;
  const s = game.state.get();
  for (const card of cards) {
    let st, label, html, aria, active = false, disabled = false;
    if (card.kind === 'item') {
      const d = ITEM[card.id];
      const sh = decor.shopState(card.id);
      const coin = `<span class="coin coin--xs" aria-hidden="true"></span><span>${d.price}</span>`;
      if (sh.state === 'placing') { st = 'placing'; html = 'Colocando'; active = true; }
      else if (sh.state === 'stock') { st = 'stock'; html = `Colocar · ${sh.n}`; aria = `Colocar ${d.short}, ${sh.n} guardado${sh.n > 1 ? 's' : ''}`; }
      else if (sh.state === 'price') { st = 'price'; html = coin; aria = `Comprar ${d.short} por ${d.price} moedas`; }
      else if (sh.reason === 'limit') { st = 'owned'; html = 'Já tem'; disabled = true; }
      else { st = 'nocoins'; html = coin; aria = `${d.short}: ${d.price} moedas, faltam moedas`; disabled = true; }
      label = st;
    } else {
      const on = (card.kind === 'wall' ? s.wall : s.floor) === card.id;
      st = on ? 'current' : 'use';
      html = on ? 'Em uso' : 'Usar';
      aria = on ? `${card.name}, em uso` : `Usar ${card.name}`;
      active = on;
      label = st;
    }
    const key = `${label}|${html}`;
    if (card.key === key) continue;
    card.key = key;
    card.btn.className = `shop-btn shop-btn--${st}`;
    card.btn.innerHTML = html;
    card.btn.disabled = disabled;
    if (aria) card.btn.setAttribute('aria-label', aria); else card.btn.removeAttribute('aria-label');
    card.li.classList.toggle('is-active', active);
  }
}

function onCard(card) {
  notice = null;
  if (card.kind === 'wall') decor.setWall(card.id);
  else if (card.kind === 'floor') decor.setFloor(card.id);
  else {
    const sh = decor.shopState(card.id).state;
    let res = null;
    if (sh === 'price') res = decor.buy(card.id);
    else if (sh === 'stock') res = decor.startPlacing(card.id);
    // Sem lugar livre: o item fica no estoque (arquitetura, M3.7).
    if (res && res.ok && res.free && res.free.length === 0) {
      decor.cancel();
      notice = { text: 'Não há lugar livre agora', until: performance.now() + NOTICE_MS };
    }
  }
  refresh();
}

// ---------- Topo e ações ----------

function renderCoins() {
  const c = game.state.get().coins;
  refs.coins.textContent = String(c);
  refs.coinsPill.setAttribute('aria-label', `${c} moedas`);
}

function onClick(e) {
  const tabBtn = e.target.closest('[data-tab]');
  if (tabBtn) {
    if (tabBtn.dataset.tab !== tab) { tab = tabBtn.dataset.tab; renderTab(); }
    return;
  }
  const cardBtn = e.target.closest('[data-card]');
  if (cardBtn) { const card = cards[Number(cardBtn.dataset.card)]; if (card) onCard(card); return; }
  const act = e.target.closest('[data-action]');
  if (!act) return;
  if (act.dataset.action === 'back') game.go('cafeteria');
  else if (act.dataset.action === 'store') { decor.store(); refresh(); }
}

export default {
  enter(el, context) {
    root = el;
    game = context;
    root.classList.add('decor');
    root.innerHTML = template();
    refs = {};
    for (const n of root.querySelectorAll('[data-ref]')) refs[n.dataset.ref] = n;
    refs.store = root.querySelector('[data-action="store"]');
    ctx = refs.canvas.getContext('2d');
    root.addEventListener('click', onClick);
    refs.canvas.addEventListener('click', onSceneClick);
    resizeObs = new ResizeObserver(layoutCanvas);
    resizeObs.observe(refs.stage);
    decor.cancel();
    renderCoins();
    refresh();
    renderTab();
    unsubs = [game.state.subscribe((ev) => {
      if (!root) return;
      if (ev.type === 'coins') { renderCoins(); renderButtons(); }
      else if (ev.type === 'decor') refresh();
    })];
  },
  exit() {
    decor.cancel(); // sair no meio: o item volta à origem ou fica no estoque
    for (const u of unsubs) u();
    unsubs = [];
    if (resizeObs) resizeObs.disconnect();
    if (refs) refs.canvas.removeEventListener('click', onSceneClick);
    if (root) root.removeEventListener('click', onClick);
    root = game = refs = ctx = view = resizeObs = layout = placing = notice = null;
    cards = [];
  },
  update(dt) {
    time += dt;
    if (notice && performance.now() >= notice.until) renderBar();
    draw();
  },
};
