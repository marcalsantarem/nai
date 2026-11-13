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

## Escopo atual: M5 — Presente (v1.0.0). M1 a M4 fechados (tags v0.1.0 a v0.4.0)

**Dentro:** instalação como PWA (manifesto, ícones, metadados da Apple); modo offline; áreas seguras e gestos no app instalado; animações de toque e acabamento (inclui as ressalvas dos QAs do M3 e do M4); desempenho a 60 fps; cliente especial com recadinhos (quando o dono mandar os textos); teste no iPhone; validação final com todos os critérios de aceite. Tasks T-045 a T-052 e T-035 no backlog.
**Fora:** ideias para depois do v1.0 (decisão 31).

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
