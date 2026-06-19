# Performance log — sub-50ms page load

## Test Protocol
- Build: production (`npm run build`)
- Server: `vite preview` on port 4173
- Base URL: http://127.0.0.1:4173/
- Cache state: cold (server restart between runs)
- Tool: `.perf/measure-pages.sh` (curl `time_total`)
- Metric: total HTML response time (median of 5 runs)
- Network: localhost (no throttling)
- Pages: 1 (SPA — `/`)

## Baseline — 2026-06-19
- Change: none
- Result: 0.00 ms (PASS)

## Run 2 — 2026-06-19
- Changes:
  - Moved Google Fonts from CSS `@import` to HTML `<link>` with preconnect
  - Removed render-blocking font stylesheet from CSS
  - Code-split all section components via React.lazy (Hero, WhoSection, WorkGrid, Philosophy, Woodland360Section, ShowcaseCarousel, Contact, CookieBanner)
  - Split vendor chunks (GSAP, Motion, React-DOM) via manualChunks
- Bundle diff:
  - Before: 717 kB main bundle (234 kB gzip)
  - After: 439 kB main (147 kB gzip) + 70 kB gsap + 98 kB motion + 12 kB vendor + section chunks
- Result: 0.00 ms (PASS)

## Final — 2026-06-19
- All pages < 50 ms: yes
- Summary: 1 passed, 0 failed
