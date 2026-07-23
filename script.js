// Категории меню: ключ соответствует полю в products.js,
// title — подпись в навигации/слайдере, icon — SVG для мобильного слайдера категорий.
const CATEGORIES = [
  { key: "drinks", title: "Напитки", icon: '<img src="content/Напитки/cafe hb.webp" alt="">' },
  { key: "breakfast", title: "Завтраки", icon: '<img src="content/Завтраки/Глазунья из 3 яиц.webp" alt="">' },
  { key: "salads", title: "Салаты", icon: '<img src="content/Салаты/Буратто с запечённый икрой.webp" alt="">' },
  { key: "soups", title: "Супы", icon: '<img src="content/Супы/Тыквенный крем-суп.webp" alt="">' },
  { key: "sandwiches", title: "Сендвичи", icon: '<img src="content/Cендвич/Сендвич с курицей и моцареллой.webp" alt="">' },
  { key: "burgers", title: "Бургеры", icon: '<img src="content/Бургеры/Бургер с говядиной.webp" alt="">' },
  { key: "dishes", title: "Горячие блюда", icon: '<img src="content/Горячие блюда/Жаркое с говядиной и овощами.webp" alt="">' },
];

const ALL_CATEGORIES_ICON = ' <img src="content/logo/LOGO.webp" alt="">';

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

function getProductVolume(product) {
  if (product.volume) return product.volume;

  const match = product.name.match(/(\d+)\s*(мл|ml)/i);
  if (!match) return "";

  const value = match[1];
  const unit = match[2].toLowerCase() === "ml" ? "ml" : "мл";
  return `${value} ${unit}`;
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

  const meta = document.createElement("div");
  meta.className = "popUp-meta";
  meta.appendChild(price);

  const volumeText = getProductVolume(product);
  if (volumeText) {
    const volume = document.createElement("span");
    volume.className = "popUp-volume";
    volume.textContent = volumeText;
    meta.appendChild(volume);
  }

  const body = document.createElement("div");
  body.className = "popUp-body";
  body.append(title, meta);

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

function renderCategorySection(category, limit, onCategorySelect, onToggleCategory, options = {}) {
  const items = products[category.key] || [];
  const isExpanded = options.isExpanded === true;
  const showToggle = options.showToggle === true;
  const sectionLimit = isExpanded ? null : limit;
  const showingAll = sectionLimit == null;
  const visibleItems = showingAll ? items : items.slice(0, sectionLimit);

  const title = document.createElement("button");
  title.type = "button";
  title.className = "category-title";
  title.textContent = category.title;
  title.addEventListener("click", (event) => {
    event.preventDefault();
    if (typeof onCategorySelect === "function") {
      onCategorySelect(category.key);
    }
  });

  const cardsContainer = document.createElement("div");
  cardsContainer.className = showingAll ? "cards-container full-mobile" : "cards-container";
  visibleItems.forEach((product) => {
    cardsContainer.appendChild(createProductCard(product, category.key));
  });

  const section = document.createElement("section");
  section.className = "category-section";
  section.dataset.category = category.key;
  section.append(title, cardsContainer);

  if (showToggle && (items.length > (limit ?? 0) || isExpanded)) {
    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "category-toggle";
    toggleButton.textContent = isExpanded ? "Скрыть все" : "Показать все";
    toggleButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof onToggleCategory === "function") {
        onToggleCategory(category.key);
      }
    });
    section.appendChild(toggleButton);
  }

  return section;
}

function resetProductsView() {
  document.getElementById("products-container").innerHTML = "";
  getPopupsRoot().innerHTML = "";
  document.body.style.overflow = "";
}

function renderProducts(limit, onCategorySelect, expandedCategoryKey = null, onToggleCategory = null) {
  resetProductsView();
  const container = document.getElementById("products-container");
  CATEGORIES.forEach((category) => {
    if (products[category.key]?.length) {
      container.appendChild(
        renderCategorySection(category, limit, onCategorySelect, onToggleCategory, {
          showToggle: Boolean(onToggleCategory),
          isExpanded: expandedCategoryKey === category.key,
        })
      );
    }
  });
}

function filterByCategory(categoryKey, limit, onCategorySelect) {
  if (categoryKey === "all") {
    renderProducts(limit ?? getDefaultLimit(), onCategorySelect);
    return;
  }

  const category = CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return;

  resetProductsView();
  document.getElementById("products-container").appendChild(
    renderCategorySection(category, limit ?? null, onCategorySelect, null, {
      showToggle: false,
      isExpanded: false,
    })
  );
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

/* ---------- Вызов официанта через Telegram ---------- */

const TELEGRAM_BOT_TOKEN = "8900105881:AAGZLy7-sB_z7-tAzHdIACPCwUpXvLXhubY";
const TELEGRAM_CHAT_ID = "-1004410311353";

function getTableNumber() {
  const params = new URLSearchParams(window.location.search);
  return params.get("table"); // например ?table=3
}

async function sendWaiterCall(tableNumber) {
  const text = `🔔 Столик №${tableNumber} просит официанта`;

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

/* ---------- Рейтинговая система ---------- */

async function sendRating(tableNumber, stars) {
  const starEmojis = "⭐".repeat(stars);
  const text = `⭐${stars} Столик №${tableNumber} оценил обслуживание: ${starEmojis}`;

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
  if (!data.ok) throw new Error("Failed to send rating");
}

function saveRatingToStorage(tableNumber, stars) {
  // Сохраняем оценку в localStorage
  const ratings = JSON.parse(localStorage.getItem("waiterRatings") || "{}");
  if (!ratings[tableNumber]) {
    ratings[tableNumber] = [];
  }
  ratings[tableNumber].push({
    stars: stars,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("waiterRatings", JSON.stringify(ratings));
}

function showRatingForm(tableNumber) {
  const overlay = document.getElementById("ratingOverlay");
  const form = document.getElementById("ratingForm");

  if (!overlay || !form) return;

  // Сохраняем номер стола в data атрибут
  form.dataset.table = tableNumber;

  // Сбрасываем выбранные звёзды
  document.querySelectorAll(".rating-star").forEach((star) => {
    star.classList.remove("active");
  });

  // Показываем форму
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function hideRatingForm() {
  const overlay = document.getElementById("ratingOverlay");
  if (!overlay) return;

  overlay.classList.remove("active");
  document.body.style.overflow = "";

  // Возвращаем кнопку в исходное состояние
  const button = document.getElementById("callWaiterBtn");
  if (button) {
    button.disabled = false;
    button.textContent = "🔔 Позвать официанта";
    button.dataset.mode = "call";
  }
}

function initRatingForm() {
  const overlay = document.getElementById("ratingOverlay");
  const form = document.getElementById("ratingForm");
  const stars = document.querySelectorAll(".rating-star");
  const submitBtn = document.getElementById("submitRatingBtn");
  const closeBtn = document.getElementById("closeRatingBtn");

  if (!overlay || !form) return;

  let selectedRating = 0;

  // Клик по звёздам
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.rating);

      // Подсветить звёзды до выбранной
      stars.forEach((s) => {
        if (parseInt(s.dataset.rating) <= selectedRating) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });

    // Эффект при наведении
    star.addEventListener("mouseenter", () => {
      const hoverRating = parseInt(star.dataset.rating);
      stars.forEach((s) => {
        if (parseInt(s.dataset.rating) <= hoverRating) {
          s.classList.add("hover");
        } else {
          s.classList.remove("hover");
        }
      });
    });
  });

  // Убрать эффект при наведении когда курсор уходит
  form.addEventListener("mouseleave", () => {
    stars.forEach((s) => {
      s.classList.remove("hover");
      if (parseInt(s.dataset.rating) <= selectedRating) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });
  });

  // Отправка оценки
  submitBtn.addEventListener("click", async () => {
    if (selectedRating === 0) {
      alert("Пожалуйста, выберите оценку");
      return;
    }

    const tableNumber = form.dataset.table;
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем...";

    try {
      await sendRating(tableNumber, selectedRating);
      saveRatingToStorage(tableNumber, selectedRating);

      submitBtn.textContent = "✅ Спасибо за оценку!";
      setTimeout(() => {
        hideRatingForm();
      }, 2000);
    } catch (err) {
      console.error(err);
      submitBtn.textContent = "❌ Ошибка отправки";
      submitBtn.disabled = false;
    }
  });

  // Закрытие формы
  closeBtn.addEventListener("click", hideRatingForm);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hideRatingForm();
  });

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      hideRatingForm();
    }
  });
}

function initCallWaiter() {
  const button = document.getElementById("callWaiterBtn");
  if (!button) return;

  const tableNumber = getTableNumber();

  // Если номера стола нет в ссылке — кнопку не показываем
  if (!tableNumber) {
    button.style.display = "none";
    return;
  }

  // Инициализируем режим кнопки
  button.dataset.mode = "call";
  button.dataset.tableNumber = tableNumber;

  button.addEventListener("click", async () => {
    // Режим 1: Вызвать официанта
    if (button.dataset.mode === "call") {
      button.disabled = true;
      button.textContent = "Отправляем...";

      try {
        await sendWaiterCall(tableNumber);
        // Успешно отправили — переходим в режим оценки
        button.textContent = "⭐ Оценить обслуживание";
        button.dataset.mode = "rate";
        button.disabled = false;
      } catch (err) {
        console.error(err);
        button.textContent = "❌ Ошибка, попробуйте ещё раз";
        button.disabled = false;
      }
    }
    // Режим 2: Показать форму оценки
    else if (button.dataset.mode === "rate") {
      showRatingForm(tableNumber);
    }
  });
}

/* ---------- Инициализация ---------- */

document.addEventListener("DOMContentLoaded", () => {
  let currentLimit = getDefaultLimit();
  let expandedCategoryKey = null;
  let restoreScrollPosition = null;

  const navigateToCategory = (categoryKey) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (categoryKey === "all") {
      expandedCategoryKey = null;
      restoreScrollPosition = null;
      renderProducts(currentLimit, navigateToCategory, expandedCategoryKey, toggleCategoryView);
    } else {
      filterByCategory(categoryKey, null, navigateToCategory);
    }
  };

  const toggleCategoryView = (categoryKey) => {
    const isCollapsing = expandedCategoryKey === categoryKey;

    if (isCollapsing) {
      expandedCategoryKey = null;
      renderProducts(currentLimit, navigateToCategory, expandedCategoryKey, toggleCategoryView);

      if (restoreScrollPosition !== null) {
        window.scrollTo({ top: restoreScrollPosition, behavior: "smooth" });
      }
      return;
    }

    restoreScrollPosition = window.scrollY;
    expandedCategoryKey = categoryKey;
    renderProducts(currentLimit, navigateToCategory, expandedCategoryKey, toggleCategoryView);
  };

  initCategorySlider(navigateToCategory);
  initNavLinks(navigateToCategory);
  initPopoverDismissal();
  initBackToTop();
  initCallWaiter();
  initRatingForm();

  renderProducts(currentLimit, navigateToCategory, expandedCategoryKey, toggleCategoryView);

  window.addEventListener("resize", () => {
    const newLimit = getDefaultLimit();
    if (newLimit !== currentLimit) {
      currentLimit = newLimit;
      renderProducts(currentLimit, navigateToCategory, expandedCategoryKey, toggleCategoryView);
    }
  });
});
