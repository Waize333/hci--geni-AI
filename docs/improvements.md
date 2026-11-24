# Interface improvements

This version retains the upstream experiment logic, scoring rules, taxonomy, API,
menu geometry, participant consent, and researcher console.

The homepage is a responsive entry point with six selectable image previews. The
“Try this design” link opens `/lab?menu=A` through `F`. These are preview images;
the linked lab contains the live interactive menus. Unknown query values fall
back to menu A. The lab offers per-layout guidance, comparison, and restart.

Participants enter through researcher-issued `/join/<link>` URLs. The homepage
links to the lab rather than labelling the admin login as a participant start.
It only offers saved-session continuation for an active locally saved run.
The study target is about 15 minutes; timing depends on the participant.

All assets remain local. No external font or image service was added. The landing
page respects browser font settings, wraps on small screens, has a skip link,
visible focus indicators, and native expandable questions. The experiment canvas
retains the original dimensions for consistent study measurements.

## Verification

```sh
npm ci
npm run build
npm test
npm run test:deploy
npm run test:coverage
```

For interactive verification, run `npm run dev`, visit `/`, change each preview,
follow its lab link, navigate to a product, and restart the preview. Resize the
homepage to check that navigation, cards, and actions wrap. Existing Playwright
acceptance suites are available with `npm run test:e2e` while the app runs.

## Verified for this revision

- Production build and taxonomy validation pass (all 432 taxonomy paths valid).
- Unit/regression suites: 397 passing tests across all five workspaces.
- Scoring coverage: 100% statements, branches, functions, and lines.
- Deployment configuration check passes.
- Browser checks: preview selection, matching lab link, live radial navigation,
  and restart; homepage checked at desktop and 390px mobile width without
  horizontal overflow.

Camera hardware accuracy and the exhaustive Playwright acceptance suite were not
revalidated for this interface revision.

This remains a research prototype. The upstream ethics/content and biometric
validation limitations documented in the root README still apply.
