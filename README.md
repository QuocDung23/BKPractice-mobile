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
are exposed through `src/lib/themes/index.ts`. See the [architecture guide](./.docs/pm/architecture/README.md) and
[agent workflow](./.docs/agent/working-agreement.md) for the repository conventions.

## Styling

Use NativeWind/Tailwind `className` utilities for static styles. Colors and font families in
`tailwind.config.ts` come from `Brands`, exported by `@/lib/themes`:

```tsx
<Text className="text-primary font-brand-medium text-[15px]">BKPractice</Text>
```

Use `Brands.colors` or `Brands.fonts` for native props and dynamic styles. Keep conditional
classes as complete strings so Tailwind can discover them. NativeWind supports
`contentContainerClassName` on ScrollView; Expo Image needs `cssInterop` as shown in
`HomeCourseCard`. Restart Metro with `npx expo start --clear` after changing Babel or Metro config.

## Checks

```bash
npx tsc --noEmit
npm run lint
```
