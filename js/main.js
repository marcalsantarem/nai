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
  root.className = 'screen is-entering';
  root.dataset.screen = name;
  root.addEventListener('animationend', (e) => { if (e.target === root) root.classList.remove('is-entering'); });
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

// Gestos do sistema no iOS: sem pinça, sem menu de toque longo, sem rolagem elástica
// fora das listas que rolam (.scroll). Toque duplo e seleção ficam no CSS.
function canScroll(target) {
  const el = target instanceof Element ? target.closest('.scroll') : null;
  return !!el && el.scrollHeight > el.clientHeight;
}

function blockSystemGestures() {
  const prevent = (e) => e.preventDefault();
  document.addEventListener('gesturestart', prevent);
  document.addEventListener('gesturechange', prevent);
  document.addEventListener('contextmenu', prevent);
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1 || !canScroll(e.target)) e.preventDefault();
  }, { passive: false });
  // Faz o :active funcionar no Safari do iOS.
  document.addEventListener('touchstart', () => {}, { passive: true });
  // O teclado do iPhone pode deixar a página deslocada ao fechar: volta ao topo.
  const resetScroll = () => { if (window.scrollX || window.scrollY) window.scrollTo(0, 0); };
  document.addEventListener('focusout', () => { resetScroll(); setTimeout(resetScroll, 120); });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      if (!(document.activeElement instanceof HTMLInputElement)) resetScroll();
    });
  }
}

// Pressionado no primeiro toque (o :active do Safari pode atrasar ou não vir):
// marca o botão no pointerdown e solta no fim do toque, visível por pelo menos PRESS_MIN_MS.
const PRESS_MIN_MS = 90;
function pressFeedback() {
  let pressed = null;
  let since = 0;
  const release = () => {
    const el = pressed;
    if (!el) return;
    pressed = null;
    const wait = PRESS_MIN_MS - (performance.now() - since);
    if (wait > 0) setTimeout(() => el.classList.remove('is-pressed'), wait);
    else el.classList.remove('is-pressed');
  };
  document.addEventListener('pointerdown', (e) => {
    release();
    const el = e.target instanceof Element ? e.target.closest('button:not(:disabled)') : null;
    if (!el) return;
    pressed = el;
    since = performance.now();
    el.classList.add('is-pressed');
  }, { passive: true });
  document.addEventListener('pointerup', release, { passive: true });
  document.addEventListener('pointercancel', release, { passive: true });
}

blockSystemGestures();
pressFeedback();
document.addEventListener('pointerdown', unlock, { capture: true, passive: true }); // som só após o toque; também retoma
go('cafeteria');
requestAnimationFrame(frame);
