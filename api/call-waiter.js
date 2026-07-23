// api/call-waiter.js
// Vercel Serverless Function.
// Токен бота и id чата хранятся в переменных окружения Vercel — они НЕ попадают в браузер.

export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { table } = req.body || {};

  // Простая защита от мусора: номер стола должен быть короткой строкой/числом
  if (!table || typeof table !== "string" || table.length > 20) {
    return res.status(400).json({ error: "Некорректный номер стола" });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Отсутствуют TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID в env");
    return res.status(500).json({ error: "Сервер не настроен" });
  }

  const text = `🔔 Столик №${table} просит официанта`;

  try {
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
        }),
      }
    );

    const tgData = await tgResponse.json();

    if (!tgData.ok) {
      console.error("Telegram API error:", tgData);
      return res.status(502).json({ error: "Не удалось отправить сообщение" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Ошибка запроса к Telegram:", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
