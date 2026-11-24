# Filter chapter problems by difficulty

Date: 2026-11-24
Spec: .docs/pm/specs/learning/chapters/spec.md (Approved)
Plan: .docs/pm/specs/learning/chapters/plan.md

## What was done

- `src/components/chapters/chapter-detail-header.tsx` — aligns the Problem difficulty filter icon to the right of the Problems/Quizzes tabs.
- `src/components/chapters/chapter-activity-list.tsx` — shows All, Easy, Medium, and Hard options above the Problem list when the icon is active; filters problems case-insensitively by the backend difficulty value.

## Functions

### `ChapterDetailHeader` — `src/components/chapters/chapter-detail-header.tsx`

- What it does: renders the Problem difficulty filter icon in the activity tab row.
- Input: active tab, difficulty selection/open state, and callbacks.
- Output: tabs on the left and the filter icon at the right while Problems is selected.
- Why it is written this way: the control stays visually connected to the Problems tab without occupying list space when closed.

### `ChapterActivityList` — `src/components/chapters/chapter-activity-list.tsx`

- What it does: renders the selected activity list and the open difficulty options.
- Input: chapter data, active tab, difficulty selection/open state, and selection callback.
- Output: difficulty chips above the Problem list, or the Quiz list when that tab is active.
- Why it is written this way: the options appear just before the list they filter and disappear when closed.

### `ProblemList` — `src/components/chapters/chapter-activity-list.tsx`

- What it does: filters the chapter's problems by the selected difficulty while preserving API order.
- Input: chapter data and All/Easy/Medium/Hard selection.
- Output: matching Problem cards or an empty state that distinguishes an empty chapter from no matches.
- Why it is written this way: difficulty comes from the existing chapter response and may differ in letter case.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| `expo-symbols` `SymbolView` | `chapter-activity-list.tsx` | Renders a platform-specific filter/tune icon without adding dependencies. |
| React state | `ChapterActivityList` | Keeps filter selection local to the chapter activity list. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.

## Left undone

- None.
