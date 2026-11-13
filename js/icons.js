// Ícones de traço do jogo (viewBox 24), tirados do mockup. Servem para HTML (iconSvg) e canvas (drawIcon).
// Cada ícone é um único `d` de caminho SVG; círculos, elipses e retângulos do mockup viram arcos.

const STROKE = 2.2;

// Primitivas convertidas para caminho (mesmo traçado do elemento SVG original).
const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;

function ellipse(cx, cy, rx, ry, deg = 0) {
  const a = (deg * Math.PI) / 180;
  const dx = +(rx * Math.cos(a)).toFixed(3);
  const dy = +(rx * Math.sin(a)).toFixed(3);
  return `M${cx - dx} ${cy - dy}A${rx} ${ry} ${deg} 1 0 ${cx + dx} ${cy + dy}A${rx} ${ry} ${deg} 1 0 ${cx - dx} ${cy - dy}z`;
}

const rect = (x, y, w, h, r) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}` +
  `h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

// Flor de 5 pétalas: arcos grandes entre pontos de um círculo interno, mais o miolo. [Proposta]: não está no mockup.
function flower() {
  const pts = [];
  for (let k = 0; k < 5; k++) {
    const a = ((-54 + k * 72) * Math.PI) / 180;
    pts.push([+(12 + 4.2 * Math.cos(a)).toFixed(2), +(12 + 4.2 * Math.sin(a)).toFixed(2)]);
  }
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let k = 1; k <= 5; k++) {
    const [x, y] = pts[k % 5];
    d += `A3.2 3.2 0 1 1 ${x} ${y}`;
  }
  return `${d}z${circle(12, 12, 1.9)}`;
}

const CUP = 'M5 9h11v4a5.5 5.5 0 0 1-11 0zM16 10h1.5a2.5 2.5 0 0 1 0 5h-1.9M4 20h13M8.5 3.5c-1 1.2 1 1.8 0 3M12.5 3.5c-1 1.2 1 1.8 0 3';
const DROP = 'M12 3.5c3.5 4.2 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2-5.8 5.5-10z';

// id → { d, stroke? }. Ids dos ingredientes iguais a docs/arquitetura.md.
export const ICONS = {
  // Ingredientes (02-preparo.html)
  grind: { d: ellipse(9, 13.5, 4, 6, -25) + ellipse(17, 8.5, 3, 4.5, 30) + 'M7.4 8.8c2.4 2.6.8 6.2 3 9' },
  espresso: { d: 'M5 10h10v3a5 5 0 0 1-10 0zM15 11h1.5a2 2 0 0 1 0 4h-1.8M4 20h12M10 4c-1 1.2 1 1.8 0 3' },
  hotWater: { d: DROP },
  teaBag: { d: 'M12 3v6M10 14h4' + rect(7, 9, 10, 11, 2) },
  milk: { d: 'M8 4h8v3l2 3v10H6V10l2-3zM6 13h12' },
  foam: { d: 'M7 17a4 4 0 0 1 .6-7.9A5 5 0 0 1 17 8.6 4.2 4.2 0 0 1 17 17z' },
  chocolate: { d: rect(5, 4, 14, 16, 2) + 'M12 4v16M5 9.3h14M5 14.6h14' },
  ice: { d: 'M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3zM12 12l7.5-4.7M12 12v9M12 12L4.5 7.3' },
  // Bebida / xícara (04-clientes.html "Sempre pede"; igual ao Cardápio da navegação)
  cup: { d: CUP },
  // Controles
  back: { d: 'M14.5 5.5L8 12l6.5 6.5' },
  check: { d: 'M5 12.5l4.5 4.5L19 7.5', stroke: 3 },
  settings: { d: circle(12, 12, 6.3) + circle(12, 12, 2.4) + 'M12 2.6v3.1M12 18.3v3.1M2.6 12h3.1M18.3 12h3.1M5.4 5.4l2.2 2.2M16.4 16.4l2.2 2.2M5.4 18.6l2.2-2.2M16.4 7.6l2.2-2.2' },
  // Navegação (01-cafeteria.html)
  cafe: { d: 'M4 10l1.5-5h13L20 10M5 10.5V19h14v-8.5M10 19v-5h4v5M4 10a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 10' },
  decor: { d: 'M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM6 18v2M18 18v2' },
  menu: { d: CUP },
  guests: { d: circle(9, 8, 3.2) + circle(17, 9, 2.4) + 'M3 19c.6-3.4 3-5 6-5s5.4 1.6 6 5M16.5 14.2c2.4.2 4 1.6 4.5 4.3' },
  // Extras: gota (planta com sede) e desenhos da espuma. Coração, flor e estrela são [Proposta] (não estão no mockup).
  drop: { d: DROP },
  heart: { d: 'M12 19.5S4.5 15 4.5 9.6A3.9 3.9 0 0 1 12 7.8a3.9 3.9 0 0 1 7.5 1.8c0 5.4-7.5 9.9-7.5 9.9z' },
  flower: { d: flower() },
  star: { d: 'M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8z' },
};

function get(id) {
  const icon = ICONS[id];
  if (!icon) throw new Error(`icons: ícone desconhecido "${id}"`);
  return icon;
}

// String <svg> de traço em currentColor. `stroke` sobrescreve a espessura padrão do ícone.
export function iconSvg(id, { size = 24, stroke } = {}) {
  const icon = get(id);
  const sw = stroke ?? icon.stroke ?? STROKE;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icon.d}"/></svg>`;
}

const pathCache = new Map();

// Desenha o ícone no canvas com (x, y) no CENTRO, em caixa de `size` px (viewBox 24 escalado).
export function drawIcon(ctx, id, x, y, size, color) {
  const icon = get(id);
  let p = pathCache.get(id);
  if (!p) {
    p = new Path2D(icon.d);
    pathCache.set(id, p);
  }
  const s = size / 24;
  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);
  ctx.scale(s, s);
  ctx.strokeStyle = color;
  ctx.lineWidth = icon.stroke ?? STROKE;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(p);
  ctx.restore();
}
