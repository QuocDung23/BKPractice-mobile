# Feature specifications

Each feature specification lives in its own directory and follows this sequence:

```text
spec.md → plan.md → tasks.md → implementation
```

- `spec.md` describes WHAT is required and carries an explicit `Draft` or `Approved` status.
- `plan.md` describes HOW an approved specification will be implemented.
- `tasks.md` lists the implementation work derived from the plan.

Do not create placeholder business specifications. Do not implement a feature until its `spec.md`
is explicitly `Approved` and its `plan.md` exists. Ask before coding when the spec, the plan, or
the request is ambiguous. Resolve conflicts using the precedence in
[`working-agreement.md`](../../agent/working-agreement.md).
