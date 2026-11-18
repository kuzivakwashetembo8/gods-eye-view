# VS Code-style workspace UI

- **Date:** 2026-11-18
- **Time:** 21:31:12 (Africa/Johannesburg, UTC+02:00)
- **Title:** Simplify the full platform UI with cascading workspace menus
- **Developer:** GPT-6

## Intent

Apply a restrained VS Code-inspired dark workspace to the whole platform. Preserve the Cesium globe, existing feature panels, and their state owners. Add a compact horizontal menu row with hover/focus cascading submenus so existing functions are easier to discover without reimplementing their logic.

## Files touched

- `src/ui/views/WorkspaceMenuBar.vue` — adds File, View, Explore, Layers, Tools, and Help menus. Menu commands invoke existing controls.
- `src/ui/views/SceneChromeView.vue` — mounts the workspace menu in the scene chrome.
- `src/ui/styles/workspace-ui.css` — adds the neutral palette, compact cascading menus, and restrained panel styling.
- `style.css` — loads the workspace stylesheet after existing styles.
- `documentations/README.md` — indexes this log.
- `documentations/2026-11-18-vscode-style-ui.md` — this record.

## Interaction notes

Menus open on hover and keyboard focus. Nested items reveal a second menu level. Actions forward to existing panel toggles and scene controls; no feature panels are removed. Touch users can focus and activate the same menu items.

## Verification

No build, automated tests, or browser interaction test was run during this edit. Verify the deployment and menu actions in the browser after the repository update.
