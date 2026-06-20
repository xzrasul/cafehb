// rebuild script.js with title click & full-mobile handling
// список категорий используется в нескольких местах
const categories = [
    { key: "drinks", title: "Напитки" },
    { key: "burgers", title: "Бургеры" },
    { key: "sandwiches", title: "Сендвичи" },
    { key: "salads", title: "Салаты" },
    { key: "dishes", title: "Блюда" },
    { key: "breakfast", title: "Завтраки" }
];

function createCard(product, categoryKey) {
    const card = document.createElement("div");
    card.className = `card ${product.size === 'mini' ? 'card-mini' : ''}`;

    const safeId = (categoryKey + '-' + product.id).replace(/\s+/g, '-');
    const button = document.createElement("button");
    button.className = "popUp-btn";
    button.dataset.popoverId = safeId;

    const popup = document.createElement("div");
    popup.className = "popUp-style";
    popup.setAttribute("popover", "manual");
    popup.id = safeId;

    const popupInner = document.createElement("div");
    popupInner.className = "popUp-inner";

    const popupImageWrap = document.createElement("div");
    popupImageWrap.className = "popUp-image-wrap";

    if (product.image) {
      const popupImg = document.createElement("img");
      popupImg.src = product.image;
      popupImg.alt = product.name;
      popupImageWrap.appendChild(popupImg);
    }

    const popupBody = document.createElement("div");
    popupBody.className = "popUp-body";

    const popupH3 = document.createElement("h3");
    popupH3.textContent = product.name;

    const popupPrice = document.createElement("span");
    popupPrice.className = "popUp-price";
    popupPrice.textContent = `${product.price} c`;

    popupBody.appendChild(popupH3);
    popupBody.appendChild(popupPrice);

    popupInner.appendChild(popupImageWrap);
    popupInner.appendChild(popupBody);
    popup.appendChild(popupInner);

    if (product.image) {
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.name;
      button.appendChild(img);
    }

    const h3 = document.createElement("h3");
    h3.textContent = product.name;

    const price = document.createElement("span");
    price.className = "price-badge";
    price.textContent = `${product.price} c`;

    button.appendChild(h3);
    button.appendChild(price);

    button.addEventListener("click", () => {
        const openPopover = document.querySelector(".popUp-style[popover]:popover-open");
        if (openPopover) {
            openPopover.hidePopover();
        } else {
            popup.showPopover();
        }
    });

    card.appendChild(button);
    card.appendChild(popup);
    return card;
}

function renderCategory(category, limit) {
    const isFull = limit == null;
    const section = document.createElement("section");
    section.className = "category-section";
    section.setAttribute("data-category", category.key);

    const title = document.createElement("h2");
    title.className = "category-title";
    title.textContent = category.title;
    section.appendChild(title);

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "cards-container";
    if (isFull) cardsContainer.classList.add('full-mobile');

    const items = products[category.key] || [];
    const count = isFull ? items.length : limit;
    items.slice(0, count).forEach(product => {
        cardsContainer.appendChild(createCard(product, category.key));
    });

    section.appendChild(cardsContainer);

    // кнопка со стрелкой вправо только если это не полный список и есть ещё товары
    if (!isFull && items.length > limit) {
        const showAllBtn = document.createElement("button");
        showAllBtn.textContent = ">";
        showAllBtn.className = "show-all-btn";
        showAllBtn.addEventListener("click", () => {
            filterByCategory(category.key, null);
        });
        // добавляем кнопку в контейнер карточек (в конец скролла)
        cardsContainer.appendChild(showAllBtn);
    }

    return section;
}

function renderProducts(limit) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    categories.forEach(category => {
        if (products[category.key] && products[category.key].length > 0) {
            container.appendChild(renderCategory(category, limit));
        }
    });
}

function filterByCategory(categoryKey, limit) {
    const container = document.getElementById("products-container");
    if (categoryKey === "all") {
        renderProducts(limit !== undefined ? limit : getDefaultLimit());
        return;
    }
    const category = categories.find(c => c.key === categoryKey);
    if (!category) return;

    container.innerHTML = "";
    container.appendChild(renderCategory(category, limit === undefined ? null : limit));
}

function getDefaultLimit() {
    return window.innerWidth < 720 ? 4 : 6;
}

// init

function init() {
    const burgerMenu = document.querySelector(".burger-menu");
    const mainNav = document.querySelector(".mainNav");

    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener("click", () => {
            mainNav.classList.toggle("active");
            burgerMenu.classList.toggle("open");
        });
    }

    let currentLimit = getDefaultLimit();
    renderProducts(currentLimit);

    window.addEventListener("resize", () => {
        const newLimit = getDefaultLimit();
        if (newLimit !== currentLimit) {
            currentLimit = newLimit;
            renderProducts(currentLimit);
        }
    });

    // links in navigation (logo and category items)
    document.querySelectorAll(".mainNav a[data-category]").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const category = link.getAttribute("data-category");
            if (category === "all") {
                // логотип должен возвращать к ограниченной витрине
                renderProducts(currentLimit);
            } else {
                // остальные пункты навбара показывают все товары выбранной категории
                filterByCategory(category, null);
            }
            mainNav.classList.remove("active");
            burgerMenu.classList.remove("open");
        });
    });

    // mobile logo link sits outside mainNav
    document.querySelectorAll(".join-a.logo-m[data-category]").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            // логотип сбрасывает фильтр на главную с лимитом
            renderProducts(currentLimit);
        });
    });

    // close popover on click outside
    document.addEventListener("click", (e) => {
        const popover = document.querySelector(".popUp-style[popover]:popover-open");
        if (!popover) return;
        if (!popover.contains(e.target) && !e.target.closest(".popUp-btn")) {
            popover.hidePopover();
        }
    });

    // close popover on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const popover = document.querySelector(".popUp-style[popover]:popover-open");
            if (popover) popover.hidePopover();
        }
    });

    // back to top
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        });
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

if (typeof products !== "undefined") {
  init();
} else {
  document.addEventListener("productsLoaded", init);
}
