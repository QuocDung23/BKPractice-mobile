# Work notes

Every turn that changes `src/` ends with a file here. The workflow is
[`../agent/working-agreement.md`](../agent/working-agreement.md).

Group files by model, using the feature name. The file name starts with the date, then the task
name:

```text
.docs/worker/
├── problems/
│   └── 2026-10-24-list-problems.md
├── auth/
│   └── 2026-10-24-sign-in.md
└── shared/
    └── 2026-10-24-setup-query-client.md
```

The date uses `YYYY-MM-DD`. The name after the date is lowercase and hyphenated. Work that belongs
to no model goes in `shared/`.

Use these sections.

```markdown
# <Task name>

Date: YYYY-MM-DD
Spec: .docs/pm/specs/<feature>/spec.md (Approved)
Plan: .docs/pm/specs/<feature>/plan.md

## What was done

- `<file path>` — what was added or changed, and which part of the spec it covers.

## Functions

### `<function name>` — `<file path>`

- What it does:
- Input:
- Output:
- Why it is written this way:

Repeat one section for every function added or changed. Record a component here too: its name,
file, props, and what it renders.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| <name> | <file or task> | <reason tied to the spec, the plan, or the architecture> |

## Checks

- `npx tsc --noEmit`:
- `npm run lint`:

## Left undone

- Work noticed while coding that sits outside the spec and the plan.
```
