# Nai's Cafe — Bíblia do projeto

> Versão curta. Detalhes do jogo em [especificacao.md](especificacao.md). Verdade: dono > Bíblia > [decisoes.md](decisoes.md) > documento do agente.

## Pitch

Jogo cozy de cafeteria para celular, numa noite de chuva: receber clientes, preparar bebidas passo a passo e decorar com as moedas. Presente pessoal para uma jogadora (Nai), não produto comercial.

## Pilares

1. **Sem falha:** sem cronômetro, cliente irritado, pedido errado nem fim de jogo.
2. **Decorar é o objetivo.**
3. **Pequenos rituais:** regar plantas, carinho no gato, desenho na espuma.
4. **Vínculo:** clientes da casa com nome, favorita e falas que avançam.
5. **Fiel ao mockup:** mesma paleta, fontes, componentes e ilustração isométrica, tudo feito por código.

## Plataforma

iPhone em retrato (Safari e PWA instalada), 390 × 844 pt de referência. Site estático, sem build, publicado no Netlify. Offline após a primeira abertura. Dados só no aparelho.

## Escopo atual: M4 — Vida da loja (v0.4.0). M1 a M3 fechados (tags v0.1.0 a v0.3.0)

**Dentro:** nível e liberação de receitas (6, 10, 14, 24); clientes da casa com falas; cliente especial com recadinhos (aguarda textos do dono); plantas com sede e gato; chuva, música e efeitos; toques na planta e no gato; telas Clientes da casa, Cardápio e Ajustes (nome editável, recomeçar do zero). Tasks T-033 a T-044 e T-056 no backlog.
**Fora:** instalação como PWA, modo offline, acabamento final e teste formal no iPhone (M5).

## Time

| Agente | Papel | Arquivos que possui |
|---|---|---|
| AG00 (líder) | Gerencia, briefings, revisão, decisões, backlog, commits | `docs/` (exceto `docs/qa/`), `CLAUDE.md`, `.claude/` |
| AG01 (Gameplay) | Simulação e regras: clientes, fila, preparo, moedas, nível, plantas, gato, salvamento | `js/sim.js`, `js/state.js`, `js/data.js` |
| AG02 (UI) | Telas e componentes HTML/CSS, laço e troca de telas | `index.html`, `css/`, `js/main.js`, `js/screens/` |
| AG03 (Arte) | Ilustração isométrica, personagens, miniaturas e retratos | `js/iso.js`, `js/art.js`, `docs/referencia/mockup-src/` |
| AG04 (Áudio) | Chuva, música e efeitos por Web Audio | `js/audio.js` |
| AG05 (Plataforma) | PWA, service worker, ícones, fontes, versão, deploy | `manifest.webmanifest`, `sw.js`, `icons/`, `fonts/`, `js/version.js`, `netlify.toml` |
| AG06 (QA) | Validação contra mockup e critérios de aceite | `docs/qa/` (só lê código) |

**Arquivos compartilhados** (`index.html`, `js/main.js`, `css/tokens.css`, `js/state.js`): outros agentes só alteram com autorização no briefing.

## Comando

- Só o AG00 fala com o dono. Especialistas trabalham só com briefing em `docs/briefings/`, na `dev`, sem commit.
- Entrega de todo especialista (máx. 10 linhas): **entregue · validação · suposições · não testado · próximo passo**.
