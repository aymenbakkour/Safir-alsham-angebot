// VARIABLES
let offerItems = [];
let searchTerm = "";
let openCategories = {};

const productsArea = document.getElementById("productsArea");
const preview = document.getElementById("preview");
const productSearch = document.getElementById("productSearch");
const offerTitle = document.getElementById("offerTitle");
const deliveryCost = document.getElementById("deliveryCost");
const transferCost = document.getElementById("transferCost");
const downloadBtn = document.getElementById("downloadImageBtn");


/* RENDER PRODUCTS */
function renderProducts() {
    productsArea.innerHTML = "";
    let groups = {};

    products.forEach(p => {
        if (searchTerm && !p.name.includes(searchTerm)) return;
        if (!groups[p.category]) groups[p.category] = [];
        groups[p.category].push(p);
    });

    Object.keys(groups).forEach(cat => {
        const head = document.createElement("div");
        head.className = "category-header";
        head.innerHTML = `<span>${cat}</span><span>▼</span>`;
        head.onclick = () => {
            openCategories[cat] = !openCategories[cat];
            renderProducts();
        };
        productsArea.appendChild(head);

        if (openCategories[cat]) {
            groups[cat].forEach(p => {
                const row = document.createElement("div");
                row.className = "product-row";

                row.innerHTML = `
                    <span>${p.name}</span>
                    <span>${p.price.toFixed(2)} €</span>
                    <button class="add-btn" onclick="addToOffer('${p.id}')">+</button>
                `;
                productsArea.appendChild(row);
            });
        }
    });
}


/* ADD PRODUCTS */
function addToOffer(id) {
    const product = products.find(p => p.id === id);
    offerItems.push({...product});
    renderOffer();
}


/* REMOVE PRODUCT */
function removeItem(index) {
    offerItems.splice(index, 1);
    renderOffer();
}


/* RENDER OFFER */
function renderOffer() {
    preview.innerHTML = "";

    if (!offerItems.length) {
        preview.innerHTML = "<p>لا توجد منتجات.</p>";
        downloadBtn.disabled = true;
        return;
    }

    preview.innerHTML += `<h3>سفير الشام – ${offerTitle.value || ""}</h3>`;

    offerItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "preview-item";
        div.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price.toFixed(2)} €</span>
            <button onclick="removeItem(${index})">حذف</button>
        `;
        preview.appendChild(div);
    });

    let d = parseFloat(deliveryCost.value || 0);
    let t = parseFloat(transferCost.value || 0);

    preview.innerHTML += `
        <div class="preview-cost">
            <span>تكلفة التوصيل: ${d.toFixed(2)} €</span>
            <span>تكلفة التحويل: ${t.toFixed(2)} €</span>
        </div>
    `;

    const total = offerItems.reduce((s, i) => s + i.price, 0) + d + t;

    preview.innerHTML += `
        <div class="preview-total">
            المجموع النهائي: ${total.toFixed(2)} €
        </div>
    `;

    downloadBtn.disabled = false;
}


/* SPECIAL OFFER */
document.getElementById("generateSpecialOfferBtn").onclick = () => {
    offerItems = [...products];
    renderOffer();
};


/* CLEAR */
document.getElementById("clearPreviewBtn").onclick = () => {
    offerItems = [];
    renderOffer();
};


/* DOWNLOAD AS IMAGE */
downloadBtn.onclick = () => {
    const clone = preview.cloneNode(true);
    clone.querySelectorAll("button").forEach(btn => btn.remove());
    clone.style.position = "absolute";
    clone.style.left = "-9999px";

    document.body.appendChild(clone);

    html2canvas(clone, { backgroundColor: "#fff", scale: 2 }).then(canvas => {
        const a = document.createElement("a");
        a.download = "offer.png";
        a.href = canvas.toDataURL();
        a.click();
        clone.remove();
    });
};


/* SEARCH */
productSearch.oninput = () => {
    searchTerm = productSearch.value.trim();
    renderProducts();
};


/* INIT */
renderProducts();
renderOffer();
