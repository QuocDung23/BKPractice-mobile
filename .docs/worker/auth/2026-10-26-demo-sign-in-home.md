# Demo sign-in and Home

Date: 2026-10-26  
Spec: .docs/pm/specs/auth/spec.md (Approved)  
Plan: .docs/pm/specs/auth/plan.md

## What was done

- `src/domain/auth/demo-session.ts` - added a concrete session model and the exact demo credential rule.
- `src/lib/auth/demo-student.ts` - added the one typed temporary student and Home dataset from the approved spec.
- `src/stores/auth-session.tsx` - added in-memory session state shared by sign-in and Home.
- `src/hooks/auth/use-demo-sign-in.ts` - added validation, inline error feedback, session creation, and navigation on success.
- `src/hooks/auth/use-home-data.ts` - connected Home to the shared session.
- `src/components/auth/sign-in-view.tsx` - changed the first field to numeric Student ID and connected the approved demo flow while preserving the other controls.
- `src/components/home/home-view.tsx` and `index.ts` - added the Figma-based Home UI and its public module export.
- `src/app/home.tsx` - added a thin Home route.
- `src/components/navigation/root-navigation.tsx` - provided auth state to routes and registered Home.
- `src/lib/theme.ts` - added the Home accent colors documented in `.docs/UI/theme-color.md`.

## Functions

### `authenticateDemoStudent` - `src/domain/auth/demo-session.ts`

- What it does: Checks the one approved demo credential pair.
- Input: Student ID and password strings.
- Output: Boolean match result.
- Why it is written this way: Keeps credential rules outside UI and does not return the password with student data.

### `createDemoSession` - `src/lib/auth/demo-student.ts`

- What it does: Returns the temporary student and Home data.
- Input: None.
- Output: `DemoSession`.
- Why it is written this way: One local typed response can later be replaced by a real data source.

### `AuthSessionProvider` and `useAuthSession` - `src/stores/auth-session.tsx`

- What they do: Hold and expose the temporary signed-in session across routes.
- Input: Provider children; `useAuthSession` takes no input.
- Output: Rendered provider; session state and setter.
- Why they are written this way: React Context is already available and avoids a new state dependency for two consumers.

### `useDemoSignIn` and `submitSignIn` - `src/hooks/auth/use-demo-sign-in.ts`

- What they do: Manage inline feedback, reject empty or incorrect credentials, set the demo session, and replace sign-in with Home.
- Input: The hook takes none; `submitSignIn` takes Student ID and password strings.
- Output: Feedback and form actions; `submitSignIn` returns void.
- Why they are written this way: Keeps form behavior outside screen markup and uses the existing Expo Router navigation convention.

### `useHomeData` - `src/hooks/auth/use-home-data.ts`

- What it does: Reads the session for Home.
- Input: None.
- Output: `DemoSession` or null.
- Why it is written this way: The Home UI receives data through a hook rather than accessing store details directly.

### `SignInView` - `src/components/auth/sign-in-view.tsx`

- What it does: Renders the existing form with a Student ID field and mock sign-in feedback.
- Input: No props; uses local field state and `useDemoSignIn`.
- Output: Sign-in screen UI.
- Why it is written this way: Preserves the approved sign-in design and controls while changing only the requested login behavior.

### `HomeView` - `src/components/home/home-view.tsx`

- What it does: Renders the Figma Home structure from the mock session and redirects an unsigned visitor to sign-in.
- Input: No props; reads `useHomeData`.
- Output: Home screen UI or redirect.
- Why it is written this way: Keeps screen UI in its module and separates scrolling content from the bottom bar. Other tabs and content CTAs are visual placeholders because their destinations are outside this spec.

### `HomeRoute` - `src/app/home.tsx`

- What it does: Connects `/home` to `HomeView`.
- Input: None.
- Output: `HomeView`.
- Why it is written this way: Keeps Expo Router files thin.

### `RootNavigation` - `src/components/navigation/root-navigation.tsx`

- What it does: Loads the existing fonts, renders the navigator, and now wraps it in the auth session provider with the Home route registered.
- Input: None.
- Output: Root navigation UI.
- Why it is written this way: The provider remains mounted while navigating between sign-in and Home.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router | Sign-in, Home, root navigation | Typed route and replacement navigation across platforms. |
| React Context | Session store | Share one temporary in-memory result without a new dependency. |
| React Native and safe-area-context | Sign-in and Home | Mobile layout, keyboard behavior, scrolling, and safe areas. |
| Expo Symbols, Inter, JetBrains Mono | Home | Reuse installed icons and typography matching the Figma reference. |

## Checks

- `npx expo customize tsconfig.json`: regenerated Expo Router's local route types for `/home` without changing `tsconfig.json`.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `EXPO_OFFLINE=1 npx expo export --platform all --output-dir /private/tmp/bkpractice-auth-export`: passed for iOS, Android, and web; `/home` is in the exported routes.
- Node assertion self-check: correct, wrong, and empty credential cases; expected mock values; password absent from returned student data. Passed.
- `git diff --check`: passed.
- Live visual tap-through was not completed. The in-app browser was unavailable and computer-use permission for Chrome was denied.

## Left undone

- The Home tabs, All courses label, and Start quiz pill are visual placeholders until those destinations have approved specs.
- Session state is in memory only. The existing Remember me control does not persist login across app restarts.
- The circular progress ring is a native view approximation of the 68% Figma arc; the number and other data are exact.
