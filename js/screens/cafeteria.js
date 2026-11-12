// PROVISÓRIO (T-004): amostra dos componentes nas posições do mockup.
// A T-007 substitui este conteúdo pela tela Cafeteria real.

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

const TEMPLATE = `
  <header style="position:relative;display:flex;align-items:center;gap:10px;padding:0 var(--gutter)">
    <div class="level"><span class="level__label">nível</span><span class="level__value">3</span></div>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:5px">
      <h1 class="title-screen">Nai's Cafe</h1>
      <div class="progress" role="img" aria-label="Progresso: 4 de 6 bebidas" style="--value:66%"><div class="progress__fill"></div></div>
      <p class="caption">Faltam 2 bebidas para liberar o Mocha</p>
    </div>
    <div class="pill"><span class="coin" aria-hidden="true"></span><span>128</span></div>
    <button class="icon-btn" aria-label="Ajustes">${icon(ICONS.settings, 22)}</button>
  </header>

  <div style="position:relative;flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:0 var(--gutter)">
    <p class="caption">(cena isométrica: T-007)</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
      <button class="btn btn--neutral">Neutro</button>
      <button class="btn" disabled>Desativado</button>
    </div>
    <span class="badge">5 visitas</span>
  </div>

  <section class="card" aria-label="Pedido atual" style="margin:0 var(--gutter) 14px;display:flex;align-items:center;gap:12px">
    <div aria-hidden="true" style="width:60px;height:60px;flex:none;border-radius:50%;border:var(--outline);background:var(--coral)"></div>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px">
      <span class="label">PEDIDO</span>
      <h2 class="title-card">Marina quer um Latte</h2>
      <div class="text-muted" style="display:flex;align-items:center;gap:6px">
        <span class="coin coin--sm" aria-hidden="true"></span><span>11 moedas</span>
      </div>
    </div>
    <button class="btn btn--primary" style="flex:none">Preparar</button>
  </section>

  <nav class="nav" aria-label="Navegação principal">
    ${NAV.map(([id, label], i) =>
      `<button class="nav__item${i === 0 ? ' is-active' : ''}" data-nav="${id}">${icon(ICONS[id])}<span>${label}</span></button>`
    ).join('')}
  </nav>
`;

let root = null;

function onNav(e) {
  const item = e.target.closest('.nav__item');
  if (!item) return;
  root.querySelectorAll('.nav__item').forEach((b) => b.classList.toggle('is-active', b === item));
}

export default {
  enter(el) {
    root = el;
    root.innerHTML = TEMPLATE;
    root.addEventListener('click', onNav);
  },
  exit() {
    root.removeEventListener('click', onNav);
    root = null;
  },
  update(dt) {},
};
