# Naga Codex

Personal brand site for [Maurice Holda](https://nagacodex.cloud) — AI agents, generative film, web development, and security consulting from Hamburg.

Live: **[nagacodex.cloud](https://nagacodex.cloud)**

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | GSAP 3 + Motion |
| Fonts | Inter, JetBrains Mono, Syne (Google Fonts) |
| Deployment | Vercel / Cloud Run |
| AI | Gemini API (`@google/genai`) |

---

## Run locally

**Prerequisites:** Node.js 20+, pnpm

```bash
pnpm install
cp .env.example .env.local
# add your GEMINI_API_KEY to .env.local
pnpm dev          # http://localhost:3000
```

## Build

```bash
pnpm build        # outputs to dist/
pnpm preview      # preview the production build
```

## Video encoding

Large source clips are encoded to H.264 + WebM for web delivery:

```bash
pnpm encode:mande   # encodes src/assets/clips/mande.mp4
pnpm encode:intro   # encodes src/assets/clips/intro.mp4 (no audio, no HEVC)
```

Requires the local `video-web-encode` Cursor skill.  
For production, host encoded clips on Cloudflare R2 or Stream rather than bundling them.

---

## Project structure

```
src/
  components/   UI components (Hero, WorkGrid, Contact, …)
  lib/          Data & utilities (films, sound, seo, scroll)
  assets/       Images, clips, certifications, music
public/         Static files (logo, og-image, sitemap, robots)
```

---

## Contact

Work enquiries: [chosenfewrecords@hotmail.de](mailto:chosenfewrecords@hotmail.de)  
LinkedIn: [linkedin.com/in/maurice-holda](https://de.linkedin.com/in/maurice-holda)
