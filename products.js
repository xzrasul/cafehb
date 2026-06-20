// products.js — читает меню из Google Sheets (опубликованного как CSV)
// Замени SHEET_ID на ID своей таблицы (из URL)

const SHEET_ID = "1gPg_AiecuOACT2q-UgQiTNVt3oImEwE0HFW4ACqUIdI"; // пример: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms

let products = {};

async function loadProducts() {
    try {
        // Читаем лист "menu" как CSV
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=menu`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Sheets fetch failed");
        const csv = await res.text();

        // Парсим CSV → объект products
        const rows = parseCSV(csv);
        const headers = rows[0]; // ["category","name","price","imageUrl"]

        const catIdx = headers.indexOf("category");
        const nameIdx = headers.indexOf("name");
        const priceIdx = headers.indexOf("price");
        const imgIdx = headers.indexOf("imageUrl");

        products = {};
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cat = row[catIdx]?.trim();
            const name = row[nameIdx]?.trim();
            const price = parseInt(row[priceIdx]);
            const image = row[imgIdx]?.trim();

            if (!cat || !name || !price) continue;

            if (!products[cat]) products[cat] = [];
            products[cat].push({
                id: name,
                name,
                price,
                image: image || null
            });
        }
    } catch (e) {
        console.warn("Sheets load error:", e);
        products = {};
    }

    document.dispatchEvent(new Event("productsLoaded"));
}

// Простой CSV парсер (учитывает кавычки)
function parseCSV(text) {
    const rows = [];
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
        if (!line.trim()) continue;
        const cols = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
                else inQuotes = !inQuotes;
            } else if (ch === ',' && !inQuotes) {
                cols.push(cur); cur = "";
            } else {
                cur += ch;
            }
        }
        cols.push(cur);
        rows.push(cols);
    }
    return rows;
}

loadProducts();
