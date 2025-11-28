// عناصر الواجهة
const categorySelect = document.getElementById("categorySelect");
const productSelect = document.getElementById("productSelect");
const qtyInput = document.getElementById("qtyInput");

const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");

const offerTitleInput = document.getElementById("offerTitle");
const deliveryCostInput = document.getElementById("deliveryCost");
const transferCostInput = document.getElementById("transferCost");

const previewDiv = document.getElementById("preview");

// مصفوفة المنتجات المختارة
let offerItems = [];

// تحميل المنتجات حسب الفئة
function loadProductsForCategory() {
    productSelect.innerHTML = "";

    const category = categorySelect.value;
    if (!products[category]) return;

    products[category].forEach(prod => {
        const opt = document.createElement("option");
        opt.value = prod.name;
        opt.textContent = `${prod.name} - ${prod.price}€`;
        opt.dataset.price = prod.price;
        productSelect.appendChild(opt);
    });
}

// تحديث المعاينة فورًا عند التعديل
offerTitleInput.addEventListener("input", updatePreview);
deliveryCostInput.addEventListener("input", updatePreview);
transferCostInput.addEventListener("input", updatePreview);

// زر إضافة منتج للمعاينة
addBtn.addEventListener("click", () => {
    const name = productSelect.value;
    const price = parseFloat(productSelect.selectedOptions[0].dataset.price);
    const qty = parseFloat(qtyInput.value) || 1;

    if (!name || price <= 0 || qty <= 0) return;

    const total = price * qty;

    offerItems.push({
        name,
        price,
        qty,
        total
    });

    updatePreview();
});

// زر تفريغ العرض بالكامل
clearBtn.addEventListener("click", () => {
    offerItems = [];
    offerTitleInput.value = "";
    deliveryCostInput.value = "";
    transferCostInput.value = "";
    updatePreview();
});

// دالة تحديث المعاينة
function updatePreview() {
    previewDiv.innerHTML = "";

    // عنوان العرض
    const title = offerTitleInput.value.trim();
    if (title) {
        const h2 = document.createElement("h2");
        h2.textContent = title;
        h2.style.marginBottom = "15px";
        previewDiv.appendChild(h2);
    }

    // المنتجات
    offerItems.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "preview-item";

        const nameSpan = document.createElement("span");
        nameSpan.className = "item-name";
        nameSpan.textContent = `${item.name} (${item.qty})`;

        const priceSpan = document.createElement("span");
        priceSpan.className = "item-price";
        priceSpan.textContent = item.total.toFixed(2) + " €";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.className = "delete-item-btn";
        deleteBtn.onclick = () => {
            offerItems.splice(index, 1);
            updatePreview();
        };

        row.appendChild(nameSpan);
        row.appendChild(priceSpan);
        row.appendChild(deleteBtn);
        previewDiv.appendChild(row);
    });

    // تكاليف إضافية
    const delivery = parseFloat(deliveryCostInput.value) || 0;
    const transfer = parseFloat(transferCostInput.value) || 0;

    if (delivery > 0) {
        const d = document.createElement("div");
        d.className = "cost-row";
        d.innerHTML = `<strong>تكلفة التوصيل:</strong> ${delivery.toFixed(2)} €`;
        previewDiv.appendChild(d);
    }

    if (transfer > 0) {
        const t = document.createElement("div");
        t.className = "cost-row";
        t.innerHTML = `<strong>تكلفة التحويل:</strong> ${transfer.toFixed(2)} €`;
        previewDiv.appendChild(t);
    }

    // الإجمالي
    const total =
        offerItems.reduce((sum, item) => sum + item.total, 0) +
        delivery +
        transfer;

    const totalRow = document.createElement("div");
    totalRow.className = "total-row";
    totalRow.innerHTML = `<strong>الإجمالي:</strong> ${total.toFixed(2)} €`;
    previewDiv.appendChild(totalRow);
}

// زر تنزيل الصورة
downloadBtn.addEventListener("click", () => {
    if (!offerItems.length) return;

    const clone = previewDiv.cloneNode(true);
    clone.querySelectorAll("button").forEach(btn => btn.remove());

    clone.querySelectorAll(".preview-item").forEach(row => {
        row.style.backgroundColor = "#ffffff";
        row.style.padding = "8px";
        row.style.borderRadius = "5px";
    });

    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    html2canvas(clone, { backgroundColor: "#f4f4f4", scale: 2 })
        .then(canvas => {
            const link = document.createElement("a");
            link.download = "offer.png";
            link.href = canvas.toDataURL("image/png");
            link.click();

            document.body.removeChild(clone);
        })
        .catch(err => {
            console.error("خطأ أثناء تنزيل العرض:", err);
        });
});

// تحميل المنتجات عند تغيير الفئة
categorySelect.addEventListener("change", loadProductsForCategory);

// تحميل المنتجات عند بدء التشغيل
loadProductsForCategory();
