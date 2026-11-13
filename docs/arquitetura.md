# Arquitetura do M2 — contratos

Contratos entre AG01 (`data`, `state`, `sim`), AG02 (telas, `icons`) e AG03 (`art`). Valores de jogo vêm da especificação e de [decisoes.md](decisoes.md); o que não está lá aparece como **[Proposta]** (ajustável por quem implementa, sem mudar a interface) ou **[A definir]** (precisa do dono ou do AG00).

## 1. Módulos e donos

| Módulo | Dono | Importa | Regra |
|---|---|---|---|
| `js/data.js` | AG01 | nada | Só constantes; nenhuma lógica além de funções puras de consulta |
| `js/state.js` | AG01 | `data` | Único lugar que guarda moedas, servidas e contagem |
| `js/sim.js` | AG01 | `data`, `state` (injetável) | Não toca no DOM, não desenha, não usa `Math.random` nem relógio direto: só `update(dt)` e o `rng` recebido. Roda em Node para testes |
| `js/iso.js` | AG03 | nada | Projeção e formas |
| `js/icons.js` | AG02 | nada | Ícones para HTML e canvas |
| `js/art.js` | AG03 | `iso`, `icons` | Só desenha o que recebe; nunca importa `data`, `state` nem `sim`, nunca altera estado |
| `js/screens/*.js` | AG02 | `data` (leitura), `state`, `art`, `iso`, `icons` | Recebem `sim` pelo contexto (seção 7); não alteram o estado direto, só pela `sim` |
| `js/main.js` | compartilhado | telas, `state`, `sim` | Cria a `sim`, roda `sim.update(dt)` em todo quadro (qualquer tela aberta) e troca telas |

## 2. Estado (`js/state.js`)

Objeto em memória no M2, com os mesmos nomes dos campos salvos (o M3 só acrescenta campos e o `load`/`save` na chave `nais-cafe-v1`):

```js
{ coins: 40, served: 0, count: 0 }   // coins = START_COINS de data.js
```

API (exportações nomeadas; o conjunto também é o `store` padrão injetado na `sim`):

- `get()` → o objeto de estado. Leitura apenas; quem lê não altera.
- `addCoins(n)`, `incServed()`, `incCount()` → alteram e avisam.
- `subscribe(fn)` → devolve `unsubscribe`. `fn({ type, value, delta })`, com `type` em `'coins' | 'served' | 'count'`. A tela assina no `enter` e cancela no `exit`.
- `reset()` → volta aos valores iniciais (testes; no M3, “Recomeçar do zero”).

Quem altera: só a `sim` no M2 (`count` na entrada pela porta; `coins` e `served` na entrega). No M3 a tela Decorar desconta compras por uma função própria de `state`.

## 3. Grade da sala

Ladrilho `(c, r)` cobre `gx ∈ [c, c+1)`, `gy ∈ [r, r+1)`, com `c, r` de 0 a 5. `gx`/`gy` são contínuos (os mesmos de `project`). Parede esquerda em `gx = 0` (porta), parede direita em `gy = 0` (quadro e janela).

- **Porta:** ladrilhos (0,4) e (0,5), no capacho; ponto de entrada e saída `DOOR = (0.15, 4.9)`.
- **Balcão e área da barista:** ladrilhos c 0–3, r 0–1 (balcão em `gx 0.8–3.7`, `gy 0.9–1.7`; barista em `(2.2, 0.42)`).
- **Fila (3 lugares), [Proposta] de posição:** `Q1 = (2.5, 2.4)` (em frente ao balcão), `Q2 = (2.5, 3.3)`, `Q3 = (2.5, 4.2)`, nos ladrilhos (2,2), (2,3), (2,4).
- **Pontos de passagem [Proposta]:** `ENTRY = (1.5, 4.5)` (ladrilho 1,4), `HUB = (3.5, 2.5)` (3,2), `EXIT = (1.5, 3.0)` (1,3).
- **Lugares:** os dois banquinhos da mesa de `INITIAL_LAYOUT`: `stool1 = (3.05, 3.8)`, virado para `+gx`; `stool2 = (4.35, 3.8)`, virado para `−gx`. Mesa = 2 lugares.
- **Reservados (nada de decoração no M3):** balcão (c 0–3, r 0–1), porta (0,4), (0,5), corredor (1,3), (1,4), (2,2), (2,3), (2,4), (3,2); na parede direita, o quadro (`gx 0.6–2.8`) e a janela (`gx 3.3–5.9`).

Caminhos permitidos (segmentos retos entre pontos, 1,7 ladrilho/s):

| Trajeto | Pontos |
|---|---|
| Chegada | `DOOR → ENTRY → Q3 → Q2 → Q1`, parando no último lugar livre da fila |
| Avançar na fila | `Qn → Qn−1` |
| Servido, com lugar | `Q1 → HUB → banquinho` |
| Saída depois de sentar | `banquinho → HUB → EXIT → ENTRY → DOOR` |
| Servido, sem lugar | `Q1 → EXIT → ENTRY → DOOR`, com o copo na mão |

Personagens não colidem entre si no M2 (podem se sobrepor ao cruzar). Os pontos ficam em `data.js` (`ROOM`), para ajuste visual sem mexer na lógica.

## 4. API da simulação (`js/sim.js`)

```js
const sim = createSim({ rng = Math.random, store = stateModule });
```

- `sim.update(dt)` — `dt` em segundos (o `main` já limita a 0,05 s). Move, conta tempos e cria clientes.
- `sim.getFront()` → `{ id, name, look, recipeId, gx, gy } | null`. Só o primeiro **parado em Q1**; enquanto anda até lá, é `null`.
- `sim.startOrder(id)` → `{ customerId, customerName, recipeId, price } | null` (`null` se `id` não é o primeiro). Não muda nada na cena; pode ser chamada de novo.
- `sim.deliver({ art })` → `{ price, tip, bonus, total } | null`. `art` é `'heart' | 'flower' | 'star' | null`. Paga ao pedido aberto: `price` da receita + `tip` inteiro sorteado em 0–2 + `bonus` 1 se `art` não é `null`. Chama `addCoins(total)` e `incServed()` na hora, dá o copo ao cliente e o manda para um banquinho livre ou para a porta. Sem pedido aberto, devolve `null` e não paga.
- `sim.entities()` → lista para a cena (seção 5), nova a cada chamada.
- `sim.subscribe(fn)` → `unsubscribe`. Eventos: `{ type: 'front', customer }` quando o primeiro muda (chega a Q1 ou é servido; `customer` no formato de `getFront()` ou `null`); `{ type: 'paid', ...resultado de deliver }`.

Regras do ciclo (valores de `CYCLE` em `data.js`):

- Chegada a cada 7–14 s enquanto a fila (incluindo quem anda até ela) tiver menos de 3; o tempo fica parado com a fila cheia e é sorteado de novo a cada chegada. Cada chegada faz `incCount()`.
- Cliente novo: nome e aparência sorteados (seção 8); pedido sorteado entre as receitas liberadas. No M2 só as de `unlockAt === 0` (a liberação entra no M4; decisão 20).
- O primeiro espera o tempo que for. Ao ser servido, a fila avança.
- O banquinho é reservado na entrega. Sentado: 14–26 s, depois coração e saída. Sem banquinho livre: sai com o copo; as moedas já entraram.
- Fases internas: `entering`, `queued`, `waiting` (Q1), `toSeat`, `seated`, `leaving`. Removido ao chegar em `DOOR`.
- Sorteios só com `rng()` em [0, 1): inteiro `a + floor(rng() * (b − a + 1))`, real `a + rng() * (b − a)`. Testes passam um `rng` com semente e chamam `update(0.05)` em laço.

## 5. Entidades para a cena

`sim.entities()` devolve objetos simples; `art` desenha sem saber das regras:

```js
{
  id: 'c7',               // 'barista' para ela
  kind: 'customer',       // 'customer' | 'barista'
  gx: 2.5, gy: 3.1,       // contínuos, no chão (sentado: posição do banquinho)
  depth: 5.61,            // opcional; sentado = gx + gy + 0.01, para ficar depois do banquinho
  dir: 'ne',              // 'se' (+gx) | 'sw' (+gy) | 'nw' (−gx) | 'ne' (−gy)
  pose: 'walk',           // 'walk' | 'stand' | 'sit'
  walk: 3.42,             // ladrilhos andados (fase das pernas)
  look: { skin, hair, shirt, pants, hairStyle, apron },   // formato de LOOKS em art.js
  cup: false,             // copo na mão
  bubble: null,           // { recipeId, label } só no primeiro em Q1 (ícone por recipeId, nome = label)
  heart: null,            // null ou 0..1, progresso do coração subindo (~1,2 s [Proposta])
}
```

- A barista passa a ser entidade fixa da `sim` (`stand` em `(2.2, 0.42)`, `dir: 'sw'`); `'barista'` sai de `INITIAL_LAYOUT`.
- `drawScene(ctx, { time = 0, entities = [] })`: chão, paredes e tapetes primeiro; depois móveis de `INITIAL_LAYOUT` e entidades juntos, em uma só lista ordenada por `depthOf` (`depth` ou `gx + gy`, estável). Sem `entities`, a cena fica como hoje.
- Sentado: `art` sobe o personagem à altura do assento; `dir` diz para que lado olha. `art` pode desenhar `ne`/`nw` como vistas de frente espelhadas no M2.
- Balão e coração ficam acima da cabeça e não entram na ordem por profundidade (desenhados por último).
- Retrato do cartão: `drawHead(ctx, x, y, look)` com o `look` de `getFront()`.

## 6. Toque na cena

1. Coordenada do toque no canvas (CSS px) → viewBox: `vx = vb.x + px / scale`, `vy = vb.y + py / scale` (`scale` de `layoutCanvas`).
2. Primeiro cliente: com `f = sim.getFront()`, o centro do corpo é `project(f.gx, f.gy, 22)`; tocou se a distância em viewBox ≤ `max(22 / scale, 20)` (22 pt mínimos na tela). Se tocou, segue o fluxo da seção 7.
3. `unproject(vx, vy)` dá o ponto no chão: serve para ladrilhos (Decorar no M3) e, no M4, plantas e gato com o mesmo critério de raio.

## 7. Fluxo entre telas

Contrato de tela: `enter(root, ctx)`, `exit()`, `update(dt)`, com `ctx = { sim, state, go, params }` e `go(name, params)` trocando a tela. Exige mudar `js/main.js` (arquivo compartilhado; autorização na T-017 ou T-019).

- **Cafeteria → Preparo:** “Preparar” ou toque no primeiro → `order = sim.startOrder(front.id)` → `go('preparo', { order })`. Sem primeiro, o botão fica desativado e o cartão mostra “Aguardando” (decisão 18).
- **Preparo → Entregar:** `sim.deliver({ art })` → `go('cafeteria')`. As moedas chegam pelo `subscribe` de `state`.
- **Voltar:** `go('cafeteria')` sem chamar a `sim`; o cliente continua em Q1 e o cartão mostra o mesmo pedido (o primeiro só muda na entrega).
- A `sim` roda também com o Preparo aberto: outros clientes chegam, sentam e saem.

## 8. Dados (`js/data.js`)

```js
RECIPES = [ { id, name, price, steps: [ingredientId...], unlockAt } ]   // 8, nesta ordem:
// espresso 'Espresso' 6 [grind, espresso] 0 · tea 'Chá' 5 [hotWater, teaBag] 0
// cappuccino 'Cappuccino' 10 [grind, espresso, milk, foam] 0 · latte 'Latte' 11 [grind, espresso, milk, art] 0
// mocha 'Mocha' 13 [grind, espresso, chocolate, milk, foam] 6 · hotChocolate 'Chocolate quente' 9 [chocolate, milk, foam] 14
// icedCoffee 'Café gelado' 12 [ice, grind, espresso, milk] 24
// whippedCoffee 'Café com leite batido' 12 [grind, espresso, foam, milk] 10 (decisão 13)

INGREDIENTS = [ { id, name, short, layer: { height, color } | null, tint?, hint } ]   // grade 2 × 4, nesta ordem:
// grind 'Moer os grãos' 'Moer' null · espresso 'Tirar o espresso' 'Espresso' 0.28 #5a3524
// hotWater 'Água quente' 0.62 #cfe3e6 · teaBag 'Sachê de chá' layer null, tint #c98d52 (tinge a água)
// milk 'Leite vaporizado' 'Leite' 0.34 #f0dcc0 · foam 'Espuma de leite' 0.16 #fffaf0
// chocolate 'Calda de chocolate' 0.14 #3b2218 · ice 'Gelo' 0.22 #dcf1f9

ART_STEP = { id: 'art', short: 'Desenho', layer: { height: 0.13, color: '#fffaf0' },
             options: [ { id: 'heart', name: 'Coração' }, { id: 'flower', name: 'Flor' }, { id: 'star', name: 'Estrela' } ] }

CYCLE = { arrivalMin: 7, arrivalMax: 14, queueMax: 3, walkSpeed: 1.7, seatMin: 14, seatMax: 26,
          tipMin: 0, tipMax: 2, artBonus: 1 }
START_COINS = 40
LEVELS = [2, 4, 6, 10, 14, 19, 24, 30, 40]   // uso no M4
ROOM = { door, entry, queue: [Q1, Q2, Q3], hub, exit, seats: [{ id: 'stool1', gx, gy, dir }, ...] }   // seção 3
CUSTOMER_NAMES = ['…']                      // nomes brasileiros comuns (decisão 19)
CUSTOMER_LOOKS = { skins: [], hairs: [], shirts: [], pants: [], hairStyles: ['short', 'long', 'bun', 'curly'] }
BARISTA_LOOK = { skin, hair, shirt: MINT, pants, hairStyle: 'curly', apron: true }
```

- A frase do cartão usa “quer um” e a legenda da barra usa “o” (todas as bebidas são masculinas).
- Cliente comum: um nome de `CUSTOMER_NAMES` e cada parte do `look` sorteada à parte. **[Proposta]** a lista não repete os nomes dos clientes da casa (Marina, Téo, Lúcia, Jorge, Bia) e não sorteia um nome que já está na loja.
- Barista (decisão 15): pele levemente morena, cabelo cacheado castanho-escuro. `hairStyle: 'curly'` é novo e fica com o AG03 (T-018); as cores exatas são [Proposta] dele.
- `short` e `hint` dos ingredientes: só “Moer”, “Espresso”, “Leite”, “Desenho” e “Agora coloque o leite vaporizado” estão no mockup; o resto é [Proposta] do AG01 na T-015.

## 9. Pontos resolvidos

1. Primeiro cliente chega ~2 s após abrir (decisão 21).
2. Quem sai sem lugar também solta coração (decisão 22).
3. Barra com 6: “O Mocha chega em breve”; nível sobe desde o M2 (decisão 23).
4. Voltar do Preparo guarda os passos (decisão 24).
5. Marcos de receita: 6, 10, 14, 24 (decisão 25).
6. Ladrilho de cada móvel do layout inicial: seção M3.1.
7. O ladrilho (1,2), do 2º da fila desde a T-053, entra em `reservedTiles` (seção M3.2).

# M3 — Decoração

Acrescenta à arquitetura do M2. Mesma convenção: **[Proposta]** é ajustável por quem implementa sem mudar a interface; **[A definir]** precisa do dono ou do AG00.

## M3.1 Layout como estado

A sala deixa de ser fixa: `state` guarda os campos salvos da especificação.

```js
items:     [ { type: 'table', c: 3, r: 3 } ]              // chão: tipo + ladrilho
wallItems: [ { type: 'frame', wall: 'left', pos: 3 } ]    // parede: tipo + parede ('left' | 'right') + posição
stock:     { plant: 1 }                                   // guardados, por tipo (0 = ausente)
wall: 'sage', floor: 'checker'                            // ids de WALL_COLORS e FLOORS (data.js)
```

- **Âncora:** item de chão é desenhado no centro do ladrilho mais o `offset` do tipo em `DECOR_ITEMS` (|d| ≤ 0,3; [Proposta], para o layout inicial ficar igual ao mockup). `decor.sceneLayout()` já devolve `gx, gy` resolvidos; `art` não calcula posição.
- **Fixos (não são itens, não se movem):** balcão com máquina, redoma e potes, luminárias pendentes, barista, porta e capacho, quadro-negro, janela com cortinas e luz no chão. Ficam em `art.js`.
- **Layout inicial (`INITIAL_DECOR` em `data.js`):**

| Item | Onde | Posição | Desenho resultante (M2) |
|---|---|---|---|
| Estante (`bookshelf`) | chão | (0,2), offset (−0,24, −0,4) | (0,26, 2,1) igual |
| Planta (`plant`) | chão | (0,3) | (0,5, 3,5) igual |
| Costela-de-adão (`monstera`) | chão | (5,0), offset (−0,1, 0,05) | (5,4, 0,55) igual |
| Mesa com banquinhos (`table`) | chão | (3,3), offset (0,2, 0,3) | (3,7, 3,8) igual; banquinhos iguais a `ROOM.seats` |
| Tapete (`rug`) | chão, por baixo | (3,3), offset (0,2, 0,3) | (3,7, 3,8) igual |
| Luminária (`floorLamp`) | chão | (5,3), offset (0, −0,3) | (5,5, 3,2) igual |
| Poltrona (`armchair`) | chão | (4,4), offset (0,3, 0,3) | (4,8, 4,8); era (5, 5) |
| Caminha (`catBed`) | chão | (1,5), offset (0, −0,3) | (1,5, 5,2); era (1,5, 5) |
| Bandeirinhas (`bunting`) ×2 | parede esquerda, faixa alta | pos 0 e 1 | cada uma é uma das 2 curvas de hoje |
| Luzinhas (`stringLights`) | parede direita, faixa alta | pos 0 | igual (sobre o quadro-negro) |
| Quadro (`frame`) | parede esquerda, faixa média | pos 3 | igual |
| Relógio (`clock`) | parede esquerda, faixa média | pos 2 | centro em gy 2,5; era 2,1 |

- `drawSmallFrame` (quadrinho azul ao lado do quadro): **[A definir]**, sem tipo na loja. Proposta: sai da cena (o relógio passa a ocupar o lugar).
- `stock` começa vazio; `wall: 'sage'`, `floor: 'checker'` (as cores atuais).
- Nomes em `data.js` (T-024): `DECOR_ITEMS`, `SHOP_TABS`, `TABLE_SEATS`, `TABLE_COLUMNS`, `WALL_SLOTS`, `WALL_COLORS`, `FLOORS`, `DEFAULT_WALL`, `DEFAULT_FLOOR`, `INITIAL_DECOR`, `SAVE_VERSION`.

## M3.2 Ocupação

- **Chão:** 1 item por ladrilho. Tapete fica numa camada por baixo: no máximo 1 tapete por ladrilho, e não bloqueia nem é bloqueado por outros itens.
- **Reservados (`ROOM.reservedTiles`, nenhum item, nem tapete):** balcão c 0–3, r 0–1; porta (0,4), (0,5); corredor (1,2), (1,3), (1,4), (2,2), (2,3), (2,4), (3,2) — fila Q1–Q3, `ENTRY`, `EXIT`, `HUB`. Sobram 19 ladrilhos livres na sala vazia.
- **Mesa:** ocupa 1 ladrilho (especificação); os banquinhos ficam a ±0,65 em gx da âncora e não ocupam ladrilho. **[Proposta]** mesa só em c 1–4 (os banquinhos ficam dentro da sala) e nunca em (c±1, r) de outra mesa (banquinhos sobrepostos). **[A definir]** se os ladrilhos dos banquinhos devem bloquear outros itens (hoje: não; pode haver sobreposição visual).
- **Limite:** `limit: 1` (caminha) conta itens colocados + estoque. A caminha do layout inicial conta.
- **Parede (`WALL_SLOTS`) [Proposta]:** duas faixas por parede; a faixa vem do tipo (`band` em `DECOR_ITEMS`).
  - Faixa alta (bandeirinhas, luzinhas): 2 posições por parede, cada uma com 3 ladrilhos de largura (pos 0 = 0–3, pos 1 = 3–6, ao longo de gy na esquerda e de gx na direita). Nada reservado.
  - Faixa média (quadro, relógio, planta pendente, prateleira): 6 posições por parede, 1 ladrilho cada (centro em pos + 0,5). Reservadas: esquerda 4 e 5 (porta); direita 0–5 (quadro-negro em gx 0,6–2,8 e janela em 3,3–5,9 cobrem tudo).
  - Resultado: 4 espaços altos e 4 médios. No início, 3 altos e 2 médios ocupados. **[A definir]** se são poucos espaços de parede.

## M3.3 API das regras: `js/decor.js` (novo, AG01)

Módulo novo e não `state.js`: as regras ficam testáveis no Node, e o `state.js` (compartilhado) só guarda campos e salva. `decor` importa `data` e `state` (injetável: `createDecor({ store })`, como a `sim`).

`state` ganha: `spend(n)` → `true` | `false` (sem moedas, não altera); `setDecor(patch)` com `{ items, wallItems, stock, wall, floor }`; `load()`, `save()`. Evento `{ type: 'decor', change }` em toda mudança da decoração.

| Chamada | Devolve | Efeito / evento |
|---|---|---|
| `shopState(type)` | `'price' \| 'placing' \| 'stock' \| 'disabled'`, com `n` do estoque | Estado do botão (seção M3.7) |
| `buy(type)` | `{ ok, reason? }`, `reason` em `'coins' \| 'limit'` | `spend(price)`, `stock[type] += 1`, depois `startPlacing(type)`. Eventos `coins` e `decor` (`change: 'buy'`) |
| `startPlacing(type)` | `{ ok, free }` | Tira 1 do estoque “na mão” (só em memória) e abre a colocação. `free` vazio = sem lugar (o item continua no estoque) |
| `freeSpots(type)` | `[[c, r], …]` ou `[{ wall, pos }, …]` | Pura. Respeita reservados, ocupação, tapete, mesa e faixa |
| `choose(spot)` | `{ ok }` | Marca o lugar escolhido (verde + transparência). Sem evento de estado |
| `place(spot)` | `{ ok }` | Coloca o item da mão; sai do estoque de vez. `decor` (`'place'`) |
| `pickUp(ref)` | `{ ok, type }` | `ref` = `{ c, r }` (item comum antes do tapete) ou `{ wall, pos, band }`. Esconde o item da cena; o salvo não muda até `place` ou `store` |
| `store()` | `{ ok }` | Item da mão vai para o estoque. `decor` (`'store'`) |
| `cancel()` | — | Movendo: volta à origem. Comprado ou do estoque: fica no estoque |
| `setWall(id)`, `setFloor(id)` | `{ ok }` | Grátis. `decor` (`'wall'` / `'floor'`) |
| `getPlacing()` | `{ type, from: 'shop' \| 'stock' \| 'move', origin, chosen, free } \| null` | Para a tela e para `drawScene` |
| `sceneLayout()` | `{ floor: [{ type, c, r, gx, gy }], wall: [{ type, wall, pos, band }] }` | Sem o item da mão |

- A compra já guarda o item no estoque: fechar o app no meio da colocação não perde moedas.
- Nada falha: chamada inválida devolve `{ ok: false }` e não altera nada.

## M3.4 Efeito na simulação

- **Lugares:** `sim` deixa de ler `ROOM.seats` (T-025). Para cada item com `seats: 2`, 2 lugares em âncora + `TABLE_SEATS` (`dx −0,65`, virado para `+gx`; `dx +0,65`, virado para `−gx`), com id `'c,r:i'`. Recalcula no evento `decor`. `ROOM.seats` fica em `data.js` até a T-025 e depois sai.
- **Móvel com lugar levantado ou guardado [Proposta]:** quem está sentado levanta, solta o coração e sai; quem anda até o lugar troca para outro livre ou sai com o copo. As moedas já entraram; nada é devolvido nem cobrado.
- Caminhos e pontos da fila não mudam; personagens atravessam móveis como no M2.
- **Gato:** existe só com a caminha colocada (entidade `kind: 'cat'` no M4, ou desenhado pela caminha no M3). Caminha guardada: o gato some. Passeio até ladrilho livre usa `freeSpots`.
- **Regáveis** (`waterable`): a sede é por item colocado, só em memória (M4).

## M3.5 Contrato com a arte

```js
drawScene(ctx, { time, entities, layout, wall, floor, placing, now, music })
```

- `layout` = `decor.sceneLayout()`. Sem `layout`, `art` usa o inicial (a cena fica como hoje). Fixos continuam em `art`.
- `wall` = objeto de `WALL_COLORS` (`left`/`right` com `base` e `stripe`); `floor` = objeto de `FLOORS` (`pattern`, `a`, `b`, `grout`). Lambri, rodapé e bordas do piso não mudam [Proposta].
- `placing` = `{ type, free, chosen }`: losango claro `#fff6e6` a 55% em cada lugar livre; escolhido em `#7ed58a` a 75% com contorno `#3f9d55` e o móvel a ~50% de opacidade em cima (mockup). Na parede, o destaque é um retângulo no plano da parede.
- `now = { h, m }` para o relógio (a hora real vem da tela, `art` não lê o relógio). `music` liga as notas da vitrola. Luminária brilha e luzinhas piscam com `time`.
- Um desenho por tipo: `drawItem(ctx, type, x, y, { time, alpha })`, com a mesma âncora da cena.
- Miniaturas: `drawItemThumb(ctx, type, size)`, centrado em um quadrado `size × size`, com as mesmas funções; cores: `drawWallThumb(ctx, wallColor, size)` e `drawFloorThumb(ctx, floor, size)`.
- Toque na parede (inversa): esquerda `gy = −vx / 30`, `h = gy × 15 − vy`; direita `gx = vx / 30`, `h = gx × 15 − vy`. Faixa alta `h ≥ 104`, média `40 ≤ h < 104` [Proposta].

## M3.6 Salvamento (`state.load` / `state.save`)

- Chave `nais-cafe-v1`, JSON: `{ v: 1, coins, served, count, name, wall, floor, items, wallItems, stock, regulars, settings }`. `v` é a versão do formato [Proposta]; `name` = “Nai's Cafe”; `regulars: {}` e `settings: { music: true, rain: true }` só são usados no M4/M5.
- `load()` na abertura: sem chave, JSON inválido ou `localStorage` indisponível → estado inicial (`INITIAL_DECOR`, 40 moedas). Campo por campo: inválido usa o padrão; item com tipo desconhecido é descartado; item fora da grade, em reservado ou repetido vai para o estoque.
- `save()` em todo evento de `state` (moedas, servidas, contagem, decoração), dentro de `try/catch`; falha é ignorada e o jogo segue.
- **Não salvo:** clientes, fila, pedido aberto, sede das plantas, posição do gato, item na mão e lugar escolhido.

## M3.7 Fluxo da tela Decorar

- **Navegando:** legenda “Toque em um móvel para mudar de lugar”. Toque em móvel → `pickUp` → *movendo*. Toque em cartão → *colocando*.
- **Colocando** (da loja ou do estoque): pílula “Escolha um lugar livre para a planta” (`article` + `short` em minúsculas). 1º toque num lugar livre → `choose`; toque no mesmo lugar → `place` → *navegando*. Toque fora dos livres não faz nada. Sem lugar livre: pílula “Não há lugar livre agora” e o item fica no estoque [Proposta].
- **Movendo:** igual a colocando, com o botão “Guardar” (`store`). Tocar na origem devolve o item.
- **Botões da loja:** `price` (amarelo) → `buy`; `placing` (“Colocando”, verde) → sem ação; `stock` (“Colocar · N”, menta) → `startPlacing`; `disabled` sem moedas ou no limite. Com estoque, o cartão mostra “Colocar · N” em vez do preço.
- Abas: Salão (`tab: 'salao'`, chão), Paredes (`'paredes'`), Cores (5 paredes + 3 pisos, aplicação imediata, ativo em amarelo).
- Sair da tela ou trocar de cartão no meio: `cancel()`. A `sim` continua rodando.

## M3.8 Pontos em aberto

1. [A definir] Colocar com 1 toque ou com escolha + confirmação (proposta acima: 2 toques no mesmo lugar).
2. [A definir] O quadrinho azul (`drawSmallFrame`) sai da cena?
3. [A definir] Banquinhos bloqueiam os ladrilhos vizinhos da mesa?
4. [A definir] A caminha inicial conta para o limite de 1, deixando a compra de 60 sempre indisponível (o mockup mostra o preço 60).
5. [A definir] Só 4 espaços médios de parede (direita toda reservada) é suficiente?
6. Resolvido: nome da cafeteria editável em Ajustes (decisão 16); o campo `name` é salvo desde o M3 e a edição entra no M4 (T-042).
