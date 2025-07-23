// js/breadcrumb.js
document.addEventListener("DOMContentLoaded", () => {
  const breadcrumb = document.getElementById("breadcrumb");
  const productId = new URLSearchParams(window.location.search).get("id");

  // Fetch product for title
  fetch("products.json")
    .then((res) => res.json())
    .then((data) => {
      const product = data.find((p) => p.id == productId);
      if (product) renderBreadcrumb(product.name);
    });

  function renderBreadcrumb(productName) {
    breadcrumb.innerHTML = `
      <li class="list-inline-item"><a href="index.html">Home</a></li>
      <li class="list-inline-item">|</li>
      <li class="list-inline-item"><a href="listing.html">Shop</a></li>
      <li class="list-inline-item">|</li>
      <li class="list-inline-item active" aria-current="page">${productName}</li>
    `;
  }
});
