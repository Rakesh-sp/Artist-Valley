document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category")?.toLowerCase();
  const title = document.getElementById("category-title");
  const banner = document.getElementById("category-banner");

  const allProducts = JSON.parse(localStorage.getItem("products")) || [];

  // Filter products by category
  const filtered = category
    ? allProducts.filter(p => p.category?.toLowerCase() === category)
    : allProducts;

  // Update banner background and title
  const categoryBackgrounds = {
    men: "url('images/bg-men.jpg')",
    women: "url('images/bg-women.jpg')",
    kids: "url('images/bg-kids.jpg')"
  };

  if (banner) {
    banner.style.backgroundImage = categoryBackgrounds[category] || "url('images/bg-default.jpg')";
  }

  if (title) {
    title.textContent = category
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
      : "All Products";
  }

  // Now render filtered products using your existing home.js logic
  if (typeof renderProducts === "function") {
    renderProducts(filtered);
  }
});
