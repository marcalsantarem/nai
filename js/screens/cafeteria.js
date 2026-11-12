// Tela Cafeteria (tela inicial): topo, cena isométrica, cartão do pedido e navegação.
import { VERSION } from '../version.js';
import { iconSvg } from '../icons.js';

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
    <button class="icon-btn" aria-label="Ajustes" data-action="settings">${iconSvg('settings', { size: 22 })}</button>
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
      `<button class="nav__item${i === 0 ? ' is-active' : ''}" data-nav="${id}"${i === 0 ? ' aria-current="page"' : ''}>${iconSvg(id)}<span>${label}</span></button>`
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
