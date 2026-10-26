# Engineering documentation

This directory contains architecture documentation and Architecture Decision Records (ADRs).
Architecture documents define cross-cutting constraints and take precedence over implementation
assumptions.

Use [`adr/`](./adr/) for durable decisions that affect more than one feature. Keep feature behavior
in [`pm/specs/`](./pm/specs/), not in an ADR.

The Clean Architecture folder map, including the role of `app`, `components`, `domain`,
`stores`, `hooks`, and `lib`, lives in [`pm/architecture/`](./pm/architecture/).

[`AGENTS.md`](../AGENTS.md) summarizes the workflow and points agents at the documents in this
directory. The steps they apply live in [`agent/working-agreement.md`](./agent/working-agreement.md),
and the source coding rules live in [`agent/rules.md`](./agent/rules.md).

After a change to `src/`, the work note for that change lives in [`worker/`](./worker/).
