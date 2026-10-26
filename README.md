# BKPractice Mobile

Expo and React Native app for BKPractice.

## Run locally

```bash
npm install
npx expo start
```

Open the project in an iOS simulator, Android emulator, or web browser from the Expo CLI.

## Source layout

Expo Router routes and navigator entries live in `src/app/`. Each route renders UI from its
module in `src/components/`. Shared components are in `src/components/ui/`, and theme values
are in `src/lib/theme.ts`. See the [architecture guide](./.docs/pm/architecture/README.md) and
[agent workflow](./.docs/agent/working-agreement.md) for the repository conventions.

## Checks

```bash
npx tsc --noEmit
npm run lint
```
