# Problem practice and submission result demo

Date: 2026-10-26  
Spec: .docs/pm/specs/problems/spec.md (Approved)  
Plan: .docs/pm/specs/problems/plan.md

## What was done

- `src/domain/problems/problem.ts` and `index.ts` — added typed problem, filter, detail, and submission result models and the difficulty filter.
- `src/lib/problems/demo-problems.ts` — added the seven Figma problem rows, Balanced Brackets statement/examples/constraints, and Accepted submission fixture. The course code and 24/40 total come from the existing `CO1003` fixture.
- `src/hooks/problems/use-problem-data.ts` — exposes the local dataset only for a signed-in demo session and filters its list.
- `src/components/problems/problem-row.tsx`, `problem-list-view.tsx`, `problem-detail-view.tsx`, `submission-result-view.tsx`, and `index.ts` — added the three Figma screens with badges, filtered rows, read-only detail, result metrics/test cases/code preview, fixed footers, and safe areas.
- `src/app/problems.tsx`, `problem-detail.tsx`, and `submission-result.tsx` — added thin Expo Router routes.
- `src/components/navigation/root-navigation.tsx` — registered the three routes in the existing stack.
- `src/components/courses/course-detail-view.tsx` and `lesson-view.tsx` — connected the Problems tab and Practice problems button to the list.
- `src/lib/theme.ts` — added hard, result row, and code text colors from `.docs/UI/theme-color.md`.

## Functions

### `filterProblems` — `src/domain/problems/problem.ts`

- What it does: Selects problems by difficulty or returns all problems.
- Input: Readonly `ProblemSummary` list and `ProblemFilter`.
- Output: Matching `ProblemSummary[]`.
- Why it is written this way: Keeps the filter independent of UI and easy to validate.

### `useProblemData` and `useFilteredProblems` — `src/hooks/problems/use-problem-data.ts`

- What they do: Gate the demo fixture on the existing signed-in session; expose the selected difficulty subset.
- Input: None for `useProblemData`; selected `ProblemFilter` for `useFilteredProblems`.
- Output: `ProblemData | null`; filtered `ProblemSummary[] | null`.
- Why they are written this way: Screen components do not read the auth store or fixture implementation directly.

### `ProblemRow` — `src/components/problems/problem-row.tsx`

- What it does: Renders one problem with attempt icon, difficulty, acceptance, topic, and chevron; opens Balanced Brackets.
- Input: `ProblemSummary` prop.
- Output: A problem row UI.
- Why it is written this way: Repeated rows share the same layout; undesigned details remain preview-only.

### `ProblemListView` — `src/components/problems/problem-list-view.tsx`

- What it does: Shows the CO1003 problem count, difficulty chips, and scrollable mock list.
- Input: None; reads the problem data hook and local filter state.
- Output: Problem List UI or sign-in redirect.
- Why it is written this way: The Figma layout separates the fixed heading from the scrolling cards.

### `ProblemDetailView` — `src/components/problems/problem-detail-view.tsx`

- What it does: Shows the read-only Balanced Brackets statement, examples, constraints, information panel, and Results footer.
- Input: None; reads the problem data hook.
- Output: Problem Detail UI or sign-in redirect.
- Why it is written this way: Matches the approved mobile reading flow without inventing an editor or a web URL.

### `SubmissionResultView` — `src/components/problems/submission-result-view.tsx`

- What it does: Shows the Accepted fixture, runtime/memory/test metrics, five visible cases, code preview, and footer.
- Input: None; reads the problem data hook.
- Output: Submission Result UI or sign-in redirect.
- Why it is written this way: Keeps the summary `7/7` while displaying only the five case rows actually specified by Figma.

### `ProblemsRoute`, `ProblemDetailRoute`, and `SubmissionResultRoute` — `src/app/`

- What they do: Connect `/problems`, `/problem-detail`, and `/submission-result` to their module root components.
- Input: None.
- Output: Each screen's UI.
- Why they are written this way: Route files remain thin per the architecture.

### `RootNavigation` — `src/components/navigation/root-navigation.tsx`

- What it does: Renders the existing navigator with three new problem routes registered.
- Input: None.
- Output: Root navigation UI or null while fonts load.
- Why it is written this way: New screens share the already mounted auth session and stack.

### `CourseDetailView` — `src/components/courses/course-detail-view.tsx`

- What it does: Keeps the existing course detail UI and makes its Problems tab open Problem List.
- Input: None; reads existing course data.
- Output: Course Detail UI or sign-in redirect.
- Why it is written this way: The newly approved Problems destination replaces its earlier placeholder.

### `LessonView` — `src/components/courses/lesson-view.tsx`

- What it does: Keeps the existing lesson UI and makes Practice problems open Problem List.
- Input: None; reads existing course data.
- Output: Lesson UI or sign-in redirect.
- Why it is written this way: Connects the approved lesson CTA to the new problem flow.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router | Three routes and navigation controls | Reuses the existing cross-platform stack and back navigation. |
| React Native and safe-area-context | Three problem screens | Native scrolling, touch controls, fixed footers, and device insets. |
| Expo Symbols | Status, navigation, and action icons | Matches the project's installed icon approach and Figma's rounded symbols. |
| Inter and JetBrains Mono | Screen typography | Reuses loaded brand fonts for UI text, metadata, and code. |
| React local state | Difficulty chips | A screen-local selection needs no added store or dependency. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `EXPO_OFFLINE=1 npx expo export --platform all --output-dir /private/tmp/bkpractice-problems-export`: passed for iOS, Android, and web; all three new routes appear in the static export.
- Node assertion self-check for All, Medium, and Hard difficulty filtering: passed.
- Figma design context and screenshots for nodes `80:6366`, `80:6532`, and `80:6634` were checked before implementation. No external static assets were provided by these nodes.
- Live device tap-through was not completed because computer-use permission for Simulator was denied in the prior course implementation turn.

## Left undone

- Other problem rows are preview-only because only Balanced Brackets detail is approved.
- Search remains a labelled affordance; no search state is designed in this frame.
- Open on Web is visibly disabled and labelled unavailable until a real URL is supplied.
- The result fixture has five displayed case rows and a `7/7` summary, as shown in Figma. The code preview is the visible partial snippet, not a runnable solution.
