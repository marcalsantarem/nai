# Nai's Cafe — especificação do jogo

Nov 11, 2026 · @Marçal

## Visão geral

Nai's Cafe é um jogo cozy de simulação de cafeteria para celular, jogado em pé, com uma mão e sem pressão de tempo. A jogadora cuida de uma cafeteria pequena numa noite de chuva: recebe clientes, prepara bebidas passo a passo e gasta as moedas em decoração.

A referência visual obrigatória é o [mockup mobile de quatro telas](https://claude.ai/artifact/PYqvSmdStmBvF4gyShGowQ). O jogo final deve reproduzir essas telas: mesma paleta, mesmas fontes, mesmos componentes e a mesma ilustração isométrica. A única diferença é o nome: onde o mockup mostra “Nossa Cafeteria”, o jogo mostra “Nai's Cafe”.

- **Público:** uma jogadora, em sessões de 5 a 15 minutos. É um presente pessoal, não um produto comercial.
- **Sem falha:** não existe cronômetro, cliente irritado, pedido errado nem fim de jogo.
- **Decorar é o objetivo:** as moedas servem para comprar e arrumar móveis, plantas e enfeites.
- **Pequenos rituais:** regar as plantas, fazer carinho no gato, escolher o desenho na espuma.
- **Vínculo:** clientes da casa têm nome, bebida favorita e falas que mudam a cada visita.

### Gráficos feitos só com código

Sim, essa qualidade de gráfico é possível só com código. O mockup inteiro já é código: não há nenhum arquivo de imagem nele. A sala, os móveis e os personagens são formas vetoriais (caixas isométricas, cilindros, elipses e retângulos arredondados) geradas por funções, e a interface é HTML e CSS.

O que esse caminho entrega e o que não entrega:

| Funciona bem só com código | Fica limitado |
| --- | --- |
| Estilo vetorial chapado, como o do mockup | Texturas pintadas à mão ou pixel art detalhada |
| Móveis e cenários isométricos montados com formas simples | Personagens com animação quadro a quadro |
| Animações de movimento, balanço, brilho e partículas | Ilustrações orgânicas complexas (rostos realistas, tecidos) |
| Música ambiente e chuva geradas por síntese | Trilha sonora gravada ou efeitos realistas |

## Plataforma

O jogo é um site estático, instalável como PWA, com o iPhone em modo retrato como alvo principal.

| Requisito | Especificação |
| --- | --- |
| Tecnologia | HTML, CSS e JavaScript puro (módulos ES), sem framework e sem etapa de build obrigatória |
| Alvo principal | iPhone no Safari e como PWA instalada, em retrato |
| Tela de referência | 390 × 844 pt; deve funcionar de 360 a 430 pt de largura |
| Paisagem e desktop | A mesma tela em uma coluna central de no máximo 430 pt, com o fundo do jogo ao redor |
| Entrada | Toque único; nenhuma ação depende de passar o mouse, arrastar ou teclado |
| Alvos de toque | No mínimo 44 × 44 pt |
| Desempenho | 60 quadros por segundo em iPhones de 2020 em diante |
| Offline | Funciona sem internet depois da primeira abertura |
| Dados | Sem login, sem servidor e sem coleta; o progresso fica só no aparelho |
| Idioma | Português do Brasil |
| Hospedagem | Repositório `marcalsantarem/nai` no GitHub, com publicação automática no Netlify |

Não desenhar barra de status nem teclado falsos: no aparelho, os do sistema aparecem por cima da tela.

## Direção de arte

O estilo é de brinquedo: painéis claros com contorno marrom grosso e sombra dura, sobre um fundo de fim de tarde. Não há gradientes, desfoques nem emoji.

### Cores

| Nome | Hex | Uso |
| --- | --- | --- |
| Tinta | `#4a2f27` | Contornos, texto principal, ícones |
| Creme | `#fff6e6` | Painéis, cartões, botões neutros |
| Entardecer | `#403f7a` | Fundo de todas as telas |
| Entardecer claro | `#4b4a8c` | Círculo grande atrás da cena |
| Noite | `#2a2954` | Sombra dura dos componentes, trilho da barra de progresso |
| Amarelo | `#ffc94d` | Item ativo, preço, moeda (borda da moeda `#d9912b`), próximo passo |
| Verde | `#7ed58a` | Ação principal (Preparar, Entregar), passo concluído |
| Coral | `#ff8f7e` | Detalhes, bochechas, tapete, cortinas |
| Menta | `#9ad9c2` | Progresso, selo de visitas, banquinhos |
| Texto secundário | `#7a5a4e` | Texto de apoio sobre creme |
| Texto sobre o fundo | `#dcdaf7` | Legendas sobre o entardecer |
| Desativado | `#a9a7cf` | Botão indisponível, com texto em Noite |

Cores da sala: parede direita `#a8dcc9` com listras `#b6e4d3`; parede esquerda `#97cfbb` com listras `#a3d6c4`; lambri `#f6e7cc`; piso em xadrez `#ecc194` e `#e2b181`; madeira `#c98a5a` e `#8a5a3c`; janela `#3d4283`.

### Tipografia

| Papel | Fonte | Peso | Tamanho |
| --- | --- | --- | --- |
| Título de tela | Baloo 2 | 700 | 22 a 24 |
| Título de cartão | Baloo 2 | 700 | 18 a 20 |
| Botões e números | Baloo 2 | 800 | 17 a 19 |
| Texto | Nunito | 600 a 800 | 13 |
| Rótulos | Nunito | 800 | 11 a 12 |

As duas fontes vêm do Google Fonts e devem ser guardadas para uso offline.

### Componentes

- **Contorno:** 3 px em Tinta em todo painel, cartão e botão.
- **Sombra:** dura, sem desfoque, 4 px abaixo dos botões e 5 px abaixo dos cartões, em Noite ou Tinta.
- **Raios:** 16 px em botões, 22 px em cartões, 24 px na barra de navegação, círculo completo em botões de ícone e pílulas.
- **Botão pressionado:** desce 3 px e a sombra encolhe para 1 px.
- **Ícones:** de traço, 24 px, espessura 2,2 px, pontas e cantos redondos, em Tinta.
- **Moeda:** círculo amarelo com borda `#d9912b` de 3 px.
- **Contraste:** texto sempre em Tinta sobre amarelo, verde, menta e creme.

### Ilustração isométrica

A cena é desenhada por funções, a partir de uma grade de 6 × 6 ladrilhos.

- **Projeção:** x na tela = (gx − gy) × 30; y na tela = (gx + gy) × 15 − altura. A origem é o canto do fundo da sala.
- **Paredes:** 124 de altura, desenhadas em um plano inclinado (cisalhamento vertical de 0,5 para a direita e −0,5 para a esquerda), com listras, lambri e rodapé.
- **Caixas:** três faces a partir de uma cor base: topo × 1,06, face esquerda × 0,86, face direita × 0,70.
- **Cilindros** (mesas, banquinhos, vasos): elipse de raio r × 42 por r × 21, com lateral em cor × 0,78.
- **Sombra de contato:** elipse `#2a1b3d` a 16% sob cada objeto e personagem.
- **Personagens:** cabeça em círculo de raio 10,5; corpo em retângulo arredondado de 19 × 22; olhos em elipses; bochechas em coral a 60%; cabelo como calota com franja.
- **Profundidade:** os objetos são desenhados em ordem crescente de gx + gy.
- **Câmera:** a sala ocupa a largura toda da tela e pode cortar até 18 px das pontas das paredes.

A sala do mockup é a composição inicial: balcão com máquina vermelha e redoma de bolo, duas luminárias pendentes, quadro-negro do cardápio, janela com chuva e cortinas, luzinhas, bandeirinhas, porta, estante, tapete redondo, mesa com dois banquinhos, costela-de-adão, poltrona, luminária de chão e caminha do gato.

## Telas

O jogo tem seis telas. As quatro primeiras estão desenhadas no mockup; Cardápio e Ajustes seguem os mesmos componentes.

Regras comuns: fundo Entardecer com o círculo claro e cinco pontos de luz; 56 pt livres no topo e 28 pt na base para as áreas do sistema; margens laterais de 16 pt.

### Cafeteria (tela inicial)

1. **Topo:** selo redondo amarelo com o nível; nome da cafeteria; barra de progresso em menta até a próxima receita, com a legenda “Faltam N bebidas para liberar X”; pílula de moedas; botão redondo de ajustes.
2. **Cena:** a sala isométrica, viva, ocupando o centro. O primeiro cliente da fila mostra um balão com o ícone e o nome da bebida. Plantas com sede mostram um balão redondo com uma gota.
3. **Cartão do pedido:** retrato do cliente, rótulo “PEDIDO”, frase “Marina quer um Latte”, valor em moedas e botão verde “Preparar”. Sem cliente na frente, o cartão mostra “Aguardando o próximo cliente” e o botão fica desativado.
4. **Navegação:** barra creme com quatro itens: Café, Decorar, Cardápio e Clientes. O item ativo tem fundo amarelo e contorno.

Toques na cena: no primeiro cliente abre o Preparo; na planta com sede, rega; no gato, solta um coração.

### Preparo da bebida

1. **Topo:** botão voltar, título “Latte da Marina”, legenda “Passo 3 de 4” e moedas.
2. **Passos:** círculos ligados por traços. Concluído em verde com um visto; atual em amarelo com halo; futuros em lilás.
3. **Palco:** painel com parede menta e balcão de madeira, com a xícara grande. Cada passo adiciona uma camada com animação de enchimento de cerca de 0,8 s.
4. **Dica:** uma linha, por exemplo “Agora coloque o leite vaporizado”.
5. **Ingredientes:** grade de 2 × 4 botões com ícone e nome. O próximo ingrediente fica em amarelo com halo.
6. **Desenho na espuma:** quando a receita pede, três opções (coração, flor, estrela) substituem a dica.
7. **Entregar:** desativado com “faltam N passos” até o fim; depois fica verde.

Toque no ingrediente errado não tem punição: o botão balança e a dica repete o passo certo. Voltar fecha a tela sem perder o cliente.

### Decorar

1. **Topo:** voltar, título “Decorar”, legenda “Toque em um móvel para mudar de lugar” e moedas.
2. **Cena reduzida:** a mesma sala, menor. Durante a colocação, os ladrilhos livres recebem um losango claro e o escolhido fica verde com o móvel em transparência.
3. **Instrução:** pílula escura, por exemplo “Escolha um lugar livre para a planta”.
4. **Loja:** painel creme com abas Salão, Paredes e Cores. Grade de três colunas; cada cartão tem miniatura, nome e botão de preço.

Estados do botão do item: preço em amarelo; “Colocando” em verde enquanto se escolhe o lugar; “Colocar · N” em menta quando há unidades guardadas; desativado quando faltam moedas.

### Clientes da casa

Lista de cartões com retrato, nome, selo de visitas, bebida favorita e a última fala. Quem ainda não apareceu vira um cartão tracejado “Cliente misterioso” com a condição para aparecer. O topo mostra “N de 5 já passaram por aqui”.

### Cardápio

Lista de receitas no mesmo formato de cartão: nome, preço e passos em sequência. Receitas bloqueadas ficam tracejadas com “Libera com N bebidas servidas”.

### Ajustes

Painel deslizante aberto pelo botão de engrenagem: música (liga e desliga), som de chuva (liga e desliga), nome da cafeteria (campo de texto, até 24 caracteres) e “Recomeçar do zero”, com confirmação em dois toques.

## Mecânicas

O ciclo do jogo é atender, receber moedas e decorar, sem nenhuma forma de perder.

&#91;embedded content: ciclo do cliente · 5 etapas, 1 decisão\]

Não existe caminho de falha: sem lugar livre, o cliente sai com a bebida e as moedas entram do mesmo jeito.

### Clientes e fila

- Um cliente novo entra pela porta a cada 7 a 14 segundos, enquanto a fila tiver menos de 3 pessoas.
- Os clientes andam a 1,7 ladrilho por segundo e formam fila em frente ao balcão.
- O primeiro da fila mostra o pedido e espera o tempo que for.
- Depois de servido, o cliente senta em um banquinho livre por 14 a 26 segundos, solta um coração e vai embora. Sem lugar livre, ele sai com o copo na mão.
- Cada mesa oferece 2 lugares.

### Preparo e moedas

- Cada receita é uma sequência fixa de passos, feita na ordem.
- A entrega paga o preço da receita, mais 0 a 2 moedas de gorjeta, mais 1 moeda quando há desenho na espuma.
- O jogo começa com 40 moedas.

### Nível e receitas

- O progresso é contado em bebidas servidas.
- Receitas novas são liberadas com 6, 14 e 24 bebidas servidas.
- O nível sobe nos marcos de 2, 4, 6, 10, 14, 19, 24, 30 e 40 bebidas. O nível é só um indicador de progresso e não bloqueia nada.
- A barra do topo mostra o avanço até a próxima receita.

### Decoração

- Comprar um item desconta as moedas e entra no modo de colocação.
- Itens de chão ocupam 1 ladrilho; tapetes ficam por baixo e não bloqueiam outros itens; itens de parede ocupam 1 espaço de parede.
- Ficam reservados o balcão, o corredor da fila, a porta, o quadro-negro e a janela.
- Com a tela Decorar aberta, tocar em um móvel o levanta para mudar de lugar. “Guardar” devolve o item ao estoque, sem perder o que foi pago.
- Cor da parede (5 opções) e piso (3 opções) são gratuitos.

### Rituais

- **Plantas:** cada planta fica com sede a cada 60 a 120 segundos. Regar rende 2 moedas.
- **Gato:** vem com a caminha. Dorme, passeia até um ladrilho livre, senta por 5 a 11 segundos e volta. Tocar nele solta um coração.

### Clientes da casa

- Cada cliente novo tem 45% de chance de ser um cliente da casa que não esteja na loja.
- Eles pedem a bebida favorita quando ela já está liberada.
- Ao serem servidos, dizem uma fala; as falas avançam em sequência a cada visita.
- A Bia só aparece depois que o Mocha entra no cardápio.
- A cada 6 clientes, entra o cliente especial, que deixa um recadinho pessoal.

## Conteúdo

O conteúdo inicial tem 7 receitas, 17 itens de decoração e 5 clientes da casa.

### Receitas

| Bebida | Preço (moedas) | Passos, em ordem | Libera com |
| --- | --- | --- | --- |
| Espresso | 6 | Moer, Espresso | Início |
| Chá | 5 | Água quente, Sachê de chá | Início |
| Cappuccino | 10 | Moer, Espresso, Leite, Espuma | Início |
| Latte | 11 | Moer, Espresso, Leite, Desenho | Início |
| Mocha | 13 | Moer, Espresso, Chocolate, Leite, Espuma | 6 bebidas |
| Chocolate quente | 9 | Chocolate, Leite, Espuma | 14 bebidas |
| Café gelado | 12 | Gelo, Moer, Espresso, Leite | 24 bebidas |

### Ingredientes e camadas na xícara

| Ingrediente | Efeito na xícara | Cor |
| --- | --- | --- |
| Moer os grãos | Nenhuma camada; só a dica muda | — |
| Tirar o espresso | Camada de 28% da altura | `#5a3524` |
| Água quente | Camada de 62% | `#cfe3e6` |
| Sachê de chá | Tinge a água | `#c98d52` |
| Leite vaporizado | Camada de 34% | `#f0dcc0` |
| Espuma de leite | Camada de 16% | `#fffaf0` |
| Calda de chocolate | Camada de 14% | `#3b2218` |
| Gelo | Camada de 22% | `#dcf1f9` |
| Desenho na espuma | Camada de 13% com coração, flor ou estrela | `#fffaf0` |

### Decoração

| Item | Onde | Preço (moedas) | Observação |
| --- | --- | --- | --- |
| Pufe | Chão | 14 |  |
| Planta | Chão | 15 | Pode ser regada |
| Mesinha com flores | Chão | 18 |  |
| Tapete | Chão | 20 | Fica por baixo de outros itens |
| Costela-de-adão | Chão | 25 | Pode ser regada |
| Luminária | Chão | 30 | Emite um brilho suave |
| Poltrona | Chão | 35 |  |
| Vitrola | Chão | 38 | Solta notas com a música ligada |
| Mesa com banquinhos | Chão | 40 | Mais 2 lugares |
| Estante de livros | Chão | 45 |  |
| Caminha com gatinho | Chão | 60 | Limite de 1 |
| Bandeirinhas | Parede | 16 |  |
| Quadro | Parede | 18 |  |
| Planta pendente | Parede | 20 |  |
| Relógio | Parede | 20 | Mostra a hora real |
| Luzinhas | Parede | 22 | Piscam devagar |
| Prateleira de xícaras | Parede | 26 |  |

Cores de parede: verde sálvia, rosa, azul céu, amarelo manteiga e lilás. Pisos: madeira clara, xadrez e madeira escura.

### Clientes da casa

| Cliente | Bebida favorita | Aparência | Falas, em ordem |
| --- | --- | --- | --- |
| Marina | Latte | Cabelo ruivo comprido, blusa amarela | “Estou escrevendo um livro. O capítulo 3 nasceu aqui.” · “O desenho na espuma é a melhor parte do meu dia.” · “Hoje a história andou. Deve ser o café.” |
| Téo | Espresso | Cabelo escuro curto, blusa azul | “Prova amanhã. Preciso de café e coragem.” · “Passei na prova! Esse espresso dá sorte.” · “Posso estudar naquela mesa de novo?” |
| Dona Lúcia | Chá | Cabelo grisalho em coque, blusa lilás | “Esse cantinho me lembra a cozinha da minha mãe.” · “Trouxe meu tricô hoje, vou ficar um tempinho.” · “Com chuva, chá fica ainda melhor.” |
| Seu Jorge | Cappuccino | Cabelo branco, blusa menta | “No meu tempo, cappuccino era só no domingo.” · “Vou deixar o jornal aqui para o próximo.” · “Esse é o melhor cappuccino do bairro.” |
| Bia | Mocha | Cabelo preto comprido, blusa laranja | “Chocolate com café foi a melhor invenção.” · “Vim desenhar a cafeteria. Posso?” · “Terminei o desenho. Ficou a sua cara.” |

Os recadinhos do cliente especial são textos pessoais e ainda precisam ser escritos (ver Decisões em aberto).

## Áudio

Todo o som é gerado por código com a Web Audio API, sem arquivos de áudio.

- **Chuva:** ruído branco em laço, com filtro passa-alta em 700 Hz e passa-baixa em 5200 Hz, volume 0,07, com entrada e saída suaves de 0,6 s.
- **Música:** quatro acordes em sequência (Lá menor com sétima, Fá maior com sétima, Dó maior com sétima, Sol com sexta), um tempo a cada 640 ms. Um baixo senoidal no primeiro tempo e notas em onda triangular nos demais, com filtro passa-baixa em 1800 Hz.
- **Efeitos curtos:** um toque suave ao concluir um passo, ao receber moedas e ao colocar um móvel.
- **Controles:** música e chuva ligam e desligam em Ajustes, e a escolha fica salva.

Regras do iPhone: o som só pode começar depois de um toque da jogadora; ao voltar para o jogo, o áudio deve ser retomado; é provável que a chave de silêncio do aparelho corte todo o som, o que deve ser confirmado no teste em aparelho.

## Arquitetura técnica

A cena roda em um canvas 2D e a interface é HTML e CSS por cima, com os mesmos desenhos do mockup.

### Estrutura de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura das telas e metadados de PWA |
| `css/tokens.css` | Cores, fontes, raios e sombras da Direção de arte |
| `css/ui.css` | Componentes: botões, cartões, pílulas, navegação, painéis |
| `js/main.js` | Inicialização, laço do jogo e troca de telas |
| `js/state.js` | Estado, salvamento e carregamento |
| `js/data.js` | Receitas, itens, clientes e textos |
| `js/iso.js` | Projeção isométrica e formas básicas (caixa, cilindro, elipse) |
| `js/art.js` | Desenho da sala, dos móveis, dos personagens e do gato |
| `js/sim.js` | Clientes, fila, lugares, plantas e gato |
| `js/screens/*.js` | Uma tela por arquivo: cafeteria, preparo, decorar, clientes, cardápio, ajustes |
| `js/audio.js` | Chuva, música e efeitos |
| `manifest.webmanifest`, `sw.js`, `icons/`, `fonts/` | Instalação, modo offline, ícones e fontes locais |

### Renderização

- Um laço com `requestAnimationFrame`; o passo de tempo é limitado a 50 ms para não dar saltos ao voltar ao jogo.
- O canvas usa a densidade de pixels do aparelho, até 3×.
- Os toques são convertidos de tela para grade pela projeção inversa; áreas de toque na cena têm raio mínimo de 22 pt na tela.
- Miniaturas da loja e retratos usam as mesmas funções de desenho da cena.

### Dados salvos

O progresso fica em `localStorage`, na chave `nais-cafe-v1`, gravado a cada mudança.

| Campo | Conteúdo |
| --- | --- |
| `coins` | Moedas atuais |
| `served` | Bebidas servidas |
| `count` | Total de clientes que entraram |
| `name` | Nome da cafeteria; padrão “Nai's Cafe” |
| `wall`, `floor` | Cor da parede e piso escolhidos |
| `items` | Itens de chão colocados: tipo e ladrilho |
| `wallItems` | Itens de parede colocados: tipo, parede e posição |
| `stock` | Itens guardados, por tipo |
| `regulars` | Visitas de cada cliente da casa |
| `settings` | Música e chuva ligadas ou desligadas |

Clientes na loja, fila e sede das plantas não são salvos: a loja recomeça vazia a cada abertura. Toda leitura e gravação deve tolerar falha, e o jogo deve abrir normalmente sem dados salvos.

## PWA no iOS

O jogo deve ser instalável pela opção “Adicionar à Tela de Início” do Safari e abrir em tela cheia, sem a barra do navegador.

| Item | Especificação |
| --- | --- |
| Manifesto | `name` e `short_name` “Nai's Cafe”; `display: standalone`; `start_url` e `scope` em `./`; cor de fundo e de tema `#403f7a` |
| Ícones | 192 e 512 px (uso geral e mascarável) e `apple-touch-icon` de 180 px, quadrado e sem transparência |
| Metadados da Apple | `apple-mobile-web-app-capable`, título “Nai's Cafe” e barra de status `black-translucent` |
| Viewport | `viewport-fit=cover`, com espaçamento por `env(safe-area-inset-*)` no topo, na base e nas laterais |
| Offline | Service worker que guarda página, scripts, estilos, ícones e fontes; a navegação tenta a rede primeiro e cai para a cópia guardada |
| Atualização | O nome do cache leva um número de versão, trocado a cada publicação |
| Fontes | Baloo 2 e Nunito servidas do próprio site, em `fonts/` |
| Gestos do sistema | Sem zoom por toque duplo ou pinça, sem seleção de texto, sem menu de toque longo e sem efeito elástico de rolagem |
| Campos de texto | Fonte de pelo menos 16 px, para o Safari não ampliar a tela ao focar |
| Publicação | Envio para a `main` do repositório; o Netlify publica em https |

O progresso salvo pertence ao app instalado: quem jogou antes pelo Safari começa do zero ao instalar.

## Entrega

A construção acontece em cinco etapas, cada uma jogável e publicável.

1. **Base visual:** tokens, componentes e a tela Cafeteria com a sala desenhada, ainda sem clientes.
2. **Ciclo principal:** clientes, fila, cartão do pedido, tela de Preparo, moedas e lugares nas mesas.
3. **Decoração:** tela Decorar, loja, colocação, mudança de lugar, estoque, cores de parede e piso.
4. **Vida da loja:** clientes da casa, Cardápio, nível e receitas, plantas, gato, áudio e Ajustes.
5. **PWA e acabamento:** manifesto, ícones, offline, áreas seguras, animações de toque e teste em iPhone.

### Critérios de aceite

- [ ] As telas Cafeteria, Preparo, Decorar e Clientes batem com o mockup em cores, fontes, espaçamentos e componentes, a 390 × 844 pt.
- [ ] O nome “Nai's Cafe” aparece no topo, no quadro-negro, no ícone instalado e no título da página.
- [ ] Nenhum arquivo de imagem é usado na cena nem na interface, exceto os ícones do app.
- [ ] É possível atender 20 clientes seguidos sem travar e sem nenhuma forma de perder.
- [ ] Todas as 7 receitas podem ser preparadas e liberam nos marcos definidos.
- [ ] Todos os 17 itens podem ser comprados, colocados, movidos e guardados.
- [ ] Fechar e reabrir o jogo mantém moedas, decoração, receitas e visitas.
- [ ] Instalado no iPhone, o jogo abre em tela cheia, respeita o entalhe e a barra inferior e funciona em modo avião.
- [ ] Música e chuva tocam após o toque no botão e voltam depois de trocar de app.
- [ ] Todos os botões têm pelo menos 44 pt e respondem ao primeiro toque.

### Decisões em aberto

- Quais são as bebidas favoritas dela, para entrarem no cardápio ou virarem a favorita de um cliente?
- Quais recadinhos o cliente especial deve deixar? São necessárias de 4 a 8 frases suas.
- A barista deve se parecer com ela (cor de cabelo, pele, roupa)?
- O nome da cafeteria pode ser trocado em Ajustes ou fica fixo em “Nai's Cafe”?
- O Claude ainda não tem permissão de escrita no repositório `marcalsantarem/nai`; sem ela, a publicação é feita por envio manual dos arquivos.
