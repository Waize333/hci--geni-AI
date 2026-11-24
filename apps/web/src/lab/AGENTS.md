# Menu lab

- Follow the repository root guidelines.
- Keep researcher help and preview controls outside the fixed experiment canvas.
- Reuse the six study menu components; do not change their geometry or logging semantics for lab-only features.
- Validate layout IDs from URL parameters against `MENU_IDS`.
- Verify lab changes with `npm run test -w @meridian/web -- test/menu-lab.test.tsx`.
