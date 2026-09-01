# café hb

Online menu for **café hb** (Dushanbe). Visitors open the site via a QR code on the table, browse the
menu by category, and can leave a rating/review that is sent directly to the owner via Telegram.

## Stack

Plain HTML/CSS/JS, no build step and no frameworks. Hosted on [Vercel](https://vercel.com).

## Structure

| File/folder       | Purpose                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| `index.html`      | main menu page                                                           |
| `products.js`     | product data (prices, descriptions, categories, images)                 |
| `script.js`       | all the logic: card rendering, popups, category filtering, rating form  |
| `style.css`       | styles, loads the Fixel font from `FixelAll/`                           |
| `content/`        | product photos by category + logo/banner                                |
| `siyoma.html`     | a separate drinks-only menu page (`/siyoma`)                            |
| `api/rate.js`     | serverless function: accepts a rating/review and sends it to Telegram   |
| `vercel.json`     | rewrite rules for `/api/*` and `/siyoma`                                 |

## Running locally

There's no build step — just open `index.html` in a browser, or spin up any static server:

```bash
npx serve .
```

The rating form (`api/rate.js`) requires the `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` environment
variables (configured in Vercel, they should not be present in the repository).

## Deployment

Pushing to `main` automatically deploys to Vercel.

## License

[GPLv3](LICENSE).
