// Tela Preparo mínima (até a T-020): mostra o pedido, "Entregar" e "Voltar".
import { iconSvg } from '../icons.js';
import { RECIPES } from '../data.js';

let root = null;
let game = null;
let order = null;

function template(recipe) {
  return `
  <header class="prep-top">
    <button class="icon-btn" aria-label="Voltar" data-action="back">${iconSvg('back', { size: 22 })}</button>
    <div class="prep-top__info">
      <h1 class="title-prep">${recipe.name}</h1>
      <p class="caption">Pedido de ${order.customerName}</p>
    </div>
  </header>

  <div class="prep-body">
    <section class="card prep-card" aria-label="Pedido">
      <span class="label">PEDIDO</span>
      <h2 class="title-card">${order.customerName} quer um ${recipe.name}</h2>
      <div class="order__price"><span class="coin coin--sm" aria-hidden="true"></span><span>${order.price} moedas</span></div>
    </section>
  </div>

  <div class="prep-actions">
    <button class="btn btn--primary prep-actions__btn" data-action="deliver">Entregar</button>
  </div>
`;
}

function back() {
  // Decisão 24: guarda os passos (a tela mínima não tem passos; mantém o que veio).
  game.sim.saveProgress(order.customerId, order.progress ?? null);
  game.go('cafeteria');
}

function deliver() {
  game.sim.deliver({ art: null });
  game.go('cafeteria');
}

function onClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  if (btn.dataset.action === 'back') back();
  else if (btn.dataset.action === 'deliver') deliver();
}

export default {
  enter(el, context) {
    root = el;
    game = context;
    order = (context.params && context.params.order) || null;
    const recipe = order && RECIPES.find((r) => r.id === order.recipeId);
    if (!recipe) {
      // Sem pedido válido: volta sem tocar na simulação.
      const { go } = context;
      queueMicrotask(() => { if (root === el) go('cafeteria'); });
      return;
    }
    root.innerHTML = template(recipe);
    root.addEventListener('click', onClick);
  },
  exit() {
    if (root) root.removeEventListener('click', onClick);
    root = game = order = null;
  },
  update() {},
};
