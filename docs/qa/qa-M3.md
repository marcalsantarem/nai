# QA — M3 (Decoração) — T-031 / BRF-030

**Data:** 2026-11-13 · **Agente:** AG06 · **Código:** `dev` em `a76cfb4` · **Publicado:** https://dev--naicafe.netlify.app (decor.js, data.js, state.js, art.js, sim.js, decorar.js, ui.css, index.html e main.js com SHA-1 igual ao local; versão 0.2.0)

## Veredito: **passa com ressalvas**

Os 17 itens são comprados, colocados, movidos e guardados; as regras de ladrilho, parede e tapete valem; cores trocam grátis; salvo persiste e aguenta corrupção; ciclo do cliente segue sem erro com a sala decorada. Ressalvas: um buraco de validação no salvo (só com arquivo editado à mão) e limitações de teste (rAF parado, só mouse).

## Como foi testado

- Local: `python -m http.server` (porta 8793) numa pasta de rascunho, com página auxiliar fora do repositório para dar moedas. Navegador embutido a 390 × 844, 360 × 780 e 430 × 932; depois salvo zerado, servidor parado, repositório sem alteração.
- Regras e sim em Node importando os módulos reais (`decor.js`, `state.js`, `sim.js`): 17 itens, fluxo completo, mesas ocupadas, 20 clientes, `parseSave` com 8 entradas corrompidas.
- Tela: cliques reais do mouse (comprar, 2 toques, guardar, abas, cores, recarregar) e medição por script (rolagem, alvos, imagens, filtros).

## Resultado por item

| # | Item | Resultado |
|---|---|---|
| 1 | Tela × mockup | **OK.** Topo, sala reduzida, pílula escura, painel com alça, abas Salão/Paredes/Cores, grade de 3 colunas, cartões e miniaturas conferem com `03-decorar.html`. Ladrilhos livres como losangos claros (mockup: retângulos). Estados: Colocando (verde), Colocar · N (menta), preço (amarelo), sem moedas e Já tem (lilás). |
| 2 | 17 itens | **OK (Node, toda a lista).** Comprar cobra o preço; Colocar · N não cobra; mover e guardar funcionam; estoque certo. Sem moedas: botão desativado (também visto no publicado com 40 moedas). Caminha: “Já tem” e limite 1 (UI e Node). Pela UI foram feitos Pufe, Pendente e Caminha. |
| 3 | Colocação | **OK.** 1º toque mostra móvel verde transparente; só o 2º no mesmo ladrilho confirma. Toque em balcão e banquinho: nada acontece. Tapete aceita ladrilho com móvel; tocar no ladrilho levanta o móvel de cima (decisão 33). Parede: espaço novo da direita entre quadro-negro e janela recebeu a Pendente sem cobrir nenhum. Sem lugar livre: item fica no estoque com aviso. |
| 4 | Paredes/pisos | **OK.** 5 paredes e 3 pisos, troca imediata, sem custo (Rosa e Madeira escura vistos; os demais conferidos na lista e nos cartões). |
| 5 | Mesa e gato | **OK.** Mesa nova passa a ter 4 lugares e clientes sentam nela (3 posições distintas em 4 entregas). Mover mesa ocupada: um cliente sai, ninguém trava. Guardar ou levantar mesa ocupada: sai com coração, fila segue. Caminha comprada traz o gato dormindo. |
| 6 | Fechar e reabrir | **OK.** Moedas, parede, piso, pendente, caminha e estoque (Pufe “Colocar · 1”) voltam após recarregar. Salvo `{{{corrompido` abre o jogo inicial; `parseSave` não lançou erro em 8 casos. Servidas não conferido na tela (ver abaixo). |
| 7 | Regressão M2 | **OK com limites.** 20 servidos em Node com sala decorada (2 mesas, caminha etc.): 0 erros, 0 pagamento em dobro, soma paga = moedas ganhas. Sem rolagem horizontal, 0 alvos < 44 pt, 0 imagens, 0 `background-image`, 0 filtros, em 390, 360 e 430, nas 3 abas; console sem erros local e publicado. |

## Diferenças

| # | Onde | Esperado | Obtido | Gravidade |
|---|---|---|---|---|
| D1 | `state.js` `cleanDecor`: `ITEM[type]` é objeto comum | Tipo desconhecido descartado | Estoque com chave `constructor` (ou `toString`, `__proto__`) passa: `stock.constructor` vira texto “function Object()…11”. Não derrubou o jogo. Só ocorre com salvo editado à mão | Baixa. Sugestão: `Object.hasOwn(ITEM, type)` ou `Object.create(null)` |
| D2 | `parseSave`, `items` presente mas todo inválido | Sala inicial | Sala sem móveis (lista vazia aceita) | Info (salvo corrompido só desse jeito) |
| D3 | Sim: caminho do cliente até o banquinho | Sem atravessar móveis | Linha reta do hub (3,5; 2,5) ao lugar passa pelo ladrilho da própria mesa (esperado, banquinho fica no ladrilho); o desvio de outros móveis não foi observado nas amostras, mas não há desvio no código | Info (herdado do M2; ver risco abaixo) |
| D4 | Tela Decorar, sala vazia | Mockup mostra clientes na sala | Só aparecem os que estão na loja no momento | Info |
| D5 | Decorar a 430 | — | Sala cresce com a largura; sobra pequena faixa entre sala e painel | Info |

## Não testado / limitações

- **Animação ao vivo:** o rAF do painel parou durante partes do teste; os 20 clientes e o ciclo com Preparo foram verificados na sim (Node) e o Preparo não mudou desde o M2 (sem diff). Ciclo completo com cliques no Preparo, 60 qps, áudio e música: não.
- Toque real no iPhone (só mouse). Alvos medidos por script.
- Pela UI foram exercitados só Pufe, Pendente, Caminha, Rosa e Madeira escura; os outros 14 itens e 3 paredes passaram pela API (`decor.js`), não por cliques.
- “Servidas” persistir após reabrir: só lido no código (`parseSave` aceita `served`); não conferido na tela.
- Teste dos limites de parede cheia só na API (itens sem lugar ficam no estoque; clock, luzinhas e prateleira ficaram lá no teste).
- Risco a observar: sem desvio de móveis no caminho do cliente, um móvel em certos ladrilhos pode ser atravessado (não reproduzido na tela).
- Publicado: só abertura, Decorar e botões desativados (sem moedas para o resto).
