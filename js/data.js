// Conteúdo e constantes do jogo (M2). Só dados, sem lógica.
// Fonte: docs/especificacao.md (Conteúdo, Mecânicas) e docs/arquitetura.md (seções 3 e 8).

const MINT = '#9ad9c2';

// ---------- Receitas ----------
// steps: ids de INGREDIENTS (ou 'art' = ART_STEP), na ordem. unlockAt: bebidas servidas.
export const RECIPES = [
  { id: 'espresso', name: 'Espresso', price: 6, steps: ['grind', 'espresso'], unlockAt: 0 },
  { id: 'tea', name: 'Chá', price: 5, steps: ['hotWater', 'teaBag'], unlockAt: 0 },
  { id: 'cappuccino', name: 'Cappuccino', price: 10, steps: ['grind', 'espresso', 'milk', 'foam'], unlockAt: 0 },
  { id: 'latte', name: 'Latte', price: 11, steps: ['grind', 'espresso', 'milk', 'art'], unlockAt: 0 },
  { id: 'mocha', name: 'Mocha', price: 13, steps: ['grind', 'espresso', 'chocolate', 'milk', 'foam'], unlockAt: 6 },
  { id: 'hotChocolate', name: 'Chocolate quente', price: 9, steps: ['chocolate', 'milk', 'foam'], unlockAt: 14 },
  { id: 'icedCoffee', name: 'Café gelado', price: 12, steps: ['ice', 'grind', 'espresso', 'milk'], unlockAt: 24 },
  // Decisão 13: favorita da Nai.
  { id: 'whippedCoffee', name: 'Café com leite batido', price: 12, steps: ['grind', 'espresso', 'foam', 'milk'], unlockAt: 10 },
];

// Marcos de liberação de receita (decisão 25).
export const RECIPE_MILESTONES = [6, 10, 14, 24];

// ---------- Ingredientes ----------
// Grade 2 × 4, nesta ordem. layer.height = fração da altura da xícara.
// tint: cor que tinge a camada anterior (sachê sobre a água).
export const INGREDIENTS = [
  { id: 'grind', name: 'Moer os grãos', short: 'Moer', layer: null, hint: 'Agora moa os grãos' },
  { id: 'espresso', name: 'Tirar o espresso', short: 'Espresso', layer: { height: 0.28, color: '#5a3524' }, hint: 'Agora tire o espresso' },
  { id: 'hotWater', name: 'Água quente', short: 'Água', layer: { height: 0.62, color: '#cfe3e6' }, hint: 'Agora coloque a água quente' },
  { id: 'teaBag', name: 'Sachê de chá', short: 'Chá', layer: null, tint: '#c98d52', hint: 'Agora coloque o sachê de chá' },
  { id: 'milk', name: 'Leite vaporizado', short: 'Leite', layer: { height: 0.34, color: '#f0dcc0' }, hint: 'Agora coloque o leite vaporizado' },
  { id: 'foam', name: 'Espuma de leite', short: 'Espuma', layer: { height: 0.16, color: '#fffaf0' }, hint: 'Agora coloque a espuma de leite' },
  { id: 'chocolate', name: 'Calda de chocolate', short: 'Chocolate', layer: { height: 0.14, color: '#3b2218' }, hint: 'Agora coloque a calda de chocolate' },
  { id: 'ice', name: 'Gelo', short: 'Gelo', layer: { height: 0.22, color: '#dcf1f9' }, hint: 'Agora coloque o gelo' },
];

// Desenho na espuma: passo final do Latte, com escolha da figura.
export const ART_STEP = {
  id: 'art',
  name: 'Desenho na espuma',
  short: 'Desenho',
  layer: { height: 0.13, color: '#fffaf0' },
  hint: 'Agora faça um desenho na espuma',
  options: [
    { id: 'heart', name: 'Coração' },
    { id: 'flower', name: 'Flor' },
    { id: 'star', name: 'Estrela' },
  ],
};

// ---------- Ciclo ----------
// Tempos em segundos; walkSpeed em ladrilhos por segundo.
export const CYCLE = {
  firstArrival: 2, // decisão 21
  arrivalMin: 7,
  arrivalMax: 14,
  queueMax: 3,
  walkSpeed: 1.7,
  seatMin: 14,
  seatMax: 26,
  tipMin: 0,
  tipMax: 2,
  artBonus: 1,
};

export const START_COINS = 40;

// Marcos de nível (bebidas servidas).
export const LEVELS = [2, 4, 6, 10, 14, 19, 24, 30, 40];

// ---------- Grade da sala (arquitetura, seção 3) ----------
// Pontos em gx/gy contínuos. dir: sentido para onde o assento está virado.
export const ROOM = {
  door: { gx: 0.15, gy: 4.9 },
  entry: { gx: 1.5, gy: 4.5 },
  queue: [
    { gx: 2.5, gy: 2.4 }, // Q1, em frente ao balcão
    { gx: 2.3, gy: 3.2 }, // Q2 (≥ 0,9 do banquinho 1)
    { gx: 2.1, gy: 4.0 }, // Q3 (≥ 0,9 do banquinho 1)
  ],
  hub: { gx: 3.5, gy: 2.5 },
  exit: { gx: 1.5, gy: 3.0 },
  barista: { gx: 2.2, gy: 0.42 },
  seats: [
    { id: 'stool1', gx: 3.05, gy: 3.8, dir: '+gx' },
    { id: 'stool2', gx: 4.35, gy: 3.8, dir: '-gx' },
  ],
  // Ladrilhos (c, r) reservados: sem decoração (uso no M3).
  reservedTiles: [
    [0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], // balcão
    [0, 4], [0, 5], // porta
    [1, 3], [1, 4], [2, 2], [2, 3], [2, 4], [3, 2], // corredor
  ],
  // Trechos reservados da parede direita (gy = 0), em gx.
  reservedWall: [
    { id: 'board', from: 0.6, to: 2.8 },
    { id: 'window', from: 3.3, to: 5.9 },
  ],
};

// ---------- Clientes comuns (decisão 19) ----------
// Sem os nomes dos clientes da casa (Marina, Téo, Lúcia, Jorge, Bia).
export const CUSTOMER_NAMES = [
  'Ana', 'Beatriz', 'Camila', 'Carla', 'Clara', 'Daniela', 'Fernanda', 'Gabriela',
  'Helena', 'Isabela', 'Joana', 'Juliana', 'Larissa', 'Laura', 'Letícia', 'Luana',
  'Mariana', 'Patrícia', 'Rafaela', 'Sofia', 'Tatiane', 'Vitória',
  'André', 'Bruno', 'Caio', 'Diego', 'Eduardo', 'Felipe', 'Gabriel', 'Gustavo',
  'Henrique', 'João', 'Lucas', 'Mateus', 'Paulo', 'Pedro', 'Rafael', 'Rodrigo',
  'Thiago', 'Vinícius',
];

// Cada parte sorteada à parte. Tons dentro da paleta do jogo.
export const CUSTOMER_LOOKS = {
  skins: ['#f6d2b8', '#e9b98f', '#d9a27a', '#c98d62', '#a86b45', '#7e4e33'],
  hairs: ['#2a2540', '#4a2f27', '#7a4b32', '#8a4b3a', '#c98a5a', '#e6e1dc'],
  shirts: ['#ffc94d', '#9cc3f0', '#ff8f7e', '#c9b6f0', '#7ed58a', '#fff6e6', '#f3dcb8'],
  pants: ['#5b4a7a', '#403f7a', '#4a2f27', '#8a5a3c', '#2a2954'],
  hairStyles: ['short', 'long', 'bun', 'curly'],
};

// Barista (decisão 15). Cores finais do AG03 (T-018).
export const BARISTA_LOOK = {
  skin: '#e2ad84', // levemente morena
  hair: '#3b2419', // castanho-escuro
  shirt: MINT,
  pants: '#5b4a7a',
  hairStyle: 'curly',
  apron: true,
};
