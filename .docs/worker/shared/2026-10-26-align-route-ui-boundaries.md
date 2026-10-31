# Align route UI with module boundaries

Date: 2026-10-26
Spec: .docs/pm/specs/ui-structure/spec.md (Approved)
Plan: .docs/pm/specs/ui-structure/plan.md

## What was done

- `src/app/index.tsx`, `onboarding.tsx`, `sign-in.tsx`, and `explore.tsx` — replaced screen UI with thin route components that render the appropriate module root.
- `src/app/_layout.tsx` — delegates the root layout to the navigation module.
- `src/components/onboarding/splash-view.tsx`, `onboarding-view.tsx`, and `index.ts` — moved the existing splash and onboarding UI and exposed their module roots.
- `src/components/auth/sign-in-view.tsx` and `index.ts` — moved the existing sign-in mock UI and exposed its root.
- `src/components/explore/explore-view.tsx` and `index.ts` — moved the existing Explore UI and exposed its root.
- `src/components/navigation/root-navigation.tsx` and `index.ts` — moved font loading, native splash coordination, status bar, and stack navigator setup out of `src/app/`.
- `src/components/ui/index.ts` — exposes the shared UI used by other modules through explicit named exports.
- `src/components/navigation/custom-tab-list.web.tsx`, `tab-button.web.tsx`, and `src/components/ui/collapsible.tsx` — updated cross-module imports to use the UI barrel and imports within the UI module to stay relative.
- `.docs/pm/specs/ui-structure/spec.md` and `plan.md` — marked the previously prepared documents approved after the user's approval.

## Functions

### `SplashRoute` — `src/app/index.tsx`

- What it does: Renders the splash module root at `/`.
- Input: None.
- Output: The `SplashView` element.
- Why it is written this way: Keeps the Expo Router entry free of screen UI and state.

### `OnboardingRoute` — `src/app/onboarding.tsx`

- What it does: Renders the onboarding module root.
- Input: None.
- Output: The `OnboardingView` element.
- Why it is written this way: Keeps the route as a thin navigation entry.

### `SignInRoute` — `src/app/sign-in.tsx`

- What it does: Renders the auth module root.
- Input: None.
- Output: The `SignInView` element.
- Why it is written this way: Keeps form UI and mock feedback in the owning module.

### `ExploreRoute` — `src/app/explore.tsx`

- What it does: Renders the Explore module root.
- Input: None.
- Output: The `ExploreView` element.
- Why it is written this way: Keeps the starter Explore UI outside the route directory.

### `RootLayout` — `src/app/_layout.tsx`

- What it does: Renders the root navigation component.
- Input: None.
- Output: The `RootNavigation` element.
- Why it is written this way: Keeps the Expo Router layout file small while preserving its entry-point role.

### `SplashView` — `src/components/onboarding/splash-view.tsx`

- What it does: Renders the current branded splash UI and schedules navigation to onboarding.
- Input: None.
- Output: Splash JSX.
- Why it is written this way: Moves both the display and its local timing behavior into the onboarding module without changing them.

### `OnboardingView` — `src/components/onboarding/onboarding-view.tsx`

- What it does: Renders the three onboarding slides and their controls.
- Input: None.
- Output: Onboarding JSX.
- Why it is written this way: Keeps the slide state and UI together in the module.

### `goForward` — `src/components/onboarding/onboarding-view.tsx`

- What it does: Advances a slide or navigates to sign-in from the last slide.
- Input: None; reads the current local step.
- Output: `void`.
- Why it is written this way: Preserves the existing onboarding interaction during the move.

### `SignInView` — `src/components/auth/sign-in-view.tsx`

- What it does: Renders the sign-in form and its current mock interactions.
- Input: None.
- Output: Sign-in JSX.
- Why it is written this way: Keeps local form state and UI in the auth module.

### `submitSignIn` — `src/components/auth/sign-in-view.tsx`

- What it does: Sets feedback based on whether email and password are present.
- Input: None; reads local form state.
- Output: `void`.
- Why it is written this way: Preserves the existing mock response without introducing authentication behavior.

### `ExploreView` — `src/components/explore/explore-view.tsx`

- What it does: Renders the existing Explore content with theme and safe-area spacing.
- Input: None.
- Output: Explore JSX.
- Why it is written this way: Moves screen markup into its module without changing the content.

### `RootNavigation` — `src/components/navigation/root-navigation.tsx`

- What it does: Loads fonts, coordinates native splash visibility, renders the status bar and stack.
- Input: None.
- Output: Root navigation JSX or `null` while fonts load.
- Why it is written this way: Preserves the existing startup sequence outside `src/app/`.

### `CustomTabList` — `src/components/navigation/custom-tab-list.web.tsx`

- What it does: Renders the existing web tab list.
- Input: `TabListProps`.
- Output: Tab list JSX.
- Why it is written this way: Its UI import now crosses the module boundary through the public barrel; rendering is unchanged.

### `TabButton` — `src/components/navigation/tab-button.web.tsx`

- What it does: Renders the existing web tab button.
- Input: `TabTriggerSlotProps`.
- Output: Tab button JSX.
- Why it is written this way: Its UI import now uses the shared UI barrel; rendering is unchanged.

### `Collapsible` — `src/components/ui/collapsible.tsx`

- What it does: Renders the existing expandable section.
- Input: Children and a `title` string.
- Output: Collapsible JSX.
- Why it is written this way: Imports sibling UI files directly to avoid cycling through its own barrel; rendering is unchanged.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router | `src/app/`, `root-navigation.tsx`, onboarding components | Preserves file-based routes, stack navigation, and existing route actions. |
| React Native | Module view components | Keeps the existing native UI and styles while moving them to the owning folders. |
| Expo Font, SplashScreen, and StatusBar | `root-navigation.tsx` | Preserves the existing startup behavior with SDK 57 APIs. |
| TypeScript module barrels and `@/` alias | `src/components/*/index.ts` and consumers | Exposes module public APIs without deep cross-module imports. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: failed on the existing `react-hooks/set-state-in-effect` error at `src/hooks/use-color-scheme.web.ts:11`; that file was not changed in this task.
- `npx eslint src/app src/components/onboarding src/components/auth src/components/explore src/components/navigation src/components/ui/collapsible.tsx src/components/ui/index.ts`: passed.
- `npx expo export --platform all --output-dir /private/tmp/bkpractice-ui-structure-export`: passed for iOS, Android, and web; static routes include `/`, `/onboarding`, `/sign-in`, and `/explore`.
- `git diff --check`: passed.
- Interactive tap-through was not completed; the local Expo web server did not begin listening in the sandbox. The navigation calls and mock handlers were kept in the moved components.

## Left undone

- The pre-existing lint error in `src/hooks/use-color-scheme.web.ts` remains outside this spec.
