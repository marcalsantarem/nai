// Painel de Ajustes (T-042): música, chuva, nome da cafeteria e "Recomeçar do zero".
// Componente aberto pela engrenagem da Cafeteria; grava pelos setters do estado (o áudio reage ao evento).

const NAME_MAX = 24; // decisão 16
const CONFIRM_MS = 3000; // janela do 2º toque em "Recomeçar do zero"
const OPEN_MS = 300; // durante a descida, toque fora não fecha
const RESET_LABEL = 'Recomeçar do zero';
const CONFIRM_LABEL = 'Toque de novo para confirmar';
const CLOSE_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

const switchRow = (key, label) => `
  <button class="set-row" type="button" role="switch" aria-checked="false" data-setting="${key}">
    <span class="set-row__label">${label}</span>
    <span class="switch" aria-hidden="true"><span class="switch__knob"></span></span>
  </button>`;

function template() {
  return `
  <div class="settings__panel card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
    <div class="settings__head">
      <h2 class="title-card" id="settings-title">Ajustes</h2>
      <button class="icon-btn" type="button" aria-label="Fechar" data-action="close">${CLOSE_ICON}</button>
    </div>
    ${switchRow('music', 'Música')}
    ${switchRow('rain', 'Som de chuva')}
    <label class="set-field">
      <span class="label">NOME DA CAFETERIA</span>
      <input class="set-field__input" type="text" maxlength="${NAME_MAX}" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Nai's Cafe" data-ref="name">
    </label>
    <button class="btn set-reset" type="button" data-action="reset">${RESET_LABEL}</button>
  </div>`;
}

// Abre o painel em `host` (a tela). ctx = { state, onName, onClose }. Devolve close().
export function openSettings(host, { state, onName = () => {}, onClose = () => {} }) {
  const el = document.createElement('div');
  el.className = 'settings';
  el.innerHTML = template();
  const input = el.querySelector('[data-ref="name"]');
  const resetBtn = el.querySelector('[data-action="reset"]');
  let armed = null; // timer do 1º toque
  let closed = false;
  const openedAt = performance.now();

  const s = () => state.get(); // o objeto muda depois de reset(): sempre relê

  function renderSwitches() {
    const set = s().settings || {};
    for (const b of el.querySelectorAll('[data-setting]')) {
      b.setAttribute('aria-checked', set[b.dataset.setting] !== false ? 'true' : 'false');
    }
  }

  function toggle(key) {
    const on = (s().settings || {})[key] === false;
    state.setSettings({ [key]: on });
    renderSwitches();
  }

  function onInput() {
    const v = input.value.trim().slice(0, NAME_MAX);
    state.setName(v);
    onName();
  }

  function disarm() {
    if (armed) clearTimeout(armed);
    armed = null;
    resetBtn.classList.remove('is-armed');
    resetBtn.textContent = RESET_LABEL;
  }

  function onReset() {
    if (!armed) {
      resetBtn.classList.add('is-armed');
      resetBtn.textContent = CONFIRM_LABEL;
      armed = setTimeout(disarm, CONFIRM_MS);
      return;
    }
    disarm();
    state.reset();
    location.reload(); // simulação, telas e áudio voltam do zero
  }

  function onClick(e) {
    if (e.target === el) { // toque fora do painel
      if (performance.now() - openedAt >= OPEN_MS) close();
      return;
    }
    const sw = e.target.closest('[data-setting]');
    if (sw) { toggle(sw.dataset.setting); return; }
    const act = e.target.closest('[data-action]');
    if (!act) return;
    if (act.dataset.action === 'close') close();
    else if (act.dataset.action === 'reset') onReset();
  }

  function onKey(e) {
    if (e.key === 'Enter') input.blur();
  }

  // iOS pode deixar a página rolada depois do teclado: volta ao topo.
  function onBlur() {
    input.value = s().name;
    window.scrollTo(0, 0);
  }

  function close() {
    if (closed) return;
    closed = true;
    disarm();
    if (document.activeElement === input) input.blur();
    el.removeEventListener('click', onClick);
    el.remove();
    onClose();
  }

  input.value = s().name;
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', onKey);
  input.addEventListener('blur', onBlur);
  el.addEventListener('click', onClick);
  renderSwitches();
  host.append(el);
  void el.offsetWidth; // aplica o estado inicial antes da transição
  el.classList.add('is-open');
  return close;
}
