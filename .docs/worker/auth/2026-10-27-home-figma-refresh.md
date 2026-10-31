# Home Figma refresh

Date: 2026-10-27
Spec: .docs/pm/specs/auth/spec.md (Approved)
Plan: .docs/pm/specs/auth/plan.md

## What was done

- `src/components/home/home-view.tsx` - kept the existing mint header and Bytey/streak block, placed the four-card Your Course grid before Continue Learning and Recommended Quiz, and moved weekly progress, assignment, and achievement below them. The cards use the approved local course list, while the existing course link and bottom navigation stay in place.
- `src/components/home/home-course-card.tsx` - added the native two-column card treatment, accessible course title and lesson count, and the Figma illustration crop for the programming card.
- `src/hooks/courses/index.ts` - exposed the existing course data hook through its module barrel for Home.
- `assets/images/home/oop.png`, `programming.png`, `data-structures.png`, `discrete-structures.png` - stored the four exact static illustrations returned by Figma node `104:5438` locally, in the same grid positions as the reference.
- Applied the native-relevant `design-taste-frontend` redesign audit: retained the brand palette and streak, kept one radius/shadow language for the new cards, and used the approved course data rather than decorative sample values.

## Functions

### `HomeView` - `src/components/home/home-view.tsx`

- What it does: renders the refreshed Home hierarchy and the retained demo sections.
- Input: no props; reads the existing demo session and course hook.
- Output: a React Native screen or the existing sign-in redirect when no session exists.
- Why it is written this way: it keeps the old streak and approved demo values while using the new Figma layout and coherent course records.

### `HomeCourseCard` - `src/components/home/home-course-card.tsx`

- What it does: renders one illustrated Home course card with its title and total lessons.
- Input: a `CourseSummary` and its local Figma `ImageSource`.
- Output: an accessible card; `CO1003` opens the supported course detail, and other cards remain previews like the existing Courses list.
- Why it is written this way: a focused child component keeps the grid styling and Figma image geometry out of the Home root component.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| React Native `View`, `Text`, `Pressable`, `StyleSheet` | Home layout and cards | Native layout, touch behavior, and cross-platform styling. |
| Expo Image | Course illustrations | Bundles and renders the supplied PNG assets efficiently on iOS, Android, and web. |
| Expo Router | Course card and existing Home links | Uses the approved app routes. |
| Inter, JetBrains Mono, and `BrandColors` | Home UI | Follows `.docs/UI/theme-color.md` and existing app typography. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `EXPO_OFFLINE=1 npx expo export --platform web --output-dir /private/tmp/bkpractice-home-web`: passed; all four illustrations appeared in the export.
- Four Home course codes were checked against the local course fixture; all matched.
- `file assets/images/home/*.png`: all four local assets are non-empty PNG files.
- Visual browser inspection was unavailable because Computer Use permissions were not granted in this environment. The web bundle and asset output were verified instead.

## Left undone

- The existing Start quiz display has no Quiz route in this workspace; the Home refresh leaves that pre-existing destination unchanged.
