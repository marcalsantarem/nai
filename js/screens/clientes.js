// Tela Clientes da casa (T-040): quem já passou por aqui, com retrato, visitas, favorita e última fala.
// Mockup 04-clientes; dados em REGULARS (data.js) e visitas em state.getVisits.
import { iconSvg } from '../icons.js';
import { REGULARS, RECIPES } from '../data.js';

const PORTRAIT = 54; // área interna do retrato (60 menos o contorno)
const MAX_DPR = 3;
const NAV = [
  ['cafe', 'Café', 'cafeteria'],
  ['decor', 'Decorar', 'decorar'],
  ['menu', 'Cardápio', 'cardapio'],
  ['guests', 'Clientes', 'clientes'],
];
const ACTIVE = 'guests';

const recipeName = (id) => (RECIPES.find((r) => r.id === id) || {}).name || '';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Última fala dita: a sim usa lines[visitas % 3] antes de contar a visita.
function lastLine(reg, visits) {
  return reg.lines[(visits - 1) % reg.lines.length];
}

// Condição do cartão misterioso. Bia: até o Mocha entrar; os outros (e Bia depois disso): [Proposta].
function mysteryText(reg) {
  if (reg.requires && !game.state.isUnlocked(reg.requires)) {
    return `Aparece depois que o ${recipeName(reg.requires)} entrar no cardápio.`;
  }
  return 'Ainda não passou por aqui.';
}

function knownCard(reg, visits) {
  return `
    <li class="card guest">
      <div class="guest__portrait" aria-hidden="true"><canvas class="guest__portrait-canvas" data-portrait="${reg.id}"></canvas></div>
      <div class="guest__info">
        <div class="guest__head">
          <h2 class="guest__name">${esc(reg.name)}</h2>
          <span class="badge">${visits === 1 ? '1 visita' : `${visits} visitas`}</span>
        </div>
        <div class="guest__fav">${iconSvg('cup', { size: 16 })}<span>Sempre pede ${esc(recipeName(reg.favorite))}</span></div>
        <p class="guest__line">“${esc(lastLine(reg, visits))}”</p>
      </div>
    </li>`;
}

function mysteryCard(reg) {
  return `
    <li class="guest guest--mystery">
      <div class="guest__portrait guest__portrait--mystery" aria-hidden="true">?</div>
      <div class="guest__info">
        <h2 class="guest__name">Cliente misterioso</h2>
        <p class="guest__hint">${esc(mysteryText(reg))}</p>
      </div>
    </li>`;
}

function template() {
  return `
  <header class="list-top">
    <div class="list-top__info">
      <h1 class="title-prep">Clientes da casa</h1>
      <p class="prep-top__step" data-ref="count"></p>
    </div>
    <div class="pill" data-ref="coinsPill"><span class="coin" aria-hidden="true"></span><span data-ref="coins"></span></div>
  </header>
  <ul class="card-list scroll" data-ref="list"></ul>
  <nav class="nav" aria-label="Navegação principal">
    ${NAV.map(([id, label]) => {
      const on = id === ACTIVE;
      return `<button class="nav__item${on ? ' is-active' : ''}" data-nav="${id}"${on ? ' aria-current="page"' : ''}>${iconSvg(id)}<span>${label}</span></button>`;
    }).join('')}
  </nav>`;
}

let root = null;
let game = null;
let refs = null;
let art = null;
let unsub = null;

function renderCoins() {
  const c = game.state.get().coins;
  refs.coins.textContent = String(c);
  refs.coinsPill.setAttribute('aria-label', `${c} moedas`);
}

function drawPortraits() {
  if (!art || !refs) return;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const px = Math.round(PORTRAIT * dpr);
  for (const c of refs.list.querySelectorAll('[data-portrait]')) {
    const look = art.lookOf({ regular: c.dataset.portrait });
    if (!look) continue;
    c.width = c.height = px;
    const g = c.getContext('2d');
    g.setTransform(px / PORTRAIT, 0, 0, px / PORTRAIT, 0, 0);
    art.drawPortrait(g, look, PORTRAIT, { background: look.portraitBg });
  }
}

function renderList() {
  const known = [];
  const unknown = [];
  for (const reg of REGULARS) {
    const v = game.state.getVisits(reg.id);
    if (v > 0) known.push(knownCard(reg, v));
    else unknown.push(mysteryCard(reg));
  }
  refs.count.textContent = `${known.length} de ${REGULARS.length} já passaram por aqui`;
  refs.list.innerHTML = known.join('') + unknown.join('');
  drawPortraits();
}

function onClick(e) {
  const item = e.target.closest('.nav__item');
  if (!item || item.dataset.nav === ACTIVE) return;
  const to = NAV.find(([id]) => id === item.dataset.nav);
  if (to) game.go(to[2]);
}

export default {
  enter(el, context) {
    root = el;
    game = context;
    root.classList.add('guests');
    root.innerHTML = template();
    refs = {};
    for (const n of root.querySelectorAll('[data-ref]')) refs[n.dataset.ref] = n;
    root.addEventListener('click', onClick);
    renderCoins();
    renderList();
    unsub = game.state.subscribe((ev) => {
      if (!refs) return;
      if (ev.type === 'coins') renderCoins();
      else if (ev.type === 'regulars' || ev.type === 'unlock') renderList();
    });
    import('../art.js')
      .then((mod) => {
        if (!root || typeof mod.drawPortrait !== 'function') return;
        art = mod;
        drawPortraits();
      })
      .catch(() => { console.info('art.js indisponível: retratos vazios.'); });
  },
  exit() {
    if (unsub) unsub();
    if (root) root.removeEventListener('click', onClick);
    root = game = refs = unsub = null;
  },
  update() {},
};
