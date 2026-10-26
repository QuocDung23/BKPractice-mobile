# Agent rules

Status: Accepted
Date: 2026-10-26

These rules apply when an agent changes source code in this repository. Follow the
[working agreement](./working-agreement.md) for the work steps and coding gate. The
[architecture](../pm/architecture/README.md) defines the responsibility of each source layer.

## Keep the change small

Add only the files and lines the current spec and plan need. Leave code outside that work as it
is. When a neighboring task shows up, record it in the work note and leave its code unchanged.
Ask before adding a dependency, helper, prop, state, or piece of UI for a later need. When one
concrete function does the job, write that function.

## Explicit types

Props, parameters, return values, and API data have a concrete type. Use `unknown` for data whose
shape is not yet known, then narrow it before reading fields. Ask when a type cannot be written
without guessing. `any` and `as any` are outside this workflow.

## Names

A new Markdown file goes in a folder named for its model or domain, matching the feature name,
such as `problems` or `auth`. Inside that folder, the file name starts with the date and then the
task name:

```text
.docs/worker/problems/2026-10-24-list-problems.md
.docs/worker/auth/2026-10-24-sign-in.md
```

The date uses `YYYY-MM-DD`. The name after the date is lowercase and hyphenated. Infrastructure
work that belongs to no model goes in `.docs/worker/shared/`.

`spec.md`, `plan.md`, `tasks.md`, `README.md`, and ADRs keep their fixed names. The workflow finds
those files by those names inside the model folder at `.docs/pm/specs/<model>/`.

Name a function as a verb followed by its object, in `camelCase`: `fetchProblems`,
`createAttempt`, `filterProblems`. Rename a noun-named function before ending the task. A
component keeps a noun name because it is a piece of UI, for example `ProblemList`.

## One component per file

A parent component imports its child components. A file contains one component. The file name is
kebab-case and matches the component's role.

Put all screen UI, styles, and root components in `src/components/<module>/`. Put shared UI in
`src/components/ui/`. Do not create a `screens/` directory. Follow the folder responsibilities
in the architecture map.

## Barrel imports

Each module directory whose code is used outside the module needs an `index.ts` barrel. Export
only the components, hooks, functions, and types that belong to the module's public API. Routes
and other modules import through the `@/` alias and the module barrel, not through internal files.
For example:

```ts
// src/components/auth/index.ts
export { SignInView } from './sign-in-view';

// src/app/sign-in.tsx
import { SignInView } from '@/components/auth';
```

Within a module, use direct relative imports to avoid circular imports through its own barrel.
Prefer explicit named exports; use `export type` and `import type` for types. Do not create a
root barrel in `src/` or use `src/app/` as a barrel: `index.tsx` there is an Expo Router route.
Standalone files such as `src/lib/theme.ts` may be imported directly. Create a barrel only when
a directory has a public API used elsewhere.

## Repository tools and conventions

- Use npm and keep `package-lock.json` as the only lockfile in this base. Install dependencies with `npx expo install <package>` (add `--dev` for development tools).
- Use Expo Router for navigation. Files in `src/app/` only declare routes, read route parameters when needed, render a module's root component, or configure navigators in `_layout.tsx`. Keep screen UI, styles, and display state outside routes; providers, components, hooks, and utilities also live outside `src/app/`.
- Follow the Expo version checks, native module, CNG, and EAS rules in [AGENTS.md](../../AGENTS.md).
- React Hook Form with Zod, TanStack Query, and Zustand are frontend conventions for approved mobile features that need them. They are not installed in this base; do not add them before a feature needs them.
- Backend and socket URLs must come from environment configuration outside components. Do not hardcode them in screens. Expo public environment variables are bundled into the app and must not contain secrets.
- Place code in its Clean Architecture layer and group business-specific code by domain within that layer. Share it when a second caller needs it.
- After a source change, if the repository has a `.codegraph/` directory or another configured code index, run the re-index command documented by this repository. Do not invent a command when none is configured.
