# Backlog

> Mantido pelo AG00. Estado: `a fazer` · `em andamento` · `feita`. Tamanho: P/M/G. Marcos em [roadmap.md](roadmap.md).

## M1 — v0.1.0 — Base visual

| ID | Título | Tam. | Dono | Estado |
|---|---|---|---|---|
| T-001 | Ligar a pasta ao repositório, descartar o protótipo e preservar os ícones em `icons/` | P | AG00 | feita |
| T-002 | Extrair o código-fonte legível do mockup para `docs/referencia/mockup-src/` (HTML da página e scripts de desenho) | P | AG03 (Arte) | feita (BRF-001) |
| T-003 | Fontes locais: Baloo 2 e Nunito em `fonts/` com `OFL.txt` (extraídas do mockup ou do `google/fonts`) | P | AG05 (Plataforma) | feita (BRF-002) |
| T-004 | Esqueleto: `index.html`, `css/tokens.css`, `css/ui.css`, `js/main.js` (laço rAF com dt ≤ 50 ms, troca de telas), coluna ≤ 430, áreas seguras, fundo Entardecer | M | AG02 (UI) | feita (BRF-004) |
| T-005 | `js/iso.js`: projeção e inversa, caixa, cilindro, elipse, sombra de contato, paredes | M | AG03 (Arte) | feita (BRF-005) |
| T-006 | `js/art.js`: sala inicial completa do mockup, canvas com DPR até 3× | G | AG03 (Arte) | feita (BRF-006) |
| T-007 | Tela Cafeteria: topo (nível, nome, progresso, moedas, ajustes), cena, cartão “Aguardando o próximo cliente”, navegação | G | AG02 (UI) | feita (BRF-007) |
| T-008 | `js/version.js` (decisão 11) e versão visível no título da página ou em meta | P | AG05 (Plataforma) | feita (BRF-003) |
| T-009 | Deploy no Netlify (decisão 9): já configurado pelo dono; conferir o site da `dev` depois da T-007 | P | AG00 | feita (site da dev servindo a versão atual) |
| T-010 | Validação do M1 contra o mockup a 390 × 844 e em 360/430 | M | AG06 (QA) | feita (BRF-008, BRF-011): passa, ver docs/qa/qa-M1.md |
| T-012 | QA D1: quadro-negro com “Nai's Cafe” (decisão 17) | P | AG03 (Arte) | feita (BRF-009) |
| T-013 | QA D2 e D3: cartão vazio só “Aguardando” (decisão 18) e legenda do progresso sem palavra sozinha a 430 | P | AG02 (UI) | feita (BRF-010) |
| T-011 | Fechamento do M1: versão, PR `dev` → `main`, tag v0.1.0 | P | AG00 | feita (PR #1, tag v0.1.0) |

Dependências: T-002 antes de T-005/T-006/T-007 · T-004 antes de T-007 · T-005 antes de T-006 · T-006 e T-007 antes de T-010.

## M2 — v0.2.0 — Ciclo principal

| ID | Título | Tam. | Dono | Estado |
|---|---|---|---|---|
| T-014 | Contratos do M2 em `docs/arquitetura.md`: forma do estado, API da simulação (entrada, fila, pedido, entrega, lugar, saída), entidades que a cena desenha e eventos para as telas | M | AG01 (Gameplay) | a fazer |
| T-015 | `js/data.js`: 7 receitas (preço, passos, marco de liberação), ingredientes (camada, altura, cor), constantes do ciclo (chegada 7–14 s, 1,7 ladrilho/s, mesa 14–26 s, 40 moedas, gorjeta 0–2, +1 com desenho), nomes e aparências de clientes comuns | P | AG01 (Gameplay) | a fazer |
| T-016 | `js/icons.js`: ícones de traço dos 8 ingredientes, das bebidas e de voltar/visto, a partir do mockup (`02-preparo.html`), usáveis em HTML e no canvas | M | AG02 (UI) | a fazer |
| T-017 | `js/state.js` (estado em memória: moedas, servidas, contagem) e `js/sim.js`: chegada pela porta, caminho até a fila (máx. 3), pedido do primeiro com receitas liberadas, entrega com pagamento, lugar livre na mesa ou saída com o copo, coração e saída | G | AG01 (Gameplay) | a fazer |
| T-018 | Arte dos clientes em `js/art.js`: aparência variada, andar, sentar, copo na mão, balão de pedido (ícone + nome da bebida), coração; `drawScene` passa a receber as entidades da simulação e mantém a ordem por profundidade | G | AG03 (Arte) | a fazer |
| T-019 | Tela Cafeteria ligada à simulação: cartão com retrato, “Nome quer um X”, valor e “Preparar”; toque no primeiro cliente abre o Preparo; moedas e barra de progresso atualizam | M | AG02 (UI) | a fazer |
| T-020 | Tela Preparo (`js/screens/preparo.js`) igual ao mockup: topo, passos, palco com a xícara e camadas animadas (~0,8 s), dica, grade 2 × 4 com o próximo em destaque, erro sem punição (balança e repete a dica), desenho na espuma (coração, flor, estrela), “Entregar”, voltar sem perder o cliente | G | AG02 (UI) | a fazer |
| T-021 | Validação do M2: 4 receitas iniciais preparáveis, 20 clientes seguidos sem travar e sem forma de perder, telas Cafeteria e Preparo contra o mockup | M | AG06 (QA) | a fazer |
| T-022 | Fechamento do M2: versão 0.2.0, PR `dev` → `main`, tag v0.2.0 | P | AG00 | a fazer |

Ordem: T-014 → (T-015 ∥ T-016) → (T-017 ∥ T-018) → T-019 → T-020 → T-021 → T-022. T-019 e T-020 são do mesmo agente e mexem em `css/ui.css`, então rodam em série.

Fora do M2 (ficam para o M3/M4): salvar progresso, liberar Mocha, Chocolate quente e Café gelado, nível, clientes da casa e áudio. A barra de progresso conta as servidas, mas a liberação de receitas só entra no M4.

## Próximos marcos

M3–M5: tasks criadas quando o marco começar.
