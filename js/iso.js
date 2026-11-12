// Base isométrica: projeção, cores e formas básicas sobre CanvasRenderingContext2D.
// Funções puras, sem estado global. Coordenadas no sistema do viewBox do mockup
// (-186 -132 372 330): a origem é o canto do fundo da sala, no chão.

export const TILE_X = 30;   // meia largura do ladrilho na tela
export const TILE_Y = 15;   // meia altura do ladrilho na tela
export const GRID = 6;      // sala de 6 × 6 ladrilhos
export const WALL_H = 124;  // altura das paredes
export const SHADOW = '#2a1b3d';

// ---------- Projeção ----------

// Grade (gx, gy) e altura h → ponto na tela.
export function project(gx, gy, h = 0) {
  return { x: (gx - gy) * TILE_X, y: (gx + gy) * TILE_Y - h };
}

// Ponto na tela → grade, no plano do chão (h = 0).
export function unproject(x, y) {
  const a = x / TILE_X;
  const b = y / TILE_Y;
  return { gx: (a + b) / 2, gy: (b - a) / 2 };
}

// ---------- Cores ----------

// Multiplica cada canal RGB por k (truncado, limitado a 0..255).
export function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.floor(v * k)));
  const r = c((n >> 16) & 255), g = c((n >> 8) & 255), b = c(n & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// ---------- Primitivas 2D ----------

// Polígono a partir de [x0, y0, x1, y1, ...]. stroke opcional (largura 0,8, cantos redondos).
export function poly(ctx, pts, fill, stroke = null, lineWidth = 0.8) {
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

export function ellipse(ctx, cx, cy, rx, ry, fill, alpha = 1) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  if (alpha !== 1) {
    const a = ctx.globalAlpha;
    ctx.globalAlpha = a * alpha;
    ctx.fill();
    ctx.globalAlpha = a;
  } else ctx.fill();
}

export function circle(ctx, cx, cy, r, fill, alpha = 1) {
  ellipse(ctx, cx, cy, r, r, fill, alpha);
}

// Caminho de retângulo arredondado (raio limitado como no SVG).
export function roundRectPath(ctx, x, y, w, h, r = 0) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  if (!r) { ctx.rect(x, y, w, h); return; }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function roundRect(ctx, x, y, w, h, r, fill, alpha = 1) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  if (alpha !== 1) {
    const a = ctx.globalAlpha;
    ctx.globalAlpha = a * alpha;
    ctx.fill();
    ctx.globalAlpha = a;
  } else ctx.fill();
}

// Sombra de contato: elipse #2a1b3d a 16%.
export function contactShadow(ctx, x, y, rx, ry = rx / 2) {
  ellipse(ctx, x, y, rx, ry, SHADOW, 0.16);
}

// ---------- Formas isométricas ----------

// Losango de ladrilho com canto do fundo em (gx, gy).
export function tile(ctx, gx, gy, fill, stroke = null, w = 1, d = 1) {
  const a = project(gx, gy), b = project(gx + w, gy), c = project(gx + w, gy + d), e = project(gx, gy + d);
  poly(ctx, [a.x, a.y, b.x, b.y, c.x, c.y, e.x, e.y], fill, stroke);
}

// Caixa de três faces: footprint (gx, gy, w, d), altura h, base em z.
// Cores derivadas de `color` (topo × 1,06, esquerda × 0,86, direita × 0,70), sobrescrevíveis.
// A face esquerda fica em gy + d; a direita em gx + w. Cada face leva contorno da própria cor (esconde emendas).
export function box(ctx, gx, gy, w, d, h, color, { z = 0, top, left, right } = {}) {
  const t = top || shade(color, 1.06);
  const l = left || shade(color, 0.86);
  const r = right || shade(color, 0.70);
  const zt = z + h;
  const A = project(gx, gy + d, z), B = project(gx + w, gy + d, z), C = project(gx + w, gy, z);
  const At = project(gx, gy + d, zt), Bt = project(gx + w, gy + d, zt), Ct = project(gx + w, gy, zt);
  const Dt = project(gx, gy, zt);
  poly(ctx, [At.x, At.y, Bt.x, Bt.y, B.x, B.y, A.x, A.y], l, l);
  poly(ctx, [Ct.x, Ct.y, Bt.x, Bt.y, B.x, B.y, C.x, C.y], r, r);
  poly(ctx, [Dt.x, Dt.y, Ct.x, Ct.y, Bt.x, Bt.y, At.x, At.y], t, t);
}

// Retângulo numa face vertical: face 'left' (plano gy = const) ou 'right' (plano gx = const).
// u0..u1 corre ao longo da face (gx na esquerda, gy na direita); h0..h1 é a altura.
export function faceRect(ctx, face, at, u0, u1, h0, h1, fill) {
  const p = face === 'left'
    ? (u, h) => project(u, at, h)
    : (u, h) => project(at, u, h);
  const a = p(u0, h0), b = p(u1, h0), c = p(u1, h1), e = p(u0, h1);
  poly(ctx, [a.x, a.y, b.x, b.y, c.x, c.y, e.x, e.y], fill);
}

// Cilindro de pé com base no ponto de tela (x, y): elipse r × 42 por r × 21, altura h.
// Lateral em `side` (padrão: topo × 0,78).
export function cylinder(ctx, x, y, r, h, top, side = shade(top, 0.78)) {
  const rx = r * 42, ry = r * 21;
  ellipse(ctx, x, y, rx, ry, side);
  ctx.fillStyle = side;
  ctx.fillRect(x - rx, y - h, rx * 2, h);
  ellipse(ctx, x, y - h, rx, ry, top);
}

// ---------- Paredes ----------

// Cisalhamento do plano da parede: 'left' (−0,5) ou 'right' (+0,5).
// No plano local, x é o da tela e y = −altura (0 no chão, −124 no topo).
export function wallTransform(ctx, side) {
  ctx.transform(1, side === 'left' ? -0.5 : 0.5, 0, 1, 0, 0);
}

// Parede com listras, lambri e rodapé. Desenha no plano local já cisalhado.
// c: { base, stripe, wainscot, rail, baseboard, panel }
export function wall(ctx, side, c, { length = GRID * TILE_X, height = WALL_H } = {}) {
  const x0 = side === 'left' ? -length : 0;
  ctx.save();
  wallTransform(ctx, side);
  ctx.fillStyle = c.base;
  ctx.fillRect(x0, -height, length, height);
  ctx.fillStyle = c.stripe;
  for (let x = x0; x < x0 + length; x += 30) ctx.fillRect(x, -height, 15, height);
  ctx.fillStyle = c.wainscot;
  ctx.fillRect(x0, -36, length, 36);
  ctx.fillStyle = c.rail;
  ctx.fillRect(x0, -39, length, 4);
  ctx.fillStyle = c.baseboard;
  ctx.fillRect(x0, -6, length, 6);
  for (let x = x0 + 4; x < x0 + length; x += 30) roundRect(ctx, x, -30, 22, 20, 2, c.panel);
  ctx.restore();
}

// ---------- Ordem de desenho ----------

// Chave de profundidade: gx + gy (ou item.depth, se houver).
export function depthOf(item) {
  return item.depth ?? item.gx + item.gy;
}

// Cópia ordenada em ordem crescente de profundidade (estável).
export function sortByDepth(items) {
  return items
    .map((it, i) => ({ it, i, k: depthOf(it) }))
    .sort((a, b) => a.k - b.k || a.i - b.i)
    .map((e) => e.it);
}
