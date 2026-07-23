# 🚀 Quick Start — Быстрый старт

## ⚡ 5 минут до запуска

### Шаг 1: Получите Telegram токен (2 мин)

```bash
# 1. Откройте Telegram и найдите @BotFather
# 2. Отправьте: /newbot
# 3. Придумайте имя бота (напр. "cafe_hb_bot")
# 4. Придумайте username (напр. "cafe_hb_waiter_bot")
# 5. Скопируйте токен (выглядит так):
#    8900105881:AAGZLy7-sB_z7-tAzHdIACPCwUpXvLXhubY
```

### Шаг 2: Создайте группу персонала (2 мин)

```bash
# 1. Создайте новую группу в Telegram
# 2. Добавьте туда вашего бота (из шага 1)
# 3. Отправьте сообщение в группу
# 4. Перейдите по ссылке:
#    https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
# 5. Найдите "chat":{"id":-1004410311353}
# 6. Это ваш Chat ID (важно: с минусом!)
```

### Шаг 3: Обновите код (1 мин)

Откройте `/home/xzrasul/Documents/cafehb/script.js` и найдите строку 366:

```javascript
// БЫЛО:
const TELEGRAM_BOT_TOKEN = "8900105881:AAGZLy7-sB_z7-tAzHdIACPCwUpXvLXhubY";
const TELEGRAM_CHAT_ID = "-1004410311353";

// СТАЛО (замените на свои):
const TELEGRAM_BOT_TOKEN = "ВАШ_ТОКЕН_ЗДЕСЬ";
const TELEGRAM_CHAT_ID = "ВАШ_CHAT_ID_ЗДЕСЬ";
```

### Шаг 4: Тестируйте локально (до 1 мин)

```bash
# Откройте в браузере:
file:///home/xzrasul/Documents/cafehb/index.html?table=3

# Нажмите "🔔 Позвать официанта"

# Проверьте что пришло сообщение в Telegram группу
```

### Шаг 5: Создайте QR-коды (~10-15 мин, но опционально)

Для каждого стола создайте QR-код:

```
Стол 1: https://вашдомен.com/index.html?table=1
Стол 2: https://вашдомен.com/index.html?table=2
Стол 3: https://вашдомен.com/index.html?table=3
... и т.д.
```

Используйте: https://qr-code-generator.com/

## ✅ Готово!

Теперь гости могут:
1. Отсканировать QR-код на столике
2. Нажать на кнопку "🔔 Позвать официанта"
3. Вы получите уведомление в Telegram

## 🎨 Опционально: Кастомизация

### Изменить цвет кнопки

В `style.css` найдите (строка ~1390):

```css
.call-waiter-btn {
    background: linear-gradient(135deg, #3561C0, #4A7BE0); /* ← цвет здесь */
    ...
}
```

### Изменить текст

В `script.js` найдите (строка ~402):

```javascript
button.textContent = "🔔 Позвать официанта"; // ← текст здесь
```

### Изменить время блокировки

В `script.js` найдите (строка ~410):

```javascript
setTimeout(() => {
    ...
}, 15000); // ← время в миллисекундах (15000 = 15 секунд)
```

## 📱 Тестирование на мобильном

```bash
# 1. На компьютере откройте DevTools (F12)
# 2. Нажмите иконку мобильного устройства
# 3. Выберите iPhone или другое устройство
# 4. Перезагрузите страницу (F5)
# 5. Проверьте что кнопка выглядит правильно
```

## 🐛 Если что-то не работает

### Кнопка не видна
```bash
# Проверьте URL: должен быть ?table=3
# Проверьте консоль браузера (F12 → Console)
# Есть ли ошибки? Напишите их в DEBUGGING_GUIDE.md
```

### Сообщение не приходит
```bash
# Проверьте токен: правильно ли скопирован?
# Проверьте Chat ID: есть ли минус (-) в начале?
# Проверьте что бот в группе
```

### CORS ошибка
```bash
# Это нормально, Telegram API её разрешает
# Если критично - используйте backend для отправки
```

## 📚 Дальше

Хотите узнать больше?

- 📖 [README_WAITER_CALL.md](README_WAITER_CALL.md) — Полный обзор
- 🔧 [WAITER_CALL_SETUP.md](WAITER_CALL_SETUP.md) — Детальная настройка
- 🚀 [EXTENSIONS_AND_CUSTOMIZATION.md](EXTENSIONS_AND_CUSTOMIZATION.md) — Расширения
- 🐛 [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md) — Отладка

## 💡 Полезные ссылки

- **Telegram BotFather:** https://t.me/BotFather
- **QR Code Generator:** https://qr-code-generator.com/
- **Telegram API Docs:** https://core.telegram.org/bots/api
- **Curl для тестирования:** https://curl.se/

## ✨ Готово! 🎉

Функция работает! Теперь разместите QR-коды на столиках и享受 😊

---

**Версия:** 1.0  
**Время на установку:** ~5 минут  
**Сложность:** 🟢 Легко  
**Статус:** ✅ Готово
