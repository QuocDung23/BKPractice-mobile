# Quiz demo flow

Date: 2026-10-27
Spec: .docs/pm/specs/quiz/spec.md (Approved)
Plan: .docs/pm/specs/quiz/plan.md

## What was done

- `src/domain/quiz/quiz.ts`, `src/domain/quiz/index.ts` — added typed quiz list, question, answer, review, and result models.
- `src/lib/quiz/demo-quiz.ts`, `src/lib/quiz/index.ts` — added the fixed Figma demo content and reused the existing course and lesson titles.
- `src/hooks/quiz/use-quiz-data.ts`, `src/hooks/quiz/index.ts` — exposed the fixture only for the signed-in demo session.
- `src/components/quiz/quiz-list-card.tsx`, `quiz-list-view.tsx`, `quiz-question-view.tsx`, `quiz-review-row.tsx`, `quiz-result-view.tsx`, `index.ts` — added the three mobile Quiz screens, selectable answer state, fixed result snapshot, and preview-only rows.
- `src/app/quizzes.tsx`, `quiz-question.tsx`, `quiz-result.tsx` — added thin Expo Router entry points.
- `src/components/navigation/bottom-navigation.tsx`, `root-navigation.tsx` — enabled the Quiz tab and registered the three routes.
- `src/components/home/home-view.tsx` — connected Start quiz to the sample question.

## Functions

### `useQuizData` — `src/hooks/quiz/use-quiz-data.ts`

- What it does: returns the fixed quiz data when the demo session exists.
- Input: the current auth session through `useHomeData`.
- Output: `QuizData` or `null`.
- Why it is written this way: keeps fixture access and the signed-in guard outside the screen components.

### `QuizListCard` — `src/components/quiz/quiz-list-card.tsx`

- What it does: renders an assigned quiz card and opens the sample question when available.
- Input: a `QuizSummary` prop.
- Output: a card with icon, title, course, duration, question count, and badge.
- Why it is written this way: the two cards share one layout while the second stays preview-only.

### `QuizListView` — `src/components/quiz/quiz-list-view.tsx`

- What it does: renders the Quiz list with XP, selectable tabs, assigned cards, empty states, and bottom navigation.
- Input: the signed-in quiz data and local selected tab state.
- Output: the list screen or sign-in redirect.
- Why it is written this way: tab state is local because the demo has no persistence or quiz service.

### `QuizQuestionView` — `src/components/quiz/quiz-question-view.tsx`

- What it does: renders the fixed sample question, tracks one selected answer, and opens the result after submission.
- Input: quiz data and local selected answer state.
- Output: the question screen or sign-in redirect.
- Why it is written this way: the submit action is disabled until a choice is selected; the timer and score remain fixed per spec.

### `QuizReviewRow` — `src/components/quiz/quiz-review-row.tsx`

- What it does: renders one numbered review summary with its correct or incorrect icon.
- Input: a `QuizReview` prop.
- Output: a noninteractive review row.
- Why it is written this way: review details are outside the approved demo scope.

### `QuizResultView` — `src/components/quiz/quiz-result-view.tsx`

- What it does: renders the fixed score, XP, metrics, review summary, Done, and Retry actions.
- Input: quiz data and the signed-in student's greeting name.
- Output: the result screen or sign-in redirect.
- Why it is written this way: the visual snapshot is fixed and Retry starts a fresh question screen.

### `QuizzesRoute`, `QuizQuestionRoute`, `QuizResultRoute` — `src/app/quizzes.tsx`, `quiz-question.tsx`, `quiz-result.tsx`

- What they do: connect URLs to the corresponding quiz root components.
- Input: no route parameters.
- Output: one screen component each.
- Why they are written this way: Expo Router route files stay thin.

### `BottomNavigation` — `src/components/navigation/bottom-navigation.tsx`

- What it does: renders the shared five-item navigation and opens Quiz List from the Quiz tab.
- Input: the active tab name.
- Output: the bottom navigation bar.
- Why it is written this way: Home, Courses, and Quiz use the same navigation component; unsupported tabs remain disabled.

### `RootNavigation` — `src/components/navigation/root-navigation.tsx`

- What it does: registers the three quiz routes in the app stack.
- Input: loaded fonts and auth provider state.
- Output: the app navigator.
- Why it is written this way: quiz routes follow the existing navigation setup.

### `HomeView` — `src/components/home/home-view.tsx`

- What it does: opens the sample quiz question from the existing Start quiz control.
- Input: signed-in Home and course data.
- Output: the Home screen with a working quiz action.
- Why it is written this way: the approved flow starts from Home as well as Quiz List.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router | Quiz routes and navigation actions | Connect the approved mobile flow using the app's existing navigator. |
| React Native | Quiz screen components | Render accessible, scrollable layouts and touch controls on iOS and Android. |
| `react-native-safe-area-context` | Quiz root screens | Keep headers and fixed actions inside device safe areas. |
| `expo-symbols` | Quiz cards, controls, and results | Reuse the icon approach already installed in the app. |
| Local TypeScript fixture | Quiz domain, lib, and hook | Match the approved visual demo without adding a backend or scoring engine. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- Web build and web visual validation were stopped at the user's request; no mobile simulator visual inspection was available in this session.

## Left undone

- Live countdown, full quiz sequence, real scoring, XP updates, and review details are outside the approved demo scope.
