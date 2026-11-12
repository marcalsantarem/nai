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
