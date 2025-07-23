const wishlistIcon = document.getElementById("wishlist-icon");
const wishlistPopup = document.getElementById("wishlist-popup");

wishlistIcon.addEventListener("click", () => {
  wishlistPopup.classList.toggle("hidden");
  if (!wishlistPopup.classList.contains("hidden")) {
    renderWishlistPopup();
  }
});

function renderWishlistPopup() {
  wishlistPopup.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistPopup.innerHTML = "<p>No items in wishlist.</p>";
    return;
  }

  wishlist.forEach(item => {
    const div = document.createElement("div");
    div.className = "wishlist-item";
    div.innerHTML = `
      <div class="wishlist-item-content">
        <img src="${item.colors[0].image}" alt="${item.name}">
        <div class="wishlist-name">${item.name}</div>
      </div>
    `;
    div.addEventListener("click", () => {
      window.location.href = `details.html?id=${item.id}`;
    });
    wishlistPopup.appendChild(div);
  });
}

document.addEventListener("click", function (event) {
  const isClickInsidePopup = wishlistPopup.contains(event.target);
  const isClickOnIcon = wishlistIcon.contains(event.target);

  if (!isClickInsidePopup && !isClickOnIcon) {
    wishlistPopup.classList.add("hidden");
  }
});