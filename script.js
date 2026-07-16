// Категории меню: ключ соответствует полю в products.js,
// title — подпись в навигации/слайдере, icon — SVG для мобильного слайдера категорий.
const CATEGORIES = [
  { key: "drinks", title: "Напитки", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3561C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>' },
  { key: "burgers", title: "Бургеры", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3561C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Z"/><path d="M3 12h18l-1 6H4Z"/><path d="M4 18h16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/></svg>' },
  { key: "sandwiches", title: "Сендвичи", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3561C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1Z"/><path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><line x1="4" y1="15" x2="20" y2="15"/></svg>' },
  { key: "salads", title: "Салаты", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3561C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10a2 2 0 0 0 2-2v-2H5v2a2 2 0 0 0 2 2Z"/><path d="M12 17V9"/><path d="M8 13l4-4 4 4"/><circle cx="12" cy="7" r="2"/></svg>' },
  { key: "dishes", title: "Блюда", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3561C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>' },
  { key: "breakfast", title: "Завтраки", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3561C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' },
];

const ALL_CATEGORIES_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#3561C0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';

const MOBILE_BREAKPOINT = 720;
const MOBILE_CARD_LIMIT = 4;
const DESKTOP_CARD_LIMIT = 6;
const SHEET_CLOSE_DURATION = 270; // мс, должно совпадать с transition в style.css

/* ---------- Открытие/закрытие попапа-шторки ---------- */

function openPopup(popupId) {
  document.querySelectorAll(".popUp-overlay.active").forEach((overlay) => {
    if (overlay.id !== popupId) overlay.classList.remove("active", "closing");
  });

  const overlay = document.getElementById(popupId);
  if (!overlay) return;

  overlay.classList.remove("closing");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePopup(popupId) {
  const overlay = document.getElementById(popupId);
  if (!overlay || !overlay.classList.contains("active")) return;

  overlay.classList.add("closing");
  document.body.style.overflow = "";

  setTimeout(() => {
    overlay.classList.remove("active", "closing");
  }, SHEET_CLOSE_DURATION);
}

function closeActivePopup() {
  const overlay = document.querySelector(".popUp-overlay.active");
  if (overlay) closePopup(overlay.id);
}

/* ---------- Построение карточки товара ---------- */

function createProductImage(product) {
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  return img;
}

function createPopupId(categoryKey, product) {
  return `${categoryKey}-${product.id}`.replace(/\s+/g, "-");
}

function createProductPopup(product, popupId) {
  const imageWrap = document.createElement("div");
  imageWrap.className = "popUp-image-wrap";
  if (product.image) imageWrap.appendChild(createProductImage(product));

  const title = document.createElement("h3");
  title.textContent = product.name;

  const price = document.createElement("span");
  price.className = "popUp-price";
  price.textContent = `${product.price} c`;

  const body = document.createElement("div");
  body.className = "popUp-body";
  body.append(title, price);

  if (product.description) {
    const description = document.createElement("p");
    description.className = "popUp-description";
    description.textContent = product.description;
    body.appendChild(description);
  }

  const scroll = document.createElement("div");
  scroll.className = "popUp-scroll";
  scroll.append(imageWrap, body);

  const handle = document.createElement("div");
  handle.className = "popUp-handle";

  const closeButton = document.createElement("button");
  closeButton.className = "popUp-close";
  closeButton.setAttribute("aria-label", "Закрыть");
  closeButton.textContent = "×";
  closeButton.addEventListener("click", () => closePopup(popupId));

  const sheet = document.createElement("div");
  sheet.className = "popUp-sheet";
  sheet.append(closeButton, handle, scroll);

  const overlay = document.createElement("div");
  overlay.className = "popUp-overlay";
  overlay.id = popupId;
  overlay.appendChild(sheet);

  // Клик по затемнённому фону (мимо шторки) закрывает попап
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closePopup(popupId);
  });

  return overlay;
}

function createProductButton(product, popupId) {
  const button = document.createElement("button");
  button.className = "popUp-btn";

  if (product.image) button.appendChild(createProductImage(product));

  const title = document.createElement("h3");
  title.textContent = product.name;

  const price = document.createElement("span");
  price.className = "price-badge";
  price.textContent = `${product.price} c`;

  button.append(title, price);
  button.addEventListener("click", () => openPopup(popupId));

  return button;
}

// Попапы живут в отдельном корне на уровне <body>, а не внутри .card.
// Это важно: у .card есть постоянный backdrop-filter, а он (как и transform/filter)
// создаёт новый containing block для position:fixed-потомков — попап "застрял" бы
// внутри маленькой карточки товара вместо того, чтобы перекрывать весь экран.
function getPopupsRoot() {
  let root = document.getElementById("popups-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "popups-root";
    document.body.appendChild(root);
  }
  return root;
}

function createProductCard(product, categoryKey) {
  const card = document.createElement("div");
  card.className = product.size === "mini" ? "card card-mini" : "card";

  const popupId = createPopupId(categoryKey, product);
  const popup = createProductPopup(product, popupId);
  const button = createProductButton(product, popupId);

  card.appendChild(button);
  getPopupsRoot().appendChild(popup);

  return card;
}

/* ---------- Рендер секций и списка товаров ---------- */

function renderCategorySection(category, limit) {
  const showingAll = limit == null;
  const items = products[category.key] || [];
  const visibleItems = showingAll ? items : items.slice(0, limit);

  const title = document.createElement("h2");
  title.className = "category-title";
  title.textContent = category.title;

  const cardsContainer = document.createElement("div");
  cardsContainer.className = showingAll ? "cards-container full-mobile" : "cards-container";
  visibleItems.forEach((product) => {
    cardsContainer.appendChild(createProductCard(product, category.key));
  });

  const section = document.createElement("section");
  section.className = "category-section";
  section.dataset.category = category.key;
  section.append(title, cardsContainer);

  return section;
}

function resetProductsView() {
  document.getElementById("products-container").innerHTML = "";
  getPopupsRoot().innerHTML = "";
  document.body.style.overflow = "";
}

function renderProducts(limit) {
  resetProductsView();
  const container = document.getElementById("products-container");
  CATEGORIES.forEach((category) => {
    if (products[category.key]?.length) {
      container.appendChild(renderCategorySection(category, limit));
    }
  });
}

function filterByCategory(categoryKey, limit) {
  if (categoryKey === "all") {
    renderProducts(limit ?? getDefaultLimit());
    return;
  }

  const category = CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return;

  resetProductsView();
  document.getElementById("products-container").appendChild(renderCategorySection(category, limit ?? null));
}

function getDefaultLimit() {
  return window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_CARD_LIMIT : DESKTOP_CARD_LIMIT;
}

/* ---------- Слайдер категорий (мобильная версия) ---------- */

function createCategoryChip(key, label, iconHtml, isActive) {
  const chip = document.createElement("div");
  chip.className = isActive ? "category-chip active" : "category-chip";
  chip.dataset.category = key;
  chip.innerHTML = `<div class="category-chip-icon">${iconHtml}</div><span class="category-chip-label">${label}</span>`;
  return chip;
}

function initCategorySlider(onSelect) {
  const slider = document.getElementById("categorySlider");
  if (!slider) return;

  slider.appendChild(createCategoryChip("all", "Все", ALL_CATEGORIES_ICON, true));
  CATEGORIES.forEach((category) => {
    slider.appendChild(createCategoryChip(category.key, category.title, category.icon, false));
  });

  slider.addEventListener("click", (event) => {
    const chip = event.target.closest(".category-chip");
    if (!chip) return;

    slider.querySelectorAll(".category-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    onSelect(chip.dataset.category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Навигация (десктопное меню и логотипы) ---------- */

function initNavLinks(onNavigate) {
  const mainNav = document.querySelector(".mainNav");

  // Пункты меню и логотип внутри .mainNav: переход к категории или на витрину.
  document.querySelectorAll(".mainNav a[data-category]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      onNavigate(link.dataset.category);
      mainNav.classList.remove("active");
    });
  });

  // Мобильный логотип всегда возвращает на витрину с ограничением по количеству карточек.
  document.querySelectorAll(".join-a.logo-m[data-category]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      onNavigate("all");
    });
  });
}

/* ---------- Закрытие попапа клавишей Escape ---------- */
/* Закрытие кликом по фону уже настроено в createProductPopup для каждого попапа */

function initPopoverDismissal() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeActivePopup();
  });
}

/* ---------- Кнопка "наверх" ---------- */

function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  window.addEventListener("scroll", () => {
    button.classList.toggle("visible", window.scrollY > 400);
  });
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Инициализация ---------- */

document.addEventListener("DOMContentLoaded", () => {
  let currentLimit = getDefaultLimit();

  const navigateToCategory = (categoryKey) => {
    if (categoryKey === "all") {
      renderProducts(currentLimit);
    } else {
      filterByCategory(categoryKey, null);
    }
  };

  initCategorySlider(navigateToCategory);
  initNavLinks(navigateToCategory);
  initPopoverDismissal();
  initBackToTop();

  renderProducts(currentLimit);

  window.addEventListener("resize", () => {
    const newLimit = getDefaultLimit();
    if (newLimit !== currentLimit) {
      currentLimit = newLimit;
      renderProducts(currentLimit);
    }
  });
});
