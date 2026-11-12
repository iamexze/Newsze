# Deploying Newze

The app is a standard Next.js 16 project with no database, no API keys and no external
services. Any Node host will run it. Three options, fastest first.

---

## Option 1 — Vercel (recommended, ~2 minutes)

```bash
cd /Users/megha/Desktop/works/Newze/web
npx vercel@latest login        # opens a browser once
npx vercel@latest --prod       # deploys, prints the live URL
```

`vercel.json` is already configured. Accept the defaults when prompted — framework is
detected as Next.js automatically. The free tier is more than sufficient for this.

**Subsequent deploys** are a single command: `npx vercel@latest --prod`

---

## Option 2 — Netlify

```bash
cd /Users/megha/Desktop/works/Newze/web
npx netlify-cli login
npx netlify-cli deploy --build --prod
```

---

## Option 3 — Any Node host (Railway, Render, Fly, a VPS)

```bash
npm install
npm run build
npm start          # serves on :3000
```

Set `PORT` if the host requires a different port. Node 20+.

---

## Non-interactive deploy (CI, or an agent without browser access)

Create a token at **vercel.com → Settings → Tokens**, then:

```bash
npx vercel@latest --prod --token "$VERCEL_TOKEN" --yes
```

This is the route to use if you want a deploy run for you without logging in interactively —
create the token, paste it, and the deploy needs no browser.

---

## Before you make it public

A short checklist, because this prototype is going to be read as a real product:

- [ ] **The sample-data banner is on every page.** It is — verify it survives any edit.
- [ ] **Decide public or private.** Vercel supports password protection on a deployment if you'd rather show it selectively first.
- [ ] **The disclaimer page is linked from the footer.** It is.
- [ ] **No real market data is being served.** Correct today — `lib/data.ts` is entirely synthetic.
- [ ] **robots.txt** — if you do not want this indexed while it is a prototype, add
      `app/robots.ts` returning `{ rules: { userAgent: "*", disallow: "/" } }` before deploying.

---

## What is deployed

206 routes, 189 pre-rendered at build time. Two routes render on demand (`/wire` and
`/search`, both because they read query parameters). Build takes about 20 seconds cold.
