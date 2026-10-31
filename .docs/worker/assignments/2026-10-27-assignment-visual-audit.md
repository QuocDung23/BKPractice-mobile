# Assignment visual audit

Date: 2026-10-27
Spec: .docs/pm/specs/assignments/spec.md (Approved)
Plan: .docs/pm/specs/assignments/plan.md

## What was done

- `.docs/UI/theme-color.md` — recorded the supporting and small-label colors visible in the approved Assignment Figma frames.
- `src/lib/theme.ts` — added named supporting-text and small-label colors from the same Figma palette.
- `src/components/assignments/assignment-list-view.tsx` — used darker theme shades for compact summary numbers, captions, and group headings.
- `src/components/assignments/assignment-card.tsx` — improved compact metadata and status badge contrast while keeping the Figma status icon and progress colors.
- `src/components/assignments/assignment-problem-row.tsx` — used darker difficulty label colors on the existing pastel badges.
- `src/components/assignments/assignment-detail-view.tsx` — improved compact due, progress, metadata, and compiler flag text contrast.
- `src/components/home/home-view.tsx` — added pressed feedback to the linked Upcoming assignment card.

## Functions

### `AssignmentListView` — `src/components/assignments/assignment-list-view.tsx`

- What it does: renders the approved grouped assignment list and summary tiles.
- Input: signed-in assignment fixture.
- Output: the list screen or sign-in redirect.
- Why it is written this way: darker text shades keep small labels readable on the same pastel Figma surfaces.

### `AssignmentCard` — `src/components/assignments/assignment-card.tsx`

- What it does: renders an assignment's status, metadata, and progress, opening Lab 04 when available.
- Input: `AssignmentSummary`.
- Output: a card with accessible label and status treatment.
- Why it is written this way: text color now uses a separate, more legible shade from the decorative icon color.

### `AssignmentProblemRow` — `src/components/assignments/assignment-problem-row.tsx`

- What it does: renders a preview problem row and difficulty badge.
- Input: `AssignmentProblem`.
- Output: a disabled, labelled problem row.
- Why it is written this way: the compact difficulty label uses a darker shade while keeping the approved badge background.

### `AssignmentDetailView` — `src/components/assignments/assignment-detail-view.tsx`

- What it does: renders the Lab 04 detail and five preview problem rows.
- Input: signed-in assignment fixture and navigation history.
- Output: the detail screen or sign-in redirect.
- Why it is written this way: supporting text and small badge labels now have stronger contrast without changing the screen hierarchy.

### `HomeView` — `src/components/home/home-view.tsx`

- What it does: renders Home with a linked Upcoming assignment card.
- Input: signed-in Home and course data.
- Output: the Home screen with visible pressed feedback on the assignment card.
- Why it is written this way: touch feedback confirms the card's action on mobile.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| React Native `Pressable` | Home assignment card | Show pressed feedback using the existing native control. |
| Shared theme tokens | Assignment components | Keep the Figma palette and compact text colors consistent across both screens. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- Contrast calculations for compact label pairs are at least 4.5:1 with the adjusted shades; no web build was run.

## Left undone

- Native simulator visual inspection was not run; the previous device inventory showed all simulators shut down.
