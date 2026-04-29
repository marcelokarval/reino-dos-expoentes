# Reino dos Expoentes

Jogo educativo de matemática sobre propriedades de expoentes, com versão web em React/Vite e versão mobile em Expo/React Native. O projeto transforma regras de expoentes em batalhas curtas com fases, inimigos, missão, FOCO, professor-guia, itens, sprites, música e efeitos sonoros.

## Autor

João Manoel

## Objetivo Educacional

O jogo treina propriedades de expoentes por repetição variada e feedback imediato:

- Produto de potências de mesma base: `a^m * a^n = a^(m+n)`.
- Divisão de potências de mesma base: `a^m / a^n = a^(m-n)`.
- Potência de potência: `(a^m)^n = a^(m*n)`.
- Expoente zero: `a^0 = 1`, com `a != 0`.
- Expoente negativo: `a^-n = 1/a^n`.
- Fase final com combinação das regras.

As perguntas não devem repetir dentro do fluxo atual de uma fase enquanto houver perguntas disponíveis no pool. As alternativas são embaralhadas a cada geração.

## Gameplay

- O jogador responde questões para causar dano ao inimigo e avançar a missão da fase.
- Respostas corretas aumentam combo, missão e FOCO.
- Respostas erradas e timeout causam dano; FOCO absorve dano antes do HP.
- FOCO começa em `0`, respeita cap por fase, espera `7s` e depois drena `1` ponto a cada `1.5s`.
- Settings pausa o runtime da batalha para evitar perda de FOCO ou timeout enquanto o modal está aberto.
- O professor dá dicas contextuais e aparece com retrato em batalha e vitória.

## Fases

- `1. FLORESTA DOS PRODUTOS`: produto de potências.
- `2. CAVERNA DAS DIVISÕES`: divisão de potências.
- `3. TORRE DAS POTÊNCIAS`: potência de potência.
- `4. DESERTO DO ZERO`: expoente zero.
- `5. ABISMO NEGATIVO`: expoente negativo com timer.
- `6. TRONO DO CAOS`: mistura de regras com timer.

## Estrutura

- `apps/web`: aplicação web React.
- `apps/mobile`: aplicação mobile Expo.
- `packages/game-core`: regras puras do jogo, reducer, combate, questões e testes.
- `packages/game-content`: fases, balanceamento, mensagens e conteúdo didático.
- `packages/assets`: catálogo de sprites, áudio e créditos.
- `docs/superpowers`: planos e trackers de execução usados durante evolução do projeto.
- `.claude/napkin.md`: runbook curto para próximos agentes.
- `AGENTS.md`: contrato operacional para agentes de IA neste repositório.

## Arquitetura

`packages/game-core` é a fonte de verdade das regras. Ele deve permanecer puro, sem React, React Native, DOM, storage, CSS, áudio ou loaders de assets.

`packages/game-content` contém o conteúdo editável: fases, balanceamento, inimigos e mensagens do professor.

`packages/assets` registra os assets disponíveis, metadados de spritesheets, cues de áudio e créditos/licenças.

`apps/web` e `apps/mobile` consomem o core e o content. Elas são responsáveis por renderização, persistência local, áudio, timers de runtime e adaptação de assets por plataforma.

## Scripts

```bash
npm install
npm run test
npm run typecheck --workspaces --if-present
npm run build
npm run dev:web
npm run dev:mobile
```

## Desenvolvimento Web

```bash
npm run dev:web
```

O Vite sobe em `127.0.0.1` e pode escolher outra porta se `5173` estiver ocupada. Confira a URL impressa no terminal.

Para gerar build web:

```bash
npm run build -w @reino/web
```

## Desenvolvimento Mobile

```bash
npm run dev:mobile
```

Para abrir no Android:

```bash
npm run android -w @reino/mobile
```

Para abrir no iOS:

```bash
npm run ios -w @reino/mobile
```

Preferência atual de validação mobile: Android primeiro, iOS depois.

## Qualidade E Prova

Antes de concluir mudanças de código, rode:

```bash
npm test
npm run typecheck --workspaces --if-present
npm run build
```

Para mudanças visuais ou de fluxo em browser, salve provas locais em `.tmp/`:

- screenshots em `.tmp/screenshots/...`;
- relatórios em `.tmp/reports/...`;
- logs de runtime em `.tmp/reports/runtime/...` ou subpastas específicas.

Exemplo já usado para fluxo de perguntas: `.tmp/screenshots/question-browser-proof/` e `.tmp/reports/question-browser-proof/`.

`.tmp/` é ignorado pelo Git por padrão.

## Assets

Os sprites e UI assets atuais usam pacotes Kenney CC0, incluindo:

- Kenney Roguelike/RPG Pack.
- Kenney Roguelike Characters.
- Kenney Tiny Dungeon.
- Kenney Roguelike Caves & Dungeons.
- Kenney UI Pack (RPG Expansion).
- Kenney Micro Roguelike.

Consulte `packages/assets/credits.md` para URLs, licença, data de download e caminhos locais.

## Regras Para Próximas Mudanças

- Se mudar FOCO, altere testes do reducer primeiro.
- Se mudar geração de perguntas, altere testes de `questions` e fluxo do reducer.
- Se mudar settings/timers, valide que o jogo pausa no web e mobile.
- Se adicionar assets, registre a licença antes de usar.
- Se mudar UI, faça browser-proof com screenshots em `.tmp/`.
- Se mudar core, preserve a separação entre regra pura e runtime de plataforma.

## Licenças e Créditos

Consulte `packages/assets/credits.md` para créditos de assets e materiais usados no projeto.

Os assets Kenney usados estão registrados como Creative Commons Zero, CC0. O áudio synth original do projeto está registrado no arquivo de créditos.
