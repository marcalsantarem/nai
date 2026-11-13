// Arte da sala (composição inicial do mockup), desenhada por código sobre js/iso.js.
// Cada objeto é uma função pura drawX(ctx, x, y, ...) com (x, y) = ponto de apoio no chão,
// na tela (normalmente project(gx, gy)). As mesmas funções servem cena, miniaturas e retratos.

import {
  project, shade, poly, ellipse, circle, roundRect, roundRectPath, contactShadow,
  tile, box, faceRect, cylinder, wall, wallTransform, sortByDepth, GRID,
} from './iso.js';
import { ICONS, drawIcon } from './icons.js';
// Só constantes (briefing BRF-024): layout inicial, âncoras, faixas e cores padrão.
import { DECOR_ITEMS, WALL_SLOTS, WALL_COLORS, FLOORS, DEFAULT_WALL, DEFAULT_FLOOR, INITIAL_DECOR } from './data.js';

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

const findById = (list, id, fallback) => list.find((e) => e.id === id) || list.find((e) => e.id === fallback);

// Piso. floor = objeto de FLOORS (ou id): 'checker' (ladrilhos a/b) ou 'planks' (tábuas a/b ao longo de gx,
// 3 por ladrilho, emendas desencontradas). As bordas do piso não mudam.
const PLANK_ROWS = 3;   // tábuas por ladrilho, ao longo de gy
const PLANK_LEN = 1.5;  // comprimento da tábua em ladrilhos
export function drawFloor(ctx, floor = DEFAULT_FLOOR) {
  paintFloor(ctx, typeof floor === 'string' || !floor ? findById(FLOORS, floor, DEFAULT_FLOOR) : floor, GRID);
}

// Piso de n × n ladrilhos a partir de (0, 0), com as bordas. Serve a sala (n = GRID) e a miniatura.
function paintFloor(ctx, f0, n) {
  const l = project(0, n), f = project(n, n), r = project(n, 0);
  poly(ctx, [l.x, l.y, f.x, f.y, f.x, f.y + 10, l.x, l.y + 10], '#8a5a3c');
  poly(ctx, [r.x, r.y, f.x, f.y, f.x, f.y + 10, r.x, r.y + 10], '#6f452d');
  if (f0.pattern === 'planks') {
    const d = 1 / PLANK_ROWS;
    for (let k = 0; k < n * PLANK_ROWS; k++) {
      const shift = ((k * 2) % 3) * (PLANK_LEN / 3);
      for (let i = -1, g = -shift; g < n; i++, g += PLANK_LEN) {
        const g0 = Math.max(0, g), g1 = Math.min(n, g + PLANK_LEN);
        if (g1 <= g0) continue;
        tile(ctx, g0, k * d, (i + k) % 2 ? f0.b : f0.a, f0.grout, g1 - g0, d);
      }
    }
    return;
  }
  for (let gx = 0; gx < n; gx++) {
    for (let gy = 0; gy < n; gy++) {
      tile(ctx, gx, gy, (gx + gy) % 2 ? f0.b : f0.a, f0.grout);
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

// Relógio. (x, y) = centro. now = { h, m } (hora real, vinda da tela); sem now, 3:00 como no mockup.
export function drawClock(ctx, x, y, now = null) {
  circle(ctx, x, y, 10, INK);
  circle(ctx, x, y, 8, CREAM);
  const h = now ? now.h : 3, m = now ? now.m : 0;
  const am = (m / 60) * Math.PI * 2, ah = (((h % 12) + m / 60) / 12) * Math.PI * 2;
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x + 5 * Math.sin(am), y - 5 * Math.cos(am));
  ctx.moveTo(x, y); ctx.lineTo(x + 4 * Math.sin(ah), y - 4 * Math.cos(ah));
  strokeLine(ctx, INK, 1.4);
}

// Bandeirinhas: um arco de 86 com 4 bandeiras (cada item é um arco). (x, y) = ponta esquerda do cordão.
const BUNTING = [[16, 3.5, CORAL], [32, 5.7, YELLOW], [49, 6, BLUE], [66, 4, CREAM]];
export function drawBunting(ctx, x, y) {
  at(ctx, x, y, () => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(43, 13, 86, 0);
    strokeLine(ctx, INK, 1);
    for (const [c, top, color] of BUNTING) poly(ctx, [c - 4, top, c + 4, top, c, top + 9], color);
  });
}

// Quadro-negro com o nome da casa. (x, y) = canto superior esquerdo da moldura.
// O título reduz a fonte (a partir de 10px) até caber em 50px, com folga no painel de 58px.
const CHALK_TITLE_MAX = 50;
export function drawChalkboard(ctx, x, y, title = "Nai's Cafe") {
  at(ctx, x, y, () => {
    roundRect(ctx, 0, 0, 66, 56, 4, '#8a5a3c');
    roundRect(ctx, 4, 4, 58, 48, 2, '#2f423f');
    let size = 10;
    ctx.font = `700 ${size}px ${TITLE_FONT}`;
    while (size > 6 && ctx.measureText(title).width > CHALK_TITLE_MAX) {
      size -= 0.5;
      ctx.font = `700 ${size}px ${TITLE_FONT}`;
    }
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

// Paredes com os fixos (porta; quadro-negro e janela). wall = objeto de WALL_COLORS:
// base e listras mudam; lambri, friso, rodapé e painéis não mudam.
function drawLeftWall(ctx, colors) {
  wall(ctx, 'left', colors ? { ...WALL_LEFT, ...colors.left } : WALL_LEFT);
  ctx.save();
  wallTransform(ctx, 'left');
  drawDoor(ctx, -169, 0);
  ctx.restore();
}

function drawRightWall(ctx, time, colors) {
  wall(ctx, 'right', colors ? { ...WALL_RIGHT, ...colors.right } : WALL_RIGHT);
  ctx.save();
  wallTransform(ctx, 'right');
  // Afastados do mockup (18 e 100) para abrir o espaço médio entre eles (decisão 30; ROOM.reservedWall).
  drawChalkboard(ctx, 6, -112, "Nai's Cafe");
  drawWindow(ctx, 105, -114, time);
  ctx.restore();
}

// ---------- Itens no chão (planos) ----------

// Luz da janela no chão.
export function drawWindowLight(ctx) {
  const p = [project(3.67, 0.1), project(5.67, 0.1), project(6.07, 2.4), project(4.07, 2.4)];
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
// time > 0: o brilho respira devagar.
export function drawFloorLamp(ctx, x, y, time = 0) {
  contactShadow(ctx, x, y, 9, 4.5);
  ellipse(ctx, x, y, 7, 3.5, INK);
  roundRect(ctx, x - 1.5, y - 60, 3, 60, 1, INK);
  circle(ctx, x, y - 52, 34, GLOW, time ? 0.2 + 0.05 * Math.sin(time * 1.3) : 0.2);
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

// Pufe lilás com botão. (x, y) = centro da base.
export function drawPouf(ctx, x, y) {
  contactShadow(ctx, x, y, 13, 6.5);
  cylinder(ctx, x, y, 11 / 42, 12, '#c9b6f0', '#9a86c9');
  ellipse(ctx, x, y - 12, 7.5, 3.6, '#d8c9f5');
  ellipse(ctx, x, y - 12, 1.8, 1, '#9a86c9');
}

// Mesinha redonda com vaso de flores. (x, y) = centro da sombra.
export function drawFlowerTable(ctx, x, y) {
  contactShadow(ctx, x, y, 12, 6);
  cylinder(ctx, x, y, 2 / 42, 18, '#8a5a3c', '#6b462e');
  cylinder(ctx, x, y - 18, 12 / 42, 3, '#f8e6c8', '#c98a5a');
  cylinder(ctx, x, y - 21, 3.6 / 42, 9, BLUE, '#7aa3d4');
  ctx.beginPath();
  ctx.moveTo(x, y - 30); ctx.lineTo(x - 5, y - 37);
  ctx.moveTo(x, y - 30); ctx.lineTo(x + 4, y - 39);
  ctx.moveTo(x, y - 30); ctx.lineTo(x, y - 44);
  strokeLine(ctx, '#4fa87a', 1);
  ellipse(ctx, x - 4, y - 32, 3.2, 1.6, '#6cc58f');
  ellipse(ctx, x + 4, y - 33, 3.2, 1.6, '#4fa87a');
  for (const [dx, dy, color] of [[-5, -38, CORAL], [4, -40, YELLOW], [0, -45, '#ffb3a6']]) {
    circle(ctx, x + dx, y + dy, 3.4, color);
    circle(ctx, x + dx, y + dy, 1.2, CREAM);
  }
}

// Notas musicais subindo (vitrola com a música ligada). (x, y) = ponto de saída.
function drawNotes(ctx, x, y, time) {
  for (let i = 0; i < 2; i++) {
    const p = (time * 0.45 + i * 0.5) % 1;
    const nx = x + 4 + p * 10 + Math.sin((p + i) * 6) * 2, ny = y - p * 24;
    withAlpha(ctx, Math.sin(p * Math.PI), () => {
      ellipse(ctx, nx, ny, 2.3, 1.7, INK);
      ctx.fillStyle = INK;
      ctx.fillRect(nx + 1.4, ny - 8, 1, 8);
      ctx.fillRect(nx + 1.4, ny - 8, 3.2, 1.4);
    });
  }
}

// Vitrola: móvel de madeira com toca-discos. (x, y) = centro da base. music liga as notas.
export function drawRecordPlayer(ctx, x, y, { time = 0, music = false } = {}) {
  contactShadow(ctx, x, y, 16, 8);
  at(ctx, x, y, () => {
    box(ctx, -0.26, -0.22, 0.52, 0.44, 20, '#8a5a3c', { top: '#b07a52' });
    faceRect(ctx, 'right', 0.26, -0.16, 0.16, 5, 15, '#6b462e');
    faceRect(ctx, 'left', 0.22, -0.2, 0.2, 13, 15, '#c98a5a');
    box(ctx, -0.22, -0.18, 0.44, 0.36, 3, CREAM, { z: 20 });
  });
  ellipse(ctx, x, y - 23, 9.5, 4.8, '#2a2540');
  ellipse(ctx, x, y - 23, 6, 3, '#3d3a5c');
  ellipse(ctx, x, y - 23, 2.4, 1.2, CORAL);
  ctx.beginPath();
  ctx.moveTo(x + 11, y - 27); ctx.lineTo(x + 9, y - 21); ctx.lineTo(x + 4, y - 22);
  strokeLine(ctx, INK, 1.2);
  circle(ctx, x + 11, y - 27, 1.6, INK);
  if (music) drawNotes(ctx, x + 2, y - 32, time);
}

// ---------- Itens de parede ----------
// No plano local da parede (já cisalhado): (x, y) = centro do espaço na horizontal e chão (y = 0).

// Planta pendente: gancho, cordas, vaso e ramos caindo.
export function drawHangingPlant(ctx, x, y) {
  at(ctx, x, y, () => {
    circle(ctx, 0, -104, 1.3, INK);
    ctx.beginPath();
    ctx.moveTo(0, -104); ctx.lineTo(-6.5, -85);
    ctx.moveTo(0, -104); ctx.lineTo(6.5, -85);
    strokeLine(ctx, INK, 0.7);
    for (const [dx, dy, r, color] of [[-7, -78, 3, '#4fa87a'], [-8.5, -72, 2.8, '#6cc58f'], [-7.5, -66, 2.6, '#4fa87a'], [-9, -60, 2.3, '#6cc58f'], [8, -77, 2.8, '#6cc58f'], [9, -71, 2.5, '#4fa87a']]) {
      circle(ctx, dx, dy, r, color);
    }
    circle(ctx, -4, -88, 4.2, '#4fa87a');
    circle(ctx, 4, -89, 4.2, '#6cc58f');
    circle(ctx, 0, -91, 3.6, '#4fa87a');
    roundRect(ctx, -7, -86, 14, 10, 2.5, '#d9735b');
    roundRect(ctx, -8, -87, 16, 3, 1.5, '#f08a70');
  });
}

// Prateleira de xícaras: duas tábuas com mãos-francesas.
const SHELF_CUPS = [[[-8, CREAM], [1, CORAL], [9.5, MINT]], [[-7, YELLOW], [3, BLUE]]];
function drawShelfCup(ctx, cx, y, color) {
  roundRect(ctx, cx - 3.2, y - 6.5, 6.4, 6.5, 1.5, color);
  ctx.beginPath();
  ctx.arc(cx + 3.6, y - 3.6, 1.8, -Math.PI / 2, Math.PI / 2);
  strokeLine(ctx, color, 1.1);
}
export function drawCupShelf(ctx, x, y) {
  at(ctx, x, y, () => {
    [[-66, SHELF_CUPS[0]], [-88, SHELF_CUPS[1]]].forEach(([py, cups]) => {
      for (const bx of [-10, 9]) poly(ctx, [bx, py, bx + 2.5, py, bx, py + 6], '#6b462e');
      for (const [cx, color] of cups) drawShelfCup(ctx, cx, py, color);
      roundRect(ctx, -14, py, 28, 3.5, 1, '#8a5a3c');
      roundRect(ctx, -14, py, 28, 1.4, 0.7, '#c98a5a');
    });
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

// Gato como entidade da simulação (arquitetura, M4.1). (x, y) = project(gx, gy), no chão.
// pose 'sleep' = enrolado na caminha (o ponto é o da caminha); 'walk' e 'sit' olham para o lado de dir.
const CAT = '#f0a35c', CAT_DARK = '#d98842', CAT_CHEST = '#f7c48f';
export function drawCatPose(ctx, x, y, { pose = 'sleep', dir = 'se', walk = 0, time = 0 } = {}) {
  if (pose === 'sleep') { drawCat(ctx, x, y - 6, time); return; }
  const f = facingOf(dir);
  contactShadow(ctx, x, y, pose === 'walk' ? 11 : 9, 4.5);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(f, 1);
  if (pose === 'walk') paintCatWalk(ctx, walk || 0);
  else paintCatSit(ctx, time);
  ctx.restore();
}

// Andando, de perfil para a direita. Passada em diagonal: dianteira de perto com a traseira de longe.
function paintCatWalk(ctx, walk) {
  const s = Math.sin(walk * Math.PI * 4);
  const b = -Math.abs(s) * 0.7;
  const liftA = Math.max(0, s) * 2, liftB = Math.max(0, -s) * 2;
  ctx.beginPath();
  ctx.moveTo(-9, -12 + b); ctx.quadraticCurveTo(-16, -13 + b, -14, -22 + b - s * 0.8);
  strokeLine(ctx, CAT, 3);
  roundRect(ctx, -6.5, -9 + b, 3, 9 - b - liftA, 1.5, CAT_DARK);
  roundRect(ctx, 5.5, -9 + b, 3, 9 - b - liftB, 1.5, CAT_DARK);
  ellipse(ctx, 0, -11 + b, 10, 5.5, CAT);
  ellipse(ctx, -4, -15 + b, 1.4, 1.9, CAT_DARK);
  ellipse(ctx, 0, -15.8 + b, 1.4, 1.9, CAT_DARK);
  roundRect(ctx, -8.5, -9 + b, 3, 9 - b - liftB, 1.5, CAT);
  roundRect(ctx, 3.5, -9 + b, 3, 9 - b - liftA, 1.5, CAT);
  const hy = -15.5 + b;
  poly(ctx, [5.6, hy - 3, 6.5, hy - 8.5, 9.2, hy - 4.2], CAT);
  poly(ctx, [9.4, hy - 4.4, 12.4, hy - 8.3, 13.2, hy - 2.2], CAT);
  circle(ctx, 9.5, hy, 5, CAT);
  ellipse(ctx, 11.6, hy - 0.6, 0.9, 1.3, INK);
  circle(ctx, 12.4, hy + 2.2, 1.3, CORAL, 0.6);
}

// Sentado, quase de frente, com o rabo enrolado nas patas.
function paintCatSit(ctx, time) {
  ellipse(ctx, 0, -9, 7.5, 9, CAT);
  ellipse(ctx, 1.5, -8.5, 3.6, 5.2, CAT_CHEST);
  ctx.beginPath();
  ctx.moveTo(-6.5, -3); ctx.quadraticCurveTo(-5, 1.6, 5.5, 0.4);
  strokeLine(ctx, CAT_DARK, 2.6);
  ellipse(ctx, -2.2, -0.9, 2.4, 1.5, CAT);
  ellipse(ctx, 3.2, -0.9, 2.4, 1.5, CAT);
  const tilt = Math.sin(time * 0.9) * 0.4;
  const hx = 1 + tilt, hy = -20;
  poly(ctx, [hx - 5.2, hy - 2.5, hx - 4.6, hy - 9, hx - 1, hy - 4.8], CAT);
  poly(ctx, [hx + 1.6, hy - 5.2, hx + 4.8, hy - 9, hx + 5.8, hy - 2.4], CAT);
  circle(ctx, hx, hy, 6, CAT);
  ellipse(ctx, hx - 2.1, hy - 0.4, 0.9, 1.3, INK);
  ellipse(ctx, hx + 2.6, hy - 0.4, 0.9, 1.3, INK);
  poly(ctx, [hx - 0.4, hy + 1.6, hx + 1.2, hy + 1.6, hx + 0.4, hy + 2.6], CORAL);
  circle(ctx, hx - 4, hy + 2.4, 1.3, CORAL, 0.6);
  circle(ctx, hx + 4.6, hy + 2.4, 1.3, CORAL, 0.6);
}

// Topo do gato (para o coração), a partir do y do chão.
function catTop(e, y) {
  return y - (e.pose === 'sit' ? 30 : e.pose === 'walk' ? 26 : 20);
}

// ---------- Personagens ----------
// look: { skin, hair, shirt, pants, hairStyle: 'short' | 'long' | 'bun' | 'curly', apron, seated }

// Clientes da casa (especificação, Clientes da casa). Pele, cabelo e blusa de Marina, Téo, Dona Lúcia
// e Seu Jorge vêm dos retratos do mockup (04-clientes); Bia não aparece lá (cartão misterioso).
// portraitBg = fundo do retrato no cartão. id = chave de state.regulars / entidade.regular.
export const REGULAR_LOOKS = {
  marina: { skin: '#e9b98f', hair: '#8a4b3a', shirt: YELLOW, pants: '#5b4a7a', hairStyle: 'long', portraitBg: '#ffd9cf' },
  teo: { skin: '#c98d62', hair: '#2a2540', shirt: BLUE, pants: '#5b4a7a', hairStyle: 'short', portraitBg: '#cfe6f7' },
  lucia: { skin: '#f6d2b8', hair: '#e6e1dc', shirt: '#c9b6f0', pants: '#5b4a7a', hairStyle: 'bun', portraitBg: '#e7e2fa' },
  jorge: { skin: '#9b6a48', hair: '#f3efe3', shirt: MINT, pants: '#4a5a6a', hairStyle: 'short', portraitBg: '#cfeedd' },
  // [Proposta] Bia: pele média, cabelo preto comprido, blusa laranja.
  bia: { skin: '#d9a179', hair: '#1f1a24', shirt: '#ffa45c', pants: '#5b4a7a', hairStyle: 'long', portraitBg: '#ffe2c4' },
};

// [Proposta] Cliente especial (traz o recadinho): boina coral, cabelo castanho cacheado, blusa creme,
// carta na mão no lugar do copo. Campo hat (boina) e letter (carta) só existem aqui.
export const SPECIAL_LOOK = {
  skin: '#e7b48c', hair: '#6b3e2e', shirt: CREAM, pants: '#5b4a7a', hairStyle: 'curly',
  hat: CORAL, letter: true, portraitBg: '#ffe9a8',
};

// Aparência de uma entidade: cliente da casa e especial têm prioridade sobre o look sorteado.
export function lookOf(e) {
  if (e && e.regular && REGULAR_LOOKS[e.regular]) return REGULAR_LOOKS[e.regular];
  if (e && e.special) return SPECIAL_LOOK;
  return e && e.look;
}

export const LOOKS = {
  // Decisão 15: pele levemente morena, cabelo cacheado castanho-escuro.
  barista: { skin: '#e2ad84', hair: '#3b2419', shirt: MINT, pants: '#5b4a7a', hairStyle: 'curly', apron: true },
  marina: REGULAR_LOOKS.marina,
  lucia: REGULAR_LOOKS.lucia,
  teo: REGULAR_LOOKS.teo,
};

// Lado para onde o personagem olha na tela: +1 direita ('se' = +gx, 'ne' = -gy), -1 esquerda.
// As direções de costas (ne/nw) são desenhadas de frente, espelhadas (arquitetura, seção 5).
function facingOf(dir) {
  return dir === 'sw' || dir === 'nw' ? -1 : 1;
}

// Cachos: volume de trás (atrás do corpo) e coroa (sobre a cabeça). [dx, dy, r] a partir do centro da cabeça.
const CURLS_BACK = [[-10.5, 2.5, 4.4], [10.5, 2.5, 4.4], [-9.5, 7.5, 3.9], [9.5, 7.5, 3.9], [-6, 10, 3.4], [6, 10, 3.4]];
const CURLS_CROWN = [[-10.4, -2.5, 4], [-9, -7.5, 4.3], [-5, -10.6, 4.4], [0, -11.8, 4.5], [5, -10.6, 4.4], [9, -7.5, 4.3], [10.4, -2.5, 4]];
const CURLS_FRINGE = [[-6.2, -5.6, 2.9], [-2, -6.6, 3], [2.2, -6.6, 3], [6.3, -5.6, 2.9]];

function curls(ctx, x, y, list, color) {
  ctx.beginPath();
  for (const [dx, dy, r] of list) {
    ctx.moveTo(x + dx + r, y + dy);
    ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
  }
  ctx.fillStyle = color;
  ctx.fill();
}

// Cabelo que fica atrás do corpo e da cabeça. (x, y) = centro da cabeça.
function drawHairBack(ctx, x, y, { hair, hairStyle }) {
  if (hairStyle === 'long') roundRect(ctx, x - 12, y - 7, 24, 25, 9, hair);
  else if (hairStyle === 'bun') circle(ctx, x, y - 12, 4.6, hair);
  else if (hairStyle === 'curly') curls(ctx, x, y, CURLS_BACK, shade(hair, 0.86));
}

// Copo para viagem na mão. (x, y) = centro da mão.
function drawHandCup(ctx, x, y) {
  roundRect(ctx, x - 3.2, y - 7.5, 6.4, 8, 1.4, CREAM);
  ctx.strokeStyle = '#ccc4b8';
  ctx.lineWidth = 0.6;
  ctx.stroke();
  roundRect(ctx, x - 3.2, y - 4.6, 6.4, 2, 0.6, '#8a5a3c');
  roundRect(ctx, x - 3.6, y - 8.6, 7.2, 2, 1, CORAL);
}

// Carta do cliente especial na mão. (x, y) = centro da mão.
function drawHandLetter(ctx, x, y) {
  roundRectPath(ctx, x - 4.5, y - 9, 9, 6.5, 1);
  ctx.fillStyle = CREAM;
  ctx.fill();
  strokeLine(ctx, INK, 0.7);
  ctx.beginPath();
  ctx.moveTo(x - 4.2, y - 8.7); ctx.lineTo(x, y - 5.6); ctx.lineTo(x + 4.2, y - 8.7);
  strokeLine(ctx, INK, 0.6);
  circle(ctx, x, y - 5.4, 1.2, CORAL);
}

// Personagem. (x, y) = centro da sombra (no chão, ou no assento se sentado).
// opts: pose 'walk' | 'stand' | 'sit', dir 'se' | 'sw' | 'nw' | 'ne', walk (ladrilhos andados), time, cup.
export function drawCharacter(ctx, look, x = 0, y = 0, opts = {}) {
  const { skin, shirt, pants = '#5b4a7a', apron = false } = look;
  const { pose = look.seated ? 'sit' : 'stand', dir = 'se', walk, time = 0, cup = false } = opts;
  const seated = pose === 'sit';
  const f = facingOf(dir);
  contactShadow(ctx, x, y, 11, 5.5);

  // Passada: fase pelos ladrilhos andados (ou pelo tempo); o corpo sobe e desce de leve.
  let swing = 0, bob = 0;
  if (pose === 'walk') {
    const ph = (walk ?? time * 1.7) * Math.PI * 2;
    swing = Math.sin(ph);
    bob = -Math.abs(swing) * 1.3;
  }
  const b = y + (seated ? -11 : 0) + bob; // base do tronco
  if (seated) {
    roundRect(ctx, x - 7, y - 21, 14, 7, 3, pants);
  } else {
    const liftL = Math.max(0, swing) * 2.6, liftR = Math.max(0, -swing) * 2.6;
    const legH = 11 + (y - b);
    roundRect(ctx, x - 6.5, b - 11, 5.5, legH - liftL, 2.5, pants);
    roundRect(ctx, x + 1, b - 11, 5.5, legH - liftR, 2.5, pants);
    ellipse(ctx, x - 3.7, y - 0.5 - liftL, 3.6, 2, INK);
    ellipse(ctx, x + 3.7, y - 0.5 - liftR, 3.6, 2, INK);
  }
  const hy = b - 40; // centro da cabeça
  drawHairBack(ctx, x, hy, look);
  circle(ctx, x - 10, b - 22, 3.3, shirt);
  circle(ctx, x + 10, b - 22, 3.3, shirt);
  roundRect(ctx, x - 9.5, b - 31, 19, 22, 8, shirt);
  if (apron) {
    roundRect(ctx, x - 6.5, b - 26, 13, 16, 3, CREAM);
    roundRect(ctx, x - 3, b - 20, 6, 4, 1.5, CORAL);
  }
  // Mãos balançam ao contrário das pernas; a do copo fica um pouco erguida e parada.
  const handL = b - 17.5 + (cup && f < 0 ? -2 : swing * 1.2);
  const handR = b - 17.5 + (cup && f > 0 ? -2 : -swing * 1.2);
  if (cup) drawHandCup(ctx, x + f * 10.6, f > 0 ? handR : handL);
  else if (look.letter) drawHandLetter(ctx, x + f * 10.6, f > 0 ? handR : handL);
  circle(ctx, x - 10.6, handL, 2.4, skin);
  circle(ctx, x + 10.6, handR, 2.4, skin);
  drawHead(ctx, x, hy, look, f * 1.3);
}

// Cabeça (serve também para retratos). (x, y) = centro da cabeça. turn desloca o rosto (px) para o lado que olha.
export function drawHead(ctx, x, y, { skin, hair, hairStyle = 'short', hat = null }, turn = 0) {
  const curly = hairStyle === 'curly';
  if (curly) curls(ctx, x, y, CURLS_CROWN, hair);
  circle(ctx, x, y, 10.5, skin);
  // calota com franja (nos cachos, franja de cachinhos)
  ctx.beginPath();
  ctx.moveTo(x - 10.8, y - 1);
  ctx.arc(x, y - 1, 10.8, Math.PI, 0);
  if (curly) {
    ctx.quadraticCurveTo(x + 5.8, y - 4.5, x, y - 4.5);
    ctx.quadraticCurveTo(x - 5.8, y - 4.5, x - 10.8, y - 1);
  } else {
    ctx.quadraticCurveTo(x + 5.8, y - 6, x, y - 5.2);
    ctx.quadraticCurveTo(x - 5.8, y - 6, x - 10.8, y - 1);
  }
  ctx.closePath();
  ctx.fillStyle = hair;
  ctx.fill();
  if (curly) curls(ctx, x, y, CURLS_FRINGE, hair);
  if (hat) {
    // boina inclinada para o lado que olha
    ellipse(ctx, x + turn * 0.8, y - 9.5, 11.5, 5, hat);
    ellipse(ctx, x + turn * 0.8, y - 7.6, 10, 1.6, shade(hat, 0.82));
    circle(ctx, x + turn * 0.8 + 1, y - 14.6, 1.7, shade(hat, 0.82));
  }
  const fx = x + turn;
  ellipse(ctx, fx - 3.6, y + 1.5, 1.3, 1.8, INK);
  ellipse(ctx, fx + 3.6, y + 1.5, 1.3, 1.8, INK);
  circle(ctx, fx - 6.6, y + 5, 2, CORAL, 0.6);
  circle(ctx, fx + 6.6, y + 5, 2, CORAL, 0.6);
  ctx.beginPath();
  ctx.moveTo(fx - 1.8, y + 5.2);
  ctx.quadraticCurveTo(fx, y + 7, fx + 1.8, y + 5.2);
  strokeLine(ctx, INK, 0.9);
}

// Retrato do cartão do pedido (viewBox 64 do mockup), em caixa size x size a partir de (0, 0).
// background: null = sem fundo. Nos cartões de Clientes, passe look.portraitBg (cor do mockup 04-clientes).
export function drawPortrait(ctx, look, size = 64, { background = '#ffd9cf' } = {}) {
  const k = 15 / 10.5; // cabeça de raio 15 no retrato
  ctx.save();
  ctx.scale(size / 64, size / 64);
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 64, 64);
  }
  if (look.hairStyle === 'long') roundRect(ctx, 13, 13, 38, 44, 16, look.hair);
  else if (look.hairStyle === 'bun') ellipse(ctx, 32, 10, 7, 7, look.hair); // coque como no mockup
  else at(ctx, 32, 30, () => drawHairBack(ctx, 0, 0, look), k);
  roundRect(ctx, 12, 47, 40, 26, 13, look.shirt);
  roundRect(ctx, 27, 40, 10, 10, 3, shade(look.skin, 0.92));
  at(ctx, 32, 30, () => drawHead(ctx, 0, 0, look), k);
  ctx.restore();
}

// ---------- Balão do pedido e coração ----------

const BUBBLE_FONT = `700 12px ${TITLE_FONT}`;

// Balão com ícone da bebida e nome. (x, y) = ponta do rabicho.
export function drawOrderBubble(ctx, x, y, label, iconId = 'cup') {
  ctx.font = BUBBLE_FONT;
  const tw = ctx.measureText(label).width; // sem cache: a largura muda quando a fonte termina de carregar
  const w = Math.max(60, Math.round(32 + tw));
  const left = x - w / 2, top = y - 29;
  roundRectPath(ctx, left, top, w, 23, 10);
  ctx.fillStyle = CREAM;
  ctx.fill();
  strokeLine(ctx, INK, 2);
  poly(ctx, [x - 5, y - 7, x + 5, y - 7, x, y], CREAM);
  ctx.beginPath();
  ctx.moveTo(x - 5, y - 6.2); ctx.lineTo(x, y + 0.8); ctx.lineTo(x + 5, y - 6.2);
  strokeLine(ctx, INK, 2);
  drawIcon(ctx, iconId, left + 13.5, top + 11, 15, INK);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK;
  ctx.fillText(label, left + 23, top + 16);
}

let heartPath = null;

// Coração subindo e sumindo. (x, y) = ponto de partida (acima da cabeça); p = progresso 0..1.
export function drawHeart(ctx, x, y, p) {
  if (p == null || p < 0 || p > 1) return;
  if (!heartPath) heartPath = new Path2D(ICONS.heart.d);
  const a = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
  const size = 14 + 3 * p;
  withAlpha(ctx, a, () => {
    ctx.save();
    ctx.translate(x - size / 2, y - 24 * p - size / 2);
    ctx.scale(size / 24, size / 24);
    ctx.fillStyle = CORAL;
    ctx.fill(heartPath);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke(heartPath);
    ctx.restore();
  });
}

// ---------- Balão de fala e sede ----------

const SPEECH_FONT = "700 10px 'Nunito', 'Segoe UI', system-ui, sans-serif";
const SPEECH_MAX_W = 128, SPEECH_LINE = 12.5;

// Quebra em até 2 linhas de SPEECH_MAX_W; o que sobrar vira reticências no fim da 2ª.
function wrapSpeech(ctx, text) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let cur = '';
  for (const word of words) {
    const next = cur ? cur + ' ' + word : word;
    if (!cur || ctx.measureText(next).width <= SPEECH_MAX_W) { cur = next; continue; }
    lines.push(cur);
    cur = word;
  }
  if (cur) lines.push(cur);
  if (lines.length <= 2) return lines;
  let last = lines.slice(1).join(' ');
  while (last.length > 1 && ctx.measureText(last + '…').width > SPEECH_MAX_W) last = last.slice(0, -1).trimEnd();
  return [lines[0], last + '…'];
}

// Balão de fala (texto curto, até 2 linhas). (x, y) = ponta do rabicho; p = progresso 0..1
// (entra subindo e aparecendo, sai sumindo). bounds mantém o balão dentro da cena.
export function drawSpeechBubble(ctx, x, y, text, p = 0.5, bounds = SCENE_VIEWBOX) {
  if (!text || p == null || p < 0 || p > 1) return;
  const a = p < 0.1 ? p / 0.1 : p > 0.85 ? (1 - p) / 0.15 : 1;
  const ty = y + (p < 0.1 ? (1 - p / 0.1) * 5 : 0) - (p > 0.85 ? ((p - 0.85) / 0.15) * 3 : 0);
  ctx.font = SPEECH_FONT;
  const lines = wrapSpeech(ctx, text);
  let tw = 0;
  for (const l of lines) tw = Math.max(tw, ctx.measureText(l).width);
  const w = Math.max(40, Math.round(tw + 16)), h = lines.length * SPEECH_LINE + 8;
  const left = Math.min(Math.max(x - w / 2, bounds.x + 4), bounds.x + bounds.w - 4 - w);
  const top = ty - 6 - h;
  const tx = Math.min(Math.max(x, left + 10), left + w - 10);
  withAlpha(ctx, a, () => {
    roundRectPath(ctx, left, top, w, h, 9);
    ctx.fillStyle = CREAM;
    ctx.fill();
    strokeLine(ctx, INK, 1.6);
    poly(ctx, [tx - 4, ty - 6.8, tx + 4, ty - 6.8, tx, ty], CREAM);
    ctx.beginPath();
    ctx.moveTo(tx - 4, ty - 6.1); ctx.lineTo(tx, ty + 0.6); ctx.lineTo(tx + 4, ty - 6.1);
    strokeLine(ctx, INK, 1.6);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = INK;
    lines.forEach((l, i) => ctx.fillText(l, left + w / 2, top + 3.5 + (i + 1) * SPEECH_LINE - 2.5));
  });
}

let dropPath = null;

// Balão redondo com gota (planta com sede). (x, y) = ponta do rabicho, logo acima da planta.
export function drawThirstBubble(ctx, x, y, time = 0) {
  if (!dropPath) dropPath = new Path2D(ICONS.drop.d);
  const tip = y + Math.sin(time * 2.2) * 1.2;
  const cy = tip - 17, r = 11;
  ctx.beginPath();
  ctx.arc(x, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = CREAM;
  ctx.fill();
  strokeLine(ctx, INK, 2);
  poly(ctx, [x - 4, cy + r - 2.2, x + 4, cy + r - 2.2, x, tip], CREAM);
  ctx.beginPath();
  ctx.moveTo(x - 4, cy + r - 1.4); ctx.lineTo(x, tip + 0.8); ctx.lineTo(x + 4, cy + r - 1.4);
  strokeLine(ctx, INK, 2);
  const size = 15;
  ctx.save();
  ctx.translate(x - size / 2, cy - size / 2 - 0.5);
  ctx.scale(size / 24, size / 24);
  ctx.fillStyle = BLUE;
  ctx.fill(dropPath);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.stroke(dropPath);
  ctx.restore();
}

// Altura do balão de sede acima do chão, pelo tipo da planta no layout (ou pelo itemId).
const THIRST_H = { plant: 40, monstera: 60 };
function thirstHeight(lay, e) {
  for (const it of lay.floor || []) {
    if (!THIRST_H[it.type]) continue;
    const a = it.gx != null ? it : anchorOf(it.type, it.c, it.r);
    if (Math.abs(a.gx - e.gx) < 0.4 && Math.abs(a.gy - e.gy) < 0.4) return THIRST_H[it.type];
  }
  return String(e.itemId || '').includes('monstera') ? THIRST_H.monstera : THIRST_H.plant;
}

// ---------- Itens da decoração ----------

const ITEM = new Map(DECOR_ITEMS.map((d) => [d.id, d]));

// Mesa com os dois banquinhos (desenho único: miniatura e fantasma). (x, y) = centro da sombra da mesa.
const STOOL_DX = 0.65; // banquinhos a ±0,65 em gx (TABLE_SEATS)
function drawTableSet(ctx, x, y) {
  const d = project(STOOL_DX, 0);
  drawStool(ctx, x - d.x, y - d.y);
  drawTable(ctx, x, y);
  drawStool(ctx, x + d.x, y + d.y);
}

// Itens de chão: (ctx, x, y, opts) com (x, y) = project(âncora).
const FLOOR_DRAW = {
  pouf: (ctx, x, y) => drawPouf(ctx, x, y),
  plant: (ctx, x, y) => drawPlant(ctx, x, y),
  flowerTable: (ctx, x, y) => drawFlowerTable(ctx, x, y),
  rug: (ctx, x, y) => drawRoundRug(ctx, x, y),
  monstera: (ctx, x, y) => drawMonstera(ctx, x, y),
  floorLamp: (ctx, x, y, o) => drawFloorLamp(ctx, x, y, o.time),
  armchair: (ctx, x, y) => drawArmchair(ctx, x, y),
  recordPlayer: (ctx, x, y, o) => drawRecordPlayer(ctx, x, y, o),
  table: (ctx, x, y) => drawTableSet(ctx, x, y),
  bookshelf: (ctx, x, y) => drawBookshelf(ctx, x, y),
  catBed: (ctx, x, y, o) => drawCatBed(ctx, x, y, { cat: !o.catEntity, time: o.time }),
};

// Itens de parede: (ctx, x, y, opts) no plano local da parede, (x, y) = centro do espaço, no chão.
// Quadro: variant 'small' é o quadrinho azul (decisão 27); sem variant, a paisagem.
const WALL_DRAW = {
  bunting: (ctx, x, y) => drawBunting(ctx, x - 43, y - 119),
  stringLights: (ctx, x, y, o) => drawStringLights(ctx, x - 46, y - 121, o.time),
  frame: (ctx, x, y, o) => (o.variant === 'small' ? drawSmallFrame(ctx, x - 8, y - 90) : drawPicture(ctx, x - 11, y - 99)),
  hangingPlant: (ctx, x, y) => drawHangingPlant(ctx, x, y),
  clock: (ctx, x, y, o) => drawClock(ctx, x, y - 98, o.now),
  cupShelf: (ctx, x, y) => drawCupShelf(ctx, x, y),
};

// Um desenho por tipo, com a mesma âncora da cena. opts: { time, alpha, now, music, variant }.
// alpha < 1 aplica a opacidade ao item inteiro (como <g opacity> do mockup), via canvas de apoio.
export function drawItem(ctx, type, x, y, opts = {}) {
  const fn = FLOOR_DRAW[type] || WALL_DRAW[type];
  if (!fn) return;
  const { alpha = 1 } = opts;
  if (alpha >= 1) fn(ctx, x, y, opts);
  else groupAlpha(ctx, alpha, (c) => fn(c, x, y, opts));
}

// Opacidade de grupo: desenha num canvas de apoio com a mesma transformação e compõe com alpha.
// Sem DOM (ou sem getTransform), cai para globalAlpha por forma.
let scratch = null;
function groupAlpha(ctx, alpha, paint) {
  const cv = ctx.canvas;
  if (!scratch && typeof document !== 'undefined') scratch = document.createElement('canvas');
  const s = scratch && cv && typeof ctx.getTransform === 'function' ? scratch.getContext('2d') : null;
  if (!s) { withAlpha(ctx, alpha, () => paint(ctx)); return; }
  if (scratch.width !== cv.width || scratch.height !== cv.height) { scratch.width = cv.width; scratch.height = cv.height; }
  s.setTransform(1, 0, 0, 1, 0, 0);
  s.clearRect(0, 0, scratch.width, scratch.height);
  s.setTransform(ctx.getTransform());
  paint(s);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha *= alpha;
  ctx.drawImage(scratch, 0, 0);
  ctx.restore();
}

// Âncora de um item de chão no ladrilho (c, r): centro + offset do tipo (DECOR_ITEMS).
export function anchorOf(type, c, r) {
  const d = ITEM.get(type);
  const o = (d && d.offset) || [0, 0];
  return { gx: c + 0.5 + o[0], gy: r + 0.5 + o[1] };
}

const bandOf = (type) => (ITEM.get(type) && ITEM.get(type).band) || 'mid';

// Centro do espaço de parede, em x do plano local da parede.
// WALL_SLOTS[band].at[side][pos] (em ladrilhos) substitui a regra do span.
function slotX(side, band, pos) {
  const sl = WALL_SLOTS[band] || WALL_SLOTS.mid;
  const at = sl.at && sl.at[side] && sl.at[side][pos];
  const u = (at != null ? at : (pos + 0.5) * sl.span) * 30;
  return side === 'left' ? -u : u;
}
// Retângulo de destaque do espaço (plano local): [x, y, w, h].
const SLOT_H = { high: [-123, -103], mid: [-103, -43] };
function slotRect(side, band, pos) {
  const span = (WALL_SLOTS[band] || WALL_SLOTS.mid).span * 30;
  const inset = band === 'high' ? 4 : 2;
  const cx = slotX(side, band, pos);
  const [y0, y1] = SLOT_H[band] || SLOT_H.mid;
  return [cx - span / 2 + inset, y0, span - inset * 2, y1 - y0];
}

// Layout inicial no formato de decor.sceneLayout(), a partir de INITIAL_DECOR (data.js).
let initial = null;
export function initialLayout() {
  if (!initial) {
    initial = {
      floor: INITIAL_DECOR.items.map((it) => ({ ...it, ...anchorOf(it.type, it.c, it.r) })),
      wall: INITIAL_DECOR.wallItems.map((it) => ({ ...it, band: it.band || bandOf(it.type) })),
    };
  }
  return initial;
}

// ---------- Miniaturas da loja ----------
// Convenção de DPR: o chamador cria o canvas com size × dpr px, aplica ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
// e passa size em px CSS. As funções não limpam o canvas e restauram o estado do contexto.

// Enquadramento por tipo: [cx, cy, lado] em coordenadas da cena, relativos à âncora do item (0, 0).
// Os seis do mockup vêm dos viewBox de 03-decorar.html (âncora em (0, 15)); o tapete do mockup usa
// escala 0,35, então o lado é 54 / 0,35. Os demais seguem a regra do mockup: centro na caixa do desenho,
// lado ≈ max(altura × 1,03, largura × 1,55) (parede: folga de ~15%).
// Itens de parede: no plano local da parede, já com THUMB_SKEW aplicado.
const THUMB_VIEW = {
  plant: [0, -18, 48],
  monstera: [0, -31, 68],
  armchair: [0, -21, 62],
  floorLamp: [0, -41, 92],
  rug: [0, 0, 154],
  catBed: [0, -5, 54],
  pouf: [0, -6, 40],
  flowerTable: [0, -22, 56],
  recordPlayer: [0, -12, 48],
  table: [0, -12, 85],
  bookshelf: [0, -36, 100],
  bunting: [0, -116, 100],
  stringLights: [0, -117, 106],
  frame: [0, -86, 40],
  hangingPlant: [0, -83, 53],
  clock: [0, -98, 32],
  cupShelf: [0, -78, 45],
};
const THUMB_SKEW = 0.25; // parede vista levemente de lado (a parede da sala usa 0,5)

// Item centrado num quadrado size × size, com o mesmo desenho da sala (drawItem).
// opts vai para drawItem ({ time, now, music, variant }); sem opts, o quadro é a paisagem e o relógio marca 3:00.
export function drawItemThumb(ctx, type, size, opts = {}) {
  const def = ITEM.get(type);
  const view = THUMB_VIEW[type];
  if (!def || !view) return;
  const [cx, cy, side] = view;
  const k = size / side;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(k, k);
  if (def.where === 'wall') ctx.transform(1, THUMB_SKEW, 0, 1, 0, 0);
  ctx.translate(-cx, -cy);
  drawItem(ctx, type, 0, 0, opts);
  ctx.restore();
}

// Canto de parede (2 ladrilhos de cada lado, altura cheia) com listras, lambri e rodapé.
// wallColor = id ou objeto de WALL_COLORS.
const WALL_THUMB_LEN = 60;
export function drawWallThumb(ctx, wallColor, size) {
  const c = typeof wallColor === 'string' || !wallColor ? findById(WALL_COLORS, wallColor, DEFAULT_WALL) : wallColor;
  const k = size / 160;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(k, k);
  ctx.translate(0, 47);
  wall(ctx, 'left', { ...WALL_LEFT, ...c.left }, { length: WALL_THUMB_LEN });
  wall(ctx, 'right', { ...WALL_RIGHT, ...c.right }, { length: WALL_THUMB_LEN });
  ctx.restore();
}

// Losango de piso (2 × 2 ladrilhos, com as bordas). floor = id ou objeto de FLOORS.
export function drawFloorThumb(ctx, floor, size) {
  const f0 = typeof floor === 'string' || !floor ? findById(FLOORS, floor, DEFAULT_FLOOR) : floor;
  const k = size / 132;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(k, k);
  ctx.translate(0, -35);
  paintFloor(ctx, f0, 2);
  ctx.restore();
}

// ---------- Composição ----------

// Fixos (não são itens): balcão com máquina, redoma e potes; luminárias pendentes sobre o balcão
// (profundidade logo após o balcão). A barista vem como entidade da simulação (arquitetura, seção 5).
const FIXED = [
  { gx: 2.25, gy: 1.3, paint: (ctx, x, y) => drawCounter(ctx, x, y) },
  { gx: 1.5, gy: 1.3, h: 75, depth: 3.56, paint: (ctx, x, y, o) => drawPendantLamp(ctx, x, y, o.time) },
  { gx: 2.9, gy: 1.3, h: 75, depth: 3.57, paint: (ctx, x, y, o) => drawPendantLamp(ctx, x, y, o.time) },
];

// Ajuste de profundidade por tipo: a estante é longa em gy (1,2 ladrilho) e fina em gx;
// ordenar pelo canto do fundo a mantém atrás do que está à frente dela.
const DEPTH_BIAS = { bookshelf: -0.81 };
const depthFor = (type, gx, gy) => (DEPTH_BIAS[type] ? gx + gy + DEPTH_BIAS[type] : undefined);

// Peças de chão ordenáveis de um layout. A mesa vira 3 peças (banquinho, mesa, banquinho)
// para os sentados ficarem na ordem certa. Memoizado por objeto de layout.
const piecesCache = new WeakMap();
const paintStool = (ctx, x, y) => drawStool(ctx, x, y);
const paintTable = (ctx, x, y) => drawTable(ctx, x, y);
function floorPieces(layout) {
  let cached = piecesCache.get(layout);
  if (cached) return cached;
  const rugs = [], pieces = [];
  for (const it of layout.floor || []) {
    const fn = FLOOR_DRAW[it.type];
    if (!fn) continue;
    const { gx, gy } = it.gx != null ? it : anchorOf(it.type, it.c, it.r);
    if (it.type === 'rug') rugs.push(project(gx, gy));
    else if (it.type === 'table') {
      pieces.push({ gx: gx - STOOL_DX, gy, paint: paintStool });
      pieces.push({ gx, gy, paint: paintTable });
      pieces.push({ gx: gx + STOOL_DX, gy, paint: paintStool });
    } else pieces.push({ gx, gy, depth: depthFor(it.type, gx, gy), paint: fn });
  }
  cached = { rugs, pieces: FIXED.concat(pieces) };
  piecesCache.set(layout, cached);
  return cached;
}

// Lugar em placing.free / chosen: [c, r], { c, r } ou { wall, pos }.
const spotC = (s) => (Array.isArray(s) ? s[0] : s.c);
const spotR = (s) => (Array.isArray(s) ? s[1] : s.r);
function sameSpot(a, b) {
  if (!a || !b) return false;
  if (a.wall != null || b.wall != null) return a.wall === b.wall && a.pos === b.pos;
  return spotC(a) === spotC(b) && spotR(a) === spotR(b);
}

const FREE_FILL = '#fff6e6', CHOSEN_FILL = '#7ed58a', CHOSEN_STROKE = '#3f9d55';

// Losango pequeno (0,22 do ladrilho, como no mockup) no centro de cada ladrilho livre;
// o escolhido é o ladrilho inteiro em verde com contorno.
function drawFloorSpots(ctx, placing) {
  for (const s of placing.free || []) {
    if (sameSpot(s, placing.chosen)) continue;
    const p = project(spotC(s) + 0.5, spotR(s) + 0.5);
    withAlpha(ctx, 0.55, () => poly(ctx, [p.x + 6.6, p.y, p.x, p.y + 3.3, p.x - 6.6, p.y, p.x, p.y - 3.3], FREE_FILL));
  }
  const ch = placing.chosen;
  if (!ch) return;
  withAlpha(ctx, 0.75, () => tile(ctx, spotC(ch), spotR(ch), CHOSEN_FILL));
  tile(ctx, spotC(ch), spotR(ch), null, CHOSEN_STROKE);
}

// Destaques da parede (retângulo no plano da parede) e item fantasma no escolhido.
function drawWallSpots(ctx, placing, opts) {
  const band = bandOf(placing.type);
  for (const side of ['left', 'right']) {
    ctx.save();
    wallTransform(ctx, side);
    for (const s of placing.free || []) {
      if (s.wall !== side || sameSpot(s, placing.chosen)) continue;
      const [x, y, w, h] = slotRect(side, band, s.pos);
      roundRect(ctx, x, y, w, h, 3, FREE_FILL, 0.55);
    }
    const ch = placing.chosen;
    if (ch && ch.wall === side) {
      const [x, y, w, h] = slotRect(side, band, ch.pos);
      roundRect(ctx, x, y, w, h, 3, CHOSEN_FILL, 0.75);
      roundRectPath(ctx, x, y, w, h, 3);
      ctx.strokeStyle = CHOSEN_STROKE;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      drawItem(ctx, placing.type, slotX(side, band, ch.pos), 0, { ...opts, alpha: 0.5 });
    }
    ctx.restore();
  }
}

// Quadros sem variant alternam paisagem e quadrinho azul pela ordem no layout (decisão 27).
const FRAME_VARIANTS = [null, 'small'];
function drawWallItems(ctx, items, opts) {
  for (const side of ['left', 'right']) {
    ctx.save();
    wallTransform(ctx, side);
    let frames = 0;
    for (const it of items) {
      const fn = WALL_DRAW[it.type];
      if (!fn) continue;
      const variant = it.type === 'frame' ? it.variant || FRAME_VARIANTS[frames++ % FRAME_VARIANTS.length] : null;
      if (it.wall === side) fn(ctx, slotX(side, it.band || bandOf(it.type), it.pos), 0, variant ? { ...opts, variant } : opts);
    }
    ctx.restore();
  }
}

// Centro da cabeça de uma entidade, a partir do y de project(gx, gy).
function headY(e, y) {
  return y - 40 - (e.pose === 'sit' ? 11 : 0);
}

// Desenha a sala inteira em coordenadas do viewBox. O chamador já aplicou escala, DPR e translação.
// layout = decor.sceneLayout() (sem layout: INITIAL_DECOR). wall/floor = objetos de WALL_COLORS/FLOORS (ou ids).
// placing = { type, free, chosen } (arquitetura, M3.5). now = { h, m } para o relógio; music liga as notas da vitrola.
// Ordem: piso, paredes e itens de parede (com destaques), luz da janela, capacho, tapetes, destaques do chão;
// depois móveis e personagens numa só lista por profundidade; balões e corações por último.
export function drawScene(ctx, { time = 0, entities = [], layout, wall, floor, placing, now = null, music = false } = {}) {
  const lay = layout || initialLayout();
  const wallColors = typeof wall === 'string' || !wall ? findById(WALL_COLORS, wall, DEFAULT_WALL) : wall;
  // Com entidade 'cat', a caminha é desenhada vazia e o gato vem da simulação.
  const catEntity = entities.some((e) => e.kind === 'cat');
  const opts = catEntity ? { time, now, music, catEntity } : { time, now, music };
  const { rugs, pieces } = floorPieces(lay);
  const def = placing && placing.type ? ITEM.get(placing.type) : null;
  const onWall = !!def && def.where === 'wall';
  ctx.save();
  drawFloor(ctx, floor);
  drawLeftWall(ctx, wallColors);
  drawRightWall(ctx, time, wallColors);
  drawWallItems(ctx, lay.wall || [], opts);
  if (onWall) drawWallSpots(ctx, placing, opts);
  drawWindowLight(ctx);
  drawDoorMat(ctx, 0.12, 4.35);
  for (const p of rugs) drawRoundRug(ctx, p.x, p.y);
  let list = pieces;
  if (def && !onWall) {
    drawFloorSpots(ctx, placing);
    const ch = placing.chosen;
    if (ch) {
      const a = anchorOf(placing.type, spotC(ch), spotR(ch));
      const ghost = (c, x, y) => drawItem(c, placing.type, x, y, { ...opts, alpha: 0.5 });
      if (placing.type === 'rug') { const p = project(a.gx, a.gy); ghost(ctx, p.x, p.y); }
      else list = list.concat({ gx: a.gx, gy: a.gy, depth: depthFor(placing.type, a.gx, a.gy), paint: ghost });
    }
  }
  const items = sortByDepth(entities.length ? list.concat(entities) : list);
  for (const it of items) {
    const p = project(it.gx, it.gy, it.h || 0);
    if (it.paint) it.paint(ctx, p.x, p.y, opts);
    else if (it.kind === 'thirst') continue;
    else if (it.kind === 'cat') drawCatPose(ctx, p.x, p.y, { pose: it.pose, dir: it.dir, walk: it.walk, time });
    else drawCharacter(ctx, lookOf(it), p.x, p.y, { pose: it.pose, dir: it.dir, walk: it.walk, time, cup: it.cup });
  }
  for (const e of entities) {
    if (e.kind !== 'thirst') continue;
    const p = project(e.gx, e.gy);
    drawThirstBubble(ctx, p.x, p.y - thirstHeight(lay, e), time);
  }
  for (const e of entities) {
    if (e.kind === 'thirst' || (!e.bubble && e.heart == null && !e.speech)) continue;
    const p = project(e.gx, e.gy);
    if (e.kind === 'cat') { if (e.heart != null) drawHeart(ctx, p.x, catTop(e, p.y), e.heart); continue; }
    const top = headY(e, p.y) - 18;
    if (e.heart != null) drawHeart(ctx, p.x, top, e.heart);
    if (e.bubble) drawOrderBubble(ctx, p.x, top, e.bubble.label);
    if (e.speech) drawSpeechBubble(ctx, p.x, e.bubble ? top - 26 : top, e.speech.text, e.speech.p);
  }
  ctx.restore();
}
