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
| T-014 | Contratos do M2 em `docs/arquitetura.md`: forma do estado, API da simulação (entrada, fila, pedido, entrega, lugar, saída), entidades que a cena desenha e eventos para as telas | M | AG01 (Gameplay) | feita (BRF-012) |
| T-015 | `js/data.js`: 8 receitas (decisão 13) (preço, passos, marco de liberação), ingredientes (camada, altura, cor), constantes do ciclo (chegada 7–14 s, 1,7 ladrilho/s, mesa 14–26 s, 40 moedas, gorjeta 0–2, +1 com desenho), nomes brasileiros comuns e aparências de clientes comuns (decisão 19) | P | AG01 (Gameplay) | feita (BRF-013) |
| T-016 | `js/icons.js`: ícones de traço dos 8 ingredientes, das bebidas e de voltar/visto, a partir do mockup (`02-preparo.html`), usáveis em HTML e no canvas | M | AG02 (UI) | feita (BRF-014) |
| T-017 | `js/state.js` (estado em memória: moedas, servidas, contagem) e `js/sim.js`: chegada pela porta, caminho até a fila (máx. 3), pedido do primeiro com receitas liberadas, entrega com pagamento, lugar livre na mesa ou saída com o copo, coração e saída | G | AG01 (Gameplay) | feita (BRF-015) |
| T-018 | Arte dos clientes em `js/art.js`: aparência variada, andar, sentar, copo na mão, balão de pedido (ícone + nome da bebida), coração; barista parecida com a Nai (decisão 15); `drawScene` passa a receber as entidades da simulação e mantém a ordem por profundidade | G | AG03 (Arte) | feita (BRF-016) |
| T-019 | Tela Cafeteria ligada à simulação: cartão com retrato, “Nome quer um X”, valor e “Preparar”; toque no primeiro cliente abre o Preparo; moedas e barra de progresso atualizam (barra para em 6, decisão 20) | M | AG02 (UI) | feita (BRF-017) |
| T-020 | Tela Preparo (`js/screens/preparo.js`) igual ao mockup: topo, passos, palco com a xícara e camadas animadas (~0,8 s), dica, grade 2 × 4 com o próximo em destaque, erro sem punição (balança e repete a dica), desenho na espuma (coração, flor, estrela), “Entregar”, voltar sem perder o cliente | G | AG02 (UI) | feita (BRF-018) |
| T-021 | Validação do M2: 4 receitas iniciais preparáveis, 20 clientes seguidos sem travar e sem forma de perder, telas Cafeteria e Preparo contra o mockup | M | AG06 (QA) | feita (BRF-019): passa com ressalvas, ver docs/qa/qa-M2.md |
| T-053 | QA D1/D2: reposicionar a fila para não se sobrepor a quem senta no banquinho 1 | P | AG03 (Arte) | feita (BRF-020) |
| T-022 | Fechamento do M2: versão 0.2.0, PR `dev` → `main`, tag v0.2.0 | P | AG00 | feita (PR #2, tag v0.2.0) |

Ordem: T-014 → (T-015 ∥ T-016) → (T-017 ∥ T-018) → T-019 → T-020 → T-021 → T-022. T-019 e T-020 são do mesmo agente e mexem em `css/ui.css`, então rodam em série.

Fora do M2 (ficam para o M3/M4): salvar progresso, liberar Mocha, Chocolate quente e Café gelado, nível, clientes da casa e áudio. A barra de progresso conta as servidas, mas a liberação de receitas só entra no M4.

## M3 — v0.3.0 — Decoração

| ID | Título | Tam. | Dono | Estado |
|---|---|---|---|---|
| T-023 | Contratos da decoração em `docs/arquitetura.md`: ocupação da grade, itens de chão e de parede, áreas reservadas, estoque, formato salvo | P | AG01 (Gameplay) | feita (BRF-021) |
| T-024 | `js/data.js`: 17 itens (onde, preço, observações), 5 cores de parede e 3 pisos | P | AG01 (Gameplay) | feita (BRF-022) |
| T-025 | Regras: comprar, colocar, mover, guardar no estoque, ocupação (tapete por baixo, 1 espaço de parede), reservados, limite da caminha, mesa nova = +2 lugares na simulação; ajustar `INITIAL_DECOR` às decisões 27 e 29 (2º Quadro, sem caminha) | M | AG01 (Gameplay) | feita (BRF-023) |
| T-026 | Salvamento em `localStorage` (`nais-cafe-v1`): moedas, servidas, contagem, parede, piso, itens, estoque; tolerante a falha; Quadro com `variant` salvo (o 2º é `'small'`) | M | AG01 (Gameplay) | feita (BRF-026) |
| T-027 | Arte dos 17 itens em `js/art.js`; a sala passa a ser montada a partir do estado (não fixa); 5 cores de parede e 3 pisos | G | AG03 (Arte) | feita (BRF-024) |
| T-054 | Abrir espaços de parede na parede direita (decisão 30) | P | AG03 (Arte) | feita (BRF-025): 1 espaço médio novo |
| T-028 | Miniaturas da loja com as mesmas funções de desenho | M | AG03 (Arte) | feita (BRF-027) |
| T-029 | Tela Decorar: cena reduzida, losangos nos ladrilhos livres, escolhido em verde com o móvel transparente, pílula de instrução, tocar em móvel para mover, “Guardar” | G | AG02 (UI) | feita (BRF-028) |
| T-030 | Loja: abas Salão, Paredes e Cores, grade de 3 colunas, estados do botão (preço, “Colocando”, “Colocar · N”, desativado) | G | AG02 (UI) | feita (BRF-029) |
| T-031 | Validação do M3: 17 itens comprados, colocados, movidos e guardados; fechar e reabrir mantém tudo | M | AG06 (QA) | feita (BRF-030): passa com ressalvas, ver docs/qa/qa-M3.md |
| T-055 | QA do M3: clientes desviam dos móveis (D3) e tipos do salvo validados (D1) | M | AG01 (Gameplay) | feita (BRF-031) |
| T-032 | Fechamento do M3: versão 0.3.0, PR, tag v0.3.0 | P | AG00 | feita (PR #3, tag v0.3.0) |

Ordem: T-023 → T-024 → (T-025 ∥ T-027) → (T-026 ∥ T-028) → T-029 → T-030 → T-031 → T-032.

## M4 — v0.4.0 — Vida da loja

| ID | Título | Tam. | Dono | Estado |
|---|---|---|---|---|
| T-033 | Nível (marcos 2…40) e liberação de receitas (6, 10, 14, 24); barra de progresso real | P | AG01 (Gameplay) | feita (BRF-032) |
| T-034 | Clientes da casa: 45% de chance, favorita, falas em sequência, Bia só depois do Mocha, visitas salvas | M | AG01 (Gameplay) | feita (BRF-034) |
| T-036 | Plantas com sede a cada 60–120 s (regar = 2 moedas); gato dorme, passeia, senta 5–11 s e volta | M | AG01 (Gameplay) | feita (BRF-036) |
| T-037 | Arte: aparência dos 5 clientes da casa e do especial, balão da gota, gato andando e sentado, fala do cliente | M | AG03 (Arte) | feita (BRF-035) |
| T-038 | Áudio: chuva, música e efeitos por Web Audio; começa no toque e volta ao retornar ao app | M | AG04 (Áudio) | feita (BRF-033) |
| T-039 | Toques na cena: planta com sede rega, gato solta coração | P | AG02 (UI) | feita (BRF-038) |
| T-040 | Tela Clientes da casa: cartões, selo de visitas, “Cliente misterioso” tracejado, “N de 5” | M | AG02 (UI) | feita (BRF-039) |
| T-041 | Tela Cardápio: receitas com preço e passos; bloqueadas tracejadas com “Libera com N bebidas” | M | AG02 (UI) | feita (BRF-040) |
| T-042 | Ajustes: painel deslizante, música e chuva, nome da cafeteria editável (decisão 16), “Recomeçar do zero” em dois toques | M | AG02 (UI) | feita (BRF-042) |
| T-057 | Animação “+N” ao ganhar moedas (entrega e regar) | P | AG02 (UI) | feita (BRF-041) |
| T-058 | Setters oficiais de ajustes e nome no estado | P | AG01 (Gameplay) | feita (BRF-043) |
| T-043 | Validação do M4: 8 receitas liberam nos marcos, clientes da casa, rituais, áudio e telas novas | M | AG06 (QA) | feita (BRF-044): passa com ressalvas, ver docs/qa/qa-M4.md |
| T-056 | Resto do D1 (tipos sem protótipo em `decor.js` e `regulars`) e impedir mesa cujos lugares fiquem sem acesso | P | AG01 (Gameplay) | feita (BRF-037) |
| T-044 | Fechamento do M4: versão 0.4.0, PR, tag v0.4.0 | P | AG00 | feita (PR #4, tag v0.4.0) |

Ordem: (T-033 ∥ T-038) → (T-034 ∥ T-037) → (T-035 ∥ T-036) → T-039 → T-040 → T-041 → T-042 → T-043 → T-044.

## M5 — v1.0.0 — Presente

| ID | Título | Tam. | Dono | Estado |
|---|---|---|---|---|
| T-045 | Manifesto, metadados da Apple e ícones (192, 512 mascarável, 180) com “Nai's Cafe” | M | AG05 (Plataforma) | feita (BRF-045) |
| T-046 | Service worker: offline, rede primeiro na navegação, cache com a versão (decisão 11) | M | AG05 (Plataforma) | feita (BRF-046) |
| T-047 | Áreas seguras e gestos do sistema no app instalado; campos de texto com 16 px | P | AG02 (UI) | em andamento |
| T-048 | Animações de toque e acabamento: botões, moedas, transições de tela; mover as cores locais de `.prep`, `.decor` e das telas Clientes/Cardápio para `tokens.css`; legenda da barra com nome longo (3 linhas a 360/390); ressalvas D1–D6 do `docs/qa/qa-M4.md` (gota e gato na Decorar, nome longo no topo, fala sobre o pedido, marca no ladrilho que fecha a passagem, barra de rolagem do Cardápio, largura do `body`) | M | AG02 (UI) | em andamento |
| T-049 | Desempenho: 60 fps em iPhone de 2020 em diante com a sala cheia | M | AG03 (Arte) | em andamento |
| T-050 | Teste no iPhone: instalado, tela cheia, modo avião, som depois de trocar de app, chave de silêncio | M | Dono + AG06 (QA) | a fazer |
| T-035 | Cliente especial a cada 6 clientes, com recadinho (depende da decisão 14) | P | AG01 (Gameplay) | bloqueada (aguarda recadinhos do dono; decisão 34) |
| T-051 | Validação final: todos os critérios de aceite da especificação | M | AG06 (QA) | a fazer |
| T-052 | Fechamento: versão 1.0.0, PR, tag v1.0.0 | P | AG00 | a fazer |

Ordem: (T-045 ∥ T-047) → T-046 → T-048 → T-049 → T-050 → T-051 → T-052.
