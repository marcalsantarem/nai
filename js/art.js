// Arte da sala (composição inicial do mockup), desenhada por código sobre js/iso.js.
// Cada objeto é uma função pura drawX(ctx, x, y, ...) com (x, y) = ponto de apoio no chão,
// na tela (normalmente project(gx, gy)). As mesmas funções servem cena, miniaturas e retratos.

import {
  project, shade, poly, ellipse, circle, roundRect, contactShadow,
  tile, box, faceRect, cylinder, wall, wallTransform, sortByDepth, GRID,
} from './iso.js';

export const SCENE_VIEWBOX = { x: -186, y: -132, w: 372, h: 330 };

const INK = '#4a2f27';
const CREAM = '#fff6e6';
const CORAL = '#ff8f7e';
const YELLOW = '#ffc94d';
const MINT = '#9ad9c2';
const BLUE = '#9cc3f0';
const GLOW = '#fff3c4';
const TITLE_FONT = "'Baloo 2', 'Trebuchet MS', sans-serif";

const WALL_LEFT = { base: '#97cfbb', stripe: '#a3d6c4', wainscot: '#ead9b9', rail: '#d6bf97', baseboard: '#c29c6c', panel: '#e0cca6' };
const WALL_RIGHT = { base: '#a8dcc9', stripe: '#b6e4d3', wainscot: '#f6e7cc', rail: '#e3cda6', baseboard: '#d2ad7c', panel: '#eedbb8' };

// ---------- Utilitários locais ----------

function withAlpha(ctx, a, fn) {
  const prev = ctx.globalAlpha;
  ctx.globalAlpha = prev * a;
  fn();
  ctx.globalAlpha = prev;
}

function strokeLine(ctx, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// Executa fn com a origem movida para (x, y) (e escala opcional, para miniaturas).
function at(ctx, x, y, fn, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  if (s !== 1) ctx.scale(s, s);
  fn();
  ctx.restore();
}

// ---------- Piso e paredes ----------

export function drawFloor(ctx) {
  const l = project(0, GRID), f = project(GRID, GRID), r = project(GRID, 0);
  poly(ctx, [l.x, l.y, f.x, f.y, f.x, f.y + 10, l.x, l.y + 10], '#8a5a3c');
  poly(ctx, [r.x, r.y, f.x, f.y, f.x, f.y + 10, r.x, r.y + 10], '#6f452d');
  for (let gx = 0; gx < GRID; gx++) {
    for (let gy = 0; gy < GRID; gy++) {
      tile(ctx, gx, gy, (gx + gy) % 2 ? '#e2b181' : '#ecc194', '#d9a878');
    }
  }
}

// Porta. (x, 0) = canto inferior esquerdo, no plano local da parede.
export function drawDoor(ctx, x, y) {
  at(ctx, x, y, () => {
    roundRect(ctx, 0, -93, 44, 93, 4, CREAM);
    roundRect(ctx, 3, -90, 38, 90, 3, '#4f8f8a');
    roundRect(ctx, 10, -82, 24, 26, 3, '#3d4283');
    roundRect(ctx, 10, -48, 24, 36, 3, '#5fa39d');
    circle(ctx, 36, -44, 2.6, YELLOW);
  });
}

// Quadro com paisagem. (x, y) = canto superior esquerdo.
export function drawPicture(ctx, x, y) {
  at(ctx, x, y, () => {
    roundRect(ctx, 0, 0, 22, 27, 2, '#8a5a3c');
    roundRect(ctx, 3, 3, 16, 21, 1, '#ffd9cf');
    circle(ctx, 11, 11, 4, CORAL);
    ctx.beginPath();
    ctx.moveTo(3, 24);
    ctx.quadraticCurveTo(11, 14, 19, 24);
    ctx.closePath();
    ctx.fillStyle = '#6cc58f';
    ctx.fill();
  });
}

// Quadrinho azul. (x, y) = canto superior esquerdo.
export function drawSmallFrame(ctx, x, y) {
  roundRect(ctx, x, y, 16, 16, 2, CREAM);
  roundRect(ctx, x + 3, y + 3, 10, 10, 1, BLUE);
}

// Relógio. (x, y) = centro.
export function drawClock(ctx, x, y) {
  circle(ctx, x, y, 10, INK);
  circle(ctx, x, y, 8, CREAM);
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x, y - 5);
  ctx.moveTo(x, y); ctx.lineTo(x + 4, y);
  strokeLine(ctx, INK, 1.4);
}

// Bandeirinhas: cordão em dois arcos de 86. (x, y) = ponta esquerda do cordão.
const BUNTING = [[16, 3.5, CORAL], [32, 5.7, YELLOW], [49, 6, BLUE], [66, 4, CREAM]];
export function drawBunting(ctx, x, y) {
  at(ctx, x, y, () => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(43, 13, 86, 0);
    ctx.quadraticCurveTo(129, 13, 172, 0);
    strokeLine(ctx, INK, 1);
    for (const off of [0, 86]) {
      for (const [cx, top, color] of BUNTING) {
        const c = cx + off;
        poly(ctx, [c - 4, top, c + 4, top, c, top + 9], color);
      }
    }
  });
}

// Quadro-negro do cardápio. (x, y) = canto superior esquerdo da moldura.
export function drawChalkboard(ctx, x, y, title = 'Cardápio') {
  at(ctx, x, y, () => {
    roundRect(ctx, 0, 0, 66, 56, 4, '#8a5a3c');
    roundRect(ctx, 4, 4, 58, 48, 2, '#2f423f');
    ctx.font = `700 10px ${TITLE_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = CREAM;
    ctx.fillText(title, 33, 18);
    const rows = [[25, 26], [33, 20], [41, 24]];
    for (const [ry, w] of rows) {
      roundRect(ctx, 10, ry, w, 2, 1, CREAM, 0.85);
      roundRect(ctx, 46, ry, 10, 2, 1, YELLOW);
    }
  });
}

// Janela com chuva e cortinas. (x, y) = canto superior esquerdo da moldura (sem o varão).
// time > 0 anima a chuva; time = 0 desenha as gotas na posição do mockup.
const RAIN = [[12, 24], [22, 10], [30, 30], [44, 26], [57, 34], [18, 42], [48, 44]]; // início de cada gota
export function drawWindow(ctx, x, y, time = 0) {
  at(ctx, x, y, () => {
    roundRect(ctx, -4, -5, 78, 4, 2, '#8a5a3c');
    roundRect(ctx, 0, 0, 70, 66, 5, CREAM);
    roundRect(ctx, 5, 5, 60, 56, 2, '#3d4283');
    ctx.fillStyle = '#7a6aa8';
    ctx.fillRect(5, 38, 60, 13);
    ctx.fillStyle = '#f0a493';
    ctx.fillRect(5, 51, 60, 10);
    circle(ctx, 51, 17, 5, GLOW);
    circle(ctx, 14, 13, 1, CREAM);
    circle(ctx, 26, 21, 1, CREAM);
    circle(ctx, 39, 11, 1, CREAM);
    // chuva (recortada no vidro)
    ctx.save();
    ctx.beginPath();
    ctx.rect(5, 5, 60, 56);
    ctx.clip();
    const fall = time ? (time * 40) % 56 : 0;
    ctx.beginPath();
    for (const [sx, sy] of RAIN) {
      const yy = 5 + (sy - 5 + fall) % 56;
      const xx = 5 + (((sx - 5 - (fall * 2) / 7) % 60) + 60) % 60;
      ctx.moveTo(xx, yy); ctx.lineTo(xx - 2, yy + 7);
    }
    withAlpha(ctx, 0.5, () => strokeLine(ctx, '#ffffff', 1));
    ctx.restore();
    ctx.fillStyle = CREAM;
    ctx.fillRect(33.5, 5, 3, 56);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(17, 0); ctx.quadraticCurveTo(15, 32, 0, 46); ctx.closePath();
    ctx.moveTo(70, 0); ctx.lineTo(53, 0); ctx.quadraticCurveTo(55, 32, 70, 46); ctx.closePath();
    ctx.fillStyle = CORAL;
    ctx.fill();
    roundRect(ctx, -5, 64, 80, 5, 2, CREAM);
  });
}

// Cordão de luzinhas. (x, y) = ponta esquerda do cordão. time > 0 faz as luzes piscarem de leve.
const BULBS = [[11, 6.4, YELLOW], [23, 7.6, CORAL], [35, 6.4, GLOW], [57, 6.4, YELLOW], [69, 7.6, CORAL], [81, 6.4, GLOW]];
export function drawStringLights(ctx, x, y, time = 0) {
  at(ctx, x, y, () => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(23, 11, 46, 0);
    ctx.quadraticCurveTo(69, 11, 92, 0);
    strokeLine(ctx, INK, 1);
    BULBS.forEach(([bx, by, color], i) => {
      const halo = time ? 0.25 + 0.12 * Math.sin(time * 2.4 + i * 1.9) : 0.25;
      circle(ctx, bx, by, 5, GLOW, halo);
      circle(ctx, bx, by, 2.6, color);
    });
  });
}

function drawLeftWall(ctx) {
  wall(ctx, 'left', WALL_LEFT);
  ctx.save();
  wallTransform(ctx, 'left');
  drawDoor(ctx, -169, 0);
  drawPicture(ctx, -116, -99);
  drawSmallFrame(ctx, -90, -90);
  drawClock(ctx, -63, -98);
  drawBunting(ctx, -176, -119);
  ctx.restore();
}

function drawRightWall(ctx, time) {
  wall(ctx, 'right', WALL_RIGHT);
  ctx.save();
  wallTransform(ctx, 'right');
  drawChalkboard(ctx, 18, -112);
  drawWindow(ctx, 100, -114, time);
  drawStringLights(ctx, 3, -121, time);
  ctx.restore();
}

// ---------- Itens no chão (planos) ----------

// Luz da janela no chão.
export function drawWindowLight(ctx) {
  const p = [project(3.5, 0.1), project(5.5, 0.1), project(5.9, 2.4), project(3.9, 2.4)];
  withAlpha(ctx, 0.3, () => poly(ctx, p.flatMap((q) => [q.x, q.y]), GLOW));
}

// Capacho retangular. (gx, gy) = canto do fundo; w × d em ladrilhos.
export function drawDoorMat(ctx, gx, gy, w = 0.74, d = 1.1) {
  tile(ctx, gx, gy, CORAL, null, w, d);
  tile(ctx, gx + 0.14, gy + 0.15, '#ffd9cf', null, w - 0.28, d - 0.3);
}

// Tapete redondo. (x, y) = centro. s = escala (1 na sala).
export function drawRoundRug(ctx, x, y, s = 1) {
  ellipse(ctx, x, y, 50.9 * s, 25.5 * s, CORAL);
  ellipse(ctx, x, y, 41.7 * s, 20.9 * s, '#ffd9cf');
  ellipse(ctx, x, y, 30.5 * s, 15.3 * s, '#ffb3a6');
}

// ---------- Móveis e objetos ----------
// Nos objetos montados com box(), o desenho é feito em coordenadas de grade relativas ao apoio.

// Estante com 3 prateleiras de livros. Apoio = centro da base (encostada na parede esquerda).
const BOOK_COLORS = [CORAL, YELLOW, MINT, BLUE, CREAM];
const BOOK_HEIGHTS = [11, 13, 15, 12, 14];
export function drawBookshelf(ctx, x, y) {
  const g0 = 0.26, g1 = 2.1; // apoio em grade (centro da base)
  const o = project(g0, g1);
  at(ctx, x - o.x, y - o.y, () => {
    box(ctx, 0.05, 1.5, 0.42, 1.2, 72, '#b07a52');
    const F = 0.47; // plano da frente
    faceRect(ctx, 'right', F, 1.58, 2.62, 6, 66, '#6d4630');
    faceRect(ctx, 'right', F, 1.58, 2.62, 25, 27, '#b07a52');
    faceRect(ctx, 'right', F, 1.58, 2.62, 45, 47, '#b07a52');
    [7, 27, 47].forEach((h0, row) => {
      for (let i = 0; i < 9; i++) {
        const u = 1.62 + i * 0.107917;
        faceRect(ctx, 'right', F, u, u + 0.0867, h0, h0 + BOOK_HEIGHTS[i % 5], BOOK_COLORS[(i + 2 * row) % 5]);
      }
    });
  });
}

// Máquina de espresso vermelha. Apoio = centro da base (sobre o tampo, z = 30 na sala).
export function drawEspressoMachine(ctx, x, y) {
  const o = project(1.31, 1.3);
  at(ctx, x - o.x, y - o.y, () => {
    box(ctx, 1.0, 1.05, 0.62, 0.5, 22, '#ff7b6b');
    box(ctx, 0.947, 1.367, 0.46, 0.06, 6, CREAM);
    box(ctx, 1.1, 1.15, 0.14, 0.14, 6, CREAM, { z: 22 });
    box(ctx, 1.32, 1.148, 0.14, 0.14, 6, CREAM, { z: 22 });
  });
}

// Pote com tampa. (x, y) = centro da base.
export function drawJar(ctx, x, y) {
  cylinder(ctx, x, y, 3 / 42, 12, CREAM, '#bdb098');
}

// Bolo na redoma. (x, y) = centro do prato.
export function drawCakeDome(ctx, x, y) {
  ellipse(ctx, x, y, 13, 6.5, CREAM);
  roundRect(ctx, x - 7, y - 9, 14, 8, 2, '#ffb3a6');
  ellipse(ctx, x, y - 9, 7, 3, '#ffd9cf');
  ctx.beginPath();
  ctx.ellipse(x, y, 12, 13, 0, Math.PI, Math.PI * 2);
  ctx.closePath();
  withAlpha(ctx, 0.4, () => {
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    strokeLine(ctx, '#ffffff', 1);
  });
}

// Balcão com máquina, pote e bolo. Apoio = centro da base.
export function drawCounter(ctx, x, y) {
  const o = project(2.25, 1.3);
  at(ctx, x - o.x, y - o.y, () => {
    box(ctx, 0.8, 0.9, 2.9, 0.8, 30, '#c98a5a', { top: '#f8e6c8' });
    faceRect(ctx, 'left', 1.7, 0.95, 3.55, 7, 23, '#b57a4c');
    const m = project(1.31, 1.3, 30);
    drawEspressoMachine(ctx, m.x, m.y);
    drawJar(ctx, 24, 21);
    drawCakeDome(ctx, 45, 31.5);
  });
}

// Luminária pendente. (x, y) = centro da boca da cúpula; o fio sobe 49.
export function drawPendantLamp(ctx, x, y, time = 0) {
  ctx.fillStyle = INK;
  ctx.fillRect(x - 0.6, y - 49, 1.2, 40);
  circle(ctx, x, y, 17, GLOW, 0.22);
  poly(ctx, [x - 3, y - 9, x + 3, y - 9, x + 8, y, x - 8, y], YELLOW);
  ellipse(ctx, x, y, 8, 2.4, '#ffe08f');
}

// Planta pequena em vaso. (x, y) = centro da sombra.
export function drawPlant(ctx, x, y) {
  contactShadow(ctx, x, y, 12, 6);
  cylinder(ctx, x, y, 5.5 / 42, 13, '#f08a70', '#b45c47');
  circle(ctx, x - 6, y - 19, 8, '#4fa87a');
  circle(ctx, x + 6, y - 20, 8, '#4fa87a');
  circle(ctx, x, y - 27, 9.5, '#6cc58f');
  circle(ctx, x - 3, y - 30, 3, '#9be3b4', 0.8);
}

// Costela-de-adão em vaso alto. (x, y) = centro da sombra.
export function drawMonstera(ctx, x, y) {
  contactShadow(ctx, x, y, 14, 7);
  cylinder(ctx, x, y, 6.4 / 42, 15, CREAM, '#bdb098');
  const py = y - 15;
  [[-62, '#4fa87a'], [-32, '#6cc58f'], [0, '#4fa87a'], [32, '#6cc58f'], [62, '#4fa87a']].forEach(([deg, color]) => {
    const a = (deg * Math.PI) / 180;
    ctx.beginPath();
    ctx.ellipse(x + 21 * Math.sin(a), py - 21 * Math.cos(a), 7.5, 21, a, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
  ellipse(ctx, x, y - 33, 2, 16, '#9be3b4', 0.5);
}

// Banquinho. (x, y) = centro da sombra.
export function drawStool(ctx, x, y) {
  contactShadow(ctx, x, y, 8, 4);
  cylinder(ctx, x, y, 6.8 / 42, 12, MINT, '#569481');
}

// Mesa redonda com xícara. (x, y) = centro da sombra.
export function drawTable(ctx, x, y, { cup = true } = {}) {
  contactShadow(ctx, x, y, 16, 8);
  cylinder(ctx, x, y, 2.5 / 42, 24, '#8a5a3c', '#6b462e');
  cylinder(ctx, x, y - 24, 17.8 / 42, 3, '#fff0d6', '#bdab8f');
  if (cup) {
    roundRect(ctx, x + 1.6, y - 31.5, 7, 7, 1.5, CREAM);
    ctx.strokeStyle = '#ccc4b8';
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ellipse(ctx, x + 5.1, y - 31.5, 3, 1.2, '#8a5a3c');
  }
}

// Luminária de chão. (x, y) = centro da sombra.
export function drawFloorLamp(ctx, x, y) {
  contactShadow(ctx, x, y, 9, 4.5);
  ellipse(ctx, x, y, 7, 3.5, INK);
  roundRect(ctx, x - 1.5, y - 60, 3, 60, 1, INK);
  circle(ctx, x, y - 52, 34, GLOW, 0.2);
  poly(ctx, [x - 7, y - 78, x + 7, y - 78, x + 13, y - 56, x - 13, y - 56], YELLOW);
  ellipse(ctx, x, y - 56, 13, 3.5, '#ffe08f');
}

// Poltrona amarela. (x, y) = centro da base.
export function drawArmchair(ctx, x, y) {
  contactShadow(ctx, x, y, 20, 10);
  at(ctx, x, y, () => {
    const c = '#f2b84b';
    box(ctx, -0.342, -0.34, 0.684, 0.17, 42, c);
    box(ctx, -0.34, -0.17, 0.148, 0.51, 25, c);
    box(ctx, -0.192, -0.17, 0.38, 0.508, 15, '#ffca52');
    box(ctx, 0.192, -0.168, 0.148, 0.51, 25, c);
  });
}

// Gato dormindo. (x, y) = centro do corpo.
export function drawCat(ctx, x, y, time = 0) {
  ellipse(ctx, x, y, 10.5, 6, '#f0a35c');
  ellipse(ctx, x + 6, y + 2.5, 6, 2.4, '#d98842');
  circle(ctx, x - 7, y - 2, 5, '#f0a35c');
  poly(ctx, [x - 11, y - 5, x - 10, y - 10, x - 7, y - 6], '#f0a35c');
  poly(ctx, [x - 6, y - 6, x - 4, y - 10, x - 3, y - 4], '#f0a35c');
  ctx.beginPath();
  ctx.moveTo(x - 9.5, y - 2); ctx.quadraticCurveTo(x - 8.5, y - 1, x - 7.5, y - 2);
  ctx.moveTo(x - 6, y - 2); ctx.quadraticCurveTo(x - 5, y - 1, x - 4, y - 2);
  strokeLine(ctx, INK, 0.8);
  const bob = time ? Math.sin(time * 1.6) * 1.5 : 0;
  ctx.font = `700 9px ${TITLE_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = CREAM;
  ctx.fillText('z', x + 6, y - 11 + bob);
}

// Caminha do gato (com o gato, por padrão). (x, y) = centro da base.
export function drawCatBed(ctx, x, y, { cat = true, time = 0 } = {}) {
  ellipse(ctx, x, y, 17, 9, '#8f86c9');
  ellipse(ctx, x, y - 2, 13, 6.5, '#cbbbe6');
  if (cat) drawCat(ctx, x, y - 6, time);
}

// ---------- Personagens ----------
// look: { skin, hair, shirt, pants, hairStyle: 'short' | 'long' | 'bun', apron, seated }

export const LOOKS = {
  barista: { skin: '#f6d2b8', hair: '#7a4b32', shirt: MINT, pants: '#5b4a7a', hairStyle: 'long', apron: true },
  // Aparências dos clientes vistos no mockup (para o M2):
  marina: { skin: '#e9b98f', hair: '#8a4b3a', shirt: YELLOW, pants: '#5b4a7a', hairStyle: 'long' },
  lucia: { skin: '#f6d2b8', hair: '#e6e1dc', shirt: '#c9b6f0', pants: '#5b4a7a', hairStyle: 'bun' },
  teo: { skin: '#c98d62', hair: '#2a2540', shirt: BLUE, pants: '#5b4a7a', hairStyle: 'short' },
};

// Personagem. (x, y) = centro da sombra (no chão ou no assento, se seated).
export function drawCharacter(ctx, look, x = 0, y = 0) {
  const { skin, hair, shirt, pants = '#5b4a7a', hairStyle = 'short', apron = false, seated = false } = look;
  contactShadow(ctx, x, y, 11, 5.5);
  const up = seated ? -11 : 0; // sentado: tronco desce sobre o assento
  const b = y + up;
  if (seated) {
    roundRect(ctx, x - 7, y - 21, 14, 7, 3, pants);
  } else {
    roundRect(ctx, x - 6.5, y - 11, 5.5, 11, 2.5, pants);
    roundRect(ctx, x + 1, y - 11, 5.5, 11, 2.5, pants);
    ellipse(ctx, x - 3.7, y - 0.5, 3.6, 2, INK);
    ellipse(ctx, x + 3.7, y - 0.5, 3.6, 2, INK);
  }
  const hy = b - 40; // centro da cabeça
  if (hairStyle === 'long') roundRect(ctx, x - 12, b - 47, 24, 25, 9, hair);
  if (hairStyle === 'bun') circle(ctx, x, hy - 12, 4.6, hair);
  circle(ctx, x - 10, b - 22, 3.3, shirt);
  circle(ctx, x + 10, b - 22, 3.3, shirt);
  circle(ctx, x - 10.6, b - 17.5, 2.4, skin);
  circle(ctx, x + 10.6, b - 17.5, 2.4, skin);
  roundRect(ctx, x - 9.5, b - 31, 19, 22, 8, shirt);
  if (apron) {
    roundRect(ctx, x - 6.5, b - 26, 13, 16, 3, CREAM);
    roundRect(ctx, x - 3, b - 20, 6, 4, 1.5, CORAL);
  }
  drawHead(ctx, x, hy, look);
}

// Cabeça (serve também para retratos). (x, y) = centro da cabeça.
export function drawHead(ctx, x, y, { skin, hair }) {
  circle(ctx, x, y, 10.5, skin);
  // calota com franja
  ctx.beginPath();
  ctx.moveTo(x - 10.8, y - 1);
  ctx.arc(x, y - 1, 10.8, Math.PI, 0);
  ctx.quadraticCurveTo(x + 5.8, y - 6, x, y - 5.2);
  ctx.quadraticCurveTo(x - 5.8, y - 6, x - 10.8, y - 1);
  ctx.closePath();
  ctx.fillStyle = hair;
  ctx.fill();
  ellipse(ctx, x - 3.6, y + 1.5, 1.3, 1.8, INK);
  ellipse(ctx, x + 3.6, y + 1.5, 1.3, 1.8, INK);
  circle(ctx, x - 6.6, y + 5, 2, CORAL, 0.6);
  circle(ctx, x + 6.6, y + 5, 2, CORAL, 0.6);
  ctx.beginPath();
  ctx.moveTo(x - 1.8, y + 5.2);
  ctx.quadraticCurveTo(x, y + 7, x + 1.8, y + 5.2);
  strokeLine(ctx, INK, 0.9);
}

// ---------- Composição inicial ----------

// Objetos da sala em grade; desenhados em ordem crescente de gx + gy.
// As luminárias pendentes ficam penduradas sobre o balcão: profundidade logo após ele.
export const INITIAL_LAYOUT = [
  { id: 'bookshelf', gx: 0.26, gy: 2.1, draw: drawBookshelf },
  { id: 'barista', gx: 2.2, gy: 0.42, draw: (ctx, x, y) => drawCharacter(ctx, LOOKS.barista, x, y) },
  { id: 'counter', gx: 2.25, gy: 1.3, draw: drawCounter },
  { id: 'pendant1', gx: 1.5, gy: 1.3, h: 75, depth: 3.56, draw: drawPendantLamp },
  { id: 'pendant2', gx: 2.9, gy: 1.3, h: 75, depth: 3.57, draw: drawPendantLamp },
  { id: 'plant', gx: 0.5, gy: 3.5, draw: drawPlant },
  { id: 'monstera', gx: 5.4, gy: 0.55, draw: drawMonstera },
  { id: 'catbed', gx: 1.5, gy: 5, draw: (ctx, x, y, t) => drawCatBed(ctx, x, y, { time: t }) },
  { id: 'stool1', gx: 3.05, gy: 3.8, draw: drawStool },
  { id: 'table', gx: 3.7, gy: 3.8, draw: drawTable },
  { id: 'stool2', gx: 4.35, gy: 3.8, draw: drawStool },
  { id: 'floorlamp', gx: 5.5, gy: 3.2, draw: drawFloorLamp },
  { id: 'armchair', gx: 5, gy: 5, draw: drawArmchair },
];

const SORTED_LAYOUT = sortByDepth(INITIAL_LAYOUT);

// Desenha a sala inteira em coordenadas do viewBox. O chamador já aplicou escala, DPR e translação.
export function drawScene(ctx, { time = 0 } = {}) {
  ctx.save();
  drawFloor(ctx);
  drawLeftWall(ctx);
  drawRightWall(ctx, time);
  drawWindowLight(ctx);
  drawDoorMat(ctx, 0.12, 4.35);
  const rug = project(3.7, 3.8);
  drawRoundRug(ctx, rug.x, rug.y);
  for (const it of SORTED_LAYOUT) {
    const p = project(it.gx, it.gy, it.h || 0);
    it.draw(ctx, p.x, p.y, time);
  }
  ctx.restore();
}
