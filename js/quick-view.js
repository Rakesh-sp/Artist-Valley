document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("product-list");
  const quickView = document.getElementById("quick-view-popup");
  const quickViewContent = document.querySelector(".quick-view-content");
  const closeQuickView = document.getElementById("quick-view-close");
  const quickViewThumbs = document.getElementById("quick-view-thumbs");
  const zoomModal = document.getElementById("zoom-modal");
  const zoomImg = document.getElementById("zoomed-img");
  const zoomClose = document.getElementById("zoom-close");
  const zoomNext = document.getElementById("zoom-next");
  const zoomPrev = document.getElementById("zoom-prev");
  const buyNowBtn = document.getElementById("buy-now-btn");
  const errorMsg = document.getElementById("quick-view-error");

  const colorOptions = document.getElementById("color-options");
  const sizeOptions = document.getElementById("size-options");
  const colorSelector = document.querySelector(".color-selector");

  let selectedColor = null;
  let selectedSize = null;
  let currentProduct = null;
  let currentImageIndex = 0;

  let products = JSON.parse(localStorage.getItem("products")) || [];

  if (!products.length) {
    fetch("products.json")
      .then(res => res.json())
      .then(data => {
        products = data;
        localStorage.setItem("products", JSON.stringify(data));
        renderProducts();
      });
  } else {
    renderProducts();
  }

  productList.addEventListener("click", function (e) {
    const eyeBtn = e.target.closest(".prd_eye_btn");
    if (!eyeBtn) return;

    const id = eyeBtn.dataset.id;
    const product = products.find(p => p.id == id);
    if (!product) return;

    currentProduct = product;
    selectedColor = null;
    selectedSize = null;
    errorMsg.style.display = "none";

    let colorArray = Array.isArray(product.colors)
      ? product.colors
      : Array.isArray(product.images)
        ? product.images.map((img, i) => ({ name: `Image ${i + 1}`, image: img }))
        : [];

    if (!colorArray.length) {
      document.getElementById("quick-view-img").src = "images/fallback.jpg";
      quickView.classList.remove("hidden");
      return;
    }

    currentImageIndex = 0;
    document.getElementById("quick-view-img").src = colorArray[0].image;

    document.getElementById("quick-view-name").textContent = product.name;
    document.getElementById("quick-view-brand").textContent = "Brand: " + product.brand;
    document.getElementById("quick-view-description").textContent = product.description || "";

    const discountedPrice = (
      product.price - (product.price * product.discount / 100)
    ).toFixed(2);

    document.getElementById("quick-view-price").innerHTML =
      `<strong>₹${discountedPrice}</strong> <s>₹${product.price.toFixed(2)}</s>`;

    document.getElementById("quick-view-rating").textContent = "Rating: " + product.rating + "★";

    quickViewThumbs.innerHTML = "";
    colorArray.forEach((color, index) => {
      const thumb = document.createElement("img");
      thumb.src = color.image;
      thumb.alt = color.name;
      thumb.title = color.name;
      thumb.addEventListener("click", () => {
        document.getElementById("quick-view-img").src = color.image;
        currentImageIndex = index;
      });
      quickViewThumbs.appendChild(thumb);
    });

    if (Array.isArray(product.colors)) {
      colorSelector.style.display = "block";
      colorOptions.innerHTML = "";

      colorArray.forEach((color, i) => {
        const btn = document.createElement("div");
        btn.className = "color-dot";
        btn.style.backgroundColor = color.name.toLowerCase();
        btn.title = color.name;

        btn.addEventListener("click", () => {
          selectedColor = color.name;
          [...colorOptions.children].forEach(c => c.classList.remove("selected"));
          btn.classList.add("selected");
          document.getElementById("quick-view-img").src = color.image;
          currentImageIndex = i;
        });

        colorOptions.appendChild(btn);
      });
    } else {
      colorSelector.style.display = "none";
    }

    sizeOptions.innerHTML = "";
    if (!product.sizes || product.sizes.length === 0) {
      const btn = document.createElement("div");
      btn.textContent = "One Size";
      btn.classList.add("selected");
      selectedSize = "One Size";
      sizeOptions.appendChild(btn);
    } else {
      product.sizes.forEach(size => {
        const btn = document.createElement("div");
        btn.textContent = size;
        btn.addEventListener("click", () => {
          selectedSize = size;
          [...sizeOptions.children].forEach(s => s.classList.remove("selected"));
          btn.classList.add("selected");
        });
        sizeOptions.appendChild(btn);
      });
    }

    quickView.classList.remove("hidden");
  });

  closeQuickView.addEventListener("click", () => {
    quickView.classList.add("hidden");
  });

  quickView.addEventListener("click", (e) => {
    if (!quickViewContent.contains(e.target)) {
      quickView.classList.add("hidden");
    }
  });

  document.getElementById("quick-view-img").addEventListener("click", () => {
    const images = Array.isArray(currentProduct.colors)
      ? currentProduct.colors.map(c => c.image)
      : Array.isArray(currentProduct.images)
        ? currentProduct.images
        : [];

    zoomImg.src = images[currentImageIndex] || "";
    zoomModal.classList.remove("hidden");
  });

  zoomClose.addEventListener("click", () => {
    zoomModal.classList.add("hidden");
  });

  zoomNext.addEventListener("click", () => {
    const images = Array.isArray(currentProduct.colors)
      ? currentProduct.colors.map(c => c.image)
      : Array.isArray(currentProduct.images)
        ? currentProduct.images
        : [];

    currentImageIndex = (currentImageIndex + 1) % images.length;
    zoomImg.src = images[currentImageIndex] || "";
  });

  zoomPrev.addEventListener("click", () => {
    const images = Array.isArray(currentProduct.colors)
      ? currentProduct.colors.map(c => c.image)
      : Array.isArray(currentProduct.images)
        ? currentProduct.images
        : [];

    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    zoomImg.src = images[currentImageIndex] || "";
  });

  buyNowBtn.addEventListener("click", () => {
    const needsColor = Array.isArray(currentProduct.colors);
    if ((needsColor && !selectedColor) || !selectedSize) {
      errorMsg.textContent = "Please select " + (needsColor && !selectedColor ? "color and " : "") + "size.";
      errorMsg.style.display = "block";

      if (needsColor && !selectedColor) {
        colorSelector.classList.add("shake");
        setTimeout(() => colorSelector.classList.remove("shake"), 400);
      }

      const sizeSelector = document.querySelector(".size-selector");
      if (!selectedSize && sizeSelector) {
        sizeSelector.classList.add("shake");
        setTimeout(() => sizeSelector.classList.remove("shake"), 400);
      }

      return;
    }

    errorMsg.style.display = "none";

    const selectedImage = Array.isArray(currentProduct.colors)
      ? currentProduct.colors.find(c => c.name === selectedColor)?.image
      : currentProduct.images?.[0] || "";

    const cartItem = {
      ...currentProduct,
      qty: 1,
      selectedSize,
      selectedColor: selectedColor || null,
      selectedImage
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item =>
      item.id === cartItem.id &&
      item.selectedSize === cartItem.selectedSize &&
      item.selectedColor === cartItem.selectedColor
    );

    if (existingIndex >= 0) {
      cart[existingIndex].qty += 1;
    } else {
      cart.unshift(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("selectedVariant", JSON.stringify({
      id: currentProduct.id,
      color: selectedColor || "",
      size: selectedSize
    }));

    window.location.href = "cart.html";
  });

  function renderProducts() {
    // Your homepage product card rendering if needed
  }
});