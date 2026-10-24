# Agent working agreement

Status: Accepted  
Date: 2026-10-24

This is the workflow agents apply to every task in this repository. [AGENTS.md](../../AGENTS.md)
routes here. Edits to `src/` happen only after step 1.

## Source of truth

When documents disagree about the same behavior, stop and ask. Compare them in this order:

```text
Architecture / Accepted ADR + Approved spec.md
    > plan.md
    > tasks.md
    > assumptions made while coding
```

| Document | What it owns |
| --- | --- |
| This file | The work steps and the rules for writing code. |
| [.docs/adr/](../adr/) | Architecture decisions that affect more than one feature. Only an `Accepted` record is in force. |
| [.docs/pm/architecture/](../pm/architecture/) | The `src/` folder map and the role of each layer. |
| `.docs/pm/specs/<feature>/spec.md` | What the feature must do. Status is `Draft` or `Approved`. |
| `.docs/pm/specs/<feature>/plan.md` | How that spec is implemented. Required before coding. |
| `.docs/pm/specs/<feature>/tasks.md` | Checklist derived from the plan, when the file exists. |
| [.docs/worker/](../worker/) | The note written after coding, grouped by model. |

`spec.md` answers WHAT. `plan.md` answers HOW. `tasks.md` is the task list taken from the plan.

## Steps

### 1. Read, ask, then open the gate

Read the documents that apply to the assigned task:

1. An `Accepted` ADR in `.docs/adr/` when that decision affects the task.
2. [.docs/pm/architecture/README.md](../pm/architecture/README.md).
3. The feature `spec.md` and `plan.md`.
4. `tasks.md`, when that file exists.
5. The matching versioned Expo docs before touching an Expo, EAS, or React Native API, as required by `AGENTS.md`.

Ask the person who assigned the work, and state the objection, when the spec, the plan, or the
request in this session is still unsettled. Each question names the unclear point, the two
readings, which reading would change the code, and why the other reading conflicts with the
documents. Stop until there is an answer.

Edit `src/` only when both are true:

- `spec.md` exists and its status is `Approved`.
- `plan.md` for the same feature exists and describes how to implement that spec.

Stop when either file is missing, the spec is still `Draft`, or the spec and the plan disagree.
Writing a spec or a plan in the same turn does not allow coding yet. When `tasks.md` exists, do
the assigned items, still inside the spec and the plan.

A question or a documentation-only task stops at this step.

### 2. Code against the architecture

Place each piece in the layer defined by
[.docs/pm/architecture/README.md](../pm/architecture/README.md). Apply the rules below while coding.

### 3. Check

For the source just changed, run:

```bash
npx tsc --noEmit
npm run lint
```

Fix the code until both commands pass. Record a pre-existing error that sits outside the assigned
work in the work note, and leave that code as it is, unless this diff caused the error.

### 4. Write the work note

Every turn that changes `src/` ends with a file at `.docs/worker/<model>/YYYY-MM-DD-<name>.md`.
The section template is in [.docs/worker/README.md](../worker/README.md). The file records:

- Everything done in the turn, including files added and files edited.
- Each function added or changed: file, what the function does, its inputs, its output, and why it is written this way.
- Each technology used, and why it is used for this task.

In the session, reply briefly and point at that note. Include the commands that ran and any question still waiting for an answer.

## Rules while coding

### Keep the change small

Add only the files and lines the current spec and plan need. Leave code outside that work as it
is. When a neighboring task shows up, record it in the work note and leave its code unchanged.
Ask before adding a dependency, helper, prop, state, or piece of UI for a later need. When one
concrete function does the job, write that function.

### Explicit types

Props, parameters, return values, and API data have a concrete type. Use `unknown` for data whose
shape is not yet known, then narrow it before reading fields. Ask when a type cannot be written
without guessing. `any` and `as any` are outside this workflow.

### Names

A new Markdown file goes in a folder named for its model, the domain that matches the feature
name, such as `problems` or `auth`. Inside that folder, the file name starts with the date and
then the task name:

```text
.docs/worker/problems/2026-10-24-list-problems.md
.docs/worker/auth/2026-10-24-sign-in.md
```

The date uses `YYYY-MM-DD`. The name after the date is lowercase and hyphenated. Infrastructure work
that belongs to no model goes in `.docs/worker/shared/`.

`spec.md`, `plan.md`, `tasks.md`, `README.md`, and ADRs keep their fixed names. The workflow finds
those files by those names, inside the model folder at `.docs/pm/specs/<model>/`.

Name a function as a verb followed by its object, in `camelCase`: `fetchProblems`,
`createAttempt`, `filterProblems`. Rename a noun-named function before ending the task. A
component keeps a noun name because it is a piece of UI, for example `ProblemList`.

### One component per file

A parent component imports its child components. A file contains one component. The file name is
kebab-case and matches the component's role.

Group domain-specific UI under `src/components/<domain>/` and shared UI under
`src/components/ui/`. Follow the folder responsibilities in the architecture map.

### Repository tools

- Use npm and keep `package-lock.json` as the only lockfile in this base. Install dependencies with `npx expo install <package>` (add `--dev` for development tools).
- Use Expo Router for navigation. Only routes and `_layout.tsx` navigator layouts belong in `src/app/`; providers, components, hooks, and utilities live outside it.
- Follow the Expo version checks, native-module, CNG, and EAS rules in `AGENTS.md`.
- React Hook Form with Zod, TanStack Query, and Zustand are the frontend conventions to follow when an approved mobile feature needs those tools. They are not installed in this base; do not add them before a feature needs them.
- Backend and socket URLs must come from environment configuration outside components. Do not hardcode them in screens. Expo public environment variables are bundled into the app and must not contain secrets.
- Place code in its Clean Architecture layer and group business-specific code by domain within that layer. Share it when a second caller needs it.
- After a source change, if the repository has a `.codegraph/` directory or another configured code index, run the re-index command documented by this repository. Do not invent a command when none is configured.

## Summary

```text
Read the spec, plan, and architecture → ask when something is unclear
    → Code against the architecture, inside the rules
    → npx tsc --noEmit and npm run lint
    → Write .docs/worker
```
