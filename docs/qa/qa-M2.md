# QA — M2 (Ciclo principal) — T-021 / BRF-019

**Data:** 2026-11-12 · **Agente:** AG06 · **Código:** `dev` em `e2cdda9` (T-020) · **Publicado:** https://dev--naicafe.netlify.app (sim.js, data.js, preparo.js, cafeteria.js e ui.css com SHA-1 igual ao local)

## Veredito: **passa com ressalvas**

O ciclo completo funciona: 20 clientes seguidos sem erro, pagamento correto, sem pagamento em dobro, sem como perder. Preparo fiel ao mockup. Ressalva única relevante: sobreposição visual entre o cliente sentado no banquinho 1 (ou a caminho dele) e o 2º da fila.

## Como foi testado

- Local: `python -m http.server` em porta livre (8791/8792), navegador embutido a 390 × 844, 360 × 780 e 430 × 932. Servidores encerrados.
- O painel oculto não dispara `requestAnimationFrame` (como no M1). Um harness temporário (fora do repositório, em pasta de rascunho) importava `js/main.js` e avançava o jogo com `step(0.05)`; os cliques foram DOM (`.click()`) para o ciclo de 20 clientes e cliques reais do mouse para o fluxo visual (Preparar, toque no cliente, ingredientes, voltar, Entregar).
- Medições (rolagem horizontal, alvos, imagens/filtros) por script no DOM nas três larguras.

## Resultado por item

| # | Item | Resultado |
|---|---|---|
| 1 | Ciclo | **OK.** Cliente em ~2 s (40 passos de 0,05 s); fila de 3 em frente ao balcão com balão só no primeiro; cartão “<Nome> quer um <Bebida>” com retrato e “N moedas”; “Preparar” e toque no cliente (cena) abrem o Preparo; entrega paga preço + gorjeta 0–2 + 1 se houver desenho; cliente senta (máx. 2) ou sai; coração; a fila anda. |
| 2 | 20 clientes | **OK.** 20 servidos em 388 ciclos do harness, 0 erros, 0 rejeições, console limpo. Gorjetas {0: 8, 1: 6, 2: 6}; 7 Lattes com desenho (bônus +1 conferido). 20 nomes diferentes de 40. Nenhum estado de falha. |
| 3 | Preparo | **OK.** Passo 3 de 4 do Latte confere com `02-preparo.html` (topo, passos, palco, xícara, dica, grade 2 × 4, Entregar desativado “faltam 2 passos”). Chá, Latte (com as 3 opções de desenho, Flor conferida na xícara) e o ciclo completo de Espresso e Cappuccino rodaram até o fim. Ingrediente errado: balança, sem punição. Voltar mantém o cliente e os passos (Chá: passo 2 restaurado ao reabrir por toque na cena). |
| 4 | Receitas / barra | **OK.** Só Espresso, Chá, Cappuccino e Latte apareceram (20 pedidos). Barra: “Faltam 5/4/3/2 bebidas…”, “Falta 1 bebida…”, com 6 “O Mocha chega em breve”. Nível: 1→7 em 20 servidos (marcos 2, 4, 6, 10, 14, 19). |
| 5 | Personagens | **OK.** Barista morena com cabelo cacheado castanho-escuro. Nomes brasileiros variados; peles, cabelos e roupas variados. |
| 6 | Profundidade | **Ressalva (D1, D2).** 3º da fila em Q3 sem tocar móveis; o tapete e a mesa ficam à parte. Ordem à frente/atrás dos móveis correta nos quadros vistos. |
| 7 | Toque em dobro | **OK.** Duplo toque em Preparar e triplo em Entregar: pagou uma vez só (ganho sempre entre preço e preço + 3). |
| 8 | Regressão M1 | **OK.** Sem rolagem horizontal (390, 360, 430: scrollWidth = clientWidth, altura = viewport), 0 botões < 44 pt, 0 imagens, 0 `background-image`/`filter`, sem emoji; console sem erros local e publicado; topo e navegação como no M1. |

## Diferenças

| # | Onde | Esperado | Obtido | Gravidade |
|---|---|---|---|---|
| D1 | Cafeteria, cliente a caminho do banquinho 1 logo após a entrega (cerca de 1–2 s) com outro cliente em Q2 | Sem personagens sobrepostos | O cliente que anda de Q1 ao banquinho passa quase colado a Q2 (≈ 1 ladrilho, em linha na tela); o corpo do 2º fica parcialmente escondido atrás do outro | Baixa/média (transitório) |
| D2 | Cafeteria, banquinho 1 ocupado com Q2 ocupado | Banquinho e 3º/2º da fila sem sobreposição estranha | Q2 (2,3; 3,2) fica a ≈ 0,96 do banquinho 1 (3,05; 3,8): quem está sentado esconde o tronco do 2º da fila; só a cabeça do 2º aparece | Média. Sugestão: afastar Q2/Q3 do banquinho (ex.: mais para −gx) ou assentar só no banquinho 2 enquanto houver fila |
| D3 | Preparo a 360 | Título numa linha | “Espresso de Paulo” quebra em 2 linhas; cabe sem cortar | Info |
| D4 | Preparo | Mockup “Latte da Marina” | “Latte de <Nome>” (sem concordar com o gênero) | Info (decisão de texto) |
| D5 | Cena | Cliente de cabelo claro `#e6e1dc` (aparece como “cabelo branco” em Lucas, Pedro, Joana) | Parece cabelo grisalho em clientes jovens | Info (opinião: aceitável como variedade) |

## Não testado / limitações

- Animação ao vivo (rAF) e áudio: o painel oculto não roda `requestAnimationFrame`; o jogo foi avançado por `step`. Movimento suave, 60 qps e coração subindo só por frames isolados.
- Banquinho 2 ocupado com 2 sentados e saída com o copo foram vistos por código/log, não por captura (sem erro no ciclo de 20, que passa pelos dois casos).
- Ordem de profundidade em todo o percurso (porta → fila → saída) só em amostras de quadros, não quadro a quadro.
- A publicada foi conferida por SHA-1 dos arquivos e carga sem erro; o ciclo foi executado só no local.
- iPhone real, Safari, PWA e toque real.
- Ferramenta de captura do painel instável (telas repetidas/cortadas); medidas feitas por script no DOM.
