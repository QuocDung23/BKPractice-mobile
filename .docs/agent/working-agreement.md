# Agent working agreement

Status: Accepted  
Date: 2026-10-24

This is the workflow agents apply to every task in this repository. [AGENTS.md](../../AGENTS.md)
routes here. Source changes follow the separate [agent rules](./rules.md). Edits to `src/`
happen only after step 1.

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
| This file | The work steps and coding gate. |
| [rules.md](./rules.md) | Rules for writing code in this repository. |
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
[.docs/pm/architecture/README.md](../pm/architecture/README.md). Apply the
[agent rules](./rules.md) while coding.

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

## Summary

```text
Read the spec, plan, architecture, and agent rules → ask when something is unclear
    → Code against the architecture
    → npx tsc --noEmit and npm run lint
    → Write .docs/worker
```
