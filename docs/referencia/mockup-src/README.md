# mockup-src — fonte legivel do mockup

Gerado por `_extrair.py` a partir de `../mockup-mobile.html` (nao editar a mao; rode `python -I docs/referencia/mockup-src/_extrair.py` da raiz).

## Arquivos

| Arquivo | O que e |
|---|---|
| `index.html` | Quadro do mockup: as 4 telas lado a lado em iframes 390x844 (agora apontando para os arquivos abaixo). |
| `01-cafeteria.html` | Tela "Cafeteria" (456 linhas). Iframe `8785c2f5-6bd2-4356-82ea-8d8770ad2e0e` do pacote. |
| `02-preparo.html` | Tela "Preparo da bebida" (173 linhas). Iframe `63bdfef0-a751-40d8-8a40-fd6265146ff2` do pacote. |
| `03-decorar.html` | Tela "Decorar" (514 linhas). Iframe `6bfa7d1e-27ad-4b18-bd8e-4c5eeb204d8c` do pacote. |
| `04-clientes.html` | Tela "Clientes da casa" (196 linhas). Iframe `1fa9ddf1-8a3c-4af9-9871-ea06a6f10726` do pacote. |
| `_extrair.py` | Refaz a extracao. |

**Importante: o mockup nao tem funcoes de desenho.** Cada tela e HTML com estilos inline e SVG estatico (poligonos, elipses, retangulos ja calculados). O unico script de cada tela e um `class Component extends DCLogic { renderVals() { return {}; } }` vazio, mantido no fim do arquivo. Nao ha CSS nem JS grandes para separar; por isso nao existem arquivos `.js`/`.css` aqui. O desenho por codigo (`js/iso.js`, `js/art.js`) tera de ser reconstruido a partir das coordenadas dos SVGs.

Mudancas em relacao ao original (para abrir sem o runtime): `sc-camel-view-box` virou `viewBox`; `<x-dc>`/`<helmet>` desembrulhados (estilos foram para o `<head>`); `@font-face` e o `<script src>` do runtime removidos. Sem as fontes, Baloo 2 e Nunito caem para o fallback do sistema.

## Indice dos desenhos (SVG)

| Arquivo:linha | viewBox | Tamanho | Rotulo / o que desenha |
|---|---|---|---|
| `01-cafeteria.html:38` | `0 0 24 24` | 22x22 | icone, perto de: "Ajustes" |
| `01-cafeteria.html:46` | `-186 -132 372 330` | 440x390 | Cafeteria em vista isométrica, com balcão, clientes e decoração |
| `01-cafeteria.html:395` | `0 0 64 64` | 54x54 | retrato, perto de: "Pedido atual" |
| `01-cafeteria.html:421` | `0 0 24 24` | 24x24 | icone, perto de: "Navegação principal" |
| `01-cafeteria.html:427` | `0 0 24 24` | 24x24 | icone, perto de: "Decorar" |
| `01-cafeteria.html:433` | `0 0 24 24` | 24x24 | icone, perto de: "Cardápio" |
| `01-cafeteria.html:439` | `0 0 24 24` | 24x24 | icone, perto de: "Clientes" |
| `02-preparo.html:23` | `0 0 24 24` | 22x22 | icone, perto de: "Voltar" |
| `02-preparo.html:39` | `0 0 24 24` | 20x20 | icone, perto de: "Moer" |
| `02-preparo.html:48` | `0 0 24 24` | 20x20 | icone, perto de: "Espresso" |
| `02-preparo.html:69` | `0 0 240 190` | 240x190 | Xícara com espresso e leite sendo servido |
| `02-preparo.html:96` | `0 0 24 24` | 22x22 | icone, perto de: "Moer os grãos" |
| `02-preparo.html:106` | `0 0 24 24` | 22x22 | icone, perto de: "Tirar o espresso" |
| `02-preparo.html:114` | `0 0 24 24` | 22x22 | icone, perto de: "Água quente" |
| `02-preparo.html:122` | `0 0 24 24` | 22x22 | icone, perto de: "Sachê de chá" |
| `02-preparo.html:131` | `0 0 24 24` | 22x22 | icone, perto de: "Leite vaporizado" |
| `02-preparo.html:139` | `0 0 24 24` | 22x22 | icone, perto de: "Espuma de leite" |
| `02-preparo.html:147` | `0 0 24 24` | 22x22 | icone, perto de: "Calda de chocolate" |
| `02-preparo.html:156` | `0 0 24 24` | 22x22 | icone, perto de: "Gelo" |
| `03-decorar.html:23` | `0 0 24 24` | 22x22 | icone, perto de: "Voltar" |
| `03-decorar.html:37` | `-186 -132 372 330` | 282x250 | Cafeteria em vista isométrica, com balcão, clientes e decoração |
| `03-decorar.html:407` | `-24 -27 48 48` | 60x60 | miniatura, perto de: "Planta" |
| `03-decorar.html:421` | `-34 -50 68 68` | 60x60 | miniatura, perto de: "Costela" |
| `03-decorar.html:440` | `-31 -37 62 62` | 60x60 | miniatura, perto de: "Poltrona" |
| `03-decorar.html:462` | `-46 -72 92 92` | 60x60 | miniatura, perto de: "Luminária" |
| `03-decorar.html:477` | `-27 -12 54 54` | 60x60 | miniatura, perto de: "Tapete" |
| `03-decorar.html:486` | `-27 -17 54 54` | 60x60 | miniatura, perto de: "Caminha" |
| `04-clientes.html:34` | `0 0 64 64` | 54x54 | retrato, perto de: "Marina" |
| `04-clientes.html:54` | `0 0 24 24` | 16x16 | icone, perto de: "Sempre pede Latte" |
| `04-clientes.html:64` | `0 0 64 64` | 54x54 | retrato, perto de: "Téo" |
| `04-clientes.html:83` | `0 0 24 24` | 16x16 | icone, perto de: "Sempre pede Espresso" |
| `04-clientes.html:93` | `0 0 64 64` | 54x54 | retrato, perto de: "Dona Lúcia" |
| `04-clientes.html:113` | `0 0 24 24` | 16x16 | icone, perto de: "Sempre pede Chá" |
| `04-clientes.html:123` | `0 0 64 64` | 54x54 | retrato, perto de: "Seu Jorge" |
| `04-clientes.html:142` | `0 0 24 24` | 16x16 | icone, perto de: "Sempre pede Cappuccino" |
| `04-clientes.html:161` | `0 0 24 24` | 24x24 | icone, perto de: "Navegação principal" |
| `04-clientes.html:167` | `0 0 24 24` | 24x24 | icone, perto de: "Decorar" |
| `04-clientes.html:173` | `0 0 24 24` | 24x24 | icone, perto de: "Cardápio" |
| `04-clientes.html:179` | `0 0 24 24` | 24x24 | icone, perto de: "Clientes" |

### Partes da cena isometrica (`01-cafeteria.html`, leitura manual aproximada)

As formas estao em ordem de pintura (de tras para frente). `03-decorar.html` repete a mesma cena (9 linhas antes) e acrescenta um `<g opacity="0.8">` com a previa do item sendo posicionado.

| Linhas | O que desenha |
|---|---|
| 47-48 | laterais (espessura) do bloco do piso |
| 49-84 | piso: 36 losangos 60x30 alternando #ecc194/#e2b181 (grade 6x6) |
| 85-125 | parede esquerda, <g matrix(1 -0.5 0 1 0 0)>: faixa menta, lambri, quadros, relogio (113-115), bandeirinhas (116-124) |
| 126-179 | parede direita, <g matrix(1 0.5 0 1 0 0)>: lousa "Cardapio" (143-151), janela com cortinas (152-165), cordao de luzes (166-178) |
| 180-185 | luz da janela no chao; tapetes |
| 186-218 | estante com 3 prateleiras de livros |
| 219-238 | barista atras do balcao |
| 239-242 | balcao (bloco isometrico: frente, lado, tampo) |
| 243-261 | sobre o balcao: maquina de espresso, xicaras, pote, bolo |
| 262-269 | 2 luminarias pendentes |
| 270-277 | planta em vaso (esquerda) |
| 278-295 | cliente 1 (cabelo castanho; mesmo rosto do retrato da linha 395) |
| 296-313 | cliente 2 (cabelo branco, roupa lilas) |
| 314-323 | planta alta em vaso (direita) |
| 324-332 | gato dormindo na caminha, com "z" |
| 333-349 | mesa com xicara entre 2 banquinhos |
| 350-363 | cliente 3 (cabelo escuro, roupa azul) |
| 364-369 | luminaria de chao |
| 370-382 | pilha de caixas amarelas |
| 383-390 | baloes de pedido sobre os clientes (gota, xicara, "Latte") |

Onde fica o resto: paleta (secao abaixo; cores estao inline em `fill`/`style`); telas = um arquivo cada; componentes de interface (cabecalho com nivel e moedas, cartao de pedido, barra de navegacao, cartoes da loja, lista de clientes) sao `<header>`, `<section>`, `<nav>`, `<ul>/<li>` com estilo inline. Obs.: o texto do mockup ainda diz "Nossa Cafeteria"; o nome do jogo e "Nai's Cafe".

Contagem de formas nas 4 telas: ellipse 299, polygon 257, rect 192, path 81, circle 6, text 6.

## Paleta (cores hex mais usadas nas 4 telas)

| Cor | Usos |
|---|---|
| `#4a2f27` | 199 |
| `#fff6e6` | 105 |
| `#d9a878` | 72 |
| `#ffc94d` | 60 |
| `#ff8f7e` | 59 |
| `#fff3c4` | 47 |
| `#ecc194` | 37 |
| `#e2b181` | 36 |
| `#9ad9c2` | 29 |
| `#2a2954` | 28 |
| `#2a1b3d` | 28 |
| `#9cc3f0` | 23 |
| `#d09e40` | 18 |
| `#a98034` | 18 |
| `#ffc34f` | 18 |
| `#4fa87a` | 17 |
| `#5b4a7a` | 14 |
| `#7a5a4e` | 14 |
| `#ffd9cf` | 13 |
| `#f6d2b8` | 13 |
| `#8a5a3c` | 12 |
| `#a3d6c4` | 12 |
| `#e0cca6` | 12 |
| `#6cc58f` | 12 |

## Recursos binarios e de terceiros (nao extraidos)

Fontes (T-003). Cada tela embute as mesmas 2 fontes com uuids proprios:

| Tela | uuid | mime | bytes | familia / subconjunto / pesos |
|---|---|---|---|---|
| `01-cafeteria.html` | `54dd3675-d48d-4987-ac85-00c24107f978` | font/woff2 | 33188 | Baloo 2 / latin / 600 700 800 |
| `01-cafeteria.html` | `baafd5b9-fbab-4029-a891-6b858187930a` | font/woff2 | 39128 | Nunito / latin / 600 700 800 |
| `02-preparo.html` | `43199fdc-38df-49ef-9cb7-b64a945f5a80` | font/woff2 | 33188 | Baloo 2 / latin / 600 700 800 |
| `02-preparo.html` | `b0a8be12-6dff-4607-8c93-7284142de5ba` | font/woff2 | 39128 | Nunito / latin / 600 700 800 |
| `03-decorar.html` | `c8999ff4-51fa-4ecb-89a5-f788f4a245da` | font/woff2 | 33188 | Baloo 2 / latin / 600 700 800 |
| `03-decorar.html` | `d31bc855-42a9-4d2b-81d8-826c97c21a38` | font/woff2 | 39128 | Nunito / latin / 600 700 800 |
| `04-clientes.html` | `7e0a863a-547c-4bb8-845c-cdfd54d4e1dc` | font/woff2 | 33188 | Baloo 2 / latin / 600 700 800 |
| `04-clientes.html` | `9b868528-1c96-4def-83e8-62f1d27a6959` | font/woff2 | 39128 | Nunito / latin / 600 700 800 |

Os subconjuntos devanagari, vietnamese e latin-ext nao estao embutidos: o original os pede a fonts.gstatic.com (Baloo 2 v23, Nunito v32).

JavaScript de terceiros (iguais nas 4 telas; necessarios so para o runtime do pacote):

| Tela | uuid | mime | bytes | o que e |
|---|---|---|---|---|
| `01-cafeteria.html` | `2e63396e-6754-4074-a309-927cbd6e4ad4` | text/javascript | 46105 | runtime dc |
| `01-cafeteria.html` | `d27a607a-f835-427e-b81c-f1e2dc4f9146` | text/javascript | 10751 | react |
| `01-cafeteria.html` | `01fe7032-ea26-432e-ad05-c2558d0c09b5` | text/javascript | 131835 | react-dom |
| `02-preparo.html` | `e0efa54d-a4dc-4afe-b5ed-79c5645a597d` | text/javascript | 46105 | runtime dc |
| `02-preparo.html` | `fcb62ef7-2849-4f94-8b39-c4333ee78df2` | text/javascript | 10751 | react |
| `02-preparo.html` | `70491a7a-d630-47e1-84fe-1d1d9916935a` | text/javascript | 131835 | react-dom |
| `03-decorar.html` | `412f993e-552e-484f-bbc8-a7b724214594` | text/javascript | 46105 | runtime dc |
| `03-decorar.html` | `54f0a7df-ca1d-443b-b3f8-e217dd4b645e` | text/javascript | 10751 | react |
| `03-decorar.html` | `bd9960cf-ffe3-4e3a-9dd8-e686d8a41076` | text/javascript | 131835 | react-dom |
| `04-clientes.html` | `96a546ca-ccac-46b5-b76c-803c15e49b8a` | text/javascript | 46105 | runtime dc |
| `04-clientes.html` | `9191ab2b-49b2-4778-ac9c-0f822a39c51a` | text/javascript | 10751 | react |
| `04-clientes.html` | `4f0cd04b-1356-4998-a9cc-c792d0a45ad2` | text/javascript | 131835 | react-dom |
