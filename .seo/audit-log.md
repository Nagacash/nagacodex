# SEO/GEO Audit Log — 2026-06-19

## Crawlability — Fail (production)
- robots.txt on live domain: `Disallow: /` (Hostinger parked)
- sitemap.xml returns 200 but domain is not the app

## Crawlability — Pass (codebase after fix)
- public/robots.txt allows all + sitemap reference
- public/sitemap.xml lists canonical homepage

## Indexation — Fail (production)
- Live homepage: `noindex, nofollow, noarchive, nosnippet`

## Indexation — Pass (codebase)
- index.html: `index, follow, max-image-preview:large`
- canonical: https://nagacodex.cloud/

## Page intent — Pass
- Single SPA homepage; sections map to service intents

## Titles & meta — Pass (codebase)
- Unique title ≤60 chars with primary keywords
- Meta description ≤155 chars
- Single H1 in Hero

## Internal links — Warn
- Shop wear → naga-apparel.com (good anchor)
- Social links are placeholders without profile URLs

## Structured data — Pass (codebase)
- JSON-LD: WebSite, Organization, Person, ProfessionalService, FAQPage

## Source citations (GEO) — Warn
- Entity trust via Person schema + FAQ; add real LinkedIn/GitHub URLs when available

## Answer-first content (GEO) — Pass (codebase)
- Contact BLUF paragraph + visible FAQ matching schema
