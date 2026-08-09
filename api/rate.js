const RATE_LIMIT_WINDOW_MS = 30000;
const rateLimitStore = globalThis.__ratingRateLimit || (globalThis.__ratingRateLimit = new Map());

function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"] || req.headers["x-real-ip"];
    const rawIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return (rawIp || "unknown").split(",")[0].trim();
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { stars, comment, honeypot } = req.body || {};

    if (honeypot) {
        return res.status(400).json({ error: "Spam detected" });
    }

    if (stars !== undefined && (stars < 0 || stars > 5)) {
        return res.status(400).json({ error: "Invalid rating" });
    }

    const ip = getClientIp(req);
    const now = Date.now();
    const lastRequestAt = rateLimitStore.get(ip) || 0;

    if (now - lastRequestAt < RATE_LIMIT_WINDOW_MS) {
        return res.status(429).json({ error: "Too many requests" });
    }

    rateLimitStore.set(ip, now);

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const hasRating = typeof stars === "number" && stars > 0;
    const ratingText = hasRating ? `⭐${stars} ` : "";
    const starEmojis = hasRating ? "⭐".repeat(stars) : "";
    const commentText = comment ? `\n💬 ${comment}` : "";
    const text = `${ratingText}Оценка кафе: ${starEmojis}${commentText}`.trim();

    const response = await fetch(
        `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text }),
        }
    );

    const data = await response.json();
    if (!data.ok) {
        return res.status(500).json({ error: "Telegram API error" });
    }

    return res.status(200).json({ ok: true });
}