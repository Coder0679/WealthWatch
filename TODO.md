# TODO - WealthWatch QA Playwright Autonomous Exploration

- [ ] Add Playwright helper utilities (logging console/network failures, safe navigation/crawl helpers, auth helpers, modal helpers)
- [ ] Add main headed autonomous exploration spec: tests/wealthwatch.qa.spec.ts
- [ ] Ensure selectors use role/label/text where possible; verify routing after clicks
- [ ] Validate public routes (/ , /pricing , /login , /signup)
- [ ] Validate protected routes after login (/dashboard , /transactions , /assets , /liabilities , /ai-advisor , /goals , /reports , /settings)
- [ ] Exercise UI: sidebar/mobile menu, profile dropdown, notifications button, filters/search, and modal open/close flows (add forms)
- [ ] Detect console errors and failed API requests; attach screenshots on failure
- [ ] Run tests locally in headed mode (chromium) and verify artifacts (HTML report, traces on retry, screenshots on failure)
- [ ] Update REPORT.md if needed / capture final QA findings from test output
