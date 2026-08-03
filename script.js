const ALL_BRANDS = ["Toyota", "Honda", "Nissan", "Mazda", "Subaru", "Mitsubishi", "Suzuki"];
const WHATSAPP_BASE = "https://wa.me/992985147438";

const productGroups = [
  {
    prefix: "wish-engine",
    count: 8,
    title: "Матор ва каропка 1.8 Валматик барои Toyota Wish (2008-2014)",
    brand: "Toyota",
    model: "Wish 2008-2014",
    category: "Мотор ва каропка",
    basePrice: 9800,
    step: 220
  },
  {
    prefix: "prius-welfire-stop",
    count: 4,
    title: "Задние стоп барои Toyota Prius ва Welfire (2008-2014)",
    brand: "Toyota",
    model: "Prius / Welfire 2008-2014",
    category: "Стоп чароғ",
    basePrice: 1250,
    step: 85
  },
  {
    prefix: "granata",
    count: 3,
    title: "Хама намуди граната барои Prius, Estima, Welfire",
    brand: "Toyota",
    model: "Prius / Estima / Welfire",
    category: "Граната",
    basePrice: 1111,
    step: 70
  },
  {
    prefix: "springs",
    count: 2,
    title: "Хама намуди пуржинаҳои пеш ва кафо барои Toyota Prius ва Estima",
    brand: "Toyota",
    model: "Prius / Estima",
    category: "Пуржина",
    basePrice: 870,
    step: 60
  },
  {
    prefix: "spare-r16-r17",
    count: 3,
    title: "Сапаскаи 5 болта R16/R17 барои дилхоҳ намуди мошинҳо",
    brands: ALL_BRANDS,
    model: "R16 / R17",
    category: "Сапаска",
    basePrice: 790,
    step: 55
  },
  {
    prefix: "estima-seat",
    count: 4,
    title: "Сиделни рияди байн (кожа/алкантара) барои Toyota Estima",
    brand: "Toyota",
    model: "Estima 2008-2014",
    category: "Сидение",
    basePrice: 2450,
    step: 160
  },
  {
    prefix: "electro-pump",
    count: 5,
    title: "Електроный насос барои дилхоҳ намуди мошинҳо",
    brands: ALL_BRANDS,
    model: "Universal",
    category: "Насос",
    basePrice: 640,
    step: 35
  },
  {
    prefix: "estima-parts",
    count: 5,
    title: "Хама намуди запчастхо барои Toyota Estima",
    brand: "Toyota",
    model: "Estima 2008-2014",
    category: "Запчастҳои Estima",
    basePrice: 520,
    step: 45
  },
  {
    prefix: "filder-axio",
    count: 3,
    title: "Хама намуди запчастхо барои Toyota Filder ва Axio",
    brand: "Toyota",
    model: "Filder / Axio 2008-2014",
    category: "Запчастҳои Filder/Axio",
    basePrice: 470,
    step: 40
  }
];

function makeProducts() {
  const list = [];
  let popularOrder = 0;

  productGroups.forEach((group) => {
    for (let i = 1; i <= group.count; i += 1) {
      popularOrder += 1;
      const num = String(i).padStart(2, "0");
      const brand = group.brands ? group.brands[(i - 1) % group.brands.length] : group.brand;
      const price = group.basePrice + (i - 1) * group.step;
      const name = `${group.title} (сурат ${i})`;

      list.push({
        id: `${group.prefix}-${num}`,
        image: `assets/media/${group.prefix}-${num}.jpg`,
        name,
        shortName: group.title,
        brand,
        model: group.model,
        category: group.category,
        price,
        status: i % 4 === 0 ? "Фақат 1-2 дона монд" : "Дар анбор ҳаст",
        order: popularOrder
      });
    }
  });

  return list;
}

const products = makeProducts();

function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} сомонӣ`;
}

function buildWhatsAppLink(text) {
  const message = encodeURIComponent(`Салом, ба ман ин маҳсулот даркор аст: ${text}`);
  return `${WHATSAPP_BASE}?text=${message}`;
}

function filterProducts(source, query, brand) {
  const q = (query || "").trim().toLowerCase();

  return source.filter((item) => {
    const byBrand = brand === "all" || item.brand === brand;
    if (!byBrand) return false;
    if (!q) return true;

    const haystack = `${item.name} ${item.brand} ${item.model} ${item.category}`.toLowerCase();
    return haystack.includes(q);
  });
}

function renderGallery(targetId, items) {
  const box = document.getElementById(targetId);
  if (!box) return;

  box.innerHTML = items
    .map(
      (item) => `
      <article class="gallery-item">
        <img src="${item.image}" alt="${item.shortName}" loading="lazy">
        <div class="gallery-caption">
          <h3>${item.shortName}</h3>
          <p>${item.brand} • ${item.model}</p>
        </div>
      </article>
    `
    )
    .join("");
}

function initHomeGallery() {
  const homeGalleryItems = products.filter((_, index) => index % 2 === 0).slice(0, 12);
  renderGallery("homeGallery", homeGalleryItems);
}

function initAboutGallery() {
  renderGallery("aboutGallery", products);
}

function initPromoGallery() {
  const promoItems = products
    .filter((item) => item.category.includes("Пуржина") || item.category.includes("Стоп") || item.category.includes("Граната"))
    .slice(0, 9);

  renderGallery("promoGallery", promoItems.length ? promoItems : products.slice(0, 9));
}

function initQuickCatalog() {
  const tableBody = document.getElementById("quickTableBody");
  const searchInput = document.getElementById("quickSearch");
  const filterWrap = document.getElementById("quickBrandFilters");

  if (!tableBody || !searchInput || !filterWrap) return;

  const state = {
    query: "",
    brand: "all"
  };

  function renderRows() {
    const filtered = filterProducts(products, state.query, state.brand).slice(0, 10);

    if (!filtered.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5">Аз рӯйи ҷустуҷӯи шумо маҳсулот ёфт нашуд.</td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered
      .map(
        (item) => `
        <tr>
          <td>${item.shortName}</td>
          <td>${item.brand} / ${item.model}</td>
          <td>${formatPrice(item.price)}</td>
          <td><span class="status">${item.status}</span></td>
          <td><a class="mini-btn" target="_blank" rel="noopener" href="${buildWhatsAppLink(item.name)}">Дар WhatsApp пурсед</a></td>
        </tr>
      `
      )
      .join("");
  }

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderRows();
  });

  filterWrap.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.brand = button.dataset.brand || "all";
      filterWrap.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderRows();
    });
  });

  renderRows();
}

function renderCatalogCards(items) {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = "<p>Маҳсулот ёфт нашуд. Ҷустуҷӯро дигар кунед.</p>";
    return;
  }

  grid.innerHTML = items
    .map(
      (item) => `
      <article class="product-card">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="product-body">
          <h3 class="product-title">${item.shortName}</h3>
          <p class="product-meta">${item.brand} • ${item.model}</p>
          <p class="product-meta">${item.category}</p>
          <p class="product-price">${formatPrice(item.price)}</p>
          <a class="btn btn-whatsapp" href="${buildWhatsAppLink(item.name)}" target="_blank" rel="noopener">Дар WhatsApp пурсед</a>
        </div>
      </article>
    `
    )
    .join("");
}

function initCatalogPage() {
  const searchInput = document.getElementById("catalogSearch");
  const brandSelect = document.getElementById("catalogBrand");
  const sortSelect = document.getElementById("catalogSort");
  const resultText = document.getElementById("catalogResultText");

  if (!searchInput || !brandSelect || !sortSelect || !resultText) return;

  const state = {
    query: "",
    brand: "all",
    sort: "popular"
  };

  function applySort(items) {
    const copy = [...items];

    if (state.sort === "price-asc") {
      copy.sort((a, b) => a.price - b.price);
    } else if (state.sort === "price-desc") {
      copy.sort((a, b) => b.price - a.price);
    } else {
      copy.sort((a, b) => a.order - b.order);
    }

    return copy;
  }

  function updateCatalog() {
    const filtered = filterProducts(products, state.query, state.brand);
    const sorted = applySort(filtered);

    resultText.textContent = `${sorted.length} маҳсулот ёфт шуд.`;
    renderCatalogCards(sorted);
  }

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    updateCatalog();
  });

  brandSelect.addEventListener("change", (event) => {
    state.brand = event.target.value;
    updateCatalog();
  });

  sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    updateCatalog();
  });

  updateCatalog();
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form || !note) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    note.textContent = "Паёми шумо қабул шуд. Мо дар кутоҳтарин вақт бо шумо тамос мегирем.";
    form.reset();
  });
}

function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const pageKey = page.replace(".html", "") || "index";
  const activeLink = document.querySelector(`[data-nav="${pageKey}"]`);
  if (activeLink) activeLink.classList.add("active");
}

function initWelcomeModal() {
  const modal = document.getElementById("welcomeModal");
  const closeBtn = document.getElementById("closeWelcome");
  if (!modal || !closeBtn) return;

  if (sessionStorage.getItem("jaz_welcome_seen") === "1") return;

  const close = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    sessionStorage.setItem("jaz_welcome_seen", "1");
  };

  setTimeout(() => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }, 700);

  closeBtn.addEventListener("click", close);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
}

function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initYear();
  initWelcomeModal();

  initHomeGallery();
  initAboutGallery();
  initPromoGallery();

  initQuickCatalog();
  initCatalogPage();
  initContactForm();
});
