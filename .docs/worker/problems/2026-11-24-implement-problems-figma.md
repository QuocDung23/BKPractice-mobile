# Implement problems from Figma

Date: 2026-11-24  
Spec: .docs/pm/specs/learning/problems/spec.md (Approved)  
Plan: .docs/pm/specs/learning/problems/plan.md

## What was done

- `src/domain/problems/problem.ts` and `index.ts` — added published-problem, detail, and repository types for the live API response.
- `src/lib/problems/problem-repository.ts` and `index.ts` — added validated decoding for public problem pages/details and learner solved status; requests use the existing authenticated learning client.
- `src/hooks/problems/use-problem-data.ts` and `index.ts` — added hooks for server-filtered problem pages and detail lookup. The prior demo hook remains only for the separate submission-result preview.
- `src/components/problems/problem-list-view.tsx` and `problem-row.tsx` — connected difficulty filters and pagination to API data, opened every row by its real problem ID, and removed unsupported sequence numbers, acceptance rates, and inferred in-progress states.
- `src/components/problems/problem-detail-view.tsx` and `src/app/problem-detail.tsx` — read the Figma detail layout from the selected ID/slug, show server statement/examples/constraints/limits/status, and keep loading, retryable error, forbidden, not-found, and signed-out states distinct.
- `src/components/problems/submission-result-view.tsx` — changed the hook import to the module barrel; the screen itself remains outside this feature.

API mapping checked against the adjacent backend source:

- `GET /api/problems?page=<page>&limit=20&difficulty=<EASY|MEDIUM|HARD>` returns `items`, `total`, `page`, and `limit`. Summary `id`, `slug`, `title`, `difficulty`, and topic names are used; the page `limit` maps to the mobile `pageSize` field.
- `GET /api/problems/:idOrSlug` returns the statement, examples, nullable constraints, and execution limits in milliseconds/megabytes. The response must match the requested ID or slug.
- `GET /api/progress/me/problems/status?problemIds=<comma-separated UUIDs>` returns `problemId`, `solved`, and nullable `solvedAt` in request order. The client validates each ID before attaching status. `solved: false` is shown as “Not solved”; it is not treated as “Not Attempted”.
- The public problem API does not return sequence numbers or acceptance percentages. Those Figma/demo-only fields are not shown. Submission history/results remain disabled from the detail screen until the separate Submissions flow supplies real data.

## Functions

### `readUuid` — `src/lib/problems/problem-repository.ts`

- What it does: Validates a problem UUID from an API response and normalizes its case.
- Input: Unknown API value.
- Output: A validated lowercase UUID string.
- Why it is written this way: The progress status endpoint only accepts UUIDs.

### `readDifficulty` — `src/lib/problems/problem-repository.ts`

- What it does: Converts the backend difficulty enum into the existing UI labels.
- Input: Unknown API value.
- Output: `Easy`, `Medium`, or `Hard`.
- Why it is written this way: Keeps backend enum casing out of the UI.

### `readProblem` — `src/lib/problems/problem-repository.ts`

- What it does: Reads the public fields needed by problem rows.
- Input: Unknown API value.
- Output: A published problem without learner status.
- Why it is written this way: Validates only fields rendered by this screen and ignores unrelated DTO fields.

### `readProblemDetail` — `src/lib/problems/problem-repository.ts`

- What it does: Reads the public detail fields used by the Figma screen.
- Input: Unknown API value.
- Output: Detail without learner status, including execution limits.
- Why it is written this way: Rejects missing/malformed server fields instead of substituting demo values.

### `readSolvedStatus` — `src/lib/problems/problem-repository.ts`

- What it does: Reads a learner's solved flag and validates its optional solve date.
- Input: Unknown API value.
- Output: Problem UUID and solved boolean.
- Why it is written this way: The UI does not infer attempt state from a false solved flag.

### `getSolvedStatuses` — `src/lib/problems/problem-repository.ts`

- What it does: Fetches solved status for the requested problem IDs and checks order/identity.
- Input: Access token and UUID list.
- Output: Solved flags in the same order as the requested IDs.
- Why it is written this way: The endpoint is user-scoped and returns statuses in input order.

### `problemRepository.list` — `src/lib/problems/problem-repository.ts`

- What it does: Loads one published problem page and its solved statuses.
- Input: Access token, page, and difficulty filter.
- Output: A page of published problems with verified progress.
- Why it is written this way: Uses server filtering and pagination and does not report success if the status request fails.

### `problemRepository.get` — `src/lib/problems/problem-repository.ts`

- What it does: Loads one problem by ID or slug and its solved status.
- Input: Access token and requested ID/slug.
- Output: The matching detail with verified progress.
- Why it is written this way: Prevents a mismatched or static detail from being shown for a different row.

### `usePublishedProblems` and `usePublishedProblem` — `src/hooks/problems/use-problem-data.ts`

- What they do: Connect list/detail requests to the existing authenticated request lifecycle.
- Input: Page/filter or ID/slug.
- Output: `LearningRequestResult` with loading, success, error, and retry state.
- Why they are written this way: Reuses the current session, access-token refresh, and retry behavior.

### `ProblemListView` — `src/components/problems/problem-list-view.tsx`

- What it does: Renders the paginated, difficulty-filtered published problem list.
- Input: Session state and local page/filter state.
- Output: List, empty, loading, retryable-error, forbidden, not-found, or sign-in state.
- Why it is written this way: The UI only displays rows after both problem and progress requests succeed.

### `ProblemRow` — `src/components/problems/problem-row.tsx`

- What it does: Renders one API problem row and opens that problem's detail route.
- Input: A `PublishedProblem`.
- Output: A tappable row with difficulty, topics, and solved state.
- Why it is written this way: Each row carries its real ID into navigation.

### `formatTimeLimit` and `ProblemDetailView` — `src/components/problems/problem-detail-view.tsx`

- What they do: Format server milliseconds as seconds when exact, and render the selected problem detail.
- Input: Millisecond limit; detail route ID/slug and request state.
- Output: The Figma detail layout with server content and access/error states.
- Why they are written this way: Values with no backend source are omitted, and long content remains in a native scroll view.

### `ProblemDetailRoute` — `src/app/problem-detail.tsx`

- What it does: Reads the `idOrSlug` route parameter and renders the detail root.
- Input: Expo Router local search params.
- Output: Problem detail or redirect to the problem list if the parameter is missing.
- Why it is written this way: Keeps the route thin and passes the selected identity through the URL.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router | Detail route and row navigation | Preserves the current route and passes the selected problem ID. |
| React Native and NativeWind | List/detail components | Reuses the app's native UI and styling system for iOS, Android, and web. |
| Existing learning HTTP client | Problem repository | Reuses bearer tokens, refresh behavior, API errors, and response validation. |
| Existing learning request hook | Problem hooks | Reuses session gating, loading/error state, cancellation, and retry behavior. |

## Checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- Native device tap-through: not run in this turn.

## Left undone

- The search affordance remains disabled; search is outside the linked detail frame and was not required by the approved problem spec.
- The separate `/submission-result` preview still uses the legacy demo fixture. The problem detail screen no longer links to it, and its production implementation belongs to the approved Submissions spec/plan.
