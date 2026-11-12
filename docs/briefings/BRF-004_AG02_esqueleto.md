# BRF-004 — AG02 (UI) — T-004 Esqueleto do jogo

**Objetivo:** a base sobre a qual todas as telas serão construídas: página, tokens, componentes, laço e troca de telas.

**Ler:** especificação (`docs/especificacao.md`), seções Plataforma, Direção de arte (Cores, Tipografia, Componentes), Telas (Regras comuns), Renderização e a linha de Gestos do sistema em PWA no iOS. Referência visual: `docs/referencia/mockup-src/01-cafeteria.html` (leia o README dela primeiro; use trechos).

**Pronto quando:**
- `index.html`: `lang="pt-BR"`, título “Nai's Cafe”, viewport com `viewport-fit=cover` e sem zoom, importa `fonts/fonts.css`, `css/tokens.css`, `css/ui.css` e `js/main.js` como módulo. Metadados de PWA/Apple **não** (são do AG05, no M5).
- `css/tokens.css`: todas as cores, fontes, raios, contornos e sombras da Direção de arte como variáveis CSS, com os nomes em inglês (ex.: `--ink`, `--cream`, `--dusk`).
- `css/ui.css`: componentes do mockup — botão (primário verde, neutro creme, desativado; pressionado desce 3 px e sombra vai a 1 px), botão de ícone redondo, cartão, pílula, moeda, barra de progresso, barra de navegação com item ativo. Alvos ≥ 44 pt.
- Layout: fundo Entardecer com o círculo claro e os cinco pontos de luz; coluna central de no máximo 430 pt, com o fundo ao redor; `env(safe-area-inset-*)`; 56 pt livres no topo e 28 pt na base; margens laterais de 16 pt. Sem zoom por toque duplo/pinça, sem seleção de texto, sem menu de toque longo, sem rolagem elástica.
- `js/main.js`: laço com `requestAnimationFrame` e dt limitado a 50 ms; troca de telas por um registro simples (cada tela em `js/screens/<nome>.js` com `enter`, `exit`, `update(dt)`); começa na tela `cafeteria`.
- `js/screens/cafeteria.js`: **provisório**, só para validar os componentes. Mostra uma amostra de cada componente na posição aproximada do mockup. A T-007 substitui o conteúdo.

**Arquivos permitidos:** `index.html`, `css/`, `js/main.js`, `js/screens/`. Não altere `fonts/`, `js/version.js` nem `docs/`.

**Validação:** abra servido localmente a 390 × 844, 360 e 430 de largura e numa janela larga. Compare cores, fontes, contornos e sombras com o mockup extraído. Console sem erros.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), dizendo o que **não** foi verificado. Pare servidores que abrir.
