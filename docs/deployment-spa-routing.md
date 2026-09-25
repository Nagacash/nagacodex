# SPA routing notes (Hostinger / static hosts)

`/skills` is a client route. After `npm run build`, ensure the host serves `index.html`
for unknown paths:

- Apache (Hostinger often): `public/.htaccess` is copied into `dist/`
- Netlify-style: `public/_redirects`
- nginx: `try_files $uri $uri/ /index.html;`

Do not deploy until explicitly approved. Live www.nagacodex.cloud must remain unchanged
until that approval.
