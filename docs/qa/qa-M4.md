# QA — M4 (Vida da loja) — T-043 / BRF-044

**Data:** 2026-11-13 · **Agente:** AG06 · **Código:** `dev` em `e9a110b`, versão 0.3.0 · **Publicado:** https://dev--naicafe.netlify.app (main.js, sim.js, decorar.js diferem do local só em fim de linha CRLF; o resto tem SHA-1 igual)

## Veredito: **passa com ressalvas**

Os 10 itens do briefing passam. Receitas, clientes da casa, telas Clientes e Cardápio, rituais, “+N”, Ajustes, “fecha a passagem” e a regressão M1–M3 funcionam, sem erro no console (local e publicado). As ressalvas são visuais leves e limites de teste (áudio sem ouvir, toque real no iPhone, aba em segundo plano).

## Como foi testado

- Cópia do projeto na pasta de rascunho, servida em porta própria (não 8123), com páginas auxiliares fora do repositório: semear estado, avançar `step(dt)` (o rAF do painel para) e ler resultados. O código do jogo é o mesmo, exceto `main.js`, que na cópia expõe `sim` em `window`. Salvo zerado no fim; servidores parados; repositório sem alteração.
- Node importando os módulos reais (`state`, `sim`, `decor`, `data`): 285 entregas seguidas, recompensas, rituais, salvo corrompido.
- Tela: cliques reais (Preparo completo, Decorar, Ajustes, navegação) a 390 × 844, 360 × 780 e 430 × 932; medição de rolagem e alvos por script; publicado só carregado a 390 (console limpo).

## Resultado por item

| # | Item | Resultado |
|---|---|---|
| 1 | Receitas | **OK.** Liberam aos 6 (Mocha), 10 (Café com leite batido), 14 (Chocolate quente) e 24 (Café gelado); eventos `unlock` nos 4 marcos; pedidos só entre as liberadas (0 fora de lista em 285). Barra e legenda: 0/6 a 5/6 “Falta 1 bebida para liberar o Mocha”, 0/4 “Faltam 4 bebidas para liberar o Café com leite batido”, 14 a 23 em 10 degraus, depois de 24 cheia e “Todas as receitas liberadas”. Nível sobe nos marcos (nível 1 a 10; 24 servidas = 8). As 8 receitas têm passos válidos (Latte usa o desenho); Espresso e Cappuccino feitos de ponta a ponta no Preparo. |
| 2 | Clientes da casa | **OK.** 47% de chegadas são da casa (alvo ~45%); 0 favorita errada; Bia 0 vezes antes do Mocha, depois 23 visitas; fala = `lines[visitas % 3]` e recomeça na 4ª; visitas salvas e voltam ao recarregar. Balão legível (texto opaco, 2 linhas), vê-se em 390. |
| 3 | Tela Clientes | **OK.** “N de 5 já passaram por aqui”, cartão com retrato, selo “N visita(s)”, “Sempre pede X”, última fala certa ((visitas−1) % 3), “Cliente misterioso” tracejado com dica; confere com `04-clientes.html`. 5 cartões cabem sem rolagem em 360 e 430. |
| 4 | Tela Cardápio | **OK.** 8 receitas, preço, passos em ícones ligados; bloqueadas tracejadas “Libera com N bebidas servidas”; “5 de 8 receitas liberadas”. |
| 5 | Plantas e gato | **OK.** Gota nas duas plantas após 60–120 s; toque rega: +2 moedas, gota some, rega de novo recusada; planta guardada perde a sede. Gato só com a caminha (antes dela: nenhum; `petCat` sem caminha = `ok:false`); dorme (zzz, 8–18 s), passeia, senta (5,1–10,8 s), coração ao tocar; nunca andou em ladrilho bloqueado (20 000 quadros). Na Decorar o toque na planta com sede levanta a planta para mover (não rega). Ver D1. |
| 6 | “+N” | **OK.** Entrega no Preparo: “+8” visto sobre a pílula e a pílula sobe de valor; “+N” só nasce com `params.gain` da entrega; comprar na Decorar não mostra nada (só desconta). Rega: moedas entram na hora. |
| 7 | Ajustes | **OK.** Abre pela engrenagem e fecha pelo X; música e chuva desligam, gravam e voltam após recarregar; nome corta em 24, vazio volta a “Nai's Cafe”, topo mostra o nome; “Recomeçar do zero” pede 2 toques (1º muda o rótulo e vale 3 s; o 2º zera tudo: 0 servidas, 40 moedas, visitas vazias). |
| 8 | Áudio | **OK por código e console.** Contexto só nasce no 1º `pointerdown` (`unlock`); ligar e desligar música e chuva e navegar não geraram erro; `visibilitychange` suspende e retoma com `catch`. Som não ouvido; troca de aba real não exercitada (ver abaixo). |
| 9 | “Esse lugar fecha a passagem” | **OK.** Na Decorar com sala cheia, o único lugar livre que isolaria um lugar de mesa mostra a pílula “Esse lugar fecha a passagem” e não coloca. Node: 47 recusas `blocks-path` num enchimento aleatório, 0 lugares sem rota no fim. |
| 10 | Regressão M1–M3 | **OK.** 20 clientes seguidos (e 285 em Node): 0 erros, 7 entidades no fim, moedas somam. Cafeteria, Preparo, Decorar (comprar, colocar, 2 toques), Cardápio e Clientes sem rolagem horizontal em 390, 360 e 430; 0 alvos < 44 pt. Console sem erro local e publicado. |

## Diferenças

| # | Onde | Esperado | Obtido | Gravidade |
|---|---|---|---|---|
| D1 | Decorar | Briefing: “nada disso na Decorar” | Gota de sede e o gato fora da caminha (sentado/andando) são desenhados na Decorar; só não respondem ao toque. Se a intenção era não desenhar, falta esconder | Baixa (decisão: aceitar ou esconder) |
| D2 | Topo da Cafeteria, 390 | Nome de até 24 letras legível | “Cafe da Nai com nome mui” aparece cortado com reticências (“Cafe da Nai com nom…”); a fonte já encolhe até o mínimo | Info |
| D3 | Cafeteria, balão de fala | Sem sobreposição | O balão de fala fica sobre o balão de pedido do próximo da fila durante ~4 s, sem esconder o texto | Info |
| D4 | Decorar, ladrilho livre | Marca de ladrilho livre | Com sala cheia, o ladrilho livre que fecha a passagem não mostra marca (só a mensagem ao tocar) | Info |
| D5 | Cardápio | Sem barra de rolagem visível | Barra fina de rolagem aparece à direita da lista (390 e 360) | Info |
| D6 | `document.body.scrollWidth` em 390 | = 390 | 415 (fundo decorativo); `documentElement` = 390, sem rolagem horizontal real. A 360 e 430 = largura | Info |

## Não testado / limitações

- Som real (música, chuva, efeitos): não ouvido; só ausência de erros e leitura do código. Troca de aba e retorno (`visibilitychange`) não exercitados; contexto suspenso no iOS não testado.
- Toque no iPhone: só mouse. Rolagem do painel, teclado do iOS no campo de nome e `maxlength` no teclado real não testados.
- Publicado: só carga a 390 e console limpo; o fluxo completo foi no local (mesmo código, SHA-1 igual).
- O rAF do painel parou; a simulação foi avançada por `step(dt)` e por timer. “+N” da rega foi visto só pela pílula (a animação de 0,9 s não cabe no tempo da captura); “+8” da entrega foi visto.
- Cliente especial: fora do M4 (decisão 34).
- Preparo completo feito só para Espresso e Cappuccino; as outras 6 receitas só por dados (passos válidos) e pela sim.

## Próximo passo

Aceitar o M4 (nenhum bloqueio). Decidir D1; D2 a D6 podem esperar o polimento do M5.
