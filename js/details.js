let productId = new URLSearchParams(window.location.search).get('id');
let product = null;
let quantity = 1;
let selectedSize = null;
let selectedColor = null;
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentImageIndex = 0;
let imageList = [];

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    product = data.find(p => p.id == productId);
    if (product) {
      localStorage.setItem("currentProduct", JSON.stringify(product));
      renderDetails(product);
      updateCounts();
    }
  });

function renderDetails(product) {
  const detailsEl = document.querySelector(".details_page");
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const hasImages = Array.isArray(product.images) && product.images.length > 0;
  const isOutOfStock = product.availability === "false" || product.availability === false;

  if (!hasColors) detailsEl.classList.add("nocolor_avl");
  if (isOutOfStock) {
    detailsEl.classList.add("out_of_stock");
    const label = document.createElement("div");
    label.className = "stock-label";
    label.textContent = "Out of Stock";
    detailsEl.prepend(label);
  }

  document.getElementById("product-name").textContent = product.name;
  document.getElementById("brand").textContent = product.brand;

  const original = product.price.toFixed(2);
  const discount = product.discount || 0;
  const discounted = (product.price - product.price * discount / 100).toFixed(2);
  document.getElementById("price").innerHTML = `₹${discounted} <s>₹${original}</s>`;

  const desc = product.description || "";
  ["description", "desc-tab", "mobile-desc"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = desc;
  });

  document.getElementById("rating").innerHTML =
    '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

  imageList = hasColors ? product.colors.map(c => c.image) : product.images || [];
  document.getElementById("main-image").src = imageList[0] || '';
  document.getElementById("main-image").onclick = () => openImagePopup(0);

  const thumbnailsContainer = document.getElementById("thumbnails");
  thumbnailsContainer.innerHTML = imageList.map((img, i) =>
    `<img src="${img}" onclick="setImage('${img}', ${i})">`
  ).join('');

  const colorDots = document.getElementById("color-dots");
  if (hasColors) {
    colorDots.innerHTML = product.colors.map(c =>
      `<div class="dot" style="background:${c.name}" data-color="${c.name}" data-image="${c.image}" onclick="selectColor(this)"></div>`
    ).join('');
    if (product.colors.length === 1) {
      selectedColor = product.colors[0];
    }
  } else {
    colorDots.innerHTML = `<div class="no-color-text text-danger" style="font-size: 14px;">There is no color in this product</div>`;
  }

  const sizePart = document.getElementById("size-part");
  const sizeContainer = document.getElementById("sizes");
  const availableSizes = product.sizes || [];

  if (!product.sizes || availableSizes.length === 0) {
    if (sizePart) sizePart.style.display = "block";
    sizeContainer.innerHTML = `<button class="size-btn selected">One Size</button>`;
    selectedSize = "One Size";
  } else {
    const allStandardSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    const allChildSizes = ["0-1Y", "2-5Y", "5-9Y", "9-12Y", "12-15Y"];
    const isChild = availableSizes.some(s => s.includes("Y"));
    const allSizesToShow = isChild ? allChildSizes : allStandardSizes;

    if (sizePart) sizePart.style.display = "block";
    sizeContainer.innerHTML = allSizesToShow.map(size => {
      const isAvailable = availableSizes.includes(size);
      return `<button 
                class="size-btn ${isAvailable ? '' : 'disabled'}" 
                ${isAvailable ? `onclick="selectSize(this)"` : 'disabled'} 
                style="${!isAvailable ? 'text-decoration: line-through; opacity: 0.4;' : ''}"
              >${size}</button>`;
    }).join('');
  }

  const badge = document.getElementById("discount-badge");
  badge.textContent = discount > 0 ? `-${discount}% OFF` : '';
  badge.style.display = discount > 0 ? 'inline-block' : 'none';

  const cartBtn = document.getElementById("add-to-cart-btn");
  if (cartBtn) {
    if (!document.getElementById("selected-info")) {
      const info = document.createElement("p");
      info.id = "selected-info";
      info.className = "text-muted mt-2";
      cartBtn.insertAdjacentElement("beforebegin", info);
    }
    if (!document.getElementById("message-area")) {
      const msg = document.createElement("div");
      msg.id = "message-area";
      msg.style.display = "none";
      msg.style.marginTop = "6px";
      msg.style.fontSize = "10px";
      msg.style.color = "red";
      cartBtn.insertAdjacentElement("beforebegin", msg);
    }
  }

  updateSelectedInfo();

  const specContainer = document.getElementById("specifications");
  if (specContainer) {
    const specs = [
      { label: "🧵 Brand", value: product.brand },
      { label: "📂 Category", value: product.category },
      { label: "📏 Available Sizes", value: product.sizes?.join(", ") || "One Size" },
      { label: "📦 Availability", value: product.availability },
      { label: "⭐ Rating", value: product.rating },
      { label: "🏷️ Discount", value: product.discount ? `${product.discount}%` : "No discount" },
      { label: "💰 Price", value: `₹${product.price.toFixed(2)}` }
    ];
    const specList = specs.map(spec =>
      `<tr><td><strong>${spec.label}</strong></td><td>${spec.value}</td></tr>`
    ).join('');
    specContainer.innerHTML = `
      <h4 class="mb-2">📝 Product Specifications</h4>
      <table class="table table-bordered table-sm spec-table">
        <tbody>${specList}</tbody>
      </table>
    `;
  }
}

function updateSelectedInfo() {
  const info = document.getElementById("selected-info");
  const message = document.getElementById("message-area");
  if (!info || !message) return;

  const requiresColorSelection = Array.isArray(product.colors) && product.colors.length > 1;
  const needsColor = !selectedColor && requiresColorSelection;
  const needsSize = product.sizes && product.sizes.length > 0 && !selectedSize;

  if (selectedSize && selectedColor) {
    info.textContent = `Selected Size: ${selectedSize} | Color: ${selectedColor.name}`;
  } else if (selectedSize) {
    info.textContent = `Selected Size: ${selectedSize}`;
  } else if (selectedColor) {
    info.textContent = `Selected Color: ${selectedColor.name}`;
  } else {
    info.textContent = "";
  }

  if (needsColor && needsSize) {
    message.textContent = "Please select size and color before proceeding.";
    message.style.display = "block";
  } else if (needsColor) {
    message.textContent = "Please select color before proceeding.";
    message.style.display = "block";
  } else if (needsSize) {
    message.textContent = "Please select size before proceeding.";
    message.style.display = "block";
  } else {
    message.textContent = "";
    message.style.display = "none";
  }
}

function setImage(url, index = 0) {
  document.getElementById("main-image").src = url;
  currentImageIndex = index;
}

function selectColor(dot) {
  document.querySelectorAll(".dot").forEach(d => d.classList.remove("active"));
  dot.classList.add("active");
  const img = dot.getAttribute("data-image");
  selectedColor = product.colors.find(c => c.name === dot.getAttribute("data-color"));
  setImage(img);
  updateSelectedInfo();
}

function selectSize(btn) {
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedSize = btn.textContent;
  updateSelectedInfo();
}

function changeQty(val) {
  quantity = Math.max(1, quantity + val);
  document.getElementById("qty").textContent = quantity;
}

function addToCartAndGoToCheckout() {
  updateSelectedInfo();
  const message = document.getElementById("message-area");
  const missing = [];

  const requiresColorSelection = Array.isArray(product.colors) && product.colors.length > 1;
  if (product.sizes && product.sizes.length > 0 && !selectedSize) missing.push("size");
  if (!selectedColor && requiresColorSelection) missing.push("color");

  if (missing.length > 0) {
    function shake(el) {
      el.classList.add("shake");
      setTimeout(() => el.classList.remove("shake"), 400);
    }

    shake(message);
    if (missing.includes("size")) shake(document.getElementById("sizes"));
    if (missing.includes("color")) shake(document.getElementById("color-dots"));
    return;
  }

  const exists = cart.some(p =>
    p.id === product.id &&
    p.selectedSize === selectedSize &&
    (!product.colors || p.selectedColor?.name === selectedColor?.name)
  );

  if (!exists) {
    cart.unshift({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
      selectedImage: selectedColor?.image || product.images?.[0] || ''
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  message.textContent = "";
  message.style.display = "none";
  window.location.href = "checkout.html";
}

function toggleWishlist() {
  const index = wishlist.findIndex(p => p.id === product.id);
  const btn = document.getElementById("wishlist-btn");
  if (index >= 0) {
    wishlist.splice(index, 1);
    btn.classList.remove("active");
  } else {
    wishlist.unshift(product);
    btn.classList.add("active");
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateCounts();
}

function updateCounts() {
  document.getElementById("wishlist-count").textContent = wishlist.length;
  document.getElementById("cart-count").textContent = cart.length;
}

function openImagePopup(index) {
  const popupOverlay = document.getElementById("image-popup-overlay");
  const zoomedImg = document.getElementById("zoomed-image");
  currentImageIndex = index;
  zoomedImg.src = imageList[currentImageIndex];
  popupOverlay.style.display = "flex";
}

function closeImagePopup(e) {
  if (e.target.id === "image-popup-overlay" || e.target.classList.contains("close-btn")) {
    document.getElementById("image-popup-overlay").style.display = "none";
  }
}

function navigateImage(dir) {
  currentImageIndex += dir;
  if (currentImageIndex < 0) currentImageIndex = imageList.length - 1;
  if (currentImageIndex >= imageList.length) currentImageIndex = 0;
  document.getElementById("zoomed-image").src = imageList[currentImageIndex];
}
