let products = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const wishlistCountEls = document.querySelectorAll(".wishlist-count");
const popup = document.getElementById("cart-popup");

function updateCartCount() {
  if (cartCount) cartCount.textContent = cart.length;
}

function updateWishlistCount() {
  wishlistCountEls.forEach(el => {
    el.textContent = wishlist.length;
  });
}

function getStarIcons(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function renderProducts(filteredProducts = products) {
  productList.innerHTML = "";
  const template = document.getElementById("product-card-template");

  filteredProducts.forEach(product => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".discount-sticker").textContent =
      product.discount ? `${product.discount}% OFF` : "";

    const img = clone.querySelector(".product-img");
    const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
    const hasImages = Array.isArray(product.images) && product.images.length > 0;

    const firstImage = hasColors
      ? product.colors[0].image
      : hasImages
      ? product.images[0]
      : "";

    img.src = firstImage;
    img.alt = product.name;
    img.id = "img-" + product.id;

    clone.querySelector(".product-link").href = `details.html?id=${product.id}`;

    const cardEl = clone.querySelector(".prod_col");
    if (cardEl) {
      const safeName = product.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      cardEl.id = `${safeName}-${product.id}`;

      if (!hasColors) cardEl.classList.add("nocolor_avl");
      if (product.availability === false || product.availability === "false") {
        cardEl.classList.add("out_of_stock");
      }
    }

    const wishlistBtn = clone.querySelector(".wishlist");
    wishlistBtn.dataset.id = product.id;
    if (wishlist.find(p => p.id === product.id)) {
      wishlistBtn.classList.add("active");
    }

    wishlistBtn.addEventListener("click", () => {
      const index = wishlist.findIndex(p => p.id === product.id);
      if (index > -1) {
        wishlist.splice(index, 1);
        wishlistBtn.classList.remove("active");
      } else {
        wishlist.unshift(product);
        wishlistBtn.classList.add("active");
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateWishlistCount();
    });

    let selectedColor = hasColors ? product.colors[0] : null;
    let selectedImage = firstImage;
    let selectedSize = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : null;

    const dotContainer = clone.querySelector(".color-dots");
    if (hasColors && dotContainer) {
      dotContainer.innerHTML = "";
      product.colors.forEach(c => {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.style.background = c.code || c.name;
        dot.addEventListener("click", () => {
          selectedColor = c;
          selectedImage = c.image;
          const imgEl = document.getElementById("img-" + product.id);
          if (imgEl) imgEl.src = c.image;
        });
        dotContainer.appendChild(dot);
      });
    } else if (dotContainer) {
      dotContainer.innerHTML = "";
    }

    const sizeSelect = clone.querySelector(".size-select");
    if (Array.isArray(product.sizes) && product.sizes.length > 0 && sizeSelect) {
      sizeSelect.innerHTML = "";
      product.sizes.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
      });
      sizeSelect.addEventListener("change", e => {
        selectedSize = e.target.value;
      });
    } else if (sizeSelect) {
      sizeSelect.style.display = "none";
    }

    const cartBtn = clone.querySelector(".add-cart");
    cartBtn.dataset.id = product.id;
    cartBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      const exists = cart.find(p =>
        p.id === product.id &&
        (!selectedSize || p.selectedSize === selectedSize) &&
        (!selectedColor || (p.selectedColor?.name === selectedColor.name))
      );

      if (exists) {
        popup.textContent = `"${product.name}" already in cart.`;
        popup.className = "cart-popup warning show";
      } else {
        const productWithVariants = {
          ...product,
          selectedColor,
          selectedSize,
          selectedImage,
          qty: 1
        };
        cart.unshift(productWithVariants);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        popup.textContent = `"${product.name}" added to cart!`;
        popup.className = "cart-popup success show";
      }

      setTimeout(() => popup.classList.remove("show"), 700);
    });

    clone.querySelector(".product-name").textContent = product.name;
    clone.querySelector(".brand").textContent = product.brand;
    clone.querySelector(".rating").innerHTML = getStarIcons(product.rating);
    clone.querySelector(".discounted").textContent =
      `₹${(product.price - product.price * product.discount / 100).toFixed(2)}`;
    clone.querySelector(".original").textContent = `₹${product.price.toFixed(2)}`;
    clone.querySelector(".size-list").textContent =
      Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes.join(", ") : "Free Size";

    const eyeBtn = clone.querySelector(".prd_eye_btn");
    const bagBtn = clone.querySelector(".bag-shopping");
    eyeBtn.dataset.id = product.id;
    bagBtn.dataset.id = product.id;

    bagBtn.addEventListener("click", () => {
      localStorage.setItem("selectedVariant", JSON.stringify({
        id: product.id,
        color: selectedColor?.name || null,
        size: selectedSize || null
      }));
      window.location.href = `details.html?id=${product.id}`;
    });

    productList.appendChild(clone);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
      updateCartCount();
      updateWishlistCount();
    });
});
