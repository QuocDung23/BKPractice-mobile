# Distinguish completed quizzes in chapter

Date: 2026-11-24
Spec: .docs/pm/specs/learning/chapters/spec.md (Approved)
Plan: .docs/pm/specs/learning/chapters/plan.md

## What was done

- `src/components/courses/course-detail-view.tsx` — derives completed Quiz IDs from the current course's loaded progress response.
- `src/components/chapters/chapter-detail-view.tsx` — passes completed Quiz IDs to the activity list.
- `src/components/quiz/quiz-list.tsx` — uses a mint check-circle for completed quizzes and a green play-circle for quizzes not yet completed.

## Functions

### `CourseDetailView` — `src/components/courses/course-detail-view.tsx`

- What it does: derives completed quiz identifiers from progress items of type `QUIZ`.
- Input: course detail and progress response already loaded by the course screen.
- Output: a set of completed quiz IDs for the selected chapter.
- Why it is written this way: completion is matched by backend IDs instead of guessing from quiz visibility or card state.

### `ChapterDetailView` — `src/components/chapters/chapter-detail-view.tsx`

- What it does: forwards completion data to the quiz list.
- Input: chapter, course title, completed quiz IDs, and back callback.
- Output: chapter content with completion state available to each quiz card.
- Why it is written this way: it keeps course loading/progress ownership in the course screen.

### `QuizList` — `src/components/quiz/quiz-list.tsx`

- What it does: renders one of two status icons for each quiz.
- Input: chapter quizzes and completed quiz IDs.
- Output: a mint check-circle for completed quizzes or a green play-circle for incomplete quizzes beside each title.
- Why it is written this way: both states stay easy to distinguish while retaining the existing card layout.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Existing course progress contract | `course-detail-view.tsx` | Supplies completed activity IDs without another request. |
| `expo-symbols` | `chapter-activity-list.tsx` | Provides platform-specific completion symbols. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.

## Left undone

- None.
