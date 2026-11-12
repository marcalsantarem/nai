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

## 9. Pontos [A definir]

1. Primeiro cliente ao abrir o jogo: espera os 7–14 s normais ou chega logo? (hoje: 7–14 s).
2. Cliente que sai sem lugar, com o copo, também solta coração?
3. Legenda da barra no M2 ao chegar a 6 servidas (decisão 20): “Faltam 0 bebidas…” ou outro texto? E o nível fica em 1 no M2?
4. Voltar do Preparo perde os passos já feitos (hoje: perde; o cliente continua)?
5. Com a decisão 13, os marcos de receita passam a 6, 10, 14 e 24, mas a especificação ainda diz “6, 14 e 24”.
6. No M3, os móveis de `INITIAL_LAYOUT` (hoje em posições contínuas) viram itens salvos `{ tipo, ladrilho }`: falta definir o ladrilho de cada um e levar o layout para `data`/`state`.
