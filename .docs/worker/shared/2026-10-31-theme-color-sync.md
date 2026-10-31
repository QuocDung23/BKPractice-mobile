# Sync theme colors with the mobile palette

Date: 2026-10-31
Spec: n/a (shared design-token sync)
Plan: n/a

## What was done

- `src/lib/theme.ts` — aligned `BrandColors` with the mobile palette in `.docs/UI/theme-color.md`:
  all 44 mobile hex values are now present, and no value outside that palette remains.
  - Replaced non-palette values: `resultRowBackground` `#F3F8F6` → `#F1F7F5`,
    `tipBorder` `#F0F6D2` → `#E7F1ED`, `tipTitle` `#5F6431` → `#8A8F4E`,
    `tipText` `#6B7040` → `#8A8F4E`.
  - Added documented tokens: `componentBackground`, `error`, `errorBackground`,
    `errorBorder`, `splashText`, `learnHighlight`, `growText`, `signInAccent`,
    `verificationBackground`, `illustrationBackground`, `lockedBadge`.

## Functions

None. Only color tokens changed.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| TypeScript const object | `src/lib/theme.ts` | Keeps the palette as typed literal tokens already consumed across modules. |

## Checks

- `npx tsc --noEmit`: passed
- `npm run lint`: passed

## Left undone

- Hardcoded hex values in `src/components/` were not replaced with the new tokens; they are
  outside this palette-only change.
