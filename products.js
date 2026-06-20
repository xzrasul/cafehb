let products;

async function loadProducts() {
    try {
        const s = JSON.parse(localStorage.getItem("cafehb_settings") || "{}");
        if (s.binId) {
            const url = "https://api.jsonbin.io/v3/b/" + s.binId + "/latest";
            const res = await fetch(url, {
                headers: { "X-Bin-Meta": "false" }
            });
            if (res.ok) {
                products = await res.json();
                localStorage.setItem("cafehb_products", JSON.stringify(products));
                document.dispatchEvent(new Event("productsLoaded"));
                return;
            }
        }
    } catch (e) {
        console.warn("jsonbin.io error:", e);
    }

    const saved = localStorage.getItem("cafehb_products");
    if (saved) {
        try { products = JSON.parse(saved); document.dispatchEvent(new Event("productsLoaded")); return; }
        catch (e) { }
    }
    products = JSON.parse(JSON.stringify(defaultProducts));
    document.dispatchEvent(new Event("productsLoaded"));
}

loadProducts();
