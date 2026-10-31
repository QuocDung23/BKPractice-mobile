# Remove unused Expo starter code

Date: 2026-10-26
Spec: .docs/pm/specs/expo-starter-cleanup/spec.md (Approved)
Plan: .docs/pm/specs/expo-starter-cleanup/plan.md

## What was done

- `.docs/pm/specs/expo-starter-cleanup/spec.md` and `plan.md` — marked the existing cleanup documents approved after the user's approval.
- `src/app/explore.tsx` and `src/components/explore/explore-view.tsx`, `index.ts` — removed the Expo starter Explore route and module.
- `src/components/navigation/app-tabs.tsx`, `app-tabs.web.tsx`, `custom-tab-list.web.tsx`, and `tab-button.web.tsx` — removed the starter tab navigation, which the current stack does not use.
- `src/components/ui/animated-icon.module.css`, `animated-icon.tsx`, `animated-icon.web.tsx`, `animated-splash-overlay.tsx`, `animated-splash-overlay.web.tsx`, `collapsible.tsx`, `external-link.tsx`, `global.css`, `hint-row.tsx`, `themed-text.tsx`, `themed-view.tsx`, and `web-badge.tsx` — removed starter demonstrations and their styling.
- `src/hooks/use-color-scheme.ts`, `use-color-scheme.web.ts`, and `use-theme.ts` — removed theme hooks only used by deleted starter UI.
- `src/components/ui/index.ts` — retained only the public `BrandMark` and `MascotPlaceholder` exports.
- `src/components/navigation/root-navigation.tsx` — removed the deleted starter CSS import; font loading, splash coordination, status bar, and stack behavior remain in place.
- `src/lib/theme.ts` — removed starter light/dark colors, fonts, spacing, and tab constants; retained BKPractice brand colors and fonts.
- `assets/images/expo-badge-white.png`, `expo-badge.png`, `expo-logo.png`, `logo-glow.png`, `react-logo.png`, `react-logo@2x.png`, `react-logo@3x.png`, `tutorial-web.png`, `splash-icon.png`, and all six `assets/images/tabIcons/` images — removed assets referenced only by deleted demos or not referenced at all. Retained the six icon and favicon paths used by `app.json`.
- `scripts/reset-project.js` and the `reset-project` script in `package.json` — removed the create-expo-app reset workflow.
- `README.md` — replaced the starter README with BKPractice setup, source layout, and check commands.

## Functions

### `RootNavigation` — `src/components/navigation/root-navigation.tsx`

- What it does: Loads fonts, coordinates native splash visibility, and renders the status bar and stack navigator.
- Input: None.
- Output: Root navigation JSX, or `null` while fonts load.
- Why it is written this way: Removing its unused CSS import leaves startup behavior intact while eliminating the starter stylesheet.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router | `src/app/`, `root-navigation.tsx` | Keeps the three BKPractice routes and the existing stack after removing Explore. |
| React Native | BKPractice components and `src/lib/theme.ts` | Keeps the current native UI and brand styling while removing demo-only theme code. |
| npm | `package.json` | Removes only the obsolete reset script without changing dependency versions or the existing lockfile. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npx expo export --platform all --output-dir /private/tmp/bkpractice-starter-cleanup-export`: passed for iOS, Android, and web. Static routes include `/`, `/onboarding`, and `/sign-in`; `/explore` is absent.
- Searched active source, `package.json`, `README.md`, and `app.json` for references to the removed starter code and assets: none found.
- Checked all six icon and favicon paths referenced by `app.json`: all exist.
- `git diff --check`: passed.

## Left undone

- Configured app icon and favicon files are still template assets because `app.json` requires them; replace them when BKPractice artwork is available.
- Unused dependency pruning is outside this cleanup spec. The existing uncommitted `package-lock.json` was preserved.
