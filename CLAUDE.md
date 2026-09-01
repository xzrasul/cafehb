# cafehb — café hb online menu

A static menu website for **café hb** (Dushanbe). Visitors open the site via a QR code on the table,
browse the menu by category, and can leave a rating/review that gets sent to the owner via Telegram.

The code is licensed under **GPLv3** (see `LICENSE`).

## Stack and deployment

- Plain HTML/CSS/JS, no build step, no framework, no `package.json`. This is a deliberate choice — don't
  add a bundler, npm dependencies, or a framework unless explicitly asked.
- Hosted on Vercel. `vercel.json` defines rewrite rules (`/api/*` → serverless functions in `api/`,
  `/siyoma` → `siyoma.html`). Pushing to `main` triggers an automatic deploy on Vercel — keep that in
  mind when pushing.
- `api/rate.js` — a Vercel serverless function (Node) that accepts a POST with a rating/review and
  forwards it to a Telegram bot via the Bot API. The `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
  secrets live only in Vercel environment variables — **never commit them to the repository**.

## Structure

- `index.html` — the main menu page (header with categories, category slider on mobile, product grid,
  cafe rating form).
- `products.js` — the single source of product data: the `defaultProducts` object, keyed by category
  (`drinks`, `breakfast`, `burgers`, `sandwiches`, `salads`, `soups`, `dishes`), values are arrays of
  products `{ id, name, price, image, description, volume? }`.
- `script.js` — all the logic: category list (`CATEGORIES`), product card rendering, popups/sheets,
  category filtering, adaptive card limits (mobile/desktop), rating form logic (client-side honeypot
  check, submission to `/api/rate`).
- `style.css` — all styling, loads the Fixel font via `@font-face` from `FixelAll/`.
- `content/` — product images organized into category folders in Russian (`Напитки`, `Завтраки`,
  `Бургеры`, `Cендвич`, `Салаты`, `Супы`, `Горячие блюда`) + `content/logo/` (logo, banner, icons).
  The file path in `products.js.image` must exactly match the real path in `content/`.
- `siyoma.html` — a separate standalone menu page **with drinks only**, without the shared navigation.
  Accessible at `/siyoma` (see the rewrite in `vercel.json`). Likely a separate QR/stand. Uses the same
  `style.css`/`products.js`/`script.js`, but with its own data set for rendering.
- `reference.html` — **not part of the site**, a separate visual reference/showcase of card animation,
  not linked anywhere and should not be treated as site code. Don't touch it unless explicitly asked.
- `FixelAll/` — Fixel font sources (Display/Text/Variable, all weights). Only `FixelText` is used, via
  `@font-face` in `style.css`. Contains leftover archive-extraction junk (`.DS_Store`, `__MACOSX/`) —
  don't clean it up without an explicit request, it's unrelated to the task.

## What to do

- The menu (`products.js`) must stay accurate: current prices, volumes (`volume`), descriptions in
  Russian, correct image paths. When adding a product — find/add an image in the corresponding
  `content/<Category>/` folder and set an `id` that matches a unique product key.
- Menu UI/UX (cards, popups, category slider, banner, "Rate us" button, "back to top" button) is
  responsive, with separate breakpoints for mobile (see `MOBILE_BREAKPOINT` in `script.js`).
- The rating form (`rating-form`) and its backend (`api/rate.js`) are protected against spam with a
  honeypot field and IP-based rate limiting (30 sec/request) — judging by commit history
  (`Protect from spam`, `Fix protecting`, `Fix stars`), this is an active area and changes here need
  care and testing.
- All user-facing text is in Russian (the cafe is in Dushanbe, Russian-speaking audience). Don't
  translate the site's interface into English.

## What not to do

- Don't commit `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, or any other secrets — only via Vercel env
  variables.
- Don't remove or weaken the honeypot/rate-limit protection in `api/rate.js` without an explicit
  request — this protection was added deliberately after spam issues.
- Don't add a build step/bundler/framework/`package.json` — the site is intentionally static and
  dependency-free.
- Don't break the `/siyoma → siyoma.html` rewrite, and don't change `siyoma.html` so that it stops
  being a standalone drinks-only page.
- Don't touch `reference.html` or the junk files in `FixelAll/__MACOSX`, `.DS_Store` — they aren't part
  of the site's working code.
- Don't rename/move files in `content/` without updating the corresponding `image` paths in
  `products.js` — a path mismatch silently breaks images in production.
