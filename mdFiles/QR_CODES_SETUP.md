# QR-коды для столиков кафе

## Инструкция по созданию

Для каждого стола используйте URL вида:
```
https://вашдомен.com/index.html?table=НОМЕР_СТОЛА
```

Затем:
1. Перейдите на сайт https://qr-code-generator.com/ (или другой генератор QR-кодов)
2. Вставьте URL в поле
3. Скачайте и распечатайте QR-код
4. Разместите на столе

## Примеры URL по номерам столов

Замените `https://example.com` на адрес вашего сайта:

| Стол | URL | Комментарий |
|------|-----|-----------|
| 1 | `https://example.com/index.html?table=1` | Первый стол |
| 2 | `https://example.com/index.html?table=2` | Второй стол |
| 3 | `https://example.com/index.html?table=3` | Третий стол |
| 4 | `https://example.com/index.html?table=4` | Четвёртый стол |
| 5 | `https://example.com/index.html?table=5` | Пятый стол |
| 6 | `https://example.com/index.html?table=6` | Шестой стол |
| 7 | `https://example.com/index.html?table=7` | Седьмой стол |
| 8 | `https://example.com/index.html?table=8` | Восьмой стол |
| 9 | `https://example.com/index.html?table=9` | Девятый стол |
| 10 | `https://example.com/index.html?table=10` | Десятый стол |

## Готовые коды для быстрого копирования

### Локальное тестирование
```
file:///home/xzrasul/Documents/cafehb/index.html?table=1
file:///home/xzrasul/Documents/cafehb/index.html?table=2
file:///home/xzrasul/Documents/cafehb/index.html?table=3
```

### Production (замените example.com на свой домен)
```
https://example.com/index.html?table=1
https://example.com/index.html?table=2
https://example.com/index.html?table=3
https://example.com/index.html?table=4
https://example.com/index.html?table=5
https://example.com/index.html?table=6
https://example.com/index.html?table=7
https://example.com/index.html?table=8
https://example.com/index.html?table=9
https://example.com/index.html?table=10
```

## Как работает параметр table

- Когда гость сканирует QR-код, в браузере открывается сайт кафе с параметром `?table=X`
- На странице автоматически появляется кнопка "🔔 Позвать официанта" в левом нижнем углу
- При клике на кнопку в группу Telegram персонала поступает сообщение: "🔔 Столик №X просит официанта"
- Кнопка блокируется на 15 секунд, чтобы избежать спама
- Официант видит уведомление в Telegram и идёт к нужному столику

## Тестирование на устройствах

1. **На компьютере:** Откройте ссылку с параметром `?table=` в браузере
2. **На телефоне:** Отсканируйте QR-код камерой или приложением для сканирования
3. **Нажмите на кнопку** и убедитесь, что сообщение пришло в Telegram
