// products.js — читает меню из Google Sheets
const SHEET_ID = "1gPg_AiecuOACT2q-UgQiTNVt3oImEwE0HFW4ACqUIdI";

let products = {};

async function loadProducts() {
    try {
        const url = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?tqx=out:csv&sheet=menu";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Sheets error");
        const csv = await res.text();

        const rows = parseCSV(csv);
        if (rows.length < 2) throw new Error("Empty sheet");

        // заголовки: category, name, price, imageUrl
        products = {};
        for (let i = 1; i < rows.length; i++) {
            const cat = (rows[i][0] || "").trim();
            const name = (rows[i][1] || "").trim();
            const price = parseInt(rows[i][2]);
            const image = (rows[i][3] || "").trim();
            if (!cat || !name || !price) continue;
            if (!products[cat]) products[cat] = [];
            products[cat].push({ id: name, name, price, image: image || null });
        }
    } catch (e) {
        console.warn("Sheets load error:", e);
        products = {};
    }
    document.dispatchEvent(new Event("productsLoaded"));
}

function parseCSV(text) {
    const rows = [];
    for (const line of text.split(/\r?\n/)) {
        if (!line.trim()) continue;
        const cols = [];
        let cur = "", inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { if (inQ && line[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
            else if (ch === ',' && !inQ) { cols.push(cur); cur = ""; }
            else cur += ch;
        }
        cols.push(cur);
        rows.push(cols);
    }
    return rows;
}

loadProducts();