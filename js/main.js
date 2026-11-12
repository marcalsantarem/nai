// Ponto de entrada: laço principal e troca de telas.
import cafeteria from './screens/cafeteria.js';

// Registro de telas: cada uma tem enter(root), exit() e update(dt).
const screens = { cafeteria };

const MAX_DT = 0.05; // 50 ms
const app = document.getElementById('app');
let current = null;
let lastTime = 0;

export function showScreen(name) {
  const next = screens[name];
  if (!next) throw new Error(`Tela desconhecida: ${name}`);
  if (current) current.exit();
  app.replaceChildren();
  const root = document.createElement('div');
  root.className = 'screen';
  root.dataset.screen = name;
  app.append(root);
  current = next;
  current.enter(root);
}

function frame(time) {
  const dt = lastTime ? Math.min((time - lastTime) / 1000, MAX_DT) : 0;
  lastTime = time;
  if (current) current.update(dt);
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
showScreen('cafeteria');
requestAnimationFrame(frame);
