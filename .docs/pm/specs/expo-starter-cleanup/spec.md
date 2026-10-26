# Remove unused Expo starter code

Status: Approved
Date: 2026-10-26

## Goal

Remove the unused create-expo-app demonstration code so the repository contains the current
BKPractice splash, onboarding, and sign-in UI without the template's Explore screen and demos.

## Scope

- Remove the Explore route and its module UI, plus the unused starter tab navigation and demo UI
  components, theme hooks, and CSS that only support them.
- Keep the current BKPractice splash, onboarding, sign-in, root navigation, brand components,
  and their fonts, colors, interactions, and route paths working.
- Keep module barrels accurate after removing starter exports. Remove theme values used only by
  deleted starter components.
- Remove assets referenced only by deleted starter code, including Expo logo and demo images.
  Keep icon and favicon files still referenced by `app.json` until replacement assets exist.
- Remove the template reset script and its package script. Replace the starter README with brief
  BKPractice setup and source-layout instructions.
- Preserve other in-progress, uncommitted changes.

## Acceptance criteria

1. The app builds with `/`, `/onboarding`, and `/sign-in`; `/explore` is no longer a route.
2. No remaining source import or package script points to a removed file.
3. The UI barrel exports only remaining public components, and active imports follow the barrel
   rule in `.docs/agent/rules.md`.
4. `npx tsc --noEmit` and `npm run lint` are run; any unrelated pre-existing lint failure is
   recorded under the working agreement.
5. Expo export succeeds for iOS, Android, and web with the remaining routes.

## Relationship to the previous refactor

The approved `ui-structure` spec preserved Explore during the structural move. Once this cleanup
is approved and implemented, its removal of the starter Explore feature supersedes that earlier
preservation requirement.
