# 🐛 Debugging и решение проблем

## Распространённые проблемы и решения

### 1. Кнопка не появляется

**Проблема:** Кнопка "Позвать официанта" не видна на странице

**Возможные причины:**
- [ ] Параметр `?table=` отсутствует в URL
- [ ] JavaScript не загрузился или содержит ошибку
- [ ] Кнопка скрыта CSS или HTML

**Решение:**
```bash
# 1. Проверьте URL
# Правильно: ?table=3
# Неправильно: ?table= или ?tablenumber=3

# 2. Откройте консоль браузера (F12)
# Проверьте нет ли ошибок в консоли

# 3. В консоли выполните:
console.log(getTableNumber()); // Должно вернуть номер стола
document.getElementById('callWaiterBtn'); // Должна быть кнопка

# 4. Проверьте CSS:
document.getElementById('callWaiterBtn').style.display; // Должно быть "block" или пусто
```

### 2. Кнопка видна, но не отправляет сообщение

**Проблема:** При клике на кнопку ничего не происходит

**Возможные причины:**
- [ ] Неправильный токен Telegram бота
- [ ] Неправильный Chat ID группы
- [ ] Бот не добавлен в группу
- [ ] Сетевая ошибка/CORS проблема

**Решение:**
```javascript
// 1. В консоли браузера (F12) проверьте:
console.log(TELEGRAM_BOT_TOKEN); // Должен быть токен
console.log(TELEGRAM_CHAT_ID); // Должен быть Chat ID

// 2. Попробуйте отправить тестовое сообщение:
fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: "🧪 Тест"
  })
}).then(r => r.json()).then(console.log);

// 3. Результат должен содержать "ok": true
```

### 3. Ошибка CORS

**Проблема:** В консоли ошибка "Access to XMLHttpRequest has been blocked by CORS policy"

**Возможные причины:**
- Запрос идёт с одного домена на другой
- Сервер не позволяет кросс-доменные запросы

**Решение:**
- Telegram API позволяет кросс-доменные запросы, так что это не должно быть проблемой
- Если проблема всё ещё есть, используйте backend для отправки сообщений

### 4. Токен не работает

**Проблема:** Ошибка "Telegram API error" или {"ok":false,"error_code":404}

**Возможные причины:**
- [ ] Неправильный токен
- [ ] Токен истёк (было пересоздать бота)
- [ ] Опечатка в токене

**Решение:**
```bash
# 1. Проверьте токен в Telegram @BotFather
# 2. Убедитесь что это именно ACCESS TOKEN для бота, не что-то другое
# 3. Скопируйте токен полностью без пробелов

# 4. Протестируйте токен через curl:
curl -X POST https://api.telegram.org/bot<YOUR_TOKEN>/getMe
# Результат должен показать информацию о боте

# 5. Если curl не работает, используйте онлайн-инструмент:
# https://api.telegram.org/bot<YOUR_TOKEN>/getMe
```

### 5. Chat ID не работает

**Проблема:** Сообщение не приходит в группу, ошибка "chat not found"

**Возможные причины:**
- [ ] Неправильный Chat ID
- [ ] Бот не добавлен в группу
- [ ] Группа удалена

**Решение:**
```bash
# 1. Убедитесь что бот в группе:
# - Откройте группу Telegram
# - Нажмите "Добавить участников"
# - Найдите вашего бота
# - Добавьте его

# 2. Получите правильный Chat ID:
# - В группе отправьте сообщение
# - Перейдите по адресу:
# https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
# - Найдите "chat":{"id":-1004410311353...}
# - Это ваш Chat ID (начинается с -)

# 3. Скопируйте Chat ID в script.js:
const TELEGRAM_CHAT_ID = "-1004410311353"; // Именно с минусом!

# 4. Протестируйте через curl:
curl -X POST https://api.telegram.org/bot<YOUR_TOKEN>/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"<YOUR_CHAT_ID>","text":"Test"}'
```

### 6. Сообщение приходит неправильное

**Проблема:** Сообщение содержит неправильный текст или формат

**Возможные причины:**
- [ ] Параметр `table` имеет неправильное значение
- [ ] Номер стола не число
- [ ] Кодировка текста нарушена

**Решение:**
```javascript
// 1. Проверьте значение параметра в консоли:
console.log(getTableNumber()); // Должно быть число (как строка) "3"

// 2. Если нужно, переходите на число:
const tableNum = parseInt(getTableNumber(), 10);

// 3. Проверьте текст сообщения:
const text = `🔔 Столик №${getTableNumber()} просит официанта`;
console.log(text); // Должен быть правильный текст
```

### 7. Кнопка блокируется, но не разблокируется

**Проблема:** Кнопка остаётся в состоянии "✅ Официант уже идёт" дольше 15 секунд

**Возможные причины:**
- [ ] Таймер не запустился
- [ ] JavaScript ошибка прерывает выполнение
- [ ] Браузер заморожен

**Решение:**
```javascript
// 1. В консоли проверьте ошибки (F12 → Console tab)

// 2. Добавьте логирование:
button.addEventListener("click", async () => {
  console.log("Кнопка нажата, tableNumber:", tableNumber);
  button.disabled = true;
  button.textContent = "Отправляем...";

  try {
    console.log("Отправляем запрос...");
    await sendWaiterCall(tableNumber);
    console.log("Запрос успешно отправлен!");
    button.textContent = "✅ Официант уже идёт";
    
    console.log("Таймер: разблокировка через 15 сек...");
    setTimeout(() => {
      console.log("Таймер: разблокировка кнопки");
      button.disabled = false;
      button.textContent = "🔔 Позвать официанта";
    }, 15000);
  } catch (err) {
    console.error("Ошибка:", err);
    button.textContent = "❌ Ошибка, попробуйте ещё раз";
    button.disabled = false;
  }
});

// 3. Нажмите на кнопку и посмотрите логи в консоли
```

### 8. Проблемы с мобильным устройством

**Проблема:** На телефоне кнопка не видна или работает неправильно

**Решение:**
```javascript
// 1. Проверьте медиа-запрос в CSS:
// Кнопка должна быть видна и на мобильном

// 2. На телефоне откройте DevTools (если Chrome):
// Menu → More Tools → DevTools
// Нажмите на иконку мобильного устройства

// 3. Проверьте размер экрана и положение кнопки

// 4. Убедитесь что нет перекрытия других элементов:
console.log(window.getComputedStyle(document.getElementById('callWaiterBtn')));
```

### 9. Проблемы с HTTPS

**Проблема:** На HTTPS сайте запрос к Telegram блокируется

**Возможные причины:**
- Браузер блокирует смешанное содержимое (HTTP запрос с HTTPS страницы)

**Решение:**
- Telegram API работает по HTTPS, так что это не должно быть проблемой
- Если проблема есть, проверьте браузер логи

## Инструменты для отладки

### 1. DevTools консоль (F12)
```javascript
// Проверьте наличие ошибок

// Просмотрите сетевые запросы (Network tab)
// Ищите POST запрос к api.telegram.org
```

### 2. Telegram Test Bot
```bash
# Используйте тестовый бот для экспериментов
# @testbot_hb (пример)

# Или создайте свой тестовый бот через @BotFather
```

### 3. Curl для тестирования
```bash
# Тест токена:
curl https://api.telegram.org/bot<TOKEN>/getMe

# Отправка тестового сообщения:
curl -X POST https://api.telegram.org/bot<TOKEN>/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<CHAT_ID>",
    "text": "Test message"
  }'
```

### 4. Postman
- Используйте для тестирования API запросов
- Сохраняйте конфигурации для документации

## Логирование для production

```javascript
function initCallWaiter() {
  const button = document.getElementById("callWaiterBtn");
  if (!button) {
    console.warn("Call waiter button not found");
    return;
  }

  const tableNumber = getTableNumber();
  console.log(`[WAITER_CALL] Инициализация для стола ${tableNumber}`);

  if (!tableNumber) {
    console.log("[WAITER_CALL] Параметр table не найден, кнопка скрыта");
    button.style.display = "none";
    return;
  }

  button.addEventListener("click", async () => {
    console.log(`[WAITER_CALL] Кнопка нажата для стола ${tableNumber}`);
    button.disabled = true;
    button.textContent = "Отправляем...";

    try {
      console.log(`[WAITER_CALL] Отправка запроса...`);
      await sendWaiterCall(tableNumber);
      console.log(`[WAITER_CALL] ✅ Успешно отправлено`);
      
      button.textContent = "✅ Официант уже идёт";
      setTimeout(() => {
        console.log(`[WAITER_CALL] Разблокировка кнопки`);
        button.disabled = false;
        button.textContent = "🔔 Позвать официанта";
      }, 15000);
    } catch (err) {
      console.error(`[WAITER_CALL] ❌ Ошибка:`, err);
      button.textContent = "❌ Ошибка, попробуйте ещё раз";
      button.disabled = false;
    }
  });
}
```

## Чек-лист перед production

- [ ] Токен проверен и работает
- [ ] Chat ID проверен и правильный
- [ ] Бот добавлен в группу
- [ ] Тестовое сообщение успешно отправлено
- [ ] Кнопка видна с параметром ?table=
- [ ] Кнопка скрыта без параметра
- [ ] Блокировка на 15 секунд работает
- [ ] Обработка ошибок работает
- [ ] Мобильная версия выглядит правильно
- [ ] HTTPS работает без ошибок CORS
- [ ] Логирование включено для отладки
