# Align route files with module UI boundaries

Status: Approved
Date: 2026-10-26

## Goal

Bring the current Expo Router UI into the accepted architecture without changing the existing
navigation flow or the visible behavior of the in-progress mock screens.

## Scope

- Keep `src/app/index.tsx`, `onboarding.tsx`, `sign-in.tsx`, and `explore.tsx` as thin route entries
  that render a module root component.
- Keep `src/app/_layout.tsx` as the root layout entry. Put font loading, splash coordination,
  status bar rendering, and navigator UI in a component under `src/components/navigation/`.
- Place the splash and onboarding UI in `src/components/onboarding/`, sign-in UI in
  `src/components/auth/`, and the existing Explore UI in `src/components/explore/`.
- Keep shared UI in `src/components/ui/`. Expose components used outside their module through
  explicit `index.ts` barrels; use the `@/` alias for imports across module boundaries.
- Preserve the current styles, text, interactions, and uncommitted configuration changes while
  moving code to its owning layer.

## Acceptance criteria

1. Route files contain no screen markup, `StyleSheet`, or display state; each renders its module
   root component. The root layout delegates its UI and setup to the navigation module.
2. Each module root and child component lives under `src/components/<module>/`; no `screens/`
   directory is introduced.
3. Imports across component modules use their public `index.ts` barrels. Imports within a
   module remain relative and do not cycle through its barrel.
4. Splash timing, onboarding progression, sign-in mock feedback, and Explore rendering continue
   to behave as before the refactor.
5. `npx tsc --noEmit` and `npm run lint` pass, or any pre-existing failure is recorded according
   to the working agreement.

## References

- [Architecture](../../architecture/README.md)
- [Agent rules](../../../agent/rules.md)
