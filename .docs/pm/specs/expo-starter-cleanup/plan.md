# Plan: remove unused Expo starter code

Spec: [spec.md](./spec.md) (Approved)

1. Verify the installed Expo SDK version and the matching docs before changing route, config, or
   package behavior. Check references to every candidate file and asset.
2. Delete the Explore route/module, old tab navigation, demo UI components, unused starter hooks,
   and their CSS. Update the shared UI barrel and retain only theme values used by BKPractice UI.
3. Delete demo-only images while retaining every asset referenced by `app.json` or active source.
   Remove the reset script and its package script; replace the starter README with project setup.
4. Run typecheck, lint, and an Expo export for all platforms. Record any pre-existing failure and
   the exact deletions in `.docs/worker/shared/`.

Keep current splash, onboarding, and sign-in code and all unrelated worktree changes intact.
