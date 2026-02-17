if (!window.MENU) {
  console.error("MENU data not found. تأكد من menu-data.js وترتيب السكربتات.");
} else {
  const data = window.MENU;

  document.title = `${data.restaurantName} | Menu`;
  const restNameEl = document.getElementById("restName");
  if (restNameEl) restNameEl.textContent = data.restaurantName;

  const tabsEl = document.getElementById("tabs");
  const gridEl = document.getElementById("grid");
  const searchEl = document.getElementById("search");
  const clearBtn = document.getElementById("clearSearch");
  const emptyEl = document.getElementById("empty");
  const resetBtn = document.getElementById("reset");
  const countEl = document.getElementById("itemsCount");

  let activeCategory = "all";
  let query = "";

  function fmtPrice(n) {
    return `${Number(n).toLocaleString("en-US")} ${data.currency}`;
  }

  function buildTabs() {
    tabsEl.innerHTML = "";
    data.categories.forEach((c) => {
      const b = document.createElement("button");
      b.className = "tab" + (c.id === activeCategory ? " active" : "");
      b.textContent = c.name;
      b.onclick = () => {
        activeCategory = c.id;
        render();
        setActiveTab();
      };
      tabsEl.appendChild(b);
    });
  }

  function setActiveTab() {
    [...tabsEl.children].forEach((btn, i) => {
      const c = data.categories[i];
      btn.classList.toggle("active", c.id === activeCategory);
    });
  }

  function filteredItems() {
    return data.items.filter((item) => {
      const inCat = activeCategory === "all" ? true : item.category === activeCategory;
      const hay = (item.name + " " + (item.desc || "") + " " + (item.tag || "")).toLowerCase();
      const inSearch = !query ? true : hay.includes(query.toLowerCase());
      return inCat && inSearch;
    });
  }

  function render() {
    const items = filteredItems();
    countEl.textContent = items.length;
    gridEl.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";

      card.innerHTML = `
        <div class="media">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/placeholder.jpg'"/>
          <div class="badge">${item.tag || "وجبة"}</div>
        </div>
        <div class="body">
          <div style="flex:1">
            <h3 class="title">${item.name}</h3>
            <p class="sub">${(item.desc || "").slice(0, 60)}${(item.desc||"").length>60 ? "..." : ""}</p>

            <div class="details">
              <button class="moreBtn" type="button">تفاصيل</button>
              <span class="sub">${item.category}</span>
            </div>

            <p class="sub fullDesc hidden">${item.desc || ""}</p>
          </div>
          <div class="price">${fmtPrice(item.price)}</div>
        </div>
      `;

      const moreBtn = card.querySelector(".moreBtn");
      const fullDesc = card.querySelector(".fullDesc");

      moreBtn.addEventListener("click", () => {
        const isHidden = fullDesc.classList.contains("hidden");
        fullDesc.classList.toggle("hidden");
        moreBtn.textContent = isHidden ? "إخفاء" : "تفاصيل";
      });

      gridEl.appendChild(card);
    });

    emptyEl.classList.toggle("hidden", items.length !== 0);
  }

  searchEl.addEventListener("input", () => {
    query = searchEl.value.trim();
    render();
  });

  clearBtn.addEventListener("click", () => {
    searchEl.value = "";
    query = "";
    render();
    searchEl.focus();
  });

  resetBtn?.addEventListener("click", () => {
    activeCategory = "all";
    query = "";
    searchEl.value = "";
    buildTabs();
    render();
  });

  buildTabs();
  render();
}
