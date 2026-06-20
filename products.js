/**
 * products.js - Скрипт динамического чтения меню напрямую из Google Таблицы (CSV формат)
 * Замените им ваш старый файл, работающий с Firebase.
 */

const SHEET_ID = "1gPg_AiecuOACT2q-UgQiTNVt3oImEwE0HFW4ACqUIdI/"; // Укажите ваш ID Google Таблицы из шага 2

// Основная функция загрузки продуктов на сайт
async function fetchProducts() {
    // Ссылка на опубликованный CSV поток данных вашей таблицы
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv`;

    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('Ошибка при сети или загрузки данных таблицы');

        const csvText = await response.text();
        const products = parseCsvToObjects(csvText);

        console.log("Успешно загружено товаров:", products.length);
        renderMenu(products);

    } catch (error) {
        console.error("Не удалось подгрузить товары из Google Sheets:", error);
        document.getElementById('menu-container').innerHTML =
            `<p class="error-msg">Произошла ошибка загрузки меню. Пожалуйста, попробуйте позже.</p>`;
    }
}

// Парсер CSV текста в массив JSON объектов
function parseCsvToObjects(csvText) {
    const lines = csvText.split('\n');
    if (lines.length <= 1) return [];

    // Читаем заголовки (первая строчка): category, name, price, imageUrl
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        // Регулярное выражение для корректного разбора CSV строк с запятыми внутри кавычек
        const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        const cleanValues = matches.map(v => v.trim().replace(/^"|"$/g, ''));

        if (cleanValues.length < headers.length) continue;

        let item = {};
        headers.forEach((header, index) => {
            item[header] = cleanValues[index];
        });

        // Преобразуем цену в числовой формат
        item.price = parseFloat(item.price) || 0;
        result.push(item);
    }

    return result;
}

// Функция отображения карточек товаров на странице HTML (Примерная реализация)
function renderMenu(products) {
    const container = document.getElementById('menu-container');
    if (!container) return;

    container.innerHTML = ""; // Очищаем спиннеры / старые данные

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = `product-card category-${product.category}`;

        // Если у товара нет фото, ставим заглушку placeholder
        const imgUrl = product.imageUrl ? product.imageUrl : 'https://via.placeholder.com/300x200?text=No+Photo';

        productCard.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${imgUrl}" alt="${product.name}" class="product-img" onerror="this.src='https://via.placeholder.com/300x200?text=No+Photo'">
            </div>
            <div class="card-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="card-footer">
                    <span class="product-price">${product.price} TJS</span>
                    <button class="buy-btn" onclick="addToCart('${product.name}', ${product.price})">Заказать</button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// Автоматический запуск при загрузке DOM
document.addEventListener("DOMContentLoaded", fetchProducts);