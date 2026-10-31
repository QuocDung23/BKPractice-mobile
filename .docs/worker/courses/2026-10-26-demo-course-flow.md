# Demo course flow

Date: 2026-10-26  
Spec: .docs/pm/specs/courses/spec.md (Approved)  
Plan: .docs/pm/specs/courses/plan.md

## What was done

- `src/domain/courses/course.ts` and `index.ts` — added typed course, detail, and lesson models plus search/status filtering.
- `src/lib/courses/demo-courses.ts` — added the five Figma course samples, `CO1003` detail, and lesson 13 content as one local fixture.
- `src/hooks/courses/use-course-data.ts` — exposes the fixture only while the demo student is signed in and filters the course list.
- `src/lib/auth/demo-student.ts` — derives the Home course summary from the same `CO1003` fixture.
- `src/lib/theme.ts` — added mint, success, progress, and lesson tip colors from `.docs/UI/theme-color.md`.
- `src/components/navigation/bottom-navigation.tsx` and `index.ts` — moved the five-item bar into one shared component; Home and Courses navigate, other tabs are labelled placeholders.
- `src/components/navigation/root-navigation.tsx` — registered Courses, Course Detail, and Lesson routes.
- `src/components/home/home-view.tsx` — connected All courses, Continue learning, and the shared tab bar.
- `src/components/courses/course-card.tsx`, `courses-view.tsx`, `lesson-row.tsx`, `course-detail-view.tsx`, `lesson-view.tsx`, and `index.ts` — implemented the three Figma screens with local filtering, course progress, lesson states, bookmark/check controls, fixed bars, and safe areas.
- `src/app/courses.tsx`, `course-detail.tsx`, and `lesson.tsx` — added thin Expo Router entry points.

## Functions

### `filterCourses` — `src/domain/courses/course.ts`

- What it does: Filters course summaries by status and a trimmed, case-insensitive code/title query.
- Input: Course list, query string, and `CourseFilter`.
- Output: Matching `CourseSummary[]`.
- Why it is written this way: Keeps list selection independent from UI and easy to check.

### `useCourseData` and `useFilteredCourses` — `src/hooks/courses/use-course-data.ts`

- What they do: Expose typed local course data when a demo session exists; apply the selected search/filter.
- Input: No input for `useCourseData`; query and filter for `useFilteredCourses`.
- Output: `CourseData | null`; filtered list with total count, or null.
- Why they are written this way: Screen components do not read fixture or auth store details directly.

### `createDemoSession` — `src/lib/auth/demo-student.ts`

- What it does: Creates the temporary signed-in student and Home response, now using the shared `CO1003` fixture.
- Input: None.
- Output: `DemoSession`.
- Why it is written this way: The Home card and Courses detail cannot drift apart during the demo.

### `BottomNavigation` — `src/components/navigation/bottom-navigation.tsx`

- What it does: Renders the shared five-item tab bar and navigates between Home and Courses.
- Input: Active tab (`Home` or `Courses`).
- Output: Native tab bar UI.
- Why it is written this way: Both approved screens show the same fixed navigation, while unapproved destinations remain labelled placeholders.

### `RootNavigation` — `src/components/navigation/root-navigation.tsx`

- What it does: Renders the existing font/session setup and registers three more routes.
- Input: None.
- Output: Root navigator UI or null while fonts load.
- Why it is written this way: New screens use the existing stack and auth provider.

### `HomeView` — `src/components/home/home-view.tsx`

- What it does: Renders Home and now opens Courses or `CO1003` detail from its relevant controls.
- Input: None; reads the demo session hook.
- Output: Home UI or sign-in redirect.
- Why it is written this way: Navigation is added at existing Figma affordances without altering unrelated Home content.

### `CourseCard` — `src/components/courses/course-card.tsx`

- What it does: Shows course icon, status, summary, and progress; opens `CO1003` detail.
- Input: `CourseSummary`.
- Output: One course card.
- Why it is written this way: Five cards share one layout; only the course with approved detail is interactive.

### `CoursesView` — `src/components/courses/courses-view.tsx`

- What it does: Renders the Courses header, query field, chips, scrollable cards, empty state, and fixed tab bar.
- Input: None; uses local query/filter state and `useFilteredCourses`.
- Output: Courses UI or sign-in redirect.
- Why it is written this way: Keeps UI state local and the navigation outside scroll content.

### `LessonRow` — `src/components/courses/lesson-row.tsx`

- What it does: Renders completed, active, or locked lesson rows and opens lesson 13 from Resume.
- Input: `LessonSummary`.
- Output: One lesson row.
- Why it is written this way: The repeated lesson layout has three clear states, with locked and undesigned destinations unavailable.

### `CourseDetailView` — `src/components/courses/course-detail-view.tsx`

- What it does: Renders the mint course header, progress, tabs, and lesson list with local bookmark state.
- Input: None; reads `useCourseData`.
- Output: Course detail UI or sign-in redirect.
- Why it is written this way: Matches the approved `CO1003` detail and preserves the existing demo progress numbers.

### `LessonView` — `src/components/courses/lesson-view.tsx`

- What it does: Renders lesson 13 reading content, code sample, Bytey tip, fixed footer, and local bookmark/check states.
- Input: None; reads `useCourseData`.
- Output: Lesson UI or sign-in redirect.
- Why it is written this way: Keeps reading scrollable while the approved footer remains reachable above the safe area.

### `CoursesRoute`, `CourseDetailRoute`, and `LessonRoute` — `src/app/`

- What they do: Connect `/courses`, `/course-detail`, and `/lesson` to their module root components.
- Input: None.
- Output: Screen UI.
- Why they are written this way: Expo Router routes remain thin as the architecture requires.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router | Routes and navigation controls | Existing cross-platform stack navigation. |
| React Native and safe-area-context | Three screens and fixed bars | Native scroll, text input, touch, and device insets. |
| Expo Symbols | Course and lesson controls | Existing icon approach consistent with the Figma symbol style. |
| Inter and JetBrains Mono | Course and lesson typography | Existing loaded brand fonts match the design reference. |
| React local state | Search, filter, bookmark, read checkbox | These states are local to one screen and need no added dependency. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `EXPO_OFFLINE=1 npx expo export --platform all --output-dir /private/tmp/bkpractice-courses-export`: passed; iOS, Android, web bundles and all three new static routes were generated.
- Node assertion self-check for All, status, trimmed/case-insensitive search, and empty results: passed.
- Visual tap-through on Simulator was attempted, but computer-use permission was not granted.

## Left undone

- Quiz, Ranking, Profile, Problems, Assignments, and Practice problems have no approved destination in this spec, so their visible controls remain labelled placeholders.
- Other course cards remain preview-only because only `CO1003` detail is approved.
- Demo auth and course data remain in memory/local fixtures; they do not persist or call a server.
