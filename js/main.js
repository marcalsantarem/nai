// Ponto de entrada: estado, simulação, laço principal e troca de telas.
import * as state from './state.js';
import { createSim } from './sim.js';
import { unlock } from './audio.js';
import cafeteria from './screens/cafeteria.js';
import preparo from './screens/preparo.js';
import decorar from './screens/decorar.js';
import clientes from './screens/clientes.js';
import cardapio from './screens/cardapio.js';

// Registro de telas: cada uma tem enter(root, ctx), exit() e update(dt).
const screens = { cafeteria, preparo, decorar, clientes, cardapio };

const MAX_DT = 0.05; // 50 ms
const app = document.getElementById('app');
const sim = createSim({ store: state });
let current = null;
let lastTime = 0;

// Troca de tela (arquitetura, seção 7). ctx = { sim, state, go, params }.
export function go(name, params = {}) {
  const next = screens[name];
  if (!next) throw new Error(`Tela desconhecida: ${name}`);
  if (current) current.exit();
  app.replaceChildren();
  const root = document.createElement('div');
  root.className = 'screen';
  root.dataset.screen = name;
  app.append(root);
  current = next;
  current.enter(root, { sim, state, go, params });
}

// Avança um quadro: a simulação roda em qualquer tela.
export function step(dt) {
  sim.update(dt);
  if (current) current.update(dt);
}

function frame(time) {
  const dt = lastTime ? Math.min((time - lastTime) / 1000, MAX_DT) : 0;
  lastTime = time;
  step(dt);
  requestAnimationFrame(frame);
}

// Gestos do sistema no iOS: sem pinça, sem menu de toque longo.
// (Toque duplo, seleção e rolagem elástica ficam no CSS.)
function blockSystemGestures() {
  const prevent = (e) => e.preventDefault();
  document.addEventListener('gesturestart', prevent);
  document.addEventListener('gesturechange', prevent);
  document.addEventListener('contextmenu', prevent);
  document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  // Faz o :active funcionar no Safari do iOS.
  document.addEventListener('touchstart', () => {}, { passive: true });
}

blockSystemGestures();
document.addEventListener('pointerdown', unlock, { capture: true, passive: true }); // som só após o toque; também retoma
go('cafeteria');
requestAnimationFrame(frame);
