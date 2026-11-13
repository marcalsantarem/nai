# BRF-042 — AG02 (UI) — T-042 Ajustes

**Ler:** especificação, Telas (Ajustes) e PWA no iOS (linha Campos de texto); decisão 16; `js/audio.js` (`setMusic`, `setRain`; o áudio relê `settings` do estado a cada evento, então **a escolha tem de ser gravada no estado**); `js/state.js` (`settings`, `name`, `reset`).

**Pronto quando:**
- Painel deslizante aberto pelo botão de engrenagem do topo da Cafeteria (fecha tocando fora ou num botão de fechar), no estilo dos componentes (creme, contorno, sombra dura).
- Música e Som de chuva: chaves liga/desliga; gravam em `settings` no estado e chamam `setMusic`/`setRain`; voltam iguais ao reabrir.
- Nome da cafeteria: campo de texto até 24 caracteres, fonte ≥ 16 px; grava no estado e o topo passa a mostrar o nome; vazio volta a “Nai's Cafe”. O teclado do iPhone não deve quebrar o layout.
- “Recomeçar do zero” com confirmação em dois toques (o 1º troca o texto para “Toque de novo para confirmar” por alguns segundos); confirma com `state.reset()` e recarrega o jogo do zero.
- Alvos ≥ 44 pt; sem imagens, gradientes nem emoji.

**Arquivos permitidos:** `js/screens/ajustes.js` (novo, ou componente dentro de `cafeteria.js`), `js/screens/cafeteria.js`, `js/main.js`, `css/ui.css`. Não altere `state`, `audio`, `sim`: se faltar algo, registre na entrega.

**Validação:** navegador local (ou Chrome sem janela): abrir e fechar; chaves gravam e voltam ao recarregar; nome com 24+ caracteres corta; nome vazio; recomeçar com um e dois toques; 360, 390 e 430; console sem erros.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
