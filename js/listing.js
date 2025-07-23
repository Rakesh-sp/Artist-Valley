let products = [];
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    fetch('products.json')
      .then(res => res.json())
      .then(data => {
        products = data;
        bindFilters();
        renderProducts();
        renderWishlistCount();
        renderCartCount();
      });

    function renderWishlistCount() {
      document.getElementById("wishlist-count").textContent = wishlist.length;
    }

    function renderCartCount() {
      document.getElementById("cart-count").textContent = cart.length;
    }

    function getCheckedValues(name) {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
    }

    function renderProducts() {
      const list = document.getElementById("product-list");
      list.innerHTML = "";

      const collection = getCheckedValues("collection");
      const availability = getCheckedValues("availability");
      const rating = Math.max(...getCheckedValues("rating").map(Number), 0);
      const maxPrice = parseFloat(document.getElementById("price-slider").value);
      const size = getCheckedValues("size");
      const brand = getCheckedValues("brand");

      const filtered = products.filter(product => {
        const matchCategory = collection.length ? collection.includes(product.category) : true;
        const matchAvailability = availability.length ? availability.includes(product.availability) : true;
        const matchRating = product.rating >= rating;
        const matchPrice = product.price <= maxPrice;
        const matchSize = size.length ? product.sizes.some(s => size.includes(s)) : true;
        const matchBrand = brand.length ? brand.includes(product.brand) : true;
        return matchCategory && matchAvailability && matchRating && matchPrice && matchSize && matchBrand;
      });

      filtered.forEach(product => {
        const defaultImage = product.colors[0].image;
        const discount = product.discount || 0;
        const original = product.price.toFixed(2);
        const discounted = (product.price - product.price * discount / 100).toFixed(2);

        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <div class="wishlist ${wishlist.find(w => w.id === product.id) ? 'active' : ''}" data-id="${product.id}">&#10084;</div>
          <div class="add-cart" data-id="${product.id}">&#128722;</div>
          <img src="${defaultImage}" alt="${product.name}" id="img-${product.id}">
          <div class="product-name">${product.name}</div>
          <div class="brand">${product.brand}</div>
          <div class="rating">${'&#9733;'.repeat(Math.floor(product.rating))}${'&#9734;'.repeat(5 - Math.floor(product.rating))}</div>
          <div class="price"><s>$${original}</s> $${discounted}</div>
          <div class="color-dots">
            ${product.colors.map(c => `<div class="dot" data-id="${product.id}" data-img="${c.image}" style="background:${c.name};"></div>`).join('')}
          </div>
        `;
        list.appendChild(card);
      });

      document.querySelectorAll(".dot").forEach(dot => {
        dot.addEventListener("click", e => {
          const id = e.target.dataset.id;
          const img = e.target.dataset.img;
          document.getElementById("img-" + id).src = img;
        });
      });

      document.querySelectorAll(".wishlist").forEach(heart => {
        heart.addEventListener("click", () => {
          const id = parseInt(heart.dataset.id);
          heart.classList.toggle("active");
          const product = products.find(p => p.id === id);
          wishlist = wishlist.filter(p => p.id !== id);
          if (heart.classList.contains("active")) wishlist.unshift(product);
          localStorage.setItem("wishlist", JSON.stringify(wishlist));
          renderWishlistCount();
        });
      });

document.querySelectorAll(".add-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = parseInt(btn.dataset.id);
    const product = products.find(p => p.id === id);
    const popup = document.getElementById("cart-popup");
    const isAlreadyInCart = cart.some(p => p.id === id);

    // Reset popup classes
    popup.classList.remove("success", "warning");

    if (!isAlreadyInCart) {
      cart = cart.filter(p => p.id !== id);
      cart.unshift(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartCount();
      popup.textContent = `"${product.name}" added to your cart!`;
      popup.classList.add("success");
    } else {
      popup.textContent = `"${product.name}" is already in your cart.`;
      popup.classList.add("warning");
    }

    document.querySelector(".cart-container").scrollIntoView({ behavior: "smooth" });

    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
    }, 2000);
  });
});


    }

    function bindFilters() {
      document.querySelectorAll(".sidebar input[type='checkbox'], #price-slider").forEach(el => {
        el.addEventListener("change", renderProducts);
      });
    }