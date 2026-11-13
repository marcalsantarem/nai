# Fluxo de trabalho com Git

Regras do dono do projeto. Valem para qualquer pessoa ou agente.

Repositório: https://github.com/marcalsantarem/nai

## Branches

| Branch | Uso | Regras |
|---|---|---|
| `main` | Versão estável | **Protegida.** Sem commit nem push direto; só recebe PR `dev` → `main`. |
| `dev` | Desenvolvimento | **Única branch com commits.** |

- Não crie outras branches sem pedido explícito do dono. Sem branch por versão: versões fechadas ficam só em tag.

## Commits

- O AG00 (líder) faz commit e push na `dev` por conta própria ao fechar uma etapa. Agrupe o trabalho.
- Especialistas nunca fazem commit, push, branch, checkout, reset ou stash.
- Mensagens em pt-BR, citando task e briefing. Ex.: `T-005 sala inicial (BRF-004)`.

## Pull Request de fim de marco

- Só o dono manda abrir. O AG00 escreve **título e descrição no chat**; o dono abre e mescla.
- Junto com o texto, o AG00 sempre envia o **link do PR**: `https://github.com/marcalsantarem/nai/compare/main...dev?quick_pull=1&title=…&body=…` com título e descrição já preenchidos (URL-encoded), para o dono só conferir e criar.
- Descrição: o que o marco fecha, principais entregas, validação (o que foi e o que não foi testado), o que acontece depois do merge.

## Versões e tags

- Um marco = uma versão = uma tag `v0.x.0` na `main`.
- Antes do PR, suba a versão no arquivo de versão único (decisão 11) em um commit na `dev`.
- Depois do merge: `git checkout main && git pull`, `git tag v0.x.0`, `git push origin v0.x.0`, volta para a `dev`.
- Nunca mova, apague nem recrie uma tag.
- Desde o M5 há service worker com cache por versão: todo push na `dev` que mude arquivos do jogo sobe o sufixo em `js/version.js` (ex.: `1.0.0-dev.3`), senão quem já abriu o jogo continua com os arquivos antigos. No fechamento do marco, a versão vira a final (ex.: `1.0.0`).
- Ao criar um arquivo novo do jogo, acrescente-o à lista do `sw.js`.
