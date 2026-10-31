# Assignment list and detail demo

Date: 2026-10-27
Spec: .docs/pm/specs/assignments/spec.md (Approved)
Plan: .docs/pm/specs/assignments/plan.md

## What was done

- `src/domain/assignments/assignment.ts`, `index.ts` — added typed assignment summaries, status, difficulty, problem, detail, and fixture data models.
- `src/lib/assignments/demo-assignments.ts`, `index.ts` — added the four visible list cards, fixed counts, and Lab 04 detail from Figma.
- `src/lib/courses/index.ts` — exposed the existing course fixture so the assignment data reuses the course title through a module barrel.
- `src/hooks/assignments/use-assignment-data.ts`, `index.ts` — exposed assignment data only during the signed-in demo session.
- `src/components/assignments/assignment-card.tsx`, `assignment-list-view.tsx`, `assignment-problem-row.tsx`, `assignment-detail-view.tsx`, `index.ts` — added the two mobile screens, assignment cards, and five preview-only problem rows.
- `src/app/assignments.tsx`, `assignment-detail.tsx` — added thin route entry points.
- `src/lib/auth/demo-student.ts` — reused Lab 04 title and progress in the Home fixture.
- `src/components/home/home-view.tsx` — connected Upcoming assignment to Lab 04 detail.
- `src/components/courses/course-detail-view.tsx` — connected the Assignments tab to the list.
- `src/components/navigation/root-navigation.tsx` — registered both routes in the existing stack.

## Functions

### `useAssignmentData` — `src/hooks/assignments/use-assignment-data.ts`

- What it does: returns the fixed assignment fixture for an active demo session.
- Input: current session from `useHomeData`.
- Output: `AssignmentData` or `null`.
- Why it is written this way: keeps session access and fixture selection out of screen markup.

### `AssignmentCard` — `src/components/assignments/assignment-card.tsx`

- What it does: renders a status-colored assignment summary and opens Lab 04 when available.
- Input: an `AssignmentSummary` prop.
- Output: an accessible card with icon, course/item code, title, timing, badge, and progress.
- Why it is written this way: the four list items share a layout while unsupported details stay disabled.

### `AssignmentListView` — `src/components/assignments/assignment-list-view.tsx`

- What it does: renders the list heading, fixed summary counts, and grouped assignment cards.
- Input: signed-in assignment fixture.
- Output: the scrollable list screen or sign-in redirect.
- Why it is written this way: the header stays visible while all groups can scroll on small devices.

### `AssignmentProblemRow` — `src/components/assignments/assignment-problem-row.tsx`

- What it does: renders one problem's completion state, name, difficulty, and chevron.
- Input: an `AssignmentProblem` prop.
- Output: a labelled, disabled preview row.
- Why it is written this way: problem details were not provided in the approved frames.

### `AssignmentDetailView` — `src/components/assignments/assignment-detail-view.tsx`

- What it does: renders Lab 04 status, title, metadata, progress, instructions, and five problem rows.
- Input: signed-in assignment fixture and navigation history.
- Output: a scrollable detail screen or sign-in redirect.
- Why it is written this way: back returns to its caller and falls back to Assignment List for a direct route open.

### `AssignmentsRoute`, `AssignmentDetailRoute` — `src/app/assignments.tsx`, `assignment-detail.tsx`

- What they do: connect each URL to its module root component.
- Input: no route parameters.
- Output: one assignment screen each.
- Why they are written this way: Expo Router files remain thin.

### `createDemoSession` — `src/lib/auth/demo-student.ts`

- What it does: supplies Home's assignment title, accepted count, total, and due days from the Lab 04 fixture.
- Input: existing course fixture and assignment fixture.
- Output: a `DemoSession`.
- Why it is written this way: Home and Assignment Detail cannot drift apart on their shared sample.

### `HomeView` — `src/components/home/home-view.tsx`

- What it does: opens Lab 04 detail from the Upcoming assignment card.
- Input: signed-in Home and course data.
- Output: the existing Home screen with an active assignment card.
- Why it is written this way: Home is an approved entry point to the new detail screen.

### `CourseDetailView` — `src/components/courses/course-detail-view.tsx`

- What it does: opens Assignment List from the course's Assignments tab.
- Input: signed-in course data and local bookmark state.
- Output: the existing course detail screen with an active Assignments tab.
- Why it is written this way: it completes the approved list entry path without changing Lessons or Problems.

### `RootNavigation` — `src/components/navigation/root-navigation.tsx`

- What it does: registers Assignment List and Detail in the existing stack.
- Input: font loading and auth provider state.
- Output: the root navigator.
- Why it is written this way: both screens follow the app's current route and session setup.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router | Route files and navigation actions | Connect Home, Course Detail, list, and detail in the current stack. |
| React Native | Assignment components | Render native scroll, cards, badges, and touch controls. |
| `react-native-safe-area-context` | Assignment root screens | Keep content within iOS and Android safe areas. |
| `expo-symbols` | Headers, assignment cards, and problem rows | Reuse the app's installed icon approach. |
| Local TypeScript fixture | Domain, lib, and hook | Show the approved Figma demo without an API or scoring service. |

## Checks

- `npx tsc --noEmit`: passed after Expo regenerated typed routes with `npx expo customize tsconfig.json`.
- `npm run lint`: passed.
- `git diff --check`: passed.
- No web build was run. iOS simulators were installed but shut down; the app was not launched for visual inspection in this session.

## Left undone

- Filter, share, other assignment details, and problem details remain preview-only as specified. No live submission, grading, or progress update was added.
