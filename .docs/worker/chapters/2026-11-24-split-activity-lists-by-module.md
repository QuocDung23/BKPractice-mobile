# Split activity lists by module

Date: 2026-11-24
Spec: .docs/pm/specs/learning/chapters/spec.md (Approved)
Plan: .docs/pm/specs/learning/chapters/plan.md

## What was done

- `src/components/problems/problem-list.tsx` — moves the chapter Problem cards, difficulty matching, and empty state into the Problem module.
- `src/components/quiz/quiz-list.tsx` — moves the chapter Quiz cards and completion icons into the Quiz module.
- `src/components/problems/index.ts` and `src/components/quiz/index.ts` — expose each list through its module barrel.
- `src/components/chapters/chapter-activity-list.tsx` — delegates to the Problem and Quiz modules, keeping only chapter activity selection and difficulty controls.
- `src/components/chapters/chapter-detail-header.tsx`, `src/components/chapters/chapter-detail-view.tsx`, and `src/components/chapters/constant.ts` — reuse the existing domain `ProblemFilter` type.

## Functions

### `ProblemList` — `src/components/problems/problem-list.tsx`

- What it does: renders filtered chapter problems and the corresponding empty state.
- Input: chapter problems and the selected difficulty filter.
- Output: ordered Problem cards or an empty state.
- Why it is written this way: Problem presentation now belongs to the Problem module as requested.

### `QuizList` — `src/components/quiz/quiz-list.tsx`

- What it does: renders chapter quizzes with completed/incomplete icons.
- Input: chapter quizzes and completed quiz IDs.
- Output: ordered Quiz cards with the existing completion state.
- Why it is written this way: Quiz presentation now belongs to the Quiz module as requested.

### `ChapterActivityList` — `src/components/chapters/chapter-activity-list.tsx`

- What it does: renders the difficulty controls and selects the relevant module list.
- Input: chapter data, active tab, filter state, and completed quiz IDs.
- Output: Problem or Quiz module component.
- Why it is written this way: chapter code coordinates the two lists while each module owns its own UI.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Module barrel exports | Problem and Quiz components | Lets other modules import public components without reaching into internal files. |
| `ProblemFilter` domain type | Chapter and Problem components | Reuses the existing difficulty filter contract. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.

## Left undone

- None.
