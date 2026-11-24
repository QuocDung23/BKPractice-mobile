# Chapter detail view

Date: 2026-11-24
Spec: .docs/pm/specs/learning/chapters/spec.md (Approved)
Plan: .docs/pm/specs/learning/chapters/plan.md

## What was done

- `src/components/courses/course-detail-view.tsx` — opens the selected chapter from the already loaded course response, avoiding another course request.
- `src/components/courses/course-detail-header.tsx` — increases course description weight to Medium, as requested.
- `src/components/chapters/chapter-card.tsx` — makes each chapter selectable and increases chapter description weight to Medium.
- `src/components/chapters/course-chapters-view.tsx` — passes chapter selection to the parent view.
- `src/components/chapters/chapter-detail-view.tsx` — adds the chapter screen body with a fixed header and a scrollable activity list; extends the scroll viewport to the bottom edge while padding content for the home indicator.
- `src/components/chapters/chapter-detail-header.tsx` — adds the back/title row, course context, description, real Problem/Quiz counts, and activity filters.
- `src/components/chapters/chapter-activity-list.tsx` — lists the chapter's Problems with type/difficulty and Quizzes with their titles; shows a distinct empty state for each tab.
- `src/components/chapters/index.ts` — exports the new chapter detail view.

## Functions

### `ChapterDetailView` — `src/components/chapters/chapter-detail-view.tsx`

- What it does: renders the chapter header separately from the scrollable Problem/Quiz list.
- Input: chapter data, course title, and a back callback.
- Output: a native chapter detail view with Problems selected by default.
- Why it is written this way: it reuses the loaded course response, keeps the header stationary while activity content scrolls, and reserves bottom inset space inside the scroll content instead of leaving a dead strip below it.

### `ChapterDetailHeader` — `src/components/chapters/chapter-detail-header.tsx`

- What it does: renders the chapter title and back action on one row, chapter context, counts, and two activity tabs.
- Input: chapter, course title, selected tab, tab callback, and back callback.
- Output: a fixed header styled with the existing course colors and controls.
- Why it is written this way: the chapter screen mirrors the app's established course UI without inventing chapter progress.

### `ChapterActivityList`, `ProblemList`, and `QuizList` — `src/components/chapters/chapter-activity-list.tsx`

- What they do: render API-provided activities in response order, or a clear empty state.
- Input: chapter data and selected activity tab.
- Output: non-interactive Problem or Quiz cards.
- Why they are written this way: current Problem/Quiz detail routes still show demo data, so these cards do not route users to misleading content.

### `ChapterCard` — `src/components/chapters/chapter-card.tsx`

- What it does: makes a chapter row accessible and selectable.
- Input: chapter and selection callback.
- Output: a chapter card with description and a chevron.
- Why it is written this way: chapter navigation stays inside the course screen and uses its already loaded data.

### `CourseChaptersView` — `src/components/chapters/course-chapters-view.tsx`

- What it does: displays course chapters and delegates selection.
- Input: chapters and selection callback.
- Output: the chapter list or the existing no-chapters state.
- Why it is written this way: it stays focused on the list and leaves detail state to its parent.

### `CourseDetailView` — `src/components/courses/course-detail-view.tsx`

- What it does: tracks the selected chapter and switches between course and chapter content.
- Input: course ID.
- Output: course chapters or the selected chapter view.
- Why it is written this way: the course detail endpoint already contains chapter activities, so selection does not trigger another request.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router screen state | `course-detail-view.tsx` | Keeps the chapter drill-down within the loaded course screen and avoids a duplicate course fetch. |
| React Native `ScrollView`, `Pressable`, `SafeAreaView` | Chapter components | Uses existing cross-platform mobile patterns for fixed controls and scrollable content. |
| `useSafeAreaInsets` | `chapter-detail-view.tsx` | Keeps the last activity clear of the home indicator while the scroll viewport fills the bottom edge. |
| `expo-symbols` | Chapter cards and detail header/list | Reuses platform-adaptive icons already used by the course UI. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.

## Left undone

- Problem and Quiz cards remain display-only until their detail routes load real backend data by ID.
- Visual review on an iOS/Android device or simulator was not run.
