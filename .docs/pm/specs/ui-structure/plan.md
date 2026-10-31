# Plan: align route files with module UI boundaries

Spec: [spec.md](./spec.md) (Approved)

1. Check the installed Expo SDK version and the matching versioned Expo Router, font, splash,
   and React Native documentation before changing their APIs.
2. Move each existing route's UI and styles into one root component under its owning module:
   `onboarding` for splash and onboarding, `auth` for sign-in, and `explore` for Explore. Keep
   local UI state and handlers with those components.
3. Make each route file import its module root from that module's `index.ts` and render it. Move
   the root layout's font, splash, status bar, and navigator setup into a navigation component;
   let `_layout.tsx` render that component.
4. Add explicit barrels only for module directories with external consumers, including shared
   UI and navigation. Update cross-module imports to use those barrels, and keep imports inside
   a module relative.
5. Run `npx tsc --noEmit` and `npm run lint`. Check the existing splash → onboarding → sign-in
   flow and Explore route on the applicable platforms. Record the source changes and check
   results in `.docs/worker/shared/`.

Apply the moves to the current working tree so the in-progress UI and configuration changes
remain intact.
