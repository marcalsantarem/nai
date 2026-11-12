# QA — M1 (Base visual) — T-010 / BRF-008

**Data:** 2026-11-12 · **Agente:** AG06 · **Versão testada:** `html[data-version="0.0.0"]` (local e dev--naicafe.netlify.app)

## Veredito: **passa com ressalvas**

A tela Cafeteria reproduz o mockup (`docs/referencia/mockup-src/01-cafeteria.html`) com fidelidade de pixel no topo, cartão e navegação, e a sala está completa e sem clientes. Nenhum defeito bloqueante. Ressalvas: o critério de aceite do quadro-negro (“Nai's Cafe”) não está atendido (o mockup mostra “Cardápio”, precisa de decisão) e a quebra do título do cartão em 3 linhas a 360.

## Como foi testado

- Local: `python -m http.server 8765` na raiz; navegador embutido com viewport emulada.
- Publicado: https://dev--naicafe.netlify.app. Os 9 arquivos servidos (index, css, fonts.css, js) têm o mesmo conteúdo do local (SHA-1 igual após remover CR; a diferença bruta em 3 arquivos é só CRLF do Windows).
- Mockup aberto a 390 × 844 com as fontes locais injetadas, para comparar medidas com `getBoundingClientRect`.
- Larguras: 390 × 844, 360 × 780, 430 × 932, 1280 × 800.

## Resultado por item do briefing

| # | Item | Resultado |
|---|---|---|
| 1 | Topo, cena, cartão vazio e navegação vs. mockup | **OK.** A 390: header 0,56,390×76; selo 16,69 50×50; ajustes 330,72 44×44; cartão 16,619 358×111; Preparar 249,649 110×52; nav 16,744 358×72; itens 82×60 — idênticos ao mockup. Pílula 83 px (mockup 88) só porque mostra “40” em vez de “128”. Cena 440×391 em −25,180 (mockup 440×390 em −25,181; arredondamento). Cores, contornos 3 px, sombras duras (4 px botões, 5 px cartões), raios 16/22/24 e ícones (mesmos paths, traço 2,2) conferem com tokens e mockup. Botão Preparar desativado em `#a9a7cf` com texto Noite, conforme especificação. |
| 2 | Sala completa, sem clientes; animações | **OK.** Presentes: balcão, máquina vermelha, redoma de bolo, 2 luminárias pendentes, quadro-negro, janela com chuva e cortinas, luzinhas, bandeirinhas, porta, estante, tapete redondo, mesa com 2 banquinhos, costela-de-adão, poltrona, luminária de chão, caminha do gato (+ barista, plantinha, relógio, quadros e capacho, como no mockup). Nenhum cliente nem balão. Animação conferida por código: `drawScene` em canvas à parte com `time` 0 / 0,7 / 2,3 muda pixels só na janela (chuva), no varal de luzinhas e na caminha (gato, “z”). |
| 3 | Nome | **OK.** `<title>` e `h1` = “Nai's Cafe”; nenhum “Nossa” no DOM nem no código. Quadro-negro: ver D1. |
| 4 | Sem imagens, gradientes, desfoques, emoji | **OK.** 0 `img/picture/image`; 0 elementos com `background-image`, `filter` ou `backdrop-filter`; recursos carregados são só css, js e 2 woff2; nenhum `gradient`, `blur`, `drawImage` nem emoji no código. |
| 5 | Coluna, rolagem, áreas, alvos | **OK.** Coluna `max-width: 430px` centralizada (a 1280: x 425–855) com fundo, círculo e pontos ao redor; `scrollWidth = clientWidth` nas 4 larguras; padding `56px 0 28px` (com `max(..., env(safe-area-inset-*))`); alvos: ajustes 44×44, Preparar 110×52, nav 75–82×60. Sala corta exatamente 18 px de cada ponta a 360 e 390. |
| 6 | Console e versão | **OK.** Console sem erros local e publicado (o único aviso local veio do meu `getImageData`). `html[data-version]` presente (= `0.0.0`; ver D4). Fontes Baloo 2 700/800 e Nunito 700/800 carregadas dos arquivos locais. |
| 7 | Pontos para opinar | Ver D1 e D2. |

## Diferenças

| # | Onde | Esperado | Obtido | Gravidade |
|---|---|---|---|---|
| D1 | Quadro-negro da cena (`js/art.js`, `drawChalkboard`, título padrão) | Critério de aceite: “Nai's Cafe” no quadro-negro | “Cardápio”, igual ao mockup | **Média** — conflito entre mockup e especificação; precisa de decisão do AG00/dono. Opinião: seguir o critério de aceite (é texto explícito e a função já aceita `title`); conferir se “Nai's Cafe” cabe no quadro com Baloo 2 sem reduzir demais. |
| D2 | Cartão do pedido a 360 × 780 | Cartão com altura do mockup (111) | “Aguardando o próximo cliente” quebra em 3 linhas; cartão 132 px e a cena perde ~21 px | **Baixa.** Opinião: aceitável, mas fica desequilibrado; preferir texto mais curto (“Aguardando cliente”) ou reduzir o título do cartão para 18 px abaixo de ~375 de largura (dentro da faixa 18–20 da especificação). |
| D3 | Legenda do progresso a 430 | Quebra equilibrada | “Faltam 6 bebidas para liberar o” / “Mocha” (palavra órfã) | Baixa (cosmético; `text-wrap: balance` ou `pretty` resolveria). |
| D4 | `js/version.js` | v0.1.0 no fechamento do M1 | `0.0.0` | Info — já previsto na T-011. |
| D5 | Navegação e botão de ajustes | — | Sem ação ao tocar | Info — esperado no M1 (navegação visual; T-007). |

## Não testado / limitações

- **Animação ao vivo:** no painel do navegador embutido o `requestAnimationFrame` não disparou (0 quadros em 1,2 s, local e publicado), então a cena ficou estática nas capturas. A animação foi validada só por código (`drawScene` com `time` diferente). Conferir num navegador visível ou no iPhone.
- iPhone real, Safari iOS e PWA (áreas seguras com entalhe, `:active` ao toque, 60 qps) — fora do alcance aqui.
- Estado pressionado dos botões (desce 3 px, sombra 1 px) conferido só no CSS, não visualmente.
- Telas de altura curta (ex.: 360 × 640) e paisagem em celular não foram testadas.
- Comparação visual com o mockup foi por medidas e capturas lado a lado, não por diff de pixels.

## Reconferência (BRF-011)

**Data:** 2026-11-12 · **Agente:** AG06 · **Código:** commit `305a036` (decisões 17 e 18) · **Versão:** `0.0.0`

### Veredito: **passa**

D1, D2 e D3 corrigidos; nenhuma regressão encontrada. Restam só itens informativos (D4, D5) e as limitações de ambiente abaixo.

### Como foi testado

- Local: `python -m http.server 8766` (porta diferente da 8123); navegador embutido a 390 × 844, 360 × 780 e 430 × 932; medidas com `getBoundingClientRect` e quebras de linha por `Range.getClientRects`.
- Publicado: https://dev--naicafe.netlify.app. `index.html`, `css/ui.css`, `js/art.js`, `js/screens/cafeteria.js`, `js/main.js` e `js/version.js` com SHA-1 igual ao local (sem CR). Medido e capturado a 390 × 844.

### Resultado

| # | Item | Resultado |
|---|---|---|
| D1 | Quadro-negro “Nai's Cafe” dentro da moldura | **Corrigido.** Texto “Nai's Cafe” visível no quadro (capturas a 360, 390 e 430, local e publicado). Em Baloo 2 700 10 px mede 44 px, abaixo do limite de 50 px do código, então não há redução de fonte; sobram ~7 px de cada lado no painel de 58 px. |
| D2 | Cartão sem cliente: só “Aguardando”, centralizado, 111 px | **Corrigido.** Título “Aguardando” em 1 linha; caixa do título 42 px (2,2 em) com o texto (30 px) centrado na vertical (6 px acima e abaixo). Cartão **111 px** a 360 (16,555 328×111), 390 (16,619 358×111) e 430 (16,707 398×111). Publicado a 390: igual. |
| D3 | Legenda em 2 linhas sem palavra sozinha | **Corrigido.** “Faltam 6 bebidas” / “para liberar o Mocha” a 360, 390 e 430 (altura 32 px), local e publicado. |
| — | Regressão: topo | OK. Header 0,56 com 76 px de altura nas 3 larguras; selo, barra, moedas e ajustes como no QA anterior. |
| — | Regressão: cena | OK. Canvas a 390 em −25,180 440×391 (igual ao QA anterior); sala completa, sem clientes. |
| — | Regressão: navegação | OK. Nav a 390 em 16,744 358×72 (igual); 4 itens, Café ativo. |
| — | Rolagem horizontal | OK. `scrollWidth = clientWidth` a 360, 390 e 430. |
| — | Console | OK. Publicado: nenhuma mensagem. Local: só o aviso `willReadFrequently` causado pelo meu `getImageData`. |
| — | Animação | **Por código.** No painel o `requestAnimationFrame` não dispara (1 quadro em 2 s, como no QA anterior). Chamando `update(0.05)` da tela Cafeteria 20× no canvas real, mudam pixels nas regiões da janela (chuva), do varal de luzinhas e da caminha (gato). |

### Observação (info)

- D6 — A 360, “Aguardando” ocupa 105 px numa coluna de 104 px (sobra 0,3 px sobre os 12 px de espaço até o botão). Sem efeito visível a 360; abaixo de ~355 px de largura a palavra passaria da coluna. Não exige ação no M1.

### Não testado / limitações

- Animação ao vivo (chuva, luzinhas, gato) não observada: o painel não roda `requestAnimationFrame`. Conferir num navegador visível ou no iPhone.
- iPhone real, Safari iOS, PWA, telas curtas e paisagem: como no QA anterior.
- Publicado medido só a 390; 360 e 430 conferidos no local (arquivos idênticos).
