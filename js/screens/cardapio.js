// Tela Cardápio (T-041): as 8 receitas na ordem dos marcos, com preço e passos; bloqueadas tracejadas.
// Sem mockup: mesmos cartões da tela Clientes (04-clientes).
import { iconSvg } from '../icons.js';
import { RECIPES, INGREDIENTS, ART_STEP } from '../data.js';

const NAV = [
  ['cafe', 'Café', 'cafeteria'],
  ['decor', 'Decorar', 'decorar'],
  ['menu', 'Cardápio', 'cardapio'],
  ['guests', 'Clientes', 'clientes'],
];
const ACTIVE = 'menu';

// Cor do quadradinho do passo: a mesma do botão do ingrediente no Preparo.
const TILE_CLASS = {
  grind: 'tile--sand', espresso: 'tile--sand', chocolate: 'tile--sand',
  hotWater: 'tile--sky', ice: 'tile--sky', milk: 'tile--sky',
  teaBag: 'tile--mint', foam: 'tile--lilac', art: 'tile--lilac',
};
const ART_ICON = ART_STEP.options[0].id; // 'heart'

// Ordem pelos marcos (estável: as quatro iniciais na ordem de RECIPES).
const ORDERED = RECIPES.map((r, i) => ({ r, i }))
  .sort((a, b) => a.r.unlockAt - b.r.unlockAt || a.i - b.i)
  .map(({ r }) => r);

const stepOf = (id) => (id === 'art' ? ART_STEP : INGREDIENTS.find((g) => g.id === id));

function stepsHtml(recipe) {
  const names = recipe.steps.map((id) => (stepOf(id) || {}).short || id);
  const items = recipe.steps.map((id, i) => {
    const tile = `<li class="recipe__step ${TILE_CLASS[id] || 'tile--sand'}">${iconSvg(id === 'art' ? ART_ICON : id, { size: 18 })}</li>`;
    return i ? `<li class="recipe__link"></li>${tile}` : tile;
  });
  return `<ol class="recipe__steps" aria-label="Passos: ${names.join(', ')}">${items.join('')}</ol>`;
}

function openCard(r) {
  return `
    <li class="card recipe">
      <div class="recipe__head">
        <h2 class="guest__name">${r.name}</h2>
        <span class="recipe__price"><span class="coin coin--sm" aria-hidden="true"></span>${r.price} moedas</span>
      </div>
      ${stepsHtml(r)}
    </li>`;
}

function lockedCard(r) {
  return `
    <li class="recipe recipe--locked">
      <h2 class="guest__name">${r.name}</h2>
      <p class="guest__hint">Libera com ${r.unlockAt} bebidas servidas</p>
    </li>`;
}

function template() {
  return `
  <header class="list-top">
    <div class="list-top__info">
      <h1 class="title-prep">Cardápio</h1>
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
let unsub = null;

function renderCoins() {
  const c = game.state.get().coins;
  refs.coins.textContent = String(c);
  refs.coinsPill.setAttribute('aria-label', `${c} moedas`);
}

function renderList() {
  const served = game.state.get().served;
  const open = ORDERED.filter((r) => r.unlockAt <= served);
  // [Proposta] legenda do topo
  refs.count.textContent = `${open.length} de ${RECIPES.length} receitas liberadas`;
  refs.list.innerHTML = ORDERED.map((r) => (r.unlockAt <= served ? openCard(r) : lockedCard(r))).join('');
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
    root.classList.add('recipes');
    root.innerHTML = template();
    refs = {};
    for (const n of root.querySelectorAll('[data-ref]')) refs[n.dataset.ref] = n;
    root.addEventListener('click', onClick);
    renderCoins();
    renderList();
    unsub = game.state.subscribe((ev) => {
      if (!refs) return;
      if (ev.type === 'coins') renderCoins();
      else if (ev.type === 'served') renderList();
    });
  },
  exit() {
    if (unsub) unsub();
    if (root) root.removeEventListener('click', onClick);
    root = game = refs = unsub = null;
  },
  update() {},
};
