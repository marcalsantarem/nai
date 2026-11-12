// Tela Cafeteria (tela inicial): topo, cena isométrica, cartão do pedido e navegação.
import { VERSION } from '../version.js';

// Valores iniciais provisórios. O estado real vem do AG01 (M2).
const LEVEL = 1;
const COINS = 40;
const DRINKS_SERVED = 0;
const NEXT_RECIPE = { name: 'o Mocha', at: 6 }; // primeira receita nova aos 6
const PREV_RECIPE_AT = 0;

// Cena: o viewBox chega de art.js; a sala (paredes de -180 a 180) pode cortar até 18 px de cada ponta.
const ROOM_HALF_WIDTH = 180;
const MAX_ROOM_CUT = 18;
const MAX_DPR = 3;
const CONTRACT_VIEWBOX = { x: -186, y: -132, w: 372, h: 330 }; // contrato com art.js, até ele carregar

const icon = (paths, size = 24) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  settings: '<circle cx="12" cy="12" r="6.3"/><circle cx="12" cy="12" r="2.4"/><path d="M12 2.6v3.1M12 18.3v3.1M2.6 12h3.1M18.3 12h3.1M5.4 5.4l2.2 2.2M16.4 16.4l2.2 2.2M5.4 18.6l2.2-2.2M16.4 7.6l2.2-2.2"/>',
  cafe: '<path d="M4 10l1.5-5h13L20 10M5 10.5V19h14v-8.5M10 19v-5h4v5M4 10a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 10"/>',
  decor: '<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM6 18v2M18 18v2"/>',
  menu: '<path d="M5 9h11v4a5.5 5.5 0 0 1-11 0zM16 10h1.5a2.5 2.5 0 0 1 0 5h-1.9M4 20h13M8.5 3.5c-1 1.2 1 1.8 0 3M12.5 3.5c-1 1.2 1 1.8 0 3"/>',
  guests: '<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.4"/><path d="M3 19c.6-3.4 3-5 6-5s5.4 1.6 6 5M16.5 14.2c2.4.2 4 1.6 4.5 4.3"/>',
};

const NAV = [
  ['cafe', 'Café'],
  ['decor', 'Decorar'],
  ['menu', 'Cardápio'],
  ['guests', 'Clientes'],
];

function progressInfo() {
  const left = Math.max(0, NEXT_RECIPE.at - DRINKS_SERVED);
  const span = NEXT_RECIPE.at - PREV_RECIPE_AT;
  const done = Math.min(span, DRINKS_SERVED - PREV_RECIPE_AT);
  const pct = Math.round((done / span) * 100);
  // espaço inseparável no nome: evita "o" / "Mocha" órfão na última linha
  const recipe = NEXT_RECIPE.name.replace(/ /g, ' ');
  const caption = left === 1
    ? `Falta 1 bebida para liberar ${recipe}`
    : `Faltam ${left} bebidas para liberar ${recipe}`;
  return { pct, caption, done, span };
}

function template() {
  const p = progressInfo();
  return `
  <header class="top">
    <div class="level"><span class="level__label">nível</span><span class="level__value">${LEVEL}</span></div>
    <div class="top__info">
      <h1 class="title-screen">Nai's Cafe</h1>
      <div class="progress" role="img" aria-label="Progresso: ${p.done} de ${p.span} bebidas para a próxima receita" style="--value:${p.pct}%"><div class="progress__fill"></div></div>
      <p class="caption">${p.caption}</p>
    </div>
    <div class="pill" aria-label="${COINS} moedas"><span class="coin" aria-hidden="true"></span><span>${COINS}</span></div>
    <button class="icon-btn" aria-label="Ajustes" data-action="settings">${icon(ICONS.settings, 22)}</button>
  </header>

  <div class="scene">
    <canvas class="scene__canvas" role="img" aria-label="Cafeteria em vista isométrica"></canvas>
  </div>

  <section class="card order" aria-label="Pedido atual">
    <div class="order__portrait order__portrait--empty" aria-hidden="true"></div>
    <div class="order__info">
      <span class="label">PEDIDO</span>
      <h2 class="title-card is-waiting">Aguardando</h2>
      <div class="order__price is-placeholder" aria-hidden="true"><span class="coin coin--sm"></span><span>0 moedas</span></div>
    </div>
    <button class="btn btn--primary order__btn" disabled>Preparar</button>
  </section>

  <nav class="nav" aria-label="Navegação principal">
    ${NAV.map(([id, label], i) =>
      `<button class="nav__item${i === 0 ? ' is-active' : ''}" data-nav="${id}"${i === 0 ? ' aria-current="page"' : ''}>${icon(ICONS[id])}<span>${label}</span></button>`
    ).join('')}
  </nav>
`;
}

let root = null;
let sceneEl = null;
let canvas = null;
let ctx = null;
let art = null; // módulo art.js, quando existir
let fontsReady = false;
let resizeObs = null;
let time = 0;
let view = null; // { cssW, cssH, dpr, scale }

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
}

function draw() {
  if (!ctx || !art || !fontsReady || !view) return;
  const vb = art.SCENE_VIEWBOX;
  const k = (canvas.width / vb.w);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(k, 0, 0, canvas.height / vb.h, -vb.x * k, -vb.y * (canvas.height / vb.h));
  art.drawScene(ctx, { time });
}

function onClick(e) {
  const item = e.target.closest('.nav__item');
  if (!item) return;
  // Café já está ativo; os outros itens ainda não têm ação (T-007).
}

export default {
  enter(el) {
    root = el;
    document.documentElement.dataset.version = VERSION;
    root.innerHTML = template();
    root.addEventListener('click', onClick);
    sceneEl = root.querySelector('.scene');
    canvas = root.querySelector('.scene__canvas');
    ctx = canvas.getContext('2d');
    resizeObs = new ResizeObserver(layoutCanvas);
    resizeObs.observe(sceneEl);
    document.fonts.ready.then(() => { fontsReady = true; });
    // art.js é do AG03; se ainda não existir, a cena fica vazia sem erro.
    import('../art.js')
      .then((mod) => {
        if (!root || typeof mod.drawScene !== 'function' || !mod.SCENE_VIEWBOX) return;
        art = mod;
        layoutCanvas();
      })
      .catch(() => { console.info('art.js indisponível: cena vazia.'); });
  },
  exit() {
    if (resizeObs) resizeObs.disconnect();
    if (root) root.removeEventListener('click', onClick);
    root = sceneEl = canvas = ctx = view = resizeObs = null;
  },
  update(dt) {
    time += dt;
    draw();
  },
};
