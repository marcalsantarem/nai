# BRF-048 — AG02 (UI) — T-048 Acabamento

**Ler:** `docs/qa/qa-M3.md` e `docs/qa/qa-M4.md` (ressalvas D1–D6 do M4); especificação, Componentes (botão pressionado) e Direção de arte.

**Pronto quando:**
- Toque: todo botão responde ao primeiro toque com o estado pressionado (desce 3 px, sombra 1 px) também no iPhone (`:active` com `touchstart` ou equivalente), sem atraso.
- Transições curtas e suaves entre telas (sem desfoque nem gradiente), respeitando `prefers-reduced-motion`.
- Ressalvas do M4: D1 a gota e o gato na Decorar não aparecem (ou aparecem e respondem; escolha esconder); D2 nome longo no topo legível; D3 balão de fala não cobre o pedido; D4 ladrilho recusado por fechar a passagem ganha marca (ex.: losango coral) por um instante; D5 barra de rolagem do Cardápio discreta ou oculta; D6 `body` sem largura maior que a tela.
- Legenda da barra com “Café com leite batido”: no máximo 2 linhas a 360 e 390 (ex.: texto mais curto “Faltam 2 para o Café com leite batido” [Proposta] ou fonte menor).
- Cores locais de `.prep`, `.decor`, Clientes e Cardápio movidas para `css/tokens.css` (**autorizado**), com nomes em inglês.

**Arquivos permitidos:** `css/`, `js/screens/`, `js/main.js`. Não toque em `index.html`, `js/art.js`, `sim`, `state`, `decor`, `data`: se precisar de algo deles, registre na entrega.

**Validação:** navegador local a 390, 360 e 430; cada ressalva conferida; console sem erros.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123); pasta de teste própria no scratchpad.
