// app.js
// يعتمد على متغير `products` الموجود في products.js

// ------- عناصر DOM -------
const productSearch = document.getElementById("productSearch");
const productsArea = document.getElementById("productsArea");

const offerTitle = document.getElementById("offerTitle");
const deliveryCost = document.getElementById("deliveryCost");
const transferCost = document.getElementById("transferCost");

const generateSpecialOfferBtn = document.getElementById("generateSpecialOfferBtn");
const clearPreviewBtn = document.getElementById("clearPreviewBtn");

const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadImageBtn");

// ------- حالة التطبيق -------
let offerItems = [];      // عناصر العرض الحالية: { name, price, qty, total }
let searchTerm = "";
let openCategories = {};  // لتتبع حالة الفئات (مفتوحة/مطوية)

// ------ مسافة آمنة لزر التنزيل (في حال لم يضبطها CSS) -------
if (downloadBtn) {
  downloadBtn.style.marginTop = downloadBtn.style.marginTop || "12px";
}

// ------- تجميع المنتجات حسب الفئة -------
function groupProducts() {
  const grouped = {};
  (products || []).forEach(p => {
    if (searchTerm && !p.name.includes(searchTerm)) return;
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });
  return grouped;
}

// ------- عرض المنتجات (مطوية حسب الفئة) -------
function renderProducts() {
  productsArea.innerHTML = "";
  const grouped = groupProducts();
  const categories = Object.keys(grouped);

  if (categories.length === 0) {
    productsArea.innerHTML = `<p class="text-gray-500">لا توجد منتجات.</p>`;
    return;
  }

  categories.forEach(cat => {
    // رأس الفئة
    const catHeader = document.createElement("div");
    catHeader.className = "category-header";
    catHeader.innerHTML = `<span>${cat}</span><span>▾</span>`;
    catHeader.addEventListener("click", () => {
      openCategories[cat] = !openCategories[cat];
      renderProducts();
    });
    productsArea.appendChild(catHeader);

    // محتوى الفئة (مطوي افتراضياً)
    if (openCategories[cat]) {
      grouped[cat].forEach(p => {
        const row = document.createElement("div");
        row.className = "product-row";
        row.innerHTML = `
          <span class="product-name">${p.name}</span>
          <span class="product-price">${Number(p.price).toFixed(2)} €</span>
          <button class="add-btn" data-id="${p.id}">+</button>
        `;
        // حدث زر الإضافة
        row.querySelector(".add-btn").addEventListener("click", (e) => {
          addToOffer(p.id);
        });
        productsArea.appendChild(row);
      });
    }
  });
}

// ------- إضافة منتج للعرض -------
function addToOffer(id) {
  const p = (products || []).find(x => x.id === id);
  if (!p) return;
  // إذا أردنا دعم الكميات لاحقًا، يمكن تعديل هنا
  const item = { name: p.name, price: Number(p.price), qty: 1, total: Number(p.price) };
  offerItems.push(item);
  renderOffer();
}

// ------- إزالة عنصر من العرض -------
function removeFromOffer(index) {
  if (index < 0 || index >= offerItems.length) return;
  offerItems.splice(index, 1);
  renderOffer();
}

// ------- حساب الإجمالي -------
function computeTotals() {
  const itemsTotal = offerItems.reduce((s, it) => s + (Number(it.total) || 0), 0);
  const d = parseFloat(deliveryCost.value || 0) || 0;
  const t = parseFloat(transferCost.value || 0) || 0;
  const grand = itemsTotal + d + t;
  return { itemsTotal, delivery: d, transfer: t, grand };
}

// ------- عرض المعاينة (مباشر) -------
function renderOffer() {
  preview.innerHTML = "";

  // عنوان العرض (يظهر حتى لو كان فارغاً كعنوان افتراضي)
  const titleText = offerTitle.value.trim() || "سفير الشام – عرض";
  const h = document.createElement("h3");
  h.textContent = titleText;
  h.style.marginBottom = "8px";
  preview.appendChild(h);

  // المنتجات (كل صف: اسم | سعر | زر حذف)
  if (offerItems.length === 0) {
    const p = document.createElement("p");
    p.className = "text-gray-500";
    p.textContent = "لا توجد منتجات في العرض.";
    preview.appendChild(p);
  } else {
    offerItems.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "preview-item";

      const nameSpan = document.createElement("span");
      nameSpan.textContent = `${it.name}`; // لو أردت إضافة الكمية: `${it.name} (${it.qty})`

      const priceSpan = document.createElement("span");
      priceSpan.textContent = `${Number(it.total).toFixed(2)} €`;

      const btn = document.createElement("button");
      btn.textContent = "حذف";
      btn.addEventListener("click", () => removeFromOffer(idx));

      row.appendChild(nameSpan);
      row.appendChild(priceSpan);
      row.appendChild(btn);

      preview.appendChild(row);
    });
  }

  // التكاليف تحت بعضها
  const totals = computeTotals();
  const costDiv = document.createElement("div");
  costDiv.className = "preview-cost";
  costDiv.innerHTML = `
    <div>تكلفة التوصيل: ${totals.delivery.toFixed(2)} €</div>
    <div>تكلفة التحويل: ${totals.transfer.toFixed(2)} €</div>
  `;
  preview.appendChild(costDiv);

  // المجموع النهائي بمظهر مختلف وواضح
  const totalDiv = document.createElement("div");
  totalDiv.className = "preview-total";
  totalDiv.textContent = `المجموع النهائي: ${totals.grand.toFixed(2)} €`;
  preview.appendChild(totalDiv);

  // حالة زر التنزيل
  downloadBtn.disabled = offerItems.length === 0;
}

// ------- تنزيل المعاينة كصورة بدون أزرار حذف -------
function downloadPreviewAsImage() {
  if (offerItems.length === 0) return;

  // استنساخ المعاينة
  const clone = preview.cloneNode(true);

  // إزالة كل الأزرار التفاعلية من النسخة
  clone.querySelectorAll("button").forEach(b => b.remove());

  // ضع تنسيقات بسيطة لضمان صورة مرتبة
  clone.querySelectorAll(".preview-item").forEach(row => {
    row.style.backgroundColor = "#ffffff";
    row.style.padding = "8px";
    row.style.borderRadius = "6px";
    row.style.marginBottom = "6px";
  });
  clone.style.backgroundColor = "#ffffff";
  clone.style.padding = "12px";
  clone.style.border = "1px solid #e6eefc";

  // نضع النسخة خارج الشاشة قبل التقاطها
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  document.body.appendChild(clone);

  // التقاط الصورة بجودة أعلى
  html2canvas(clone, { backgroundColor: "#ffffff", scale: 2 }).then(canvas => {
    const a = document.createElement("a");
    a.download = "offer.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    // إزالة النسخة المؤقتة
    document.body.removeChild(clone);
  }).catch(err => {
    console.error("خطأ أثناء إنشاء صورة العرض:", err);
    if (clone.parentNode) clone.parentNode.removeChild(clone);
  });
}

// ------- الأحداث -------

// البحث النصي
productSearch.addEventListener("input", () => {
  searchTerm = productSearch.value.trim();
  renderProducts();
});

// تحديث المعاينة فورًا عند تعديل الحقول
offerTitle.addEventListener("input", renderOffer);
deliveryCost.addEventListener("input", renderOffer);
transferCost.addEventListener("input", renderOffer);

// أزرار الإنشاء / التفريغ / تنزيل
generateSpecialOfferBtn.addEventListener("click", () => {
  // مثال: نملأ العرض بعناصر محددة (يمكنك تعديل القائمة لتناسب احتياجك)
  offerItems = [
    { name: "٥ كغ سكر", price: 3.75, qty: 1, total: 3.75 },
    { name: "٥ كغ رز مصري", price: 5.00, qty: 1, total: 5.00 },
    { name: "٥ كغ رز تايلندي", price: 5.00, qty: 1, total: 5.00 },
    { name: "٢ كغ دبس بندورة", price: 3.00, qty: 1, total: 3.00 },
    { name: "٢ كغ سمنة كلارنا", price: 5.85, qty: 1, total: 5.85 },
    { name: "٤ لتر زيت دوار الشمس", price: 8.35, qty: 1, total: 8.35 },
    { name: "٢ كغ برغل خشن", price: 1.70, qty: 1, total: 1.70 },
    { name: "٤٥٠ غ شاي سيدي هشام", price: 5.50, qty: 1, total: 5.50 },
    { name: "٥٠٠ غ بن الحموي هال اكسترا", price: 8.50, qty: 1, total: 8.50 },
    { name: "٥ قوالب ماجي", price: 1.00, qty: 1, total: 1.00 },
    { name: "٢ كغ فخاد فروج", price: 5.00, qty: 1, total: 5.00 },
    { name: "١ كغ لحمة عجل هبرة", price: 12.00, qty: 1, total: 12.00 }
  ];
  renderOffer();
});

clearPreviewBtn.addEventListener("click", () => {
  offerItems = [];
  offerTitle.value = "";
  deliveryCost.value = "";
  transferCost.value = "";
  renderOffer();
});

downloadBtn.addEventListener("click", downloadPreviewAsImage);

// ------- تهيئة أولية -------
renderProducts();
renderOffer();
