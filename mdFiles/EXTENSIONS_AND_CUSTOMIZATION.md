# 🔧 Вариант расширений и интеграции функции "Вызов официанта"

## 1. Отправка других типов сообщений

Можно добавить кнопки для других операций:

### Пример: Счёт, Жалобы, Комплименты

```javascript
// В script.js добавить новые функции:

async function sendWaiterMessage(tableNumber, messageType) {
  const messages = {
    waiter: `🔔 Столик №${tableNumber} просит официанта`,
    bill: `💳 Столик №${tableNumber} просит счёт`,
    complaint: `😞 Столик №${tableNumber} - жалоба`,
    compliment: `😊 Столик №${tableNumber} - комплимент`,
  };

  const text = messages[messageType] || messages.waiter;

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
      }),
    }
  );

  const data = await response.json();
  if (!data.ok) throw new Error("Telegram API error");
}
```

## 2. Отправка дополнительных деталей (меню, QR-коды)

### Добавить кнопку для отправки электронного меню:

```javascript
async function sendMenuButton() {
  const button = document.querySelector('[data-action="send-menu"]');
  if (!button) return;

  const tableNumber = getTableNumber();

  button.addEventListener("click", async () => {
    try {
      // Отправить меню через Telegram
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: `📋 Столик №${tableNumber} запросил электронное меню`,
          }),
        }
      );
    } catch (err) {
      console.error(err);
    }
  });
}
```

## 3. Сохранение истории вызовов

### Добавить localStorage для отслеживания вызовов:

```javascript
function saveWaiterCall(tableNumber, timestamp) {
  const calls = JSON.parse(localStorage.getItem('waiterCalls') || '[]');
  calls.push({
    table: tableNumber,
    time: new Date(timestamp).toLocaleTimeString('ru-RU'),
  });
  localStorage.setItem('waiterCalls', JSON.stringify(calls));
}

// В функции initCallWaiter добавить:
saveWaiterCall(tableNumber, Date.now());
```

## 4. Отправка фото с комментарием

### Интеграция с камерой устройства:

```javascript
async function sendPhotoWithComment(tableNumber) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', file);
    formData.append('caption', `📸 Столик №${tableNumber} отправил фото`);

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      if (!data.ok) throw new Error('Failed to send photo');
    } catch (err) {
      console.error(err);
    }
  };
  input.click();
}
```

## 5. Интеграция с системой рейтинга

### Попросить оценить обслуживание:

```javascript
function showRatingPopup(tableNumber) {
  const rating = prompt('Оцените обслуживание (1-5 звёзд):', '5');
  if (!rating) return;

  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `⭐ Столик №${tableNumber} оценил обслуживание: ${rating}/5 звёзд`,
    }),
  });
}
```

## 6. Таймер для ограничения частоты вызовов

### Более гибкий контроль частоты:

```javascript
const lastCallTimes = {};

function canCallWaiter(tableNumber) {
  const lastCall = lastCallTimes[tableNumber] || 0;
  const timeSinceLastCall = Date.now() - lastCall;
  return timeSinceLastCall > 15000; // 15 секунд
}

function recordWaiterCall(tableNumber) {
  lastCallTimes[tableNumber] = Date.now();
}
```

## 7. Уведомления для гостей

### Показать уведомление о том, что официант идёт:

```javascript
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #3561C0, #4A7BE0);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(53, 97, 192, 0.3);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Использование:
await sendWaiterCall(tableNumber);
showNotification('✅ Официант получил ваш запрос!');
```

## 8. Интеграция с WebSocket для реал-тайма

### Получение подтверждения от официантов в реал-тайме:

```javascript
let officiantResponse = null;

function initWebSocket() {
  const ws = new WebSocket('wss://your-backend.com/socket');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'officiant_coming') {
      showNotification(`✅ Официант идёт к столику ${data.table}`);
      officiantResponse = data;
    }
  };
}
```

## 9. Кастомизация текста и эмодзи

### Конфиг для легкого изменения:

```javascript
const CONFIG = {
  BUTTON_TEXTS: {
    default: '🔔 Позвать официанта',
    sending: '📤 Отправляем...',
    success: '✅ Официант уже идёт',
    error: '❌ Ошибка, попробуйте ещё раз',
  },
  WAIT_TIME: 15000, // мс
  TELEGRAM_BOT_TOKEN: '8900105881:AAGZLy7-sB_z7-tAzHdIACPCwUpXvLXhubY',
  TELEGRAM_CHAT_ID: '-1004410311353',
  MESSAGE_TEMPLATE: (table) => `🔔 Столик №${table} просит официанта`,
};

// Использование:
button.textContent = CONFIG.BUTTON_TEXTS.success;
```

## 10. Analytics и статистика

### Отслеживание использования:

```javascript
class WaiterCallAnalytics {
  constructor() {
    this.calls = [];
  }

  recordCall(tableNumber, timestamp = Date.now()) {
    this.calls.push({ table: tableNumber, time: timestamp });
    this.saveToServer();
  }

  async saveToServer() {
    // Отправить статистику на сервер
    await fetch('/api/analytics/waiter-calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.calls),
    });
  }

  getStats() {
    return {
      totalCalls: this.calls.length,
      callsPerTable: this.calls.reduce((acc, call) => {
        acc[call.table] = (acc[call.table] || 0) + 1;
        return acc;
      }, {}),
      averageResponseTime: this.calculateAverageTime(),
    };
  }
}
```

## Как использовать расширения

1. Скопируйте нужный код из примеров выше
2. Добавьте в `script.js` перед функцией `initCallWaiter()`
3. Вызовите новые функции по мере необходимости
4. Протестируйте перед развёртыванием в production

## Безопасность при расширении

- ✅ Используйте try/catch для обработки ошибок
- ✅ Ограничивайте частоту запросов
- ✅ Валидируйте входные данные (номер стола)
- ✅ Не отправляйте конфиденциальные данные
- ⚠️ Помните, что токен видим в коде браузера

## Рекомендации

- Для сложных интеграций используйте backend
- Протестируйте все расширения на мобильных устройствах
- Документируйте изменения для будущей поддержки
- Используйте версионирование для отслеживания изменений
