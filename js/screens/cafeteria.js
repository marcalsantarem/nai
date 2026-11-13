// Tela Cafeteria (tela inicial): topo, cena isométrica, cartão do pedido e navegação.
import { VERSION } from '../version.js';
import { iconSvg } from '../icons.js';
import { RECIPES, RECIPE_MILESTONES } from '../data.js';
import { project } from '../iso.js';
import decor from '../decor.js';

// Barra do M2: conta as servidas até o primeiro marco e para ali (decisões 20 e 23).
const NEXT_AT = RECIPE_MILESTONES[0];
const NEXT_RECIPE = RECIPES.find((r) => r.unlockAt === NEXT_AT);

const PORTRAIT_SIZE = 54; // área interna do retrato (60 menos o contorno)
const TAP_RADIUS_PT = 22; // raio mínimo do toque no primeiro cliente
const TAP_RADIUS_VB = 20;
const BODY_HEIGHT = 22;   // centro do corpo acima do chão (arquitetura, seção 6)

// Cena: o viewBox chega de art.js; a sala (paredes de -180 a 180) pode cortar até 18 px de cada ponta.
const ROOM_HALF_WIDTH = 180;
const MAX_ROOM_CUT = 18;
const MAX_DPR = 3;
const CONTRACT_VIEWBOX = { x: -186, y: -132, w: 372, h: 330 }; // contrato com art.js, até ele carregar

const NAV = [
  ['cafe', 'Café'],
  ['decor', 'Decorar'],
  ['menu', 'Cardápio'],
  ['guests', 'Clientes'],
];

function progressInfo(served) {
  const span = NEXT_AT;
  const done = Math.min(span, Math.max(0, served));
  const left = span - done;
  const pct = Math.round((done / span) * 100);
  // espaço inseparável no nome: evita "o" / "Mocha" órfão na última linha
  const recipe = `o ${NEXT_RECIPE.name}`;
  let caption;
  if (left === 0) caption = `O ${NEXT_RECIPE.name} chega em breve`;
  else if (left === 1) caption = `Falta 1 bebida para liberar ${recipe}`;
  else caption = `Faltam ${left} bebidas para liberar ${recipe}`;
  return { pct, caption, done, span };
}

function template() {
  return `
  <header class="top">
    <div class="level"><span class="level__label">nível</span><span class="level__value" data-ref="level"></span></div>
    <div class="top__info">
      <h1 class="title-screen">Nai's Cafe</h1>
      <div class="progress" role="img" data-ref="progress"><div class="progress__fill"></div></div>
      <p class="caption" data-ref="caption"></p>
    </div>
    <div class="pill" data-ref="coinsPill"><span class="coin" aria-hidden="true"></span><span data-ref="coins"></span></div>
    <button class="icon-btn" aria-label="Ajustes" data-action="settings">${iconSvg('settings', { size: 22 })}</button>
  </header>

  <div class="scene">
    <canvas class="scene__canvas" role="img" aria-label="Cafeteria em vista isométrica"></canvas>
  </div>

  <section class="card order" aria-label="Pedido atual">
    <div class="order__portrait order__portrait--empty" aria-hidden="true" data-ref="portrait"><canvas class="order__portrait-canvas"></canvas></div>
    <div class="order__info">
      <span class="label">PEDIDO</span>
      <h2 class="title-card is-waiting" data-ref="title">Aguardando</h2>
      <div class="order__price is-placeholder" aria-hidden="true" data-ref="price"><span class="coin coin--sm" aria-hidden="true"></span><span data-ref="priceText">0 moedas</span></div>
    </div>
    <button class="btn btn--primary order__btn" data-action="prepare" disabled>Preparar</button>
  </section>

  <nav class="nav" aria-label="Navegação principal">
    ${NAV.map(([id, label], i) =>
      `<button class="nav__item${i === 0 ? ' is-active' : ''}" data-nav="${id}"${i === 0 ? ' aria-current="page"' : ''}>${iconSvg(id)}<span>${label}</span></button>`
    ).join('')}
  </nav>
`;
}

let root = null;
let game = null; // ctx da tela: { sim, state, go, params }
let refs = null;
let sceneEl = null;
let canvas = null;
let ctx = null;
let art = null; // módulo art.js, quando existir
let fontsReady = false;
let resizeObs = null;
let unsubs = [];
let front = null; // primeiro cliente parado em Q1, ou null
let time = 0;
let view = null; // { cssW, cssH, dpr, scale }
let layout = null; // decor.sceneLayout(), refeito no evento 'decor'

// Tamanho da cena: a sala ocupa a largura da coluna cortando 18 px de cada ponta
// (a 390 px dá os 440 × 390 do mockup); reduz se não couber na altura.
function layoutCanvas() {
  if (!canvas || !sceneEl) return;
  const vb = art ? art.SCENE_VIEWBOX : CONTRACT_VIEWBOX;
  const areaW = sceneEl.clientWidth;
  const areaH = sceneEl.clientHeight;
  const byWidth = (areaW + 2 * MAX_ROOM_CUT) / (2 * ROOM_HALF_WIDTH);
  const maxByHeight = areaH / vb.h;
  const scale = Math.max(0.1, Math.min(byWidth, maxByHeight));
  const cssW = vb.w * scale;
  const cssH = vb.h * scale;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  view = { cssW, cssH, dpr, scale };
  fitOrderTitle();
  draw(); // redesenha já: mudar o tamanho limpa o canvas
}

function draw() {
  if (!ctx || !art || !fontsReady || !view) return;
  const vb = art.SCENE_VIEWBOX;
  const k = (canvas.width / vb.w);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(k, 0, 0, canvas.height / vb.h, -vb.x * k, -vb.y * (canvas.height / vb.h));
  const s = game.state.get();
  const d = new Date();
  art.drawScene(ctx, {
    time, entities: game.sim.entities(), layout, wall: s.wall, floor: s.floor,
    now: { h: d.getHours(), m: d.getMinutes() },
  });
}

// ---------- Topo: nível, barra e moedas (seguem o estado) ----------

function renderTop() {
  const s = game.state.get();
  const p = progressInfo(s.served);
  refs.level.textContent = String(game.state.getLevel());
  refs.progress.style.setProperty('--value', `${p.pct}%`);
  refs.progress.setAttribute('aria-label', `Progresso: ${p.done} de ${p.span} bebidas para a próxima receita`);
  refs.caption.textContent = p.caption;
  refs.coins.textContent = String(s.coins);
  refs.coinsPill.setAttribute('aria-label', `${s.coins} moedas`);
}

// ---------- Cartão do pedido ----------

function drawCardPortrait() {
  const c = refs && refs.portrait.firstElementChild;
  if (!c) return;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const px = Math.round(PORTRAIT_SIZE * dpr);
  if (c.width !== px) { c.width = px; c.height = px; }
  const g = c.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, px, px);
  if (!front || !art || typeof art.drawPortrait !== 'function') return;
  g.setTransform(px / PORTRAIT_SIZE, 0, 0, px / PORTRAIT_SIZE, 0, 0);
  art.drawPortrait(g, front.look, PORTRAIT_SIZE);
}

// Pedido longo em coluna estreita (ex.: "Vinícius quer um Cappuccino" a 360): reduz a fonte
// até caber em 2 linhas, para a altura do cartão não mudar.
const TITLE_MIN_PX = 14;
function fitOrderTitle() {
  if (!refs) return;
  const t = refs.title;
  t.style.fontSize = '';
  if (!front) return;
  const maxH = parseFloat(getComputedStyle(refs.title.parentElement.parentElement).getPropertyValue('--order-title-h')) || 42;
  let size = parseFloat(getComputedStyle(t).fontSize);
  while (t.scrollHeight > maxH + 0.5 && size > TITLE_MIN_PX) {
    size -= 1;
    t.style.fontSize = `${size}px`;
  }
}

function renderOrder() {
  const recipe = front ? RECIPES.find((r) => r.id === front.recipeId) : null;
  const has = !!recipe;
  refs.portrait.classList.toggle('order__portrait--empty', !has);
  refs.title.classList.toggle('is-waiting', !has);
  refs.title.textContent = has ? `${front.name} quer um ${recipe.name}` : 'Aguardando';
  refs.price.classList.toggle('is-placeholder', !has);
  refs.price.setAttribute('aria-hidden', has ? 'false' : 'true');
  refs.priceText.textContent = `${has ? recipe.price : 0} moedas`;
  refs.prepare.disabled = !has;
  fitOrderTitle();
  drawCardPortrait();
}

// ---------- Ações ----------

function openOrder() {
  if (!front) return;
  const order = game.sim.startOrder(front.id);
  if (order) game.go('preparo', { order });
}

// Toque na cena: só o primeiro cliente (arquitetura, seção 6).
function onSceneClick(e) {
  if (!front || !art || !view) return;
  const rect = canvas.getBoundingClientRect();
  const vb = art.SCENE_VIEWBOX;
  const vx = vb.x + (e.clientX - rect.left) / view.scale;
  const vy = vb.y + (e.clientY - rect.top) / view.scale;
  const c = project(front.gx, front.gy, BODY_HEIGHT);
  const r = Math.max(TAP_RADIUS_PT / view.scale, TAP_RADIUS_VB);
  if (Math.hypot(vx - c.x, vy - c.y) <= r) openOrder();
}

function onClick(e) {
  if (e.target.closest('[data-action="prepare"]')) { openOrder(); return; }
  const item = e.target.closest('.nav__item');
  if (!item) return;
  // Café já está ativo; Cardápio e Clientes ainda não têm tela.
  if (item.dataset.nav === 'decor') game.go('decorar');
}

export default {
  enter(el, context) {
    root = el;
    game = context;
    document.documentElement.dataset.version = VERSION;
    root.innerHTML = template();
    refs = {};
    for (const n of root.querySelectorAll('[data-ref]')) refs[n.dataset.ref] = n;
    refs.prepare = root.querySelector('[data-action="prepare"]');
    root.addEventListener('click', onClick);
    sceneEl = root.querySelector('.scene');
    canvas = root.querySelector('.scene__canvas');
    canvas.addEventListener('click', onSceneClick);
    ctx = canvas.getContext('2d');
    resizeObs = new ResizeObserver(layoutCanvas);
    resizeObs.observe(sceneEl);

    front = game.sim.getFront();
    layout = decor.sceneLayout();
    renderTop();
    renderOrder();
    unsubs = [
      game.state.subscribe((ev) => {
        if (!root) return;
        if (ev.type === 'decor') layout = decor.sceneLayout();
        else renderTop();
      }),
      game.sim.subscribe((ev) => {
        if (!root || ev.type !== 'front') return;
        front = ev.customer;
        renderOrder();
      }),
    ];

    document.fonts.ready.then(() => { fontsReady = true; fitOrderTitle(); });
    // art.js é do AG03; se ainda não existir, a cena fica vazia sem erro.
    import('../art.js')
      .then((mod) => {
        if (!root || typeof mod.drawScene !== 'function' || !mod.SCENE_VIEWBOX) return;
        art = mod;
        layoutCanvas();
        drawCardPortrait();
      })
      .catch(() => { console.info('art.js indisponível: cena vazia.'); });
  },
  exit() {
    for (const u of unsubs) u();
    unsubs = [];
    if (resizeObs) resizeObs.disconnect();
    if (canvas) canvas.removeEventListener('click', onSceneClick);
    if (root) root.removeEventListener('click', onClick);
    root = game = refs = sceneEl = canvas = ctx = view = resizeObs = front = layout = null;
  },
  update(dt) {
    time += dt;
    draw();
  },
};
