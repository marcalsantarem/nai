# BRF-024 — AG03 (Arte) — T-027 Arte da decoração

**Objetivo:** a sala passa a ser desenhada a partir do layout, com os 17 itens, as 5 cores de parede e os 3 pisos.

**Ler:** `docs/arquitetura.md`, seção “M3 — Decoração” (layout, contrato com a arte); `js/data.js` (`DECOR_ITEMS`, `WALL_COLORS`, `FLOORS`, `INITIAL_DECOR`, `WALL_SLOTS`); decisões 26 a 30; especificação, Cores da sala e Conteúdo (Decoração, coluna Observação). Mockup: `03-decorar.html` (sala reduzida e miniaturas da loja; README da pasta primeiro).

**Pronto quando:**
- `drawScene(ctx, { time, entities, layout, wall, floor, placing })` conforme a arquitetura. **Sem `layout`, usa `INITIAL_DECOR` de `data.js`**, para a tela atual continuar funcionando sem mudança. Itens fixos (balcão, máquina, porta, quadro-negro, janela, pendentes) continuam sempre.
- Uma função de desenho por tipo para os 17 itens (os que já existem são reaproveitados): pufe, planta, mesinha com flores, tapete, costela-de-adão, luminária (brilho suave), poltrona, vitrola, mesa com banquinhos, estante, caminha com gatinho; bandeirinhas, quadro, planta pendente, relógio (hora real), luzinhas (piscam devagar), prateleira de xícaras. Itens de parede desenhados no plano da parede, em cada espaço possível.
- Paredes com as 5 cores (listras e lambri acompanhando) e os 3 pisos.
- `placing`: losango claro nos ladrilhos livres, escolhido em verde com o móvel em transparência, como no mockup.
- Ordem de profundidade correta com qualquer arranjo; tapete sempre por baixo.
- 60 fps com a sala cheia (todos os itens + 6 personagens).

**Arquivos permitidos:** `js/art.js` (e `js/iso.js` se precisar). O AG01 mexe em `js/data.js`, `js/state.js`, `js/sim.js` e cria `js/decor.js` ao mesmo tempo: não toque; o `INITIAL_DECOR` dele vai perder a caminha e ganhar um 2º Quadro (decisões 27 e 29).

**Validação:** página de teste temporária fora do repositório: sala inicial (igual à de hoje, salvo as decisões 27/29), sala cheia, cada cor de parede e piso, `placing` com um item de chão e um de parede; compare com o mockup `03-decorar.html`. Console sem erros; tempo por quadro com a sala cheia.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
