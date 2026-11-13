// Conteúdo e constantes do jogo (M2 e M3). Só dados, sem lógica.
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
  entry: { gx: 1.3, gy: 4.3 }, // acima da caminha do gato
  // Fila no canto esquerdo do balcão, fora da coluna dos banquinhos na tela (T-053).
  queue: [
    { gx: 2.0, gy: 2.0 }, // Q1, em frente ao balcão, entre os dois banquinhos na tela
    { gx: 1.1, gy: 2.6 }, // Q2, ponta esquerda do balcão
    { gx: 1.0, gy: 3.25 }, // Q3, em direção à porta
  ],
  hub: { gx: 3.5, gy: 2.5 },
  exit: { gx: 2.1, gy: 4.6 }, // à esquerda do banquinho 1, fora do tapete
  barista: { gx: 2.2, gy: 0.42 },
  // Ladrilhos (c, r) reservados: sem decoração, nem tapete (arquitetura, M3.2).
  reservedTiles: [
    [0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], // balcão
    [0, 4], [0, 5], // porta
    [1, 2], [1, 3], [1, 4], [2, 2], [2, 3], [2, 4], [3, 2], // corredor: fila Q1–Q3, ENTRY, EXIT, HUB
  ],
  // Reservados onde nem banquinho de mesa pode ficar (balcão e porta). No corredor pode (decisão 28).
  noStoolTiles: [
    [0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 4], [0, 5],
  ],
  // Trechos reservados da parede direita (gy = 0), em gx. Quadro-negro e janela afastados
  // para abrir um espaço médio entre eles (decisão 30; WALL_SLOTS.mid.at).
  reservedWall: [
    { id: 'board', from: 0.2, to: 2.4 },
    { id: 'window', from: 3.35, to: 6 },
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

// ---------- Decoração (M3; arquitetura, seção M3) ----------
// where: 'floor' | 'wall'. tab: aba da loja ('salao' | 'paredes'). short: rótulo do cartão;
// article + short em minúsculas monta a pílula (“Escolha um lugar livre para a planta”).
// Marcações (só presentes quando valem): waterable (pode ser regada), under (tapete, fica por baixo),
// glow (brilho suave), seats (lugares extras), limit (máximo no jogo), clock (hora real),
// blink (pisca devagar), notes (solta notas com a música ligada).
// offset: deslocamento da âncora a partir do centro do ladrilho, em gx/gy [Proposta].
// band: faixa da parede, 'high' | 'mid' (WALL_SLOTS) [Proposta].
// short, article, offset e band são [Proposta] do AG01; nomes e preços vêm da especificação.
export const DECOR_ITEMS = [
  { id: 'pouf', name: 'Pufe', short: 'Pufe', article: 'o', where: 'floor', tab: 'salao', price: 14 },
  { id: 'plant', name: 'Planta', short: 'Planta', article: 'a', where: 'floor', tab: 'salao', price: 15, waterable: true },
  { id: 'flowerTable', name: 'Mesinha com flores', short: 'Mesinha', article: 'a', where: 'floor', tab: 'salao', price: 18 },
  { id: 'rug', name: 'Tapete', short: 'Tapete', article: 'o', where: 'floor', tab: 'salao', price: 20, under: true, offset: [0.2, 0.3] },
  { id: 'monstera', name: 'Costela-de-adão', short: 'Costela', article: 'a', where: 'floor', tab: 'salao', price: 25, waterable: true, offset: [-0.1, 0.05] },
  { id: 'floorLamp', name: 'Luminária', short: 'Luminária', article: 'a', where: 'floor', tab: 'salao', price: 30, glow: true, offset: [0, -0.3] },
  { id: 'armchair', name: 'Poltrona', short: 'Poltrona', article: 'a', where: 'floor', tab: 'salao', price: 35, offset: [0.3, 0.3] },
  { id: 'recordPlayer', name: 'Vitrola', short: 'Vitrola', article: 'a', where: 'floor', tab: 'salao', price: 38, notes: true },
  { id: 'table', name: 'Mesa com banquinhos', short: 'Mesa', article: 'a', where: 'floor', tab: 'salao', price: 40, seats: 2, offset: [0.2, 0.3] },
  { id: 'bookshelf', name: 'Estante de livros', short: 'Estante', article: 'a', where: 'floor', tab: 'salao', price: 45, offset: [-0.24, -0.4] },
  { id: 'catBed', name: 'Caminha com gatinho', short: 'Caminha', article: 'a', where: 'floor', tab: 'salao', price: 60, limit: 1, offset: [0, -0.3] },
  { id: 'bunting', name: 'Bandeirinhas', short: 'Bandeirinhas', article: 'as', where: 'wall', tab: 'paredes', price: 16, band: 'high' },
  { id: 'frame', name: 'Quadro', short: 'Quadro', article: 'o', where: 'wall', tab: 'paredes', price: 18, band: 'mid' },
  { id: 'hangingPlant', name: 'Planta pendente', short: 'Pendente', article: 'a', where: 'wall', tab: 'paredes', price: 20, band: 'mid' },
  { id: 'clock', name: 'Relógio', short: 'Relógio', article: 'o', where: 'wall', tab: 'paredes', price: 20, clock: true, band: 'mid' },
  { id: 'stringLights', name: 'Luzinhas', short: 'Luzinhas', article: 'as', where: 'wall', tab: 'paredes', price: 22, blink: true, band: 'high' },
  { id: 'cupShelf', name: 'Prateleira de xícaras', short: 'Prateleira', article: 'a', where: 'wall', tab: 'paredes', price: 26, band: 'mid' },
];

// Abas da loja, na ordem do mockup. 'cores' lista WALL_COLORS e FLOORS.
export const SHOP_TABS = [
  { id: 'salao', name: 'Salão' },
  { id: 'paredes', name: 'Paredes' },
  { id: 'cores', name: 'Cores' },
];

// Lugares de uma mesa, relativos à âncora (gx/gy). dir: sentido para onde o banquinho está virado.
// Com a mesa inicial em (3,3) + offset: (3,05, 3,8) e (4,35, 3,8), os banquinhos do M2.
// Ladrilhos dos banquinhos: (c − 1, r) e (c + 1, r), bloqueados para outros itens (decisão 28).
export const TABLE_SEATS = [
  { dx: -0.65, dy: 0, dir: '+gx' },
  { dx: 0.65, dy: 0, dir: '-gx' },
];

// Mesa só nestas colunas, para os banquinhos ficarem dentro da sala [Proposta].
export const TABLE_COLUMNS = { min: 1, max: 4 };

// Espaços de parede [Proposta]. Parede 'left' (gx = 0, ao longo de gy; porta) e 'right' (gy = 0, ao longo de gx).
// span: largura de cada posição em ladrilhos; a posição p cobre [p * span, (p + 1) * span).
// reserved: posições sem decoração. Faixa média da direita: quadro-negro e janela (ROOM.reservedWall).
// at: centro de uma posição fora da regra do span, em ladrilhos ao longo da parede (só desenho; decor.js ignora).
// Direita: só cabe 1 espaço médio, entre o quadro-negro e a janela (decisão 30).
export const WALL_SLOTS = {
  high: { count: 2, span: 3, reserved: { left: [], right: [] } },
  mid: { count: 6, span: 1, reserved: { left: [4, 5], right: [0, 1, 3, 4, 5] }, at: { right: { 2: 2.95 } } },
};

// Cores de parede, gratuitas. 'sage' é a sala atual (especificação, Cores da sala).
// A parede esquerda é a mais escura. As demais cores são [Proposta] do AG01, na paleta do jogo.
export const WALL_COLORS = [
  { id: 'sage', name: 'Verde sálvia', left: { base: '#97cfbb', stripe: '#a3d6c4' }, right: { base: '#a8dcc9', stripe: '#b6e4d3' } },
  { id: 'pink', name: 'Rosa', left: { base: '#eeb4ad', stripe: '#f3c0ba' }, right: { base: '#f7c6c0', stripe: '#fad3ce' } },
  { id: 'sky', name: 'Azul céu', left: { base: '#a6c8e6', stripe: '#b2d1ec' }, right: { base: '#b9d8f2', stripe: '#c8e1f6' } },
  { id: 'butter', name: 'Amarelo manteiga', left: { base: '#ecd28b', stripe: '#f1da9c' }, right: { base: '#f8e3a3', stripe: '#fbecbd' } },
  { id: 'lilac', name: 'Lilás', left: { base: '#bdafe0', stripe: '#c7bae6' }, right: { base: '#cfc2ec', stripe: '#dbd0f2' } },
];

// Pisos, gratuitos. 'checker' é a sala atual (especificação). pattern: 'checker' (ladrilhos a/b alternados)
// ou 'planks' (tábuas a/b). grout: linha entre ladrilhos/tábuas. Madeiras são [Proposta] do AG01.
export const FLOORS = [
  { id: 'lightWood', name: 'Madeira clara', pattern: 'planks', a: '#e8c596', b: '#ddb784', grout: '#c99a68' },
  { id: 'checker', name: 'Xadrez', pattern: 'checker', a: '#ecc194', b: '#e2b181', grout: '#d9a878' },
  { id: 'darkWood', name: 'Madeira escura', pattern: 'planks', a: '#b07a52', b: '#a06c47', grout: '#8a5a3c' },
];

export const DEFAULT_WALL = 'sage';
export const DEFAULT_FLOOR = 'checker';

// Layout inicial (arquitetura, M3.1): a composição do mockup como itens.
// Sem a caminha (decisão 29); o quadrinho azul é um 2º Quadro (decisão 27).
// Balcão, máquina, redoma, pendentes, porta, capacho, quadro-negro e janela são fixos (art.js).
export const INITIAL_DECOR = {
  items: [
    { type: 'bookshelf', c: 0, r: 2 },
    { type: 'plant', c: 0, r: 3 },
    { type: 'monstera', c: 5, r: 0 },
    { type: 'rug', c: 3, r: 3 },
    { type: 'table', c: 3, r: 3 },
    { type: 'floorLamp', c: 5, r: 3 },
    { type: 'armchair', c: 4, r: 4 },
  ],
  wallItems: [
    { type: 'bunting', wall: 'left', pos: 0 },
    { type: 'bunting', wall: 'left', pos: 1 },
    { type: 'stringLights', wall: 'right', pos: 0 },
    { type: 'clock', wall: 'left', pos: 2 },
    { type: 'frame', wall: 'left', pos: 3 },
    { type: 'frame', wall: 'left', pos: 1 },
  ],
  stock: {},
  wall: DEFAULT_WALL,
  floor: DEFAULT_FLOOR,
};

// Versão do formato salvo em 'nais-cafe-v1' [Proposta].
export const SAVE_VERSION = 1;
