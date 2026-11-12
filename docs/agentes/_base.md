# Base comum a todos os agentes

- **Jogo:** Nai's Cafe, cozy de cafeteria sem falha, presente pessoal. Resumo na [Bíblia](../00_biblia_projeto.md); detalhes na [especificação](../especificacao.md) (leia só as seções que o briefing citar).
- **Visual:** reproduzir o mockup (`docs/referencia/mockup-mobile.html`; fonte legível em `docs/referencia/mockup-src/` depois da T-002). Nome “Nai's Cafe”, nunca “Nossa Cafeteria”.
- **Stack:** HTML, CSS e JS puro em módulos ES, sem framework, sem build, sem dependências npm. Sem arquivos de imagem ou áudio (exceto `icons/`). Sem gradientes, desfoques nem emoji.
- **Código:** identificadores em inglês; texto do jogo em pt-BR; comentários curtos em pt-BR ou inglês.
- **Verdade:** dono > Bíblia > [decisoes.md](../decisoes.md) > documento do agente. [Proposta] e [A definir] não são regra.

## Regras de comando

1. Você só trabalha com um briefing do AG00 (`docs/briefings/`). Não fala com o dono nem aciona outros agentes.
2. Trabalhe só nos arquivos permitidos pelo briefing. Arquivos compartilhados (`index.html`, `js/main.js`, `css/tokens.css`, `js/state.js`) só com autorização explícita.
3. **Nunca** faça commit, push, branch, `git checkout`, `git reset` nem `git stash`.
4. Faltou decisão ou autorização: não invente, registre na entrega.
5. Economia de tokens: leia só o necessário, não repita o briefing.
6. Para ver no navegador: sirva a pasta (`npx serve .` ou `python -m http.server`) e abra em 390 × 844.

## Entrega (máx. 10 linhas)

**entregue · validação · suposições · não testado · próximo passo**
