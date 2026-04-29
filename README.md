# Reino dos Expoentes

Jogo educativo de matemática sobre propriedades de expoentes, com versão web em React/Vite e versão mobile em Expo/React Native.

## Autor

João Manoel

## Estrutura

- `apps/web`: aplicação web React.
- `apps/mobile`: aplicação mobile Expo.
- `packages/game-core`: regras puras do jogo, reducer, combate, questões e testes.
- `packages/game-content`: fases, balanceamento, mensagens e conteúdo didático.
- `packages/assets`: catálogo de sprites, áudio e créditos.

## Scripts

```bash
npm install
npm run test
npm run typecheck --workspaces --if-present
npm run build
npm run dev:web
npm run dev:mobile
```

## Licenças e Créditos

Consulte `packages/assets/credits.md` para créditos de assets e materiais usados no projeto.
