// Tela Preparo (T-020): passos da receita, xícara com camadas, ingredientes e entrega.
import { iconSvg, ICONS } from '../icons.js';
import { RECIPES, INGREDIENTS, ART_STEP } from '../data.js';
import { sfx } from '../audio.js';

// ---------- Xícara (SVG do mockup, viewBox 240 × 190) ----------
const CUP_PATH = 'M62 56h116v50a58 52 0 0 1-116 0z';
const CUP_BOTTOM = 158; // fundo interno da xícara
const CUP_FILL_H = 104; // altura de referência das camadas (layer.height × isto)
const POUR_TOP = 34;    // ponta do bico da leiteira
const FIG = 28;      // tamanho do desenho na espuma
const CLICK_GUARD_MS = 300; // toque que "vaza" da tela anterior (ex.: toque duplo) é ignorado

// Fundo do ícone de cada ingrediente (mockup). Leite: [Proposta], o mockup só o mostra em destaque.
const TILE_CLASS = {
  grind: 'tile--sand', espresso: 'tile--sand', chocolate: 'tile--sand',
  hotWater: 'tile--sky', ice: 'tile--sky', milk: 'tile--sky',
  teaBag: 'tile--mint', foam: 'tile--lilac',
};

let root = null;
let game = null;
let order = null;
let recipe = null;
let steps = [];      // [{ id, short, hint, layer, tint, isArt }]
let done = 0;        // passos concluídos
let art = null;      // 'heart' | 'flower' | 'star' | null
let refs = null;
let unsubs = [];
let enteredAt = 0;
let leaving = false; // trava contra entrega/volta em dobro

const stepInfo = (id) => (id === 'art' ? { ...ART_STEP, isArt: true } : INGREDIENTS.find((i) => i.id === id));

// ---------- Modelo da xícara ----------

// Camadas a partir dos passos feitos. Cada uma: { top, bottom, color, anim }.
function cupLayers(count, animateLast) {
  const layers = [];
  let figure = null;
  let tea = false;
  let cursor = CUP_BOTTOM;
  for (let i = 0; i < count; i++) {
    const s = steps[i];
    const anim = animateLast && i === count - 1;
    if (s.layer) {
      const top = cursor - s.layer.height * CUP_FILL_H;
      // A primeira desce até o fundo do recorte; as outras cobrem a onda da anterior.
      const bottom = layers.length ? cursor + 4 : CUP_BOTTOM + 8;
      layers.push({ top, bottom, color: s.layer.color, anim: anim ? 'fill' : null });
      if (s.isArt && art) figure = { id: art, cy: (top + cursor) / 2, anim };
      cursor = top;
    } else if (s.tint && layers.length) {
      const last = layers[layers.length - 1];
      layers.push({ top: last.top, bottom: last.bottom, color: s.tint, anim: anim ? 'fade' : null });
      tea = { anim };
    }
  }
  return { layers, figure, tea, top: cursor };
}

const wave = (top, bottom) => `M56 ${top.toFixed(1)}q16 -7 32 0t32 0t32 0t32 0V${bottom.toFixed(1)}H56z`;

function cupSvg(animateLast) {
  const { layers, figure, tea, top } = cupLayers(done, animateLast);
  const last = done > 0 ? steps[done - 1] : null;
  const pouring = animateLast && last && last.layer && !last.isArt;
  const layerSvg = layers
    .map((l) => `<path class="cup__layer${l.anim ? ` is-${l.anim}` : ''}" d="${wave(l.top, l.bottom)}" fill="${l.color}"/>`)
    .join('');
  const figSvg = figure
    ? `<g class="cup__figure${figure.anim ? ' is-fade' : ''}" transform="translate(${120 - FIG / 2} ${(figure.cy - FIG / 2).toFixed(1)}) scale(${FIG / 24})"><path d="${ICONS[figure.id].d}"/></g>`
    : '';
  const teaSvg = tea
    ? `<g class="cup__tea${tea.anim ? ' is-fade' : ''}"><path d="M150 ${Math.max(top + 6, 70)}V44h12" /><rect x="160" y="34" width="14" height="16" rx="3"/></g>`
    : '';
  const pourSvg = pouring
    ? `<g class="cup__pour" aria-hidden="true">
        <g transform="rotate(-32 172 26)">
          <path class="cup__pitcher" d="M150 8h40l-4 9 7 30h-46l7-30z"/>
          <path class="cup__pitcher-handle" d="M193 22h6a8 8 0 0 1 0 16h-4"/>
        </g>
        <rect x="116" y="${POUR_TOP}" width="9" height="${(top + 8 - POUR_TOP).toFixed(1)}" rx="4.5" fill="${last.layer.color}"/>
      </g>`
    : '';
  return `
    <svg class="cup" viewBox="0 0 240 190" width="240" height="190" role="img" aria-label="${cupLabel()}">
      <ellipse class="cup__shadow" cx="120" cy="170" rx="84" ry="12"/>
      <ellipse class="cup__saucer" cx="120" cy="164" rx="78" ry="11"/>
      ${pourSvg}
      <path class="cup__handle-out" d="M178 70h12a21 21 0 0 1 0 42h-10"/>
      <path class="cup__handle-in" d="M178 70h12a21 21 0 0 1 0 42h-10"/>
      <clipPath id="prep-cupclip"><path d="${CUP_PATH}"/></clipPath>
      <path class="cup__inside" d="${CUP_PATH}"/>
      <g clip-path="url(#prep-cupclip)">
        ${layerSvg}
        ${figSvg}
        <rect class="cup__gloss" x="70" y="62" width="9" height="34" rx="4.5"/>
      </g>
      ${teaSvg}
      <path class="cup__outline" d="${CUP_PATH}"/>
    </svg>`;
}

function cupLabel() {
  if (!done) return 'Xícara vazia';
  const names = steps.slice(0, done).filter((s) => s.layer || s.tint).map((s) => s.short.toLowerCase());
  return names.length ? `Xícara com ${names.join(', ')}` : 'Xícara vazia';
}

// ---------- Modelo da tela ----------

const left = () => steps.length - done;
const current = () => (done < steps.length ? steps[done] : null);

function hintText() {
  const s = current();
  return s ? s.hint : 'Tudo pronto! Toque em Entregar';
}

function stepsHtml() {
  return steps
    .map((s, i) => {
      const state = i < done ? 'done' : i === done ? 'current' : 'todo';
      const mark = state === 'done' ? iconSvg('check', { size: 20 }) : String(i + 1);
      const label = state === 'done' ? 'feito' : state === 'current' ? 'agora' : 'depois';
      const dot = `<li class="prep-step is-${state}" aria-label="Passo ${i + 1}, ${s.short}, ${label}"><span class="prep-step__dot" aria-hidden="true">${mark}</span><span class="prep-step__name" aria-hidden="true">${s.short}</span></li>`;
      const line = i < steps.length - 1 ? `<li class="prep-step__line${i < done ? ' is-done' : ''}" aria-hidden="true"></li>` : '';
      return dot + line;
    })
    .join('');
}

function ingredientsHtml() {
  return INGREDIENTS.map(
    (ing) => `<button class="prep-ing" data-ing="${ing.id}"><span class="prep-ing__tile ${TILE_CLASS[ing.id] || 'tile--sand'}">${iconSvg(ing.id, { size: 22 })}</span><span class="prep-ing__name">${ing.name}</span></button>`
  ).join('');
}

function artOptionsHtml() {
  return ART_STEP.options
    .map((o) => `<button class="prep-art__btn" data-art="${o.id}">${iconSvg(o.id, { size: 22 })}<span>${o.name}</span></button>`)
    .join('');
}

function template() {
  return `
  <header class="prep-top">
    <button class="icon-btn" aria-label="Voltar" data-action="back">${iconSvg('back', { size: 22 })}</button>
    <div class="prep-top__info">
      <h1 class="title-prep">${recipe.name} de ${order.customerName}</h1>
      <p class="prep-top__step" data-ref="stepText"></p>
    </div>
    <div class="pill" data-ref="coinsPill"><span class="coin" aria-hidden="true"></span><span data-ref="coins"></span></div>
  </header>

  <ol class="prep-steps" aria-label="Passos da receita" data-ref="steps"></ol>

  <div class="prep-stage">
    <div class="prep-stage__rail" aria-hidden="true"></div>
    <div class="prep-stage__counter" aria-hidden="true"></div>
    <div class="prep-stage__cup" data-ref="cup"></div>
  </div>

  <p class="prep-hint" aria-live="polite" data-ref="hint"></p>
  <div class="prep-art" role="group" aria-label="Escolha o desenho na espuma" data-ref="artRow" hidden>${artOptionsHtml()}</div>

  <div class="prep-grid" data-ref="grid">${ingredientsHtml()}</div>

  <button class="btn prep-deliver" data-action="deliver" data-ref="deliver"></button>
`;
}

function render(animateLast = false) {
  const s = current();
  refs.stepText.textContent = `Passo ${Math.min(done + 1, steps.length)} de ${steps.length}`;
  refs.steps.innerHTML = stepsHtml();
  refs.cup.innerHTML = cupSvg(animateLast);
  const isArt = !!(s && s.isArt);
  refs.hint.hidden = isArt;
  refs.artRow.hidden = !isArt;
  refs.hint.textContent = hintText();
  for (const b of refs.grid.children) {
    const next = !!s && b.dataset.ing === s.id;
    b.classList.toggle('is-next', next);
  }
  const n = left();
  refs.deliver.disabled = n > 0;
  refs.deliver.classList.toggle('btn--primary', n === 0);
  refs.deliver.textContent = n === 0 ? 'Entregar' : `Entregar · ${n === 1 ? 'falta 1 passo' : `faltam ${n} passos`}`;
}

function renderCoins() {
  const c = game.state.get().coins;
  refs.coins.textContent = String(c);
  refs.coinsPill.setAttribute('aria-label', `${c} moedas`);
}

// Reinicia uma animação de CSS no elemento.
function replay(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

// ---------- Ações ----------

function saveProgress() {
  game.sim.saveProgress(order.customerId, done ? { recipeId: recipe.id, done, art } : null);
}

function advance() {
  done += 1;
  sfx('step');
  saveProgress();
  render(true);
}

function onIngredient(btn) {
  const s = current();
  if (s && !s.isArt && btn.dataset.ing === s.id) { advance(); return; }
  // Errado (ou fora de hora): balança e repete o passo certo, sem punição.
  replay(btn, 'is-wrong');
  if (s && s.isArt) replay(refs.artRow, 'is-nudge');
  else { refs.hint.textContent = hintText(); replay(refs.hint, 'is-nudge'); }
}

function onArt(id) {
  const s = current();
  if (!s || !s.isArt) return;
  art = id;
  advance();
}

function back() {
  if (leaving) return;
  leaving = true;
  saveProgress(); // decisão 24
  game.go('cafeteria');
}

function deliver() {
  if (leaving || left() > 0) return;
  leaving = true;
  game.sim.deliver({ art });
  sfx('coins');
  game.go('cafeteria');
}

function onClick(e) {
  if (leaving || performance.now() - enteredAt < CLICK_GUARD_MS) return;
  const t = e.target;
  const ing = t.closest('[data-ing]');
  if (ing) { onIngredient(ing); return; }
  const opt = t.closest('[data-art]');
  if (opt) { onArt(opt.dataset.art); return; }
  const act = t.closest('[data-action]');
  if (!act || act.disabled) return;
  if (act.dataset.action === 'back') back();
  else if (act.dataset.action === 'deliver') deliver();
}

// Passos guardados (decisão 24), validados contra a receita.
function restore(progress) {
  done = 0;
  art = null;
  if (!progress || progress.recipeId !== recipe.id) return;
  const n = Math.floor(Number(progress.done) || 0);
  done = Math.max(0, Math.min(steps.length, n));
  const artIdx = steps.findIndex((s) => s.isArt);
  if (artIdx >= 0 && artIdx < done) {
    art = ART_STEP.options.some((o) => o.id === progress.art) ? progress.art : ART_STEP.options[0].id;
  }
}

export default {
  enter(el, context) {
    root = el;
    game = context;
    leaving = false;
    order = (context.params && context.params.order) || null;
    recipe = order && RECIPES.find((r) => r.id === order.recipeId);
    if (!recipe) {
      // Sem pedido válido: volta sem tocar na simulação.
      const { go } = context;
      queueMicrotask(() => { if (root === el) go('cafeteria'); });
      return;
    }
    steps = recipe.steps.map(stepInfo);
    restore(order.progress);
    enteredAt = performance.now();
    root.classList.add('prep');
    root.innerHTML = template();
    refs = {};
    for (const n of root.querySelectorAll('[data-ref]')) refs[n.dataset.ref] = n;
    render(false);
    renderCoins();
    unsubs = [game.state.subscribe((ev) => { if (refs && ev.type === 'coins') renderCoins(); })];
    root.addEventListener('click', onClick);
  },
  exit() {
    for (const u of unsubs) u();
    unsubs = [];
    if (root) root.removeEventListener('click', onClick);
    root = game = order = recipe = refs = null;
    steps = [];
  },
  update() {},
};
