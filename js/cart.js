let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartList = document.getElementById("cart-list");
const subtotalEl = document.getElementById("subtotal");
const totalDiscountEl = document.getElementById("total-discount");
const totalEl = document.getElementById("total");
const summaryBox = document.getElementById("summary");

function renderCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    if (summaryBox) summaryBox.style.display = "none";
    cartList.innerHTML = `
      <div class="empty" style="text-align:center; margin-top:40px;">
        <p>Your cart is empty.</p>
        <a href="index.html" class="btn" style="
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #333;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        ">Continue Shopping</a>
      </div>
    `;
    updateSummary();
    return;
  }

  if (summaryBox) summaryBox.style.display = "block";

  const template = document.getElementById("cart-item-template");

  cart.forEach(product => {
    product.qty = product.qty || 1;

    let selectedColorObj = null;
    let colorName = "N/A";
    let colorCode = "";
    let hasColor = false;

    if (typeof product.selectedColor === "object" && product.selectedColor !== null) {
      selectedColorObj = product.selectedColor;
      hasColor = true;
    } else if (product.colors && product.selectedColor) {
      selectedColorObj = product.colors.find(c => c.name === product.selectedColor);
      hasColor = !!selectedColorObj;
    }

    if (selectedColorObj) {
      colorName = selectedColorObj.name || "N/A";
      if (selectedColorObj.code && /^#[0-9A-Fa-f]{3,6}$/.test(selectedColorObj.code)) {
        colorCode = selectedColorObj.code;
      }
    } else if (typeof product.selectedColor === "string") {
      colorName = product.selectedColor;
      hasColor = true;
    }

    const discountedPrice = +(product.price - (product.price * product.discount / 100)).toFixed(2);

    const item = template.content.cloneNode(true);
    const cartItem = item.querySelector(".cart-item");

    // Image
    const productImage = cartItem.querySelector("img");
    productImage.src = product.selectedImage || selectedColorObj?.image || product.images?.[0] || "";
    productImage.alt = product.name;
    productImage.style.cursor = "pointer";
    productImage.addEventListener("click", () => {
      window.location.href = `details.html?id=${product.id}`;
    });

    // Name
    const itemName = cartItem.querySelector(".item-name");
    itemName.textContent = product.name;
    itemName.style.cursor = "pointer";
    itemName.addEventListener("click", () => {
      window.location.href = `details.html?id=${product.id}`;
    });

    // Brand and Size
    cartItem.querySelector(".item-brand").textContent = product.brand || "";
    cartItem.querySelector(".size-value").textContent = product.selectedSize || "N/A";

    // Color
    const itemColor = cartItem.querySelector(".item-color");
    if (hasColor && itemColor) {
      const colorDot = itemColor.querySelector(".color-dot");
      const colorNameSpan = itemColor.querySelector(".color-name");

      if (colorDot) {
        colorDot.style.width = "16px";
        colorDot.style.height = "16px";
        colorDot.style.borderRadius = "50%";
        colorDot.style.marginRight = "5px";
        colorDot.style.border = "1px solid #ccc";

        // Only apply color if valid
        colorDot.style.backgroundColor = colorCode || "#ccc";
      }

      if (colorNameSpan) {
        colorNameSpan.textContent = colorName;
      }
    } else {
      if (itemColor) itemColor.remove();
    }

    // Prices
    cartItem.querySelector(".discounted").textContent = `₹${discountedPrice.toFixed(2)}`;
    cartItem.querySelector(".original").textContent = `₹${product.price.toFixed(2)}`;

    const qtyId = `qty-${product.id}-${colorName}-${product.selectedSize}`;
    const qtyDisplay = cartItem.querySelector(".qty-display");
    qtyDisplay.id = qtyId;
    qtyDisplay.textContent = product.qty;

    // Quantity Controls
    cartItem.querySelector(".dec").addEventListener("click", () =>
      changeQty(product.id, colorName, product.selectedSize, -1)
    );
    cartItem.querySelector(".inc").addEventListener("click", () =>
      changeQty(product.id, colorName, product.selectedSize, 1)
    );

    // Remove
    cartItem.querySelector(".remove-btn").addEventListener("click", () =>
      removeItem(product.id, colorName, product.selectedSize)
    );

    cartList.appendChild(cartItem);
  });

  updateSummary();
}

function changeQty(id, colorName, size, change) {
  const item = cart.find(p =>
    p.id === id &&
    (p.selectedColor?.name || p.selectedColor || "N/A") === colorName &&
    p.selectedSize === size
  );

  if (!item) return;

  item.qty = Math.max(1, item.qty + change);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(id, colorName, size) {
  cart = cart.filter(p =>
    !(p.id === id &&
      (p.selectedColor?.name || p.selectedColor || "N/A") === colorName &&
      p.selectedSize === size)
  );
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function updateSummary() {
  let subtotal = 0;
  let discountTotal = 0;
  let totalItems = 0;
  let totalDiscountPercent = 0;

  const summaryList = document.getElementById("product-summary");
  const deliveryRow = document.getElementById("delivery-row");
  const deliveryChargeEl = document.getElementById("deliverycharge");

  if (summaryList) summaryList.innerHTML = "";

  cart.forEach(p => {
    const qty = p.qty || 1;
    const originalTotal = p.price * qty;
    const discountedTotal = (p.price - (p.price * p.discount / 100)) * qty;

    subtotal += originalTotal;
    discountTotal += originalTotal - discountedTotal;
    totalItems += qty;
    totalDiscountPercent += p.discount * qty;

    if (summaryList) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="summary-name">${p.name}</span>
        <span class="summary-mult">×</span>
        <span class="summary-qty">${qty}</span>
      `;
      summaryList.appendChild(li);
    }
  });

  let finalTotal = subtotal - discountTotal;
  const avgDiscount = totalItems ? (totalDiscountPercent / totalItems).toFixed(1) : 0;

  let deliveryCharge = 0;
  if (finalTotal < 30 && cart.length > 0) {
    deliveryCharge = 6;
    finalTotal += deliveryCharge;
    if (deliveryChargeEl) deliveryChargeEl.textContent = `₹${deliveryCharge.toFixed(2)}`;
    if (deliveryRow) deliveryRow.style.display = "flex";
  } else {
    if (deliveryChargeEl) deliveryChargeEl.textContent = "₹0.00";
    if (deliveryRow) deliveryRow.style.display = "none";
  }

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (totalDiscountEl) totalDiscountEl.textContent = `${avgDiscount}% OFF -₹${discountTotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `₹${finalTotal.toFixed(2)}`;

  const totalItemsEl = document.getElementById("total-items");
  if (totalItemsEl) totalItemsEl.textContent = totalItems;
}

// Initial render
renderCart();
